// server/collab-server.ts
import { WebSocketServer, WebSocket } from 'ws';
import * as http from 'http';
import * as url from 'url';

type Role = 'host' | 'viewer';

type HelloMsg = {
  type: 'hello';
  roomId: string;
  user: { id: string; name: string; color?: string };
  role: Role;
};

type ClientMsg =
  | HelloMsg
  | { type: 'selection'; payload: { x:number; y:number; z:number } }
  | { type: 'camera'; payload: { pos:[number,number,number]; target:[number,number,number] } }
  | { type: 'chat'; payload: { text: string } }
  | { type: 'requestControl' }
  | { type: 'grantControl'; payload: { userId: string } }
  | { type: 'releaseControl' }
  ;

type ServerMsg =
  | { type: 'presence'; payload: { users: Array<{ id:string; name:string; color?:string; role:Role }>; hostId: string | null } }
  | { type: 'selection'; from: string; payload: { x:number; y:number; z:number } }
  | { type: 'camera'; from: string; payload: { pos:[number,number,number]; target:[number,number,number] } }
  | { type: 'chat'; from: string; payload: { text: string } }
  | { type: 'control'; payload: { hasControlUserId: string | null; requestedBy?: string } }
  | { type: 'error'; message: string }
  ;

type Client = {
  ws: WebSocket;
  userId: string;
  name: string;
  color?: string;
  role: Role;
  roomId: string;
};

type Room = {
  id: string;
  clients: Map<string, Client>;
  hostId: string | null;
  hasControlUserId: string | null;
};

const rooms = new Map<string, Room>();

function getOrCreateRoom(id: string): Room {
  let r = rooms.get(id);
  if (!r) {
    r = { id, clients: new Map(), hostId: null, hasControlUserId: null };
    rooms.set(id, r);
  }
  return r;
}

function broadcast(room: Room, msg: ServerMsg) {
  const data = JSON.stringify(msg);
  room.clients.forEach(c => {
    if (c.ws.readyState === c.ws.OPEN) c.ws.send(data);
  });
}

const server = http.createServer();
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  const { pathname } = url.parse(req.url || '');
  if (pathname !== '/ws') {
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket as any, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws) => {
  let client: Client | null = null;

  ws.on('message', (buf) => {
    let msg: ClientMsg;
    try { msg = JSON.parse(String(buf)); } catch { return; }

    if (msg.type === 'hello') {
      const room = getOrCreateRoom(msg.roomId);
      client = {
        ws,
        userId: msg.user.id,
        name: msg.user.name,
        color: msg.user.color,
        role: msg.role || 'viewer',
        roomId: msg.roomId,
      };
      room.clients.set(client.userId, client);
      if (client.role === 'host' && !room.hostId) room.hostId = client.userId;
      // announce presence
      broadcast(room, {
        type: 'presence',
        payload: {
          users: Array.from(room.clients.values()).map(c => ({ id:c.userId, name:c.name, color:c.color, role:c.role })),
          hostId: room.hostId
        }
      });
      return;
    }

    if (!client) return;
    const room = rooms.get(client.roomId);
    if (!room) return;

    switch (msg.type) {
      case 'selection':
      case 'camera':
      case 'chat':
        broadcast(room, { type: msg.type, from: client.userId, payload: (msg as any).payload });
        break;
      case 'requestControl':
        // notify host
        broadcast(room, { type: 'control', payload: { hasControlUserId: room.hasControlUserId, requestedBy: client.userId } });
        break;
      case 'grantControl':
        if (client.userId !== room.hostId) return;
        room.hasControlUserId = msg.payload.userId;
        broadcast(room, { type: 'control', payload: { hasControlUserId: room.hasControlUserId } });
        break;
      case 'releaseControl':
        if (client.userId !== room.hostId) return;
        room.hasControlUserId = null;
        broadcast(room, { type: 'control', payload: { hasControlUserId: null } });
        break;
      default:
        break;
    }
  });

  ws.on('close', () => {
    if (!client) return;
    const room = rooms.get(client.roomId);
    if (!room) return;
    room.clients.delete(client.userId);
    if (room.hostId === client.userId) room.hostId = null;
    broadcast(room, {
      type: 'presence',
      payload: {
        users: Array.from(room.clients.values()).map(c => ({ id:c.userId, name:c.name, color:c.color, role:c.role })),
        hostId: room.hostId
      }
    });
  });
});

const port = Number(process.env.PORT || 7070);
server.listen(port, () => {
  console.log(`[collab] ws server listening on ws://localhost:${port}/ws`);
});