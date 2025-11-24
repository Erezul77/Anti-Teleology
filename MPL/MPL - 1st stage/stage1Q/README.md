# Stage 1Q — Rule Debugger (Single‑Voxel Step‑Through)

Add an **instrumented rule debugger** that captures the evaluation trace for a **single voxel** per tick.
The debugger integrates with the Stage 1N `EventBus` and shows traces in a UI panel.

## What you get
- `ruleDebug.ts` — engine‑side instrumentation with a small API
  - `setTarget(pos|null)`, `hasTarget()`, `shouldCapture(pos)`
  - `begin(step,pos)`, `predicate(ruleId,label,ok,details?)`, `action(ruleId,desc,delta?)`, `end()`
  - optional: `setEvalProvider(fn)` so the UI can trigger **evaluate‑once** for the target voxel
- `events.patch` — extends `EngineEvents` with a `ruleDebug` event
- `RuleDebuggerPanel.tsx` — live trace viewer + “Watch selected voxel” + optional “Step once”
- `useRuleDebugStream.ts` — hook to read `ruleDebug` events and keep the latest trace

## Minimal integration (≈3 minutes)
1) **Extend events** — merge `src/engine/events.patch` into your `src/engine/events.ts` (add the `ruleDebug` type):
```diff
@@
 export type EngineEvents = {
   tick: { step: number; t: number };
   stateChange: { /* ... */ };
   ruleApplied: { /* ... */ };
   simulationStart: { at: number };
   simulationStop: { at: number };
   error: { message: string; where?: string; data?: any };
+  ruleDebug: {
+    step: number;
+    pos: VoxelPos;
+    trace: RuleDebugTrace;
+  };
 };
+
+export type RuleDebugEntry =
+  | { kind: 'start'; ruleId: string }
+  | { kind: 'predicate'; ruleId: string; label: string; ok: boolean; details?: any }
+  | { kind: 'action'; ruleId: string; desc: string; delta?: any }
+  | { kind: 'end'; ruleId: string };
+
+export type RuleDebugTrace = {
+  step: number;
+  pos: VoxelPos;
+  entries: RuleDebugEntry[];
+  summary?: { matchedRules: string[] };
+};
```

2) **Add instrumentation** — import `ruleDebug` in your rule application code and sprinkle 3–5 calls:
```ts
import { ruleDebug } from './ruleDebug';

function applyRulesAt(x:number,y:number,z:number) {
  if (!ruleDebug.shouldCapture({x,y,z})) return engineApplyWithoutDebug(x,y,z);

  ruleDebug.begin(currentStep, {x,y,z});
  for (const rule of rules) {
    ruleDebug.markStart(rule.id);
    const ok = rule.when?.({x,y,z, grid}) ?? true;
    ruleDebug.predicate(rule.id, 'when', !!ok);
    if (ok) {
      const delta = rule.then?.({x,y,z, grid});
      ruleDebug.action(rule.id, 'then', delta);
      // ...apply delta...
    }
    ruleDebug.markEnd(rule.id);
  }
  ruleDebug.end();
}
```

3) **Wire UI** — drop the panel in your IDE (next to the grid & inspector):
```tsx
import RuleDebuggerPanel from '../ui/components/RuleDebuggerPanel';

<RuleDebuggerPanel />
```

4) **Select target** — Click a voxel in the 3D grid, then press **“Watch selected voxel”** in the panel.
On each tick, if the engine happens to evaluate that voxel, you’ll see a full trace.

5) (Optional) **Step once** — Set `ruleDebug.setEvalProvider(pos => applyRulesAt(pos.x,pos.y,pos.z))` to enable the button.

## Acceptance criteria
- Can choose a voxel and see a structured trace of **which rules matched** and **what actions executed** on the last tick.
- Works without changing the rule semantics when debugger is not enabled.
- Low overhead: instrumentation only records when `ruleDebug.shouldCapture(pos)` is true (single voxel).

## Notes
- If your rule model differs, adapt the 3–5 call sites to your predicates and actions. The UI is agnostic — it renders whatever you emit.
- You can add more `predicate()` calls to expose intermediate checks.