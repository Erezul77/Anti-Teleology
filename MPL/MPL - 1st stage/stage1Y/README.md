# Stage 1Y — Snapshot Export (PNG + WebM Timelapse)

Export images and videos from the Playground:
- **PNG snapshot** of the current 3D view
- **WebM timelapse** recorded from the **history buffer** (Stage 1P), using `MediaRecorder`

This stage is UI-only and works with either single-grid (`visBridge`) or multi-layer (`layersBridge`) viewers.

---

## What you get
- `src/ui/utils/canvasExport.ts` — helpers to grab a `<canvas>` and download **PNG**
- `src/ui/utils/webmTimelapse.ts` — record a **WebM** from a canvas stream while stepping history frames
- `src/ui/components/SnapshotPanel.tsx` — controls: **Save PNG**, **Record Timelapse** (start/end/fps)

---

## Quick wire‑up (≈1 minute)
1) Give your `<Canvas>` an id in your viewer component so the panel can find it reliably:
```tsx
<div id="mpl-canvas">
  <Canvas /* ... */>
    {/* your scene */}
  </Canvas>
</div>
```
2) Mount the panel anywhere in your IDE:
```tsx
import SnapshotPanel from '../ui/components/SnapshotPanel';

<SnapshotPanel />
```
3) Make sure **Stage 1P** (history) is integrated; the timelapse uses `useHistory().getDecodedAt()`.

---

## Notes
- **PNG**: captures the current canvas pixels via `toDataURL` and triggers a download.
- **WebM**: uses `canvas.captureStream(fps)` + `MediaRecorder`. Browser support is strong for WebM/VP8/9.
- During timelapse recording we temporarily **override** the live view using Stage 1P’s playback override.
  Live updates resume automatically when recording finishes.
- If you want **GIF**, you can add a small encoder lib later; this stage focuses on **WebM** (smaller, higher quality).