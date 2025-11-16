// src/ui/components/RuleDebuggerPanel.tsx
import React, { useMemo, useState } from 'react';
import { useVoxelSelection } from '../hooks/useVoxelSelection';
import { useRuleDebugStream } from '../hooks/useRuleDebugStream';
import { ruleDebug } from '../../engine/ruleDebug';

export default function RuleDebuggerPanel() {
  const { selection } = useVoxelSelection();
  const { latest } = useRuleDebugStream(50);
  const [watching, setWatching] = useState(false);

  const selText = selection ? `(${selection.x},${selection.y},${selection.z})` : 'none';
  const target = ruleDebug.getTarget();
  const isTargetSelected = !!target && selection && target.x===selection.x && target.y===selection.y && target.z===selection.z;

  const onToggleWatch = () => {
    if (!selection) return;
    if (isTargetSelected && watching) {
      ruleDebug.clearTarget();
      setWatching(false);
    } else {
      ruleDebug.setTarget(selection);
      setWatching(true);
    }
  };

  const onStepOnce = () => {
    ruleDebug.stepOnce();
  };

  const trace = latest?.trace;
  const entries = trace?.entries ?? [];

  return (
    <div className="p-3 rounded-xl bg-neutral-900 text-neutral-100 text-sm space-y-3 shadow">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-80">Rule Debugger</div>
        <div className="text-xs opacity-70">Selected: <span className="font-mono">{selText}</span></div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className={"px-2 py-1 rounded text-xs " + (selection ? "bg-neutral-800 hover:bg-neutral-700" : "bg-neutral-800/50 cursor-not-allowed")}
          disabled={!selection}
          onClick={onToggleWatch}
        >
          {isTargetSelected && watching ? 'Stop Watching' : 'Watch selected voxel'}
        </button>
        <button
          className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs"
          onClick={onStepOnce}
          title="Evaluate rules once on target voxel (requires engine to set eval provider)"
        >
          Step once
        </button>
      </div>

      {!trace ? (
        <div className="opacity-60 text-xs">No trace yet. Start the simulation or press “Step once”.</div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs opacity-80">Trace @ step {trace.step} — pos ({trace.pos.x},{trace.pos.y},{trace.pos.z})</div>
          <div className="max-h-56 overflow-auto bg-neutral-800 rounded p-2 text-[11px] font-mono">
            {entries.map((e: any, i: number) => (
              <div key={i} className="whitespace-pre">
                {formatEntry(e)}
              </div>
            ))}
          </div>
          {trace.summary?.matchedRules?.length ? (
            <div className="text-xs opacity-80">
              Matched rules: {trace.summary.matchedRules.join(', ')}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function formatEntry(e: any): string {
  switch (e.kind) {
    case 'start': return `→ ${e.ruleId}`;
    case 'predicate': return `   ? ${e.ruleId}.${e.label} = ${e.ok} ${e.details ? JSON.stringify(e.details) : ''}`;
    case 'action': return `   ✓ ${e.ruleId}.action: ${e.desc} ${e.delta ? JSON.stringify(e.delta) : ''}`;
    case 'end': return `← ${e.ruleId}`;
    default: return JSON.stringify(e);
  }
}