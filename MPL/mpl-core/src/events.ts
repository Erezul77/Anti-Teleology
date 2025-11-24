// Stage 1N: Engine Event System for MPL
// Lightweight, typed event bus for the MPL engine & IDE

export type VoxelPos = { x: number; y: number; z: number };

export type EngineEvents = {
  tick: { step: number; t: number; gridState: any }; // emitted once per engine step
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
  simulationStart: { at: number; initialGrid: any };
  simulationStop: { at: number; finalGrid: any };
  error: { message: string; where?: string; data?: any; line?: number; column?: number };
  functionCall: { name: string; args: any[]; step: number; result?: any };
  variableChange: { name: string; prevValue: any; newValue: any; step: number };
  gridUpdate: { x: number; y: number; prevValue: number; newValue: number; step: number };
  performance: { operation: string; duration: number; step: number; details?: any };
};

type Handler<T> = (payload: T) => void;

export class EventBus<EvtMap extends Record<string, any>> {
  private handlers: { [K in keyof EvtMap]?: Set<Handler<EvtMap[K]>> } = {} as any;
  private eventHistory: Array<{ event: string; payload: any; timestamp: number }> = [];
  private maxHistorySize: number = 1000;

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
    // Add to event history
    this.eventHistory.push({
      event: String(event),
      payload,
      timestamp: performance.now()
    });

    // Maintain history size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    const set = this.handlers[event];
    if (!set || set.size === 0) return;
    
    // Copy to avoid mutation during iteration
    Array.from(set).forEach(h => {
      try { (h as Handler<EvtMap[K]>)(payload); }
      catch (err) {
        if ((this as any).emit) {
          // Attempt to report through error channel if available
          try { (this as any).emit('error', { message: (err as Error).message, where: String(event) }); } catch {}
        }
        // Fallback: console error
        console.error('EventBus handler error on', String(event), err);
      }
    });
  }

  // Stage 1N: Enhanced event system features
  getEventHistory(eventType?: string, limit: number = 100): Array<{ event: string; payload: any; timestamp: number }> {
    if (eventType) {
      return this.eventHistory
        .filter(h => h.event === eventType)
        .slice(-limit);
    }
    return this.eventHistory.slice(-limit);
  }

  getEventCount(eventType?: string): number {
    if (eventType) {
      return this.eventHistory.filter(h => h.event === eventType).length;
    }
    return this.eventHistory.length;
  }

  getLastEvent(eventType?: string): { event: string; payload: any; timestamp: number } | null {
    const events = eventType 
      ? this.eventHistory.filter(h => h.event === eventType)
      : this.eventHistory;
    
    return events.length > 0 ? events[events.length - 1] : null;
  }

  clearHistory(): void {
    this.eventHistory = [];
  }

  setMaxHistorySize(size: number): void {
    this.maxHistorySize = size;
    // Trim if current history exceeds new size
    if (this.eventHistory.length > size) {
      this.eventHistory = this.eventHistory.slice(-size);
    }
  }

  clearAll() {
    Object.keys(this.handlers).forEach(k => (this.handlers as any)[k]?.clear());
    this.eventHistory = [];
  }

  // Stage 1N: Performance monitoring
  getPerformanceStats(): { totalEvents: number; eventsByType: Record<string, number>; avgEventsPerSecond: number } {
    const now = performance.now();
    const eventsByType: Record<string, number> = {};
    
    this.eventHistory.forEach(h => {
      eventsByType[h.event] = (eventsByType[h.event] || 0) + 1;
    });

    const totalEvents = this.eventHistory.length;
    const timeSpan = this.eventHistory.length > 0 
      ? (now - this.eventHistory[0].timestamp) / 1000 
      : 0;
    
    const avgEventsPerSecond = timeSpan > 0 ? totalEvents / timeSpan : 0;

    return {
      totalEvents,
      eventsByType,
      avgEventsPerSecond
    };
  }
}

// Singleton instance for the engine & UI to share
export const eventBus = new EventBus<EngineEvents>();
export type EngineEventName = keyof EngineEvents;

// Stage 1N: Convenience functions for common events
export const emitTick = (step: number, gridState: any) => {
  eventBus.emit('tick', { step, t: performance.now(), gridState });
};

export const emitStateChange = (x: number, y: number, prevState: any, nextState: any, step: number) => {
  eventBus.emit('stateChange', { 
    pos: { x, y, z: 0 }, 
    prevState, 
    nextState, 
    step 
  });
};

export const emitRuleApplied = (ruleId: string, x: number, y: number, step: number, meta?: any) => {
  eventBus.emit('ruleApplied', { 
    ruleId, 
    pos: { x, y, z: 0 }, 
    step, 
    meta 
  });
};

export const emitSimulationStart = (initialGrid: any) => {
  eventBus.emit('simulationStart', { at: Date.now(), initialGrid });
};

export const emitSimulationStop = (finalGrid: any) => {
  eventBus.emit('simulationStop', { at: Date.now(), finalGrid });
};

export const emitError = (message: string, where?: string, data?: any, line?: number, column?: number) => {
  eventBus.emit('error', { message, where, data, line, column });
};

export const emitFunctionCall = (name: string, args: any[], step: number, result?: any) => {
  eventBus.emit('functionCall', { name, args, step, result });
};

export const emitVariableChange = (name: string, prevValue: any, newValue: any, step: number) => {
  eventBus.emit('variableChange', { name, prevValue, newValue, step });
};

export const emitGridUpdate = (x: number, y: number, prevValue: number, newValue: number, step: number) => {
  eventBus.emit('gridUpdate', { x, y, prevValue, newValue, step });
};

export const emitPerformance = (operation: string, duration: number, step: number, details?: any) => {
  eventBus.emit('performance', { operation, duration, step, details });
};
