// src/ui/state/layerConfig.ts
import React, { createContext, useContext, useState } from 'react';

type LayerOverride = { visible?: boolean; opacity?: number };
type Ctx = {
  overrides: Record<string, LayerOverride>;
  setVisible: (id: string, v: boolean) => void;
  setOpacity: (id: string, a: number) => void;
  reset: () => void;
};

const LayerConfigCtx = createContext<Ctx | null>(null);

export function LayerConfigProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, LayerOverride>>({});
  const setVisible = (id: string, v: boolean) => setOverrides(o => ({ ...o, [id]: { ...(o[id]||{}), visible: v } }));
  const setOpacity = (id: string, a: number) => setOverrides(o => ({ ...o, [id]: { ...(o[id]||{}), opacity: Math.max(0, Math.min(1, a)) } }));
  const reset = () => setOverrides({});
  return (
    <LayerConfigCtx.Provider value={{ overrides, setVisible, setOpacity, reset }}>
      {children}
    </LayerConfigCtx.Provider>
  );
}

export function useLayerConfig() {
  const ctx = useContext(LayerConfigCtx);
  if (!ctx) throw new Error('useLayerConfig must be used within LayerConfigProvider');
  return ctx;
}