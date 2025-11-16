// src/ui/state/history.ts
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { visPlayback } from '../../engine/visPlayback';
import type { Snapshot } from '../../engine/visBridge';

type EncodedSnapshot = {
  step: number;
  t: number;
  size: { x:number; y:number; z:number };
  encoding: 'raw' | 'rle';
  data: Uint8Array; // raw channel or RLE-packed channel
};

function rleEncode(u8: Uint8Array): Uint8Array {
  const out: number[] = [];
  let i = 0;
  while (i < u8.length) {
    const val = u8[i];
    let run = 1;
    while (i + run < u8.length && u8[i + run] === val && run < 255) run++;
    out.push(val, run);
    i += run;
  }
  return new Uint8Array(out);
}

function rleDecode(u8: Uint8Array, expectedLen: number): Uint8Array {
  const out = new Uint8Array(expectedLen);
  let oi = 0;
  for (let i = 0; i < u8.length; i += 2) {
    const val = u8[i];
    const run = u8[i+1];
    out.fill(val, oi, oi + run);
    oi += run;
  }
  return out;
}

type HistoryState = {
  items: EncodedSnapshot[];
  capacity: number;
  count: number; // number of valid items
  head: number;  // write index (ring buffer)
  stride: number;
  useCompression: boolean;
  mode: 'live' | 'playback';
  playbackIndex: number | null; // 0..count-1, relative to oldest
  isPlaying: boolean;
  fps: number;
};

type HistoryCtx = HistoryState & {
  push: (snap: Snapshot, step: number, t: number) => void;
  clear: () => void;
  setCapacity: (n: number) => void;
  setStride: (n: number) => void;
  toggleCompression: (v?: boolean) => void;
  enterPlayback: (idx: number) => void;
  exitPlayback: () => void;
  stepBy: (delta: number) => void;
  setFps: (fps: number) => void;
  play: () => void;
  pause: () => void;
  getDecodedAt: (idx: number) => Snapshot | null;
};

const Ctx = createContext<HistoryCtx | null>(null);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HistoryState>({
    items: [], capacity: 600, count: 0, head: 0,
    stride: 1, useCompression: true,
    mode: 'live', playbackIndex: null, isPlaying: false, fps: 12
  });
  const strideCounter = useRef(0);
  const timerRef = useRef<any>(null);

  const push = useCallback((snap: Snapshot, step: number, t: number) => {
    // stride: record every Nth call
    strideCounter.current = (strideCounter.current + 1) % state.stride;
    if (strideCounter.current !== 0) return;
    const len = snap.size.x * snap.size.y * snap.size.z;
    const data = state.useCompression ? rleEncode(snap.channel) : snap.channel;
    const enc: EncodedSnapshot = {
      step, t, size: snap.size,
      encoding: state.useCompression ? 'rle' : 'raw',
      data
    };
    setState(s => {
      const items = s.items.length === s.capacity ? s.items.slice() : (s.items.length ? s.items.slice() : new Array<EncodedSnapshot>(0));
      if (items.length < s.capacity) items.push(enc);
      else items[s.head] = enc;
      const head = (s.head + 1) % s.capacity;
      const count = Math.min(s.count + 1, s.capacity);
      return { ...s, items, head, count };
    });
  }, [state.stride, state.useCompression]);

  const clear = useCallback(() => {
    setState(s => ({ ...s, items: [], head: 0, count: 0, playbackIndex: null }));
    visPlayback.exit();
  }, []);

  const setCapacity = useCallback((n: number) => setState(s => ({ ...s, capacity: Math.max(1,n) })), []);
  const setStride = useCallback((n: number) => setState(s => ({ ...s, stride: Math.max(1,n) })), []);
  const toggleCompression = useCallback((v?: boolean) => setState(s => ({ ...s, useCompression: v ?? !s.useCompression })), []);

  const getDecodedAt = useCallback((idx: number): Snapshot | null => {
    return getDecodedAtFromState(state, idx);
  }, [state]);

  const enterPlayback = useCallback((idx: number) => {
    setState(s => ({ ...s, mode: 'playback', playbackIndex: clampIndex(idx, s.count), isPlaying: false }));
    const snap = getDecodedAtFromState(state, idx);
    if (snap) visPlayback.enter(snap);
  }, [state]);

  const exitPlayback = useCallback(() => {
    setState(s => ({ ...s, mode: 'live', playbackIndex: null, isPlaying: false }));
    visPlayback.exit();
  }, []);

  const stepBy = useCallback((delta: number) => {
    setState(s => {
      if (s.count === 0) return s;
      const idx = s.playbackIndex == null ? s.count-1 : s.playbackIndex;
      const next = clampIndex(idx + delta, s.count);
      const nextSnap = getDecodedAtFromState(s, next);
      if (nextSnap) visPlayback.show(nextSnap);
      return { ...s, mode: 'playback', playbackIndex: next, isPlaying: false };
    });
  }, []);

  const setFps = useCallback((fps: number) => setState(s => ({ ...s, fps: Math.max(1, Math.min(60, fps)) })), []);

  const play = useCallback(() => {
    setState(s => ({ ...s, mode: 'playback', isPlaying: true, playbackIndex: s.playbackIndex ?? (s.count ? 0 : 0) }));
  }, []);

  const pause = useCallback(() => setState(s => ({ ...s, isPlaying: false })), []);

  // Playback timer
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (state.mode === 'playback' && state.isPlaying && state.count > 0) {
      const interval = 1000 / state.fps;
      timerRef.current = setInterval(() => {
        setState(s => {
          const idx = (s.playbackIndex ?? 0) + 1;
          const wrapped = idx >= s.count ? 0 : idx;
          const snap = getDecodedAtFromState(s, wrapped);
          if (snap) visPlayback.show(snap);
          return { ...s, playbackIndex: wrapped };
        });
      }, interval);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.mode, state.isPlaying, state.fps, state.count]);

  const value: HistoryCtx = {
    ...state, push, clear, setCapacity, setStride, toggleCompression,
    enterPlayback, exitPlayback, stepBy, setFps, play, pause, getDecodedAt
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHistory() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useHistory must be used inside HistoryProvider');
  return ctx;
}

function clampIndex(i: number, count: number) {
  if (count <= 0) return 0;
  return Math.max(0, Math.min(count-1, i));
}

function getDecodedAtFromState(s: HistoryState, idx: number): Snapshot | null {
  if (s.count === 0) return null;
  const base = (s.items.length === s.capacity && s.count === s.capacity) ? s.head : 0;
  const phys = (base + clampIndex(idx, s.count)) % (s.items.length || 1);
  const enc = s.items[phys];
  if (!enc) return null;
  const len = enc.size.x * enc.size.y * enc.size.z;
  const channel = enc.encoding === 'rle' ? rleDecode(enc.data, len) : enc.data;
  return { size: enc.size, channel };
}