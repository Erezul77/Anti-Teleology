# Stage 1U — Pattern Import / Export (JSON + PNG Heightmap)

This stage adds **pattern I/O** so you can bring grid content in/out of the Playground:
- **Export** current grid or all layers to **JSON**
- **Import** a single-layer pattern from **JSON**
- **Import PNG heightmap** → 3D voxel pattern (extrude by grayscale)
- Apply pattern into the engine with origin/merge mode via a small engine hook

Works with both **single grid** (`visBridge`) and **multi-layer** (`layersBridge`) setups.

---

## What you get
- `src/engine/patternIO.ts` — engine-side hooks: register **apply** and **snapshot** providers; utility to apply patterns
- `src/ui/components/PatternPanel.tsx` — UI for **Export JSON**, **Import JSON**, **Import PNG Heightmap**
- `src/ui/utils/pngToPattern.ts` — browser-side PNG → channel / 3D extrude helpers
- `src/ui/state/patternUI.ts` — tiny store for import options (origin, target layer, merge mode, heightmap params)
- `README.md` — JSON schemas and wire-up

---

## JSON Schemas

### Single-layer Pattern
```json
{
  "schema": "mpl.pattern.v1",
  "size": { "x": 32, "y": 32, "z": 1 },
  "channel": "base64:AAECAwQ...",
  "meta": { "name": "My Pattern", "createdAt": 1690000000000 }
}
```
- `channel` is **base64** of **Uint8Array** length = `x*y*z` (x-major: `i = x + y*sx + z*sx*sy`).

### Multi-layer Pattern
```json
{
  "schema": "mpl.pattern.layers.v1",
  "layers": [
    {
      "id": "base", "name": "Base",
      "size": { "x": 32, "y": 32, "z": 1 },
      "channel": "base64:...",
      "meta": {}
    }
  ],
  "meta": { "createdAt": 1690000000000 }
}
```

---

## Quick Wire‑Up (≈3 minutes)

1) **Engine boot**: register apply + snapshot providers once.
```ts
// runner.ts or engine boot file
import { patternIO } from './patternIO';

patternIO.setApplyHandler((pattern, opts) => {
  // TODO: Implement this using your engine's APIs.
  // Example pseudo-code for single grid:
  // engine.pastePattern(pattern, { origin: opts.origin, mode: opts.merge });
});

// For export (JSON): provide current grid OR all layers
import { visBridge } from './visBridge';
import { layersBridge } from './layersBridge';

patternIO.setSnapshotProvider(() => {
  // Prefer layers if available; otherwise fall back to single grid
  const layers = layersBridge?.hasProvider?.() ? layersBridge.getSnapshot().layers : null;
  if (layers && layers.length) {
    return { kind: 'layers', layers };
  }
  const s = visBridge.getSnapshot().snapshot;
  return s ? { kind: 'single', snapshot: s } : null;
});
```

2) **Drop the panel** anywhere in the IDE (near grid / inspector):
```tsx
import { PatternPanel } from '../ui/components/PatternPanel';
<PatternPanel />
```

3) (Optional) Customize default **merge mode** and **heightmap** params in `patternUI.ts`.

---

## Merge Modes (engine-side behavior)
- `replace` — overwrite destination channel values
- `add` — `dst = clamp(dst + src)`
- `max` — `dst = max(dst, src)`
(You can ignore modes you don't need; they’re provided to the handler.)

---

## Acceptance Criteria
- Export current state to JSON (single grid or multi-layer)
- Import JSON to preview dimensions → **Apply** inserts into engine at chosen origin
- Import PNG heightmap, set `zDepth` → preview size → **Apply** extrudes into engine
- No runtime impact when panel is idle