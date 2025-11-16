// src/engine/events.ts
// Lightweight, typed event bus for the MPL engine & IDE.

export type VoxelPos = { x: number; y: number; z: number };

export type EngineEvents = {
  tick: { step: number; t: number }; // emitted once per engine step
  stateChange: {
    pos: VoxelPos;
    prevState: Record<string, any>;
    nextState: Record<string, any>;
    step: number;
  };
  ruleApplied: {
    ruleId: string;
    pos: VoxelPos;
    step: number;
    meta?: Record<string, any>;
  };
  simulationStart: { at: number };
  simulationStop: { at: number };
  error: { message: string; where?: string; data?: any };
};

type Handler<T> = (payload: T) => void;

export class EventBus<EvtMap extends Record<string, any>> {
  private handlers: { [K in keyof EvtMap]?: Set<Handler<EvtMap[K]>> } = {} as any;

  on<K extends keyof EvtMap>(event: K, handler: Handler<EvtMap[K]>): () => void {
    if (!this.handlers[event]) this.handlers[event] = new Set();
    this.handlers[event]!.add(handler as any);
    return () => this.off(event, handler);
  }

  once<K extends keyof EvtMap>(event: K, handler: Handler<EvtMap[K]>): () => void {
    const off = this.on(event, (payload: EvtMap[K]) => {
      try { handler(payload); } finally { off(); }
    });
    return off;
  }

  off<K extends keyof EvtMap>(event: K, handler: Handler<EvtMap[K]>) {
    this.handlers[event]?.delete(handler as any);
  }

  emit<K extends keyof EvtMap>(event: K, payload: EvtMap[K]) {
    const set = this.handlers[event];
    if (!set || set.size === 0) return;
    // copy to avoid mutation during iteration
    Array.from(set).forEach(h => {
      try { (h as Handler<EvtMap[K]>)(payload); }
      catch (err) {
        if ((this as any).emit) {
          // Attempt to report through error channel if available
          try { (this as any).emit('error', { message: (err as Error).message, where: String(event) }); } catch {}
        }
        // Fallback: console error
        // eslint-disable-next-line no-console
        console.error('EventBus handler error on', String(event), err);
      }
    });
  }

  clearAll() {
    Object.keys(this.handlers).forEach(k => (this.handlers as any)[k]?.clear());
  }
}

// Singleton instance for the engine & UI to share
export const eventBus = new EventBus<EngineEvents>();
export type EngineEventName = keyof EngineEvents;