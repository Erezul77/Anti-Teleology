// src/ui/components/VoxelInspectorPanel.tsx
import React, { useMemo } from 'react';
import { useVoxelSelection } from '../hooks/useVoxelSelection';
import { visBridge } from '../../engine/visBridge';

export default function VoxelInspectorPanel() {
  const { selection } = useVoxelSelection();
  const info = useMemo(() => {
    const snap = visBridge.getSnapshot().snapshot;
    if (!snap || !selection) return null;
    const { x, y, z } = selection;
    const state = snap.getStateAt?.(x,y,z);
    return { x,y,z, state };
  }, [selection?.x, selection?.y, selection?.z]);

  return (
    <div className="p-3 rounded-xl bg-neutral-900 text-neutral-100 text-sm space-y-2 shadow">
      <div className="opacity-80 text-xs">Voxel Inspector</div>
      {!selection ? (
        <div className="opacity-60">Click a voxel to inspect.</div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs opacity-80">Position</div>
          <div className="font-mono text-xs">({info?.x}, {info?.y}, {info?.z})</div>
          <div className="text-xs opacity-80">State</div>
          <pre className="text-xs overflow-auto max-h-40 bg-neutral-800 p-2 rounded">
            {JSON.stringify(info?.state ?? {}, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}