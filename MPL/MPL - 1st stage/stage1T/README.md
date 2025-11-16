# Stage 1T — Multi-Grid / Layer Support

Add support for **multiple voxel layers** rendered together:
- Each layer has its own **channel → color** mapping, **visibility**, and **opacity**
- Layers share the same grid dimensions for rendering (x,y,z)
- UI controls to toggle layers and adjust opacity
- Click selection still works — you can inspect a coordinate and (optionally) per-layer states

This stage is additive: the single-grid pipeline (Stage 1O with `visBridge`) **still works**.  
For multi-layer visualizing, we use a separate **`layersBridge`** and **`VoxelLayers3D`** component.

## What you get
- `layersBridge.ts` — engine↔UI bridge for **multiple layers** (cheap provider pattern, tick-synced)
- `VoxelLayers3D.tsx` — React + Three.js **multi-layer instanced renderer**
- `LayerControlsPanel.tsx` — UI toggles + opacity sliders
- `layerConfig.ts` — small UI store for per-layer overrides
- README with a small engine patch snippet

## Types
```ts
type LayerSnapshot = {
  id: string;                 // stable id
  name: string;               // display name
  visible?: boolean;          // default visibility (UI can override)
  opacity?: number;           // default 0..1  (UI can override)
  size: { x:number; y:number; z:number };
  channel: Uint8Array;        // length = x*y*z (0..255), color-mapped client-side
  getStateAt?: (x:number,y:number,z:number) => Record<string,any> | undefined;
};
```

## Quick wire‑up (≈3 minutes)
1) **Register a layered provider** in your engine once grid(s) are ready:
```ts
// runner.ts or engine boot
import { layersBridge, LayerSnapshot } from './layersBridge';

layersBridge.setProvider((): LayerSnapshot[] => {
  // Example using two internal grids with same dimensions
  const sx = gridA.sx, sy = gridA.sy, sz = gridA.sz;
  const chA = new Uint8Array(sx*sy*sz);
  const chB = new Uint8Array(sx*sy*sz);
  // fill channels 0..255 from your state
  // ...
  return [
    { id:'base', name:'Base', visible:true, opacity:1.0, size:{x:sx,y:sy,z:sz}, channel: chA, getStateAt:(x,y,z)=>gridA.getState(x,y,z) },
    { id:'heat', name:'Heat Field', visible:true, opacity:0.5, size:{x:sx,y:sy,z:sz}, channel: chB, getStateAt:(x,y,z)=>gridB.getState(x,y,z) },
  ];
});
```
> The provider should be **cheap** (no deep copies). Build channels each tick inside your engine, or cache buffers.

2) **Use layered renderer + controls** in your IDE:
```tsx
import VoxelLayers3D from '../ui/components/VoxelLayers3D';
import LayerControlsPanel from '../ui/components/LayerControlsPanel';

<div className="grid grid-cols-[1fr_320px] gap-3 h-full">
  <VoxelLayers3D className="h-full w-full rounded-2xl overflow-hidden" />
  <div className="flex flex-col gap-3">
    <LayerControlsPanel />
    {/* you can keep VoxelInspectorPanel, TimelinePanel, etc. */}
  </div>
</div>
```

3) **Events** — `layersBridge` bumps its internal version automatically on every `tick` via Stage 1N’s `eventBus`.

## Notes
- All layers must share the same `size` for now (keep it simple). We can extend to per-layer sizes later.
- Each layer is drawn as a separate `InstancedMesh` with its own **opacity** and **visibility**.
- Opacity works with `transparent` materials; the effect is additive overlay.
- For very large grids × many layers, consider throttling (record every Nth tick).

## Acceptance Criteria
- Multiple layers render simultaneously with independent visibility and opacity.
- Selection still works; panel shows current coordinates and (if you provide `getStateAt`) per-layer states.
- Performance holds on **32×32×32 with up to 3 layers** at interactive FPS.