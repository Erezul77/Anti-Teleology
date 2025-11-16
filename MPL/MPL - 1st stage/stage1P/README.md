# Stage 1P — State History & Playback

Adds a *timeline buffer* that records grid snapshots and a **Timeline Panel** to scrub, play, and compare states.
Playback integrates with the visualization (Stage 1O) by temporarily overriding the live snapshot in `visBridge`.

## What you get
- `HistoryProvider` + `useHistory()` — minimal store for timeline, playback state, and controls
- `useHistoryCollector()` — subscribes to engine `tick` and records snapshots (every N steps)
- `TimelinePanel` — slider + play/pause/step + "Follow Live" toggle
- `visPlayback` — a tiny helper to put `VoxelGrid3D` into playback mode (without touching engine code)
- `visBridge.patch` — adds an optional *override snapshot* so playback can display historical frames
- Optional RLE compression for the channel buffer to save memory

## Install
No new deps. (Uses your existing `events` + `visBridge` + React only.)

## Folder layout
```
src/
 ├─ engine/
 │   ├─ visPlayback.ts      # controls playback override on top of visBridge
 │   └─ visBridge.patch     # patch to add override snapshot support
 └─ ui/
     ├─ components/
     │   └─ TimelinePanel.tsx
     ├─ hooks/
     │   └─ useHistoryCollector.ts
     └─ state/
         └─ history.ts
```

## Quick wire‑up (≈2 minutes)
1) **Apply the patch** to `src/engine/visBridge.ts` (or manually merge the few lines):
```diff
@@
 class VisBridge {
   private provider: (() => Snapshot) | null = null;
-  private tickVersion = 0;
+  private tickVersion = 0;
+  private overrideSnapshot: Snapshot | null = null;

@@
   getSnapshot(): { version:number; snapshot?: Snapshot } {
-    return { version: this.tickVersion, snapshot: this.provider?.() };
+    return { version: this.tickVersion, snapshot: this.overrideSnapshot ?? this.provider?.() };
   }

   constructor() {
     // Advance a simple version so UI knows when to refresh
     eventBus.on('tick', () => { this.tickVersion++; });
     eventBus.on('simulationStop', () => { this.tickVersion++; });
   }
+
+  setExternalSnapshot(s: Snapshot | null) {
+    this.overrideSnapshot = s;
+    this.tickVersion++;
+  }
 }
```

2) **Wrap your IDE root** with the providers:
```tsx
import { VoxelSelectionProvider } from '../ui/hooks/useVoxelSelection';
import { HistoryProvider } from '../ui/state/history';
import { useHistoryCollector } from '../ui/hooks/useHistoryCollector';

function IDERoot() {
  useHistoryCollector(); // starts collecting snapshots during run
  return (
    <VoxelSelectionProvider>
      <HistoryProvider>
        {/* ... your layout ... */}
      </HistoryProvider>
    </VoxelSelectionProvider>
  );
}
```

3) **Add the panel** next to the grid:
```tsx
import TimelinePanel from '../ui/components/TimelinePanel';

<div className="grid grid-cols-[1fr_320px] gap-3 h-full">
  <VoxelGrid3D className="h-full w-full rounded-2xl overflow-hidden" />
  <div className="flex flex-col gap-3">
    <VoxelInspectorPanel />
    <TimelinePanel />
  </div>
</div>
```

4) (Optional) Tune history:
Open `history.ts` and adjust:
- `capacity` (default 600 frames)
- `stride` (record every N ticks; default 1)
- `useCompression` (RLE on/off)

## Acceptance criteria
- Records snapshots as the engine runs (bounded memory via ring buffer)
- Scrub with a slider to show any past frame in the 3D grid
- Play/pause, step prev/next, follow live
- Switching back to live resumes real-time updates

## Memory notes
For a 32×32×32 grid (`32768` voxels), a raw channel is ~32 KB per frame.
At 600 frames: ~19.7 MB uncompressed. RLE typically shrinks many simulations by 2–10×.