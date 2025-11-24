// src/ui/hooks/useEngineEvents.ts
import { useEffect, useRef, useState } from 'react';
import { eventBus, EngineEventName, EngineEvents } from '../../engine/events';

type AnyEvent = { name: EngineEventName; payload: any; at: number };

export function useEngineEvents<EventKey extends EngineEventName>(
  names: EventKey[],
  limit: number = 500
) {
  const [items, setItems] = useState<string[]>([]);
  const queueRef = useRef<AnyEvent[]>([]);

  useEffect(() => {
    const offs = names.map((n) =>
      eventBus.on(n, (payload: EngineEvents[EventKey]) => {
        queueRef.current.push({ name: n as EngineEventName, payload, at: Date.now() });
        if (queueRef.current.length > limit) queueRef.current.shift();
        // Simple formatting; customize as needed
        const line = `[${new Date().toISOString()}] ${String(n)}: ${JSON.stringify(payload)}`;
        setItems((prev) => (prev.length >= limit ? [...prev.slice(1), line] : [...prev, line]));
      })
    );
    return () => offs.forEach((off) => off());
  }, [names.join('|'), limit]);

  return items;
}