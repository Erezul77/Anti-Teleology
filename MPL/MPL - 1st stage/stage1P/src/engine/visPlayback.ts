// src/engine/visPlayback.ts
import { visBridge } from './visBridge';
import type { Snapshot } from './visBridge';

export const visPlayback = {
  enter(snapshot: Snapshot) {
    visBridge.setExternalSnapshot(snapshot);
  },
  exit() {
    visBridge.setExternalSnapshot(null);
  },
  show(snapshot: Snapshot) {
    visBridge.setExternalSnapshot(snapshot);
  }
};