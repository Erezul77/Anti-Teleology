// src/ui/state/metrics.ts
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';

export type TickSample = {
  step: number;
  t: number;            // performance time when tick emitted
  dtMs: number;         // ms since previous tick
  fps: number;          // instantaneous FPS (1000/dtMs)
  fpsEma: number;       // EMA smoothed FPS
  changedVoxels: number;
  percentChanged: number; // 0..100
  ruleTriggers: number;
  ruleCounts: Record<string, number>; // delta per rule this tick
};

export type MetricsState = {
  buffer: TickSample[];
  capacity: number;
  head: number;   // next write index
  count: number;  // valid samples (<=capacity)
  fpsAlpha: number;
};

type Ctx = MetricsState & {
  pushSample: (s: Omit<TickSample, 'fpsEma'>) => void;
  clear: () => void;
  setCapacity: (n: number) => void;
  setFpsAlpha: (a: number) => void;
};

const MetricsCtx = createContext<Ctx | null>(null);

export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MetricsState>({
    buffer: new Array<TickSample>(0),
    capacity: 600,
    head: 0,
    count: 0,
    fpsAlpha: 0.2, // EMA smoothing factor
  });
  const lastEmaRef = useRef<number | null>(null);

  const pushSample = (s: Omit<TickSample, 'fpsEma'>) => {
    const fpsEma = lastEmaRef.current == null
      ? s.fps
      : (state.fpsAlpha * s.fps + (1 - state.fpsAlpha) * lastEmaRef.current);
    lastEmaRef.current = fpsEma;

    setState(prev => {
      const buf = prev.buffer.length === prev.capacity
        ? prev.buffer.slice()
        : (prev.buffer.length ? prev.buffer.slice() : new Array<TickSample>(0));
      const sample: TickSample = { ...s, fpsEma };
      if (buf.length < prev.capacity) {
        buf.push(sample);
      } else {
        buf[prev.head] = sample;
      }
      const head = (prev.head + 1) % prev.capacity;
      const count = Math.min(prev.count + 1, prev.capacity);
      return { ...prev, buffer: buf, head, count };
    });
  };

  const clear = () => {
    lastEmaRef.current = null;
    setState(s => ({ ...s, buffer: [], head: 0, count: 0 }));
  };

  const setCapacity = (n: number) => setState(s => ({ ...s, capacity: Math.max(10, n) }));
  const setFpsAlpha = (a: number) => setState(s => ({ ...s, fpsAlpha: Math.min(1, Math.max(0.01, a)) }));

  const value: Ctx = { ...state, pushSample, clear, setCapacity, setFpsAlpha };
  return <MetricsCtx.Provider value={value}>{children}</MetricsCtx.Provider>;
}

export function useMetrics() {
  const ctx = useContext(MetricsCtx);
  if (!ctx) throw new Error('useMetrics must be used within MetricsProvider');
  return ctx;
}