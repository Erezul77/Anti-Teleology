// src/visBridge.ts
// Minimal bridge between MPL engine state and UI visualization.
import { eventBus } from './events';

export type Snapshot = {
  size: { x: number; y: number; z: number };
  channel: Uint8Array; // flattened x-major: i = x + y*sx + z*sx*sy
  getStateAt?: (x: number, y: number, z: number) => Record<string, any> | undefined;
};

class VisBridge {
  private provider: (() => Snapshot) | null = null;
  private tickVersion = 0;

  setSnapshotProvider(fn: () => Snapshot) {
    this.provider = fn;
  }

  hasProvider() { return !!this.provider; }

  getSnapshot(): { version: number; snapshot?: Snapshot } {
    return { version: this.tickVersion, snapshot: this.provider?.() };
  }

  constructor() {
    // Advance a simple version so UI knows when to refresh
    eventBus.on('tick', () => { this.tickVersion++; });
    eventBus.on('simulationStop', () => { this.tickVersion++; });
  }
}

export const visBridge = new VisBridge();
export type { Snapshot as VisSnapshot };
