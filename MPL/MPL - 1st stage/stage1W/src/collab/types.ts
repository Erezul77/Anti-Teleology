// src/collab/types.ts
export type Role = 'host' | 'viewer';

export type PresenceUser = { id: string; name: string; color?: string; role: Role };

export type ClientMsg =
  | { type: 'hello'; roomId: string; user: PresenceUser; role: Role }
  | { type: 'selection'; payload: { x:number; y:number; z:number } }
  | { type: 'camera'; payload: { pos:[number,number,number]; target:[number,number,number] } }
  | { type: 'chat'; payload: { text: string } }
  | { type: 'requestControl' }
  | { type: 'grantControl'; payload: { userId: string } }
  | { type: 'releaseControl' }
  ;

export type ServerMsg =
  | { type: 'presence'; payload: { users: PresenceUser[]; hostId: string | null } }
  | { type: 'selection'; from: string; payload: { x:number; y:number; z:number } }
  | { type: 'camera'; from: string; payload: { pos:[number,number,number]; target:[number,number,number] } }
  | { type: 'chat'; from: string; payload: { text: string } }
  | { type: 'control'; payload: { hasControlUserId: string | null; requestedBy?: string } }
  | { type: 'error'; message: string }
  ;