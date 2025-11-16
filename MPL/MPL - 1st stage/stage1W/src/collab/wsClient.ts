// src/collab/wsClient.ts
import type { ClientMsg, ServerMsg, PresenceUser, Role } from './types';

type Listener = (m: ServerMsg) => void;

export class CollabWS {
  private url: string;
  private roomId: string;
  private user: PresenceUser;
  private role: Role;
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private retry = 0;
  private connected = false;

  constructor(url: string, roomId: string, user: PresenceUser, role: Role) {
    this.url = url;
    this.roomId = roomId;
    this.user = user;
    this.role = role;
    this.connect();
  }

  private connect() {
    const full = `${this.url.replace(/\/$/,'')}/ws`;
    this.ws = new WebSocket(full);
    this.ws.addEventListener('open', () => {
      this.connected = true;
      this.retry = 0;
      const hello: ClientMsg = { type: 'hello', roomId: this.roomId, user: this.user, role: this.role };
      this.ws!.send(JSON.stringify(hello));
    });
    this.ws.addEventListener('message', (ev) => {
      try {
        const msg = JSON.parse(String(ev.data)) as ServerMsg;
        this.listeners.forEach((fn) => fn(msg));
      } catch {}
    });
    this.ws.addEventListener('close', () => {
      this.connected = false;
      this.ws = null;
      // simple reconnect
      const delay = Math.min(1000 * Math.pow(2, this.retry++), 10000);
      setTimeout(() => this.connect(), delay);
    });
  }

  on(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  send(msg: ClientMsg) {
    if (!this.ws || this.ws.readyState !== this.ws.OPEN) return;
    this.ws.send(JSON.stringify(msg));
  }
}