// src/ui/components/RuleHotReloadPanel.tsx
import React, { useEffect } from 'react';
import { useRuleEditor } from '../state/ruleEditor';

export default function RuleHotReloadPanel() {
  const { text, setText, status, errors, loadActive, validate, apply, discard } = useRuleEditor();

  useEffect(() => {
    // Initial load of active rules (if provider is wired)
    loadActive();
  }, []);

  return (
    <div className="p-3 rounded-xl bg-neutral-900 text-neutral-100 shadow space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-80">Rule Hot‑Reload</div>
        <StatusBadge status={status} />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-48 bg-neutral-800 rounded p-2 font-mono text-xs outline-none"
        spellCheck={false}
        placeholder="// Paste your MPL rule source here…"
      />

      {errors.length > 0 && (
        <div className="bg-red-900/40 border border-red-800 text-red-100 text-xs rounded p-2">
          <div className="opacity-80 mb-1">Errors:</div>
          <ul className="list-disc pl-4 space-y-1">
            {errors.map((e,i)=>(<li key={i} className="whitespace-pre-wrap">{e}</li>))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs" onClick={loadActive}>
          Load Active
        </button>
        <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs" onClick={validate}>
          Validate
        </button>
        <button className="px-2 py-1 rounded bg-green-700 hover:bg-green-600 text-xs" onClick={apply}>
          Apply
        </button>
        <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs" onClick={discard}>
          Discard
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'idle'|'valid'|'error'|'applied' }) {
  const map: Record<string, string> = {
    idle: 'Idle',
    valid: 'Valid (staged)',
    error: 'Error',
    applied: 'Applied'
  };
  const cls: Record<string, string> = {
    idle: 'bg-neutral-800 text-neutral-200',
    valid: 'bg-emerald-800 text-emerald-100',
    error: 'bg-red-800 text-red-100',
    applied: 'bg-blue-800 text-blue-100'
  };
  return <div className={`text-[10px] px-2 py-1 rounded ${cls[status]}`}>{map[status]}</div>;
}