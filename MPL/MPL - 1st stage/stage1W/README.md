# Stage 1W — Collaborative Mode (Presence, Camera/Selection Sync, Chat)

Minimal **real-time collaboration** for the Playground:
- **Server**: lightweight WebSocket relay with rooms
- **Presence**: who’s online, host vs. viewers
- **Viewer Mode** (read-only): viewers follow the host’s **camera** and see shared **selection**
- **Chat**: small dock for messages
- **Control Requests**: viewers can request control; host can grant/release (policy is up to you)

> This stage keeps the engine authoritative on the **host**. Viewers don’t run or control the engine.
> Next stages can add shared editing (CRDT) or host-driven snapshot streaming if needed.

---

## What you get
- `server/collab-server.ts` — Node + `ws` WebSocket server (rooms, presence, relay)
- `src/collab/types.ts` — message shapes shared client-side
- `src/collab/wsClient.ts` — client wrapper with reconnect & subscriptions
- `src/ui/state/collab.tsx` — React provider + hooks (`useCollab`) for presence and actions
- `src/ui/components/PresenceBar.tsx` — avatars, roles, control requests
- `src/ui/components/ChatDock.tsx` — tiny chat panel
- `src/ui/components/CollabCameraBridge.tsx` — r3f camera **broadcast/follow** inside your `<Canvas>`

---

## Quick Wire‑Up (≈3 minutes)

### 1) Run the server (dev)
```bash
# In a separate terminal
npm i -D ts-node typescript @types/node
npm i ws
npx ts-node server/collab-server.ts
# default port: 7070
```

### 2) Wrap your IDE root
```tsx
import { CollabProvider } from '../ui/state/collab';

function IDERoot() {
  return (
    <CollabProvider serverUrl={process.env.COLLAB_WS || 'ws://localhost:7070'} roomId="demo-room">
      {/* your IDE layout ... */}
    </CollabProvider>
  );
}
```

### 3) Add UI bits
```tsx
import PresenceBar from '../ui/components/PresenceBar';
import ChatDock from '../ui/components/ChatDock';

<div className="flex items-center justify-between mb-2">
  <PresenceBar />
</div>
<ChatDock />
```

### 4) Sync camera and selection with the 3D view
Inside your 3D viewer component, add the **bridge** inside the `<Canvas>`:
```tsx
import CollabCameraBridge from '../ui/components/CollabCameraBridge';

<Canvas /* ... */>
  {/* your lights and voxels ... */}
  <CollabCameraBridge />
</Canvas>
```
Selection is automatically shared if you call `setSelection()` from `useVoxelSelection()`.
The provider listens and relays the latest selection.

---

## Roles & Control
- First client that connects as `role: 'host'` becomes **host** (leader).
- Viewers connect with `role: 'viewer'` (default) and follow the host’s camera.
- Viewers can “Request Control” → host can **Grant** or **Release** from `PresenceBar`.
- Policy is client-side only; you can hook this to engine controls later.

---

## Acceptance Criteria
- Multiple browsers connect to the same room and see each other in `PresenceBar`
- Viewers automatically follow host camera updates and see the shared selection
- Chat messages arrive in real-time
- Control request/accept flow toggles a “hasControl” flag

---

## Next Steps (optional)
- Add CRDT (Y.js or Automerge) for **shared rule editing**
- Host snapshot streaming (send compressed frames to viewers)
- Per-room auth tokens / invite URLs