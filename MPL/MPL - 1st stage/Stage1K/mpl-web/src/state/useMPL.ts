import { compile, initVM, type VMState, stdlib, STD_CONSTANTS } from "mpl-core";
import { useCallback } from "react";

export function useMPL() {
  // ... previous state hooks

  const run = useCallback(() => {
    const res = compile(source);
    if (res.errors.length) return;

    let g = state.grid;

    // runtime context with stdlib + constants
    const ctx = { grid: g, ...stdlib, ...STD_CONSTANTS };

    // naïve interpreter loop (will improve in Stage L)
    const lines = source.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(...Object.keys(ctx), line);
        fn(...Object.values(ctx));
      } catch (err) {
        console.error("Runtime error:", err);
      }
    }

    setState({ grid: g });
  }, [source, state.grid]);

  // ...
}
