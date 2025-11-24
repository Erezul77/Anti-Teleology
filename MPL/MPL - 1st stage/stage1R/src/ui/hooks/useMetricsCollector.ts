// src/ui/hooks/useMetricsCollector.ts
import { useEffect, useRef } from 'react';
import { eventBus } from '../../engine/events';
import { visBridge } from '../../engine/visBridge';
import { useMetrics } from '../state/metrics';

type PosKey = string;

export function useMetricsCollector() {
  const { pushSample } = useMetrics();
  const lastTickT = useRef<number | null>(null);
  const changedPositions = useRef<Set<PosKey>>(new Set());
  const perRule = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const offState = eventBus.on('stateChange', ({ pos }) => {
      changedPositions.current.add(key(pos.x, pos.y, pos.z));
    });

    const offRule = eventBus.on('ruleApplied', ({ ruleId }) => {
      perRule.current.set(ruleId, (perRule.current.get(ruleId) || 0) + 1);
    });

    const offTick = eventBus.on('tick', ({ step, t }) => {
      const dtMs = lastTickT.current == null ? 0 : Math.max(0, t - lastTickT.current);
      const fps = dtMs > 0 ? 1000 / dtMs : 0;
      lastTickT.current = t;

      const { snapshot } = visBridge.getSnapshot();
      const size = snapshot?.size ?? { x: 1, y: 1, z: 1 };
      const total = size.x * size.y * size.z;
      const changedVoxels = changedPositions.current.size;
      const percentChanged = total > 0 ? (changedVoxels / total) * 100 : 0;

      const ruleCounts: Record<string, number> = {};
      let ruleTriggers = 0;
      perRule.current.forEach((v, k) => {
        ruleCounts[k] = v;
        ruleTriggers += v;
      });

      pushSample({
        step,
        t,
        dtMs,
        fps,
        changedVoxels,
        percentChanged,
        ruleTriggers,
        ruleCounts,
      });

      // reset per-tick accumulators
      changedPositions.current.clear();
      perRule.current.clear();
    });

    return () => {
      offState();
      offRule();
      offTick();
    };
  }, [pushSample]);
}

function key(x: number, y: number, z: number): string {
  return `${x}|${y}|${z}`;
}