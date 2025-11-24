// src/ui/components/RuleVCPanel.tsx
import React, { useMemo, useState } from 'react';
import { useRuleVC } from '../state/ruleVC';
import { useRuleEditor } from '../state/ruleEditor';
import { lineDiff } from '../utils/diff';

export default function RuleVCPanel() {
  const { commits, selectedId, setSelectedId, autoCommit, setAutoCommit, commitFromEditor, checkoutToEditor, applyToEngine, deleteCommit } = useRuleVC();
  const { text } = useRuleEditor();
  const [msg, setMsg] = useState('');

  const selected = useMemo(() => commits.find(c => c.id === selectedId) || null, [commits, selectedId]);
  const diff = useMemo(() => selected ? lineDiff(selected.source, text) : [], [selected?.id, text]);

  return (
    <div className="p-3 rounded-xl bg-neutral-900 text-neutral-100 shadow space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-80">Rule Version Control</div>
        <label className="text-xs flex items-center gap-2">
          <input type="checkbox" checked={autoCommit} onChange={(e)=>setAutoCommit(e.target.checked)} />
          Auto-commit on Apply
        </label>
      </div>

      <div className="rounded-lg bg-neutral-800 p-2 text-xs flex gap-2 items-center">
        <input
          className="flex-1 bg-neutral-700 rounded px-2 py-1"
          placeholder="Commit message"
          value={msg}
          onChange={(e)=>setMsg(e.target.value)}
        />
        <button className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600" onClick={()=>{ commitFromEditor(msg || '(no message)'); setMsg(''); }}>
          Commit current
        </button>
      </div>

      <div className="rounded-lg bg-neutral-800 p-2 max-h-40 overflow-auto">
        {commits.length === 0 ? (
          <div className="text-xs opacity-60">No commits yet.</div>
        ) : commits.map(c => (
          <div key={c.id} className={"p-2 rounded mb-1 cursor-pointer " + (c.id===selectedId ? "bg-neutral-700" : "hover:bg-neutral-700/60")}
               onClick={()=>setSelectedId(c.id)}>
            <div className="flex items-center justify-between">
              <div className="font-medium text-xs">{new Date(c.at).toLocaleString()}</div>
              <div className="text-[10px] opacity-70">#{c.hash} · {c.byteSize}B</div>
            </div>
            <div className="text-[11px] opacity-80">{c.message}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50" disabled={!selected} onClick={()=>selected && checkoutToEditor(selected.id)}>
          Checkout → Editor
        </button>
        <button className="px-2 py-1 rounded bg-green-700 hover:bg-green-600 disabled:opacity-50" disabled={!selected} onClick={async ()=>{ if (selected) await applyToEngine(selected.id); }}>
          Apply to Engine
        </button>
        <button className="ml-auto px-2 py-1 rounded bg-red-800 hover:bg-red-700 disabled:opacity-50" disabled={!selected} onClick={()=>selected && deleteCommit(selected.id)}>
          Delete
        </button>
      </div>

      <div className="rounded-lg bg-neutral-800 p-2 text-[11px] font-mono max-h-64 overflow-auto">
        {selected ? (
          <>
            <div className="opacity-70 mb-1">Diff: <span className="italic">commit</span> → <span className="italic">editor</span></div>
            {diff.map((d, i) => (
              <div key={i} className={d.type==='same' ? '' : (d.type==='add' ? 'text-emerald-300' : 'text-red-300')}>
                {d.type==='same' ? '  ' : (d.type==='add' ? '+ ' : '- ')}{d.text}
              </div>
            ))}
          </>
        ) : (
          <div className="opacity-60">Select a commit to view diff.</div>
        )}
      </div>
    </div>
  );
}