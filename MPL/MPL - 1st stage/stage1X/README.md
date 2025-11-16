# Stage 1X — Rule Version Control (Commits, Diffs, Restore)

Lightweight **version control for rule sets** inside the Playground, no backend required.
- Save named **commits** of your rule source
- See **diffs** between editor vs. a commit (line diff)
- **Checkout to Editor** or **Apply to Engine**
- Optional **Auto-commit on Apply** (hooks into Stage 1S events)
- Stored locally (browser `localStorage`)

## What you get
- `src/engine/ruleRepo.ts` — tiny repository API (commit/list/get/delete), FNV-1a hashing
- `src/ui/utils/diff.ts` — minimal line-diff (LCS)
- `src/ui/state/ruleVC.ts` — provider + hook; listens to `rulesReloaded` for auto-commit
- `src/ui/components/RuleVCPanel.tsx` — history list, commit input, diff viewer, checkout/apply/delete

## Quick wire-up (≈2 minutes)
1) Ensure Stage **1S** (Rule Hot Reload) is integrated.
2) Wrap your editor area with:
```tsx
import { RuleEditorProvider } from '../ui/state/ruleEditor'; // from 1S
import { RuleVCProvider } from '../ui/state/ruleVC';

<RuleEditorProvider>
  <RuleVCProvider>
    {/* your editor + RuleHotReloadPanel */}
  </RuleVCProvider>
</RuleEditorProvider>
```
3) Mount the panel:
```tsx
import RuleVCPanel from '../ui/components/RuleVCPanel';
<RuleVCPanel />
```

## Acceptance
- Commit current editor contents with a message
- View diff (commit → editor)
- Checkout commit into editor, or apply to engine (via Stage 1S)
- Toggle auto-commit on successful Apply