// src/ui/components/PresenceBar.tsx
import React from 'react';
import { useCollab } from '../state/collab';

export default function PresenceBar() {
  const { users, hostId, me, role, requestControl, grantControl, releaseControl, hasControlUserId } = useCollab();
  const isHost = me.id === hostId && role === 'host';

  return (
    <div className="flex items-center gap-2">
      {users.map(u => (
        <div key={u.id} className="px-2 py-1 rounded-full text-xs" style={{ background: u.color || '#444', opacity: 0.9 }} title={u.name}>
          <span className="font-semibold">{u.name}</span>
          {u.id === hostId ? <span className="ml-1 text-[10px] opacity-80">(host)</span> : null}
          {u.id === hasControlUserId ? <span className="ml-1 text-[10px] opacity-80">[control]</span> : null}
        </div>
      ))}
      <div className="ml-2 flex items-center gap-2">
        {isHost ? (
          <>
            <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs" onClick={releaseControl}>
              Release Control
            </button>
            {/* Demo: grant control to the first viewer (improve UI as needed) */}
            <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs" onClick={() => {
              const viewer = users.find(u => u.id !== hostId);
              if (viewer) grantControl(viewer.id);
            }}>
              Grant Control (first viewer)
            </button>
          </>
        ) : (
          <button className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs" onClick={requestControl}>
            Request Control
          </button>
        )}
      </div>
    </div>
  );
}