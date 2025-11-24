// src/ui/components/PresetsPanel.tsx
import React, { useMemo, useState } from 'react';
import { usePresets } from '../state/presets';

export default function PresetsPanel() {
  const { presets, gridSize, setGridSize, loadPreset, lastStatus } = usePresets();
  const [q, setQ] = useState('');
  const [applyRules, setApplyRules] = useState(true);
  const [seed, setSeed] = useState<number | ''>('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return presets;
    return presets.filter(p =>
      p.title.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      p.tags.some(t => t.toLowerCase().includes(s))
    );
  }, [q, presets]);

  const onLoad = (id: string) => {
    const seedVal = typeof seed === 'number' ? seed : undefined;
    loadPreset(id, { applyRules, seed: seedVal });
  };

  return (
    <div className="p-3 rounded-xl bg-neutral-900 text-neutral-100 shadow space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-80">Presets</div>
        <div className="text-[11px] opacity-70">{lastStatus || 'Ready.'}</div>
      </div>

      <div className="flex items-center gap-2">
        <input
          placeholder="Search presets…"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          className="flex-1 bg-neutral-800 rounded px-2 py-1 text-xs"
        />
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={applyRules} onChange={(e)=>setApplyRules(e.target.checked)} />
          Apply rules
        </label>
      </div>

      <div className="rounded-lg bg-neutral-800 p-2 text-xs">
        <div className="opacity-80 mb-2">Grid Size</div>
        <div className="grid grid-cols-6 gap-2 items-center">
          <label className="opacity-70">X</label>
          <input type="number" value={gridSize.x} onChange={(e)=>setGridSize({ ...gridSize, x: parseInt(e.target.value||'1',10) })} className="bg-neutral-700 rounded px-2 py-1" />
          <label className="opacity-70">Y</label>
          <input type="number" value={gridSize.y} onChange={(e)=>setGridSize({ ...gridSize, y: parseInt(e.target.value||'1',10) })} className="bg-neutral-700 rounded px-2 py-1" />
          <label className="opacity-70">Z</label>
          <input type="number" value={gridSize.z} onChange={(e)=>setGridSize({ ...gridSize, z: parseInt(e.target.value||'1',10) })} className="bg-neutral-700 rounded px-2 py-1" />
        </div>
        <div className="grid grid-cols-6 gap-2 items-center mt-2">
          <label className="opacity-70">Seed</label>
          <input
            type="number"
            value={seed}
            onChange={(e)=>setSeed(e.target.value === '' ? '' : parseInt(e.target.value,10))}
            placeholder="optional"
            className="bg-neutral-700 rounded px-2 py-1"
          />
          <div className="col-span-4 opacity-60">Optional seed for deterministic patterns.</div>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(p => (
          <div key={p.id} className="rounded-lg bg-neutral-800 p-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{p.title}</div>
                <div className="text-xs opacity-80">{p.description}</div>
              </div>
              <button
                className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-xs"
                onClick={()=>onLoad(p.id)}
              >
                Load
              </button>
            </div>
            <div className="mt-1 text-[11px] opacity-70">#{p.tags.join('  #')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}