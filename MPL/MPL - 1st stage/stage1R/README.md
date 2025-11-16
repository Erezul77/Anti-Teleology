# Stage 1R — Timeline & Metrics Panel

Real‑time **metrics** for your simulation + small **charts** over time. It listens to `eventBus`
and records per‑tick stats (FPS, changed voxels, rule triggers). It also integrates with Stage 1O/1P via `visBridge` to compute % changed.

## What you get
- `MetricsProvider` + `useMetrics()` — in‑memory ring buffers of the last N samples
- `useMetricsCollector()` — collects tick rate and counts by listening to `tick`, `stateChange`, `ruleApplied`
- `MetricsPanel.tsx` — live KPIs + small charts (Recharts) + top rules table
- Config knobs (buffer size, EMA smoothing, etc.)

## Install deps
```bash
npm i recharts
```

## Folder layout
```
src/
 └─ ui/
    ├─ components/
    │  └─ MetricsPanel.tsx
    ├─ hooks/
    │  └─ useMetricsCollector.ts
    └─ state/
       └─ metrics.ts
```

## Quick wire‑up (≈2 minutes)
1) **Add provider** around your IDE root:
```tsx
import { MetricsProvider } from '../ui/state/metrics';
import { useMetricsCollector } from '../ui/hooks/useMetricsCollector';

function IDERoot() {
  useMetricsCollector(); // start collecting
  return (
    <MetricsProvider>
      {/* your IDE layout */}
    </MetricsProvider>
  );
}
```

2) **Drop the panel** next to your grid:
```tsx
import MetricsPanel from '../ui/components/MetricsPanel';
<MetricsPanel />
```

3) (Optional) If your engine can compute an "active voxels" count more precisely, you can emit a custom `ruleApplied` meta or additional `stateChange` batches. By default we derive:
- **changed voxels** = unique positions seen in `stateChange` during a tick
- **% changed** = changed / (grid size from `visBridge`) * 100

## Acceptance criteria
- Display current FPS (EMA), changed voxels, % changed, total rule triggers for last tick
- Show line charts for FPS and % changed over the buffer window
- Show top rules by triggers (rolling window)

## Notes
- Buffers are bounded (default 600 samples). Adjust in `metrics.ts`.
- Low overhead: we aggregate in memory and flush per `tick`.