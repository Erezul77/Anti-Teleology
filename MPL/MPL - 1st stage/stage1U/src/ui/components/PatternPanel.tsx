// src/ui/components/PatternPanel.tsx
import React, { useMemo, useRef, useState } from 'react';
import { patternIO, u8ToBase64, base64ToU8 } from '../../engine/patternIO';
import type { AnyPattern, PatternV1, LayersPatternV1 } from '../../engine/patternIO';
import { imageToGrayscale, fileToImage, extrudeTo3D } from '../utils/pngToPattern';
import { usePatternUI } from '../state/patternUI';
import { layersBridge } from '../../engine/layersBridge';

export function PatternPanel() {
  const { origin, setOrigin, merge, setMerge, targetLayerId, setTargetLayerId, hmZDepth, setHmZDepth, hmThreshold, setHmThreshold } = usePatternUI();
  const fileInputJson = useRef<HTMLInputElement>(null);
  const fileInputPng = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>('Idle.');
  const layerOptions = useMemo(() => {
    try {
      const { layers } = layersBridge.getSnapshot();
      return layers.map(L => ({ id: L.id, name: L.name }));
    } catch { return []; }
  }, []);

  const exportJSON = () => {
    const current = patternIO.exportCurrent();
    if (!current) { setStatus('Nothing to export (no snapshot).'); return; }
    const json = serializePattern(current);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentHasLayers(current) ? 'pattern_layers.json' : 'pattern.json';
    a.click();
    setStatus('Exported JSON.');
    URL.revokeObjectURL(url);
  };

  const onImportJSON = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    try {
      const obj = JSON.parse(text);
      const pattern = deserializePattern(obj);
      // Preview? For now we apply immediately with current UI opts:
      patternIO.apply(pattern, { origin, targetLayerId, merge });
      setStatus('Imported JSON and applied.');
    } catch (e:any) {
      setStatus('Failed to import JSON: ' + (e?.message || e));
    } finally {
      ev.target.value = '';
    }
  };

  const onImportPNG = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    try {
      const img = await fileToImage(f);
      const { width, height, gray } = imageToGrayscale(img);
      const { size, channel } = extrudeTo3D(gray, width, height, hmZDepth, hmThreshold);
      const pattern: AnyPattern = { schema: 'mpl.pattern.v1', size, channel };
      patternIO.apply(pattern, { origin, targetLayerId, merge });
      setStatus(`Imported PNG ${width}×${height} → extruded z=${hmZDepth} and applied.`);
    } catch (e:any) {
      setStatus('Failed to import PNG: ' + (e?.message || e));
    } finally {
      ev.target.value = '';
    }
  };

  return (
    <div className="p-3 rounded-xl bg-neutral-900 text-neutral-100 shadow space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs opacity-80">Patterns</div>
        <div className="text-[11px] opacity-70">{status}</div>
      </div>

      {/* Export */}
      <div className="rounded-lg bg-neutral-800 p-2">
        <div className="text-xs opacity-80 mb-2">Export</div>
        <button className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-xs" onClick={exportJSON}>
          Export JSON
        </button>
      </div>

      {/* Import JSON */}
      <div className="rounded-lg bg-neutral-800 p-2 space-y-2">
        <div className="text-xs opacity-80">Import JSON</div>
        <input ref={fileInputJson} type="file" accept="application/json" onChange={onImportJSON} className="text-xs" />
      </div>

      {/* Import PNG Heightmap */}
      <div className="rounded-lg bg-neutral-800 p-2 space-y-2">
        <div className="text-xs opacity-80">Import PNG Heightmap → 3D</div>
        <div className="grid grid-cols-3 gap-2 text-xs items-center">
          <label className="opacity-70">Z Depth</label>
          <input type="number" min={1} max={512} value={hmZDepth} onChange={(e)=>setHmZDepth(parseInt(e.target.value||'1',10))} className="bg-neutral-700 rounded px-2 py-1" />
          <div />
          <label className="opacity-70">Threshold</label>
          <input type="number" min={0} max={255} value={hmThreshold} onChange={(e)=>setHmThreshold(parseInt(e.target.value||'0',10))} className="bg-neutral-700 rounded px-2 py-1" />
          <div />
        </div>
        <input ref={fileInputPng} type="file" accept="image/png" onChange={onImportPNG} className="text-xs" />
      </div>

      {/* Options */}
      <div className="rounded-lg bg-neutral-800 p-2 space-y-2">
        <div className="text-xs opacity-80">Apply Options</div>
        <div className="grid grid-cols-6 gap-2 text-xs items-center">
          <label className="opacity-70">Origin X</label>
          <input type="number" value={origin.x} onChange={(e)=>setOrigin({ ...origin, x: parseInt(e.target.value||'0',10) })} className="bg-neutral-700 rounded px-2 py-1" />
          <label className="opacity-70">Origin Y</label>
          <input type="number" value={origin.y} onChange={(e)=>setOrigin({ ...origin, y: parseInt(e.target.value||'0',10) })} className="bg-neutral-700 rounded px-2 py-1" />
          <label className="opacity-70">Origin Z</label>
          <input type="number" value={origin.z} onChange={(e)=>setOrigin({ ...origin, z: parseInt(e.target.value||'0',10) })} className="bg-neutral-700 rounded px-2 py-1" />
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs items-center mt-2">
          <label className="opacity-70">Merge</label>
          <select value={merge} onChange={(e)=>setMerge(e.target.value as any)} className="bg-neutral-700 rounded px-2 py-1">
            <option value="replace">replace</option>
            <option value="add">add</option>
            <option value="max">max</option>
          </select>
          <div />
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs items-center mt-2">
          <label className="opacity-70">Target Layer</label>
          <select value={targetLayerId ?? ''} onChange={(e)=>setTargetLayerId(e.target.value || null)} className="bg-neutral-700 rounded px-2 py-1">
            <option value="">(engine default)</option>
            {layerOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <div />
        </div>
      </div>
    </div>
  );
}

function currentHasLayers(p: AnyPattern): p is LayersPatternV1 {
  return (p as any).schema === 'mpl.pattern.layers.v1';
}

function serializePattern(p: AnyPattern): string {
  if ((p as any).schema === 'mpl.pattern.layers.v1') {
    const L = (p as LayersPatternV1).layers.map(l => ({ ...l, channel: u8ToBase64(l.channel) }));
    return JSON.stringify({ schema: 'mpl.pattern.layers.v1', layers: L, meta: (p as any).meta ?? {} }, null, 2);
  } else {
    const s = p as PatternV1;
    return JSON.stringify({ schema: 'mpl.pattern.v1', size: s.size, channel: u8ToBase64(s.channel), meta: s.meta ?? {} }, null, 2);
  }
}

function deserializePattern(obj: any): AnyPattern {
  if (obj?.schema === 'mpl.pattern.v1') {
    if (!obj.size || !obj.channel) throw new Error('Invalid pattern.v1');
    return { schema: 'mpl.pattern.v1', size: obj.size, channel: base64ToU8(String(obj.channel)), meta: obj.meta ?? {} };
  }
  if (obj?.schema === 'mpl.pattern.layers.v1') {
    if (!Array.isArray(obj.layers)) throw new Error('Invalid pattern.layers.v1');
    const layers = obj.layers.map((l:any) => ({
      id: String(l.id || 'layer'),
      name: String(l.name || 'Layer'),
      size: l.size,
      channel: base64ToU8(String(l.channel)),
      meta: l.meta ?? {}
    }));
    return { schema: 'mpl.pattern.layers.v1', layers, meta: obj.meta ?? {} };
  }
  throw new Error('Unknown schema');
}