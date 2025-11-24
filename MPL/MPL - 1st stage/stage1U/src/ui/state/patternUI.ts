// src/ui/state/patternUI.ts
import React, { createContext, useContext, useState } from 'react';

export type MergeMode = 'replace' | 'add' | 'max';
export type Axis = 'zUp'; // can be extended later

type Ctx = {
  origin: { x:number; y:number; z:number };
  setOrigin: (o: {x:number;y:number;z:number}) => void;
  merge: MergeMode;
  setMerge: (m: MergeMode) => void;
  targetLayerId: string | null;
  setTargetLayerId: (id: string | null) => void;

  // Heightmap options
  hmZDepth: number;
  setHmZDepth: (n: number) => void;
  hmThreshold: number; // 0..255; values below are treated as empty
  setHmThreshold: (n: number) => void;
};

const Ctx = createContext<Ctx | null>(null);

export function PatternUIProvider({ children }: { children: React.ReactNode }) {
  const [origin, setOrigin] = useState({ x:0, y:0, z:0 });
  const [merge, setMerge] = useState<MergeMode>('replace');
  const [targetLayerId, setTargetLayerId] = useState<string | null>(null);
  const [hmZDepth, setHmZDepth] = useState<number>(16);
  const [hmThreshold, setHmThreshold] = useState<number>(1);

  return (
    <Ctx.Provider value={{ origin, setOrigin, merge, setMerge, targetLayerId, setTargetLayerId, hmZDepth, setHmZDepth, hmThreshold, setHmThreshold }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePatternUI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePatternUI must be used within PatternUIProvider');
  return ctx;
}