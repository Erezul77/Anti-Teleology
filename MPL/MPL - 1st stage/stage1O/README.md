# Stage 1O — Live Voxel Grid Visualization

This stage adds a real-time 3D voxel grid viewer to the Web IDE, wired to the engine via the Stage 1N EventBus.

## What you get
- `<VoxelGrid3D />` — React + Three.js (r3f) instanced voxel renderer
- `<VoxelInspectorPanel />` — click-to-inspect panel for voxel state
- `visBridge` — a tiny adapter between your engine and the UI
- Color mapping and simple config
- A small patch snippet showing where to connect in your runner

## Install deps (if not already in your project)
```bash
npm i three @react-three/fiber @react-three/drei
```

## Folder layout
```
src/
 ├─ engine/
 │   └─ visBridge.ts     # engine↔UI bridge (set snapshot provider; optional diffs)
 └─ ui/
     ├─ components/
     │   ├─ VoxelGrid3D.tsx
     │   └─ VoxelInspectorPanel.tsx
     ├─ hooks/
     │   └─ useVoxelSelection.ts
     └─ state/
         └─ visConfig.ts
```

## Quick wire‑up (≈2 minutes)
1) **Add the files** in this bundle to your repo under the same paths.
2) **Emit ticks** (already in Stage 1N). The grid will refresh on every `tick`.
3) **Provide a snapshot** function in your runner (see patch below) and register it:
```ts
// runner.ts (add once after you build or load your grid)
import { visBridge } from './visBridge';
visBridge.setSnapshotProvider(() => buildGridSnapshot());
```
`buildGridSnapshot()` should return:
```ts
type Snapshot = {
  size: { x:number; y:number; z:number };
  channel: Uint8Array; // length = x*y*z (0..255), used for color map
  getStateAt?: (x:number,y:number,z:number) => Record<string,any> | undefined;
};
```
4) **Use the components** in your IDE workspace:
```tsx
import VoxelGrid3D from '../ui/components/VoxelGrid3D';
import VoxelInspectorPanel from '../ui/components/VoxelInspectorPanel';

<VoxelGrid3D className="h-full w-full" />
<VoxelInspectorPanel />
```
5) **Color mapping** — edit `visConfig.ts` or replace `colorForChannel()` to map your channel values to custom colors.

## Engine patch (example)
```diff
--- a/src/engine/runner.ts
+++ b/src/engine/runner.ts
@@ -1,6 +1,11 @@
 import { eventBus } from './events';
+import { visBridge, Snapshot } from './visBridge';

 export class EngineRunner {
   private step = 0;
   private running = false;
+  // Example: reference to your grid data structure
+  private grid: any;

   start() {
     eventBus.emit('simulationStart', { at: Date.now() });
@@ -15,9 +20,22 @@ export class EngineRunner {
     // ... mutate grid with your rules here

     this.step++;
+    // Ensure a snapshot provider exists (cheap function, no heavy cloning):
+    if (!visBridge.hasProvider()) {
+      visBridge.setSnapshotProvider((): Snapshot => {
+        const { sx, sy, sz } = this.grid; // adapt to your structure
+        const channel = new Uint8Array(sx*sy*sz);
+        // Fill channel from your voxel states (0..255). Example:
+        // for (let i=0;i<channel.length;i++) channel[i] = this.grid.voxels[i].c & 0xff;
+        return {
+          size: { x: sx, y: sy, z: sz },
+          channel,
+          getStateAt: (x,y,z) => this.grid.getState(x,y,z)
+        };
+      });
+    }

     eventBus.emit('tick', { step: this.step, t: performance.now() });
   }

   stop() {
     this.running = false;
     eventBus.emit('simulationStop', { at: Date.now() });
   }
 }
```

## Notes
- The renderer is optimized with **InstancedMesh**. It updates only per tick.
- For very large grids, consider lowering voxel size or using a lower FPS (e.g., throttle on every Nth tick).
- The inspector calls `getStateAt(x,y,z)` if you provided it; otherwise it shows coordinates only.