// src/ui/components/LayerControlsPanel.tsx
import React from 'react';
import { layersBridge } from '../../engine/layersBridge';
import { useLayerConfig } from '../state/layerConfig';

export default function LayerControlsPanel() {
  const { overrides, setVisible, setOpacity, reset } = useLayerConfig();
  const { layers } = layersBridge.getSnapshot();
  return (
    <div className="p-3 rounded-xl bg-neutral-900 text-neutral-100 shadow space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-80">Layers</div>
        <button className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700" onClick={reset}>Reset</button>
      </div>
      <div className="space-y-3">
        {layers.length === 0 ? (
          <div className="opacity-60 text-xs">No layers. Register a provider in the engine.</div>
        ) : layers.map(L => {
          const o = overrides[L.id] || {};
          const visible = o.visible ?? (L.visible ?? true);
          const opacity = o.opacity ?? (typeof L.opacity === 'number' ? L.opacity : 1.0);
          return (
            <div key={L.id} className="rounded-lg bg-neutral-800 p-2">
              <div className="flex items-center justify-between text-xs">
                <div className="font-medium">{L.name}</div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e)=>setVisible(L.id, e.target.checked)}
                  />
                  <span className="opacity-70">Visible</span>
                </label>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="opacity-70 w-16">Opacity</span>
                <input
                  type="range"
                  min={0} max={1} step={0.05}
                  value={opacity}
                  onChange={(e)=>setOpacity(L.id, parseFloat(e.target.value))}
                  className="flex-1 accent-white"
                />
                <span className="w-10 text-right">{opacity.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}