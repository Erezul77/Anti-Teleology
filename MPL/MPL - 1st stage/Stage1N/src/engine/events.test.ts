// src/engine/events.test.ts
import { eventBus } from './events';

describe('EventBus', () => {
  it('emits and receives events', () => {
    const received: any[] = [];
    const off = eventBus.on('tick', (p) => received.push(p));
    eventBus.emit('tick', { step: 1, t: 123 });
    off();
    expect(received).toHaveLength(1);
    expect(received[0].step).toBe(1);
  });

  it('handles errors in handlers gracefully', () => {
    const off = eventBus.on('tick', () => { throw new Error('boom'); });
    expect(() => eventBus.emit('tick', { step: 2, t: 456 })).not.toThrow();
    off();
  });
});