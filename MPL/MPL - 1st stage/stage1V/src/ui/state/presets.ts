// src/ui/state/presets.ts
import React, { createContext, useContext, useState } from 'react';
import { PRESETS, Preset } from '../../presets/presets';
import { patternIO } from '../../engine/patternIO';
import { ruleHotReload } from '../../engine/ruleHotReload';

type PresetsCtx = {
  presets: Preset[];
  lastStatus: string;
  gridSize: { x:number; y:number; z:number };
  setGridSize: (s: {x:number;y:number;z:number}) => void;
  loadPreset: (id: string, opts?: { applyRules?: boolean; seed?: number }) => void;
};

const Ctx = createContext<PresetsCtx | null>(null);

export function PresetsProvider({ children }: { children: React.ReactNode }) {
  const [lastStatus, setLastStatus] = useState('');
  const [gridSize, setGridSize] = useState({ x: 32, y: 32, z: 32 });

  const loadPreset = (id: string, opts?: { applyRules?: boolean; seed?: number }) => {
    const p = PRESETS.find(p => p.id === id);
    if (!p) { setLastStatus('Preset not found.'); return; }

    // 1) Pattern
    const pattern = p.generate({ ...gridSize, seed: opts?.seed });
    try {
      patternIO.apply(pattern, { origin: { x:0,y:0,z:0 }, merge: 'replace' });
      setLastStatus('Pattern applied.');
    } catch (e:any) {
      setLastStatus('Pattern apply failed: ' + (e?.message || e));
      return;
    }

    // 2) Optional rules
    if (opts?.applyRules && p.rulesSource) {
      const res = ruleHotReload.stage(p.rulesSource);
      if (res.ok) {
        const ok = ruleHotReload.apply();
        setLastStatus(ok ? 'Pattern applied + rules hot-swapped.' : 'Pattern applied; failed applying rules.');
      } else {
        setLastStatus('Pattern applied; rules validation failed.');
      }
    }
  };

  const value: PresetsCtx = {
    presets: PRESETS,
    lastStatus,
    gridSize, setGridSize,
    loadPreset
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePresets() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePresets must be used within PresetsProvider');
  return ctx;
}