// src/ui/hooks/useHistoryCollector.ts
import { useEffect, useRef } from 'react';
import { eventBus } from '../../engine/events';
import { visBridge } from '../../engine/visBridge';
import { useHistory } from '../state/history';

/**
 * Subscribes to engine ticks and records snapshots into the history buffer.
 * Lightweight: reads current snapshot pointer from visBridge and stores
 * channel (optionally compressed) into a ring buffer.
 */
export function useHistoryCollector() {
  const { push, mode } = useHistory();
  const lastVersionRef = useRef<number>(-1);

  useEffect(() => {
    const off = eventBus.on('tick', ({ step, t }) => {
      if (mode !== 'live') return; // don't record while scrubbing playback
      const { version, snapshot } = visBridge.getSnapshot();
      if (!snapshot) return;
      if (version === lastVersionRef.current) return; // avoid double-recording same frame
      lastVersionRef.current = version;
      push(snapshot, step, t);
    });
    return () => off();
  }, [mode, push]);
}