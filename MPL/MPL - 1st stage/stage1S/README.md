# Stage 1S — Rule Editing with Live Reload (Validate → Hot‑Swap → Rollback)

Hot‑reload your rule set at runtime with safety:
- **Validate** (compile offline, no side effects)
- **Apply** (atomic swap into the engine)
- **Rollback** (discard staged)
- **Events** for success/errors

Works with your existing parser/engine by injecting 3 tiny callbacks.

## What you get
- `ruleHotReload.ts` — engine‑side manager (staging, apply, rollback, hashing)
- `events.patch` — adds `rulesReloaded` and `rulesReloadError` to `EngineEvents`
- `RuleHotReloadPanel.tsx` — simple in‑IDE editor panel (textarea) + Validate/Apply/Discard
- `ruleEditor.ts` — tiny UI store for draft text & status

## Wire‑up (≈3 minutes)
1) **Merge events** (`src/engine/events.ts`) using the patch or manual edits:
```diff
@@
 export type EngineEvents = {
   tick: { step: number; t: number };
   stateChange: { /* ... */ };
   ruleApplied: { /* ... */ };
   simulationStart: { at: number };
   simulationStop: { at: number };
   error: { message: string; where?: string; data?: any };
+  rulesReloaded: { at: number; sourceHash: string; byteSize: number };
+  rulesReloadError: { at: number; errors: string[] };
 };
```

2) **Register integration** (once, e.g., in `runner.ts` or your engine boot file):
```ts
import { ruleHotReload } from './ruleHotReload';

// 2a) Provide a compiler (adapt to your real MPL parser)
ruleHotReload.setCompiler((src: string) => {
  try {
    // const rules = parseMPL(src);           // <-- your real parser
    // return { ok: true, rules };
    const mock = { rules: src.length };      // placeholder if parser not ready
    return { ok: true, rules: mock };
  } catch (e:any) {
    return { ok: false, errors: [String(e.message || e)] };
  }
});

// 2b) Tell how to apply rules atomically to the running engine
ruleHotReload.setApplyHandler((rules) => {
  // engine.setRules(rules);                  // <-- swap active rule set
});

// 2c) Provide a way to fetch the current active source (for the editor's "Load Active")
ruleHotReload.setActiveSourceProvider(() => {
  // return engine.getActiveRuleSource();     // <-- return string of current rules
  return '';                                  // placeholder
});
```

3) **Drop the panel** in your IDE (anywhere near the grid/inspector):
```tsx
import RuleHotReloadPanel from '../ui/components/RuleHotReloadPanel';
<RuleHotReloadPanel />
```

4) (Optional) Replace the textarea with your existing Monaco/CodeMirror editor.
Just bind the text to `useRuleEditor()` instead of the local textarea state.

## Acceptance criteria
- Validate compiles staged rules **without** touching the running engine
- Apply swaps the rule set atomically; emits `rulesReloaded` (and updates take effect next tick)
- Invalid sources emit `rulesReloadError` and do **not** affect runtime
- Discard removes staged data without side effects

## Notes
- The reloader only understands strings in / compiled rule objects out. Keep your own types.
- Hashing is FNV‑1a (short base36 string) so you can track versions in metrics/logs.
- You can enrich events with more metadata later (e.g., rule counts).