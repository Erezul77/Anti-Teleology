// src/engine/patternIO.ts
import type { Snapshot } from './visBridge';

export type PatternV1 = {
  schema: 'mpl.pattern.v1';
  size: { x:number; y:number; z:number };
  channel: Uint8Array;
  meta?: Record<string, any>;
};

export type LayerPattern = {
  id: string;
  name: string;
  size: { x:number; y:number; z:number };
  channel: Uint8Array;
  meta?: Record<string, any>;
};

export type LayersPatternV1 = {
  schema: 'mpl.pattern.layers.v1';
  layers: LayerPattern[];
  meta?: Record<string, any>;
};

export type AnyPattern = PatternV1 | LayersPatternV1;

export type ApplyOptions = {
  origin: { x:number; y:number; z:number };
  targetLayerId?: string | null;
  merge: 'replace' | 'add' | 'max';
};

type ApplyHandler = (pattern: AnyPattern, opts: ApplyOptions) => void;
type SnapshotProvider = () => (null | { kind: 'single'; snapshot: Snapshot } | { kind: 'layers'; layers: Array<{ id:string; name:string; size:{x:number;y:number;z:number}; channel: Uint8Array }>);

class PatternIO {
  private applyHandler: ApplyHandler | null = null;
  private snapshotProvider: SnapshotProvider | null = null;

  setApplyHandler(fn: ApplyHandler) { this.applyHandler = fn; }
  setSnapshotProvider(fn: SnapshotProvider) { this.snapshotProvider = fn; }

  exportCurrent(): AnyPattern | null {
    if (!this.snapshotProvider) return null;
    const src = this.snapshotProvider();
    if (!src) return null;
    if (src.kind === 'single') {
      const { size, channel } = src.snapshot;
      return { schema: 'mpl.pattern.v1', size, channel: channel.slice() };
    } else {
      const layers = src.layers.map(L => ({
        id: L.id, name: L.name, size: L.size, channel: L.channel.slice()
      }));
      return { schema: 'mpl.pattern.layers.v1', layers };
    }
  }

  apply(pattern: AnyPattern, opts: ApplyOptions) {
    if (!this.applyHandler) throw new Error('PatternIO: no apply handler registered');
    this.applyHandler(pattern, opts);
  }
}

export const patternIO = new PatternIO();

// ---- helpers for base64 encoding/decoding ----
export function u8ToBase64(u8: Uint8Array): string {
  let s = ''; for (let i=0;i<u8.length;i++) s += String.fromCharCode(u8[i]);
  return 'base64:' + btoa(s);
}
export function base64ToU8(s: string): Uint8Array {
  const b64 = s.startsWith('base64:') ? s.slice(7) : s;
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) u8[i] = bin.charCodeAt(i);
  return u8;
}