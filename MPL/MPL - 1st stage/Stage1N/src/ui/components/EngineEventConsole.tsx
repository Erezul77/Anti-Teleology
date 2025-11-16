// src/ui/components/EngineEventConsole.tsx
import React from 'react';
import { useEngineEvents } from '../hooks/useEngineEvents';

export default function EngineEventConsole() {
  const lines = useEngineEvents(['tick','error','simulationStart','simulationStop'], 1000);
  return (
    <div className="p-2 rounded-xl bg-neutral-900 text-neutral-100 h-64 overflow-auto text-[11px] font-mono shadow">
      {lines.length === 0 ? (
        <div className="opacity-60">No events yet. Run the simulation to see live logs.</div>
      ) : (
        lines.map((l, i) => <div key={i}>{l}</div>)
      )}
    </div>
  );
}