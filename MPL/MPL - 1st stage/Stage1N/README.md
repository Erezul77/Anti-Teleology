# Stage 1N — Engine Tick Event System

This stage adds a standardized event bus so the engine, UI, visualization, 
and analytics can communicate via typed events.

## What you get
- `EventBus` (lightweight, dependency-free)
- Typed events: `tick`, `stateChange`, `ruleApplied`, `simulationStart`, `simulationStop`, `error`
- React helpers to consume events in the Web IDE

## Integrate (quick)
1) Copy `src/engine/events.ts` into your repo.
2) In your engine runner (e.g., `src/engine/runner.ts`), create a single EventBus instance and export it.
3) Emit events at the appropriate places (examples shown below).
4) In the UI, use `useEngineEvents` or subscribe directly.

## Example wiring in runner
```ts
// runner.ts (snippet)
import { eventBus, EngineEvents } from './events';

function applyRulesAt(x:number,y:number,z:number){ /* ... */ }

export async function tick(step: number) {
  // ... engine logic before
  eventBus.emit('tick', { step, t: performance.now() });
  // Example: when a rule modifies a voxel state
  // eventBus.emit('stateChange', { pos:{x,y,z}, prevState, nextState, step });
  // Example: when a rule applies
  // eventBus.emit('ruleApplied', { ruleId, pos:{x,y,z}, step, meta });
  // ...
}

export function run() {
  eventBus.emit('simulationStart', { at: Date.now() });
  // ...
}

export function stop() {
  // ...
  eventBus.emit('simulationStop', { at: Date.now() });
}
```

## React usage example
```tsx
// Anywhere in UI
import { useEngineEvents } from '../hooks/useEngineEvents';
export default function EngineEventConsole(){
  const logs = useEngineEvents(['tick','error'], 1000); // keep last 1000
  return <div className="text-xs font-mono">{logs.map((l,i)=>(<div key={i}>{l}</div>))}</div>
}
```

## Notes
- EventBus is synchronous by default; keep handlers light. If needed, debounce in the UI.
- The bus is a singleton (`eventBus`) to avoid multiple subscriptions.
- Events are fully typed; extend the `EngineEvents` map as you add capabilities.
```