// src/ui/state/collab.tsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CollabWS } from '../../collab/wsClient';
import type { PresenceUser, Role, ServerMsg } from '../../collab/types';
import { useVoxelSelection } from '../hooks/useVoxelSelection';

type CollabCtx = {
  connected: boolean;
  users: PresenceUser[];
  hostId: string | null;
  me: PresenceUser;
  role: Role;
  hasControlUserId: string | null;
  requestControl: () => void;
  grantControl: (userId: string) => void;
  releaseControl: () => void;
  sendChat: (text: string) => void;
  chat: Array<{ from: string; text: string; at: number }>;
  // camera sync
  lastCamera: { pos:[number,number,number]; target:[number,number,number] } | null;
  sendCamera: (pos:[number,number,number], target:[number,number,number]) => void;
};

const Ctx = createContext<CollabCtx | null>(null);

function randomColor() { return '#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0'); }
function randomUser() {
  const id = Math.random().toString(36).slice(2,8);
  return { id, name: 'user-'+id, color: randomColor() };
}

export function CollabProvider({ children, serverUrl, roomId, role='viewer' as Role }: { children: React.ReactNode; serverUrl: string; roomId: string; role?: Role }) {
  const me = useMemo<PresenceUser>(() => randomUser(), []);
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [hostId, setHostId] = useState<string | null>(null);
  const [chat, setChat] = useState<Array<{ from:string; text:string; at:number }>>([]);
  const [hasControlUserId, setHasControlUserId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastCamera, setLastCamera] = useState<{pos:[number,number,number]; target:[number,number,number]}|null>(null);

  const wsRef = useRef<CollabWS | null>(null);
  const { selection } = useVoxelSelection?.() ?? { selection: null };

  useEffect(() => {
    const ws = new CollabWS(serverUrl, roomId, { ...me, role }, role);
    wsRef.current = ws;
    setConnected(true);
    const off = ws.on((msg: ServerMsg) => {
      if (msg.type === 'presence') {
        setUsers(msg.payload.users);
        setHostId(msg.payload.hostId);
      } else if (msg.type === 'chat') {
        setChat(c => [...c, { from: msg.from, text: msg.payload.text, at: Date.now() }]);
      } else if (msg.type === 'control') {
        setHasControlUserId(msg.payload.hasControlUserId);
      } else if (msg.type === 'camera') {
        setLastCamera(msg.payload);
      } else if (msg.type === 'selection') {
        // The selection itself is handled elsewhere if desired; here we could integrate with UI.
      }
    });
    return () => { off(); };
  }, [serverUrl, roomId, role, me.id]);

  // Broadcast selection
  useEffect(() => {
    if (!selection || !wsRef.current) return;
    wsRef.current.send({ type: 'selection', payload: selection });
  }, [selection?.x, selection?.y, selection?.z]);

  const sendCamera = (pos:[number,number,number], target:[number,number,number]) => {
    wsRef.current?.send({ type: 'camera', payload: { pos, target } });
  };

  const requestControl = () => wsRef.current?.send({ type: 'requestControl' });
  const grantControl = (userId: string) => wsRef.current?.send({ type: 'grantControl', payload: { userId } });
  const releaseControl = () => wsRef.current?.send({ type: 'releaseControl' });
  const sendChat = (text: string) => wsRef.current?.send({ type: 'chat', payload: { text } });

  const value: CollabCtx = {
    connected, users, hostId, me, role,
    hasControlUserId,
    requestControl, grantControl, releaseControl,
    sendChat, chat,
    lastCamera, sendCamera
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCollab() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCollab must be used within CollabProvider');
  return ctx;
}