// src/ui/hooks/useRuleDebugStream.ts
import { useEffect, useState } from 'react';
import { eventBus } from '../../engine/events';

export function useRuleDebugStream(limit = 20) {
  const [traces, setTraces] = useState<any[]>([]);
  useEffect(() => {
    const off = eventBus.on('ruleDebug', (payload) => {
      setTraces((prev) => {
        const next = [...prev, payload];
        if (next.length > limit) next.shift();
        return next;
      });
    });
    return () => off();
  }, [limit]);
  const latest = traces.length ? traces[traces.length - 1] : null;
  return { traces, latest };
}