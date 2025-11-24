# Stage 1V — Preset Library (Built‑in Demos)

One‑click **loadable presets** that set up an initial pattern and (optionally) a rules source.
This stage wires into **Stage 1S** (`ruleHotReload`) and **Stage 1U** (`patternIO`), so presets can:
- Apply an initial **pattern** (single grid for now; works with layers via your own apply handler)
- (Optionally) **load rules** text and hot‑swap them into the engine

> The presets ship with placeholder MPL snippets. If your MPL parser is ready, replace the `rulesSource` strings with real rules.
> If validation fails, we still apply the pattern and show a status line in the panel.

## What you get
- `src/presets/presets.ts` — preset definitions + generators (3D Life, Diffusion, Crystal Seed, Noise)
- `src/ui/state/presets.ts` — small store and `loadPreset()` coordinator
- `src/ui/components/PresetsPanel.tsx` — searchable list, grid size controls, **Load pattern** / **Load rules+pattern**
- `README.md` — wiring and notes

## Quick wire‑up (≈1 minute)
1) Ensure Stages **1S** and **1U** are integrated (ruleHotReload + patternIO).
2) Add the panel to your IDE:
```tsx
import { PresetsProvider } from '../ui/state/presets';
import PresetsPanel from '../ui/components/PresetsPanel';

<PresetsProvider>
  <PresetsPanel />
</PresetsProvider>
```
3) (Optional) Replace placeholder rule strings with your actual MPL rule sets.

## Acceptance criteria
- User can choose a preset and **apply** an initial pattern sized to the grid
- Optionally applies a matching **rules** source via hot reload
- Status feedback on success/failure (e.g., pattern applied even if rules failed to compile)