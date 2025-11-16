import { compile, stdlib, STD_CONSTANTS, executeWithCatch, MPLRuntimeError } from "mpl-core";
import { useCallback } from "react";

export function useMPL() {
  // ... previous hooks & state

  const run = useCallback(() => {
    const res = compile(source);
    if (res.errors.length) return;

    let g = state.grid;
    const ctx = { grid: g, ...stdlib, ...STD_CONSTANTS };

    const lines = source.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
      executeWithCatch(() => {
        // eslint-disable-next-line no-new-func
        const fn = new Function(...Object.keys(ctx), line);
        fn(...Object.values(ctx));
      }, (err) => {
        console.error("Runtime error:", err);
        throw new MPLRuntimeError(`Runtime error: ${err.message}`);
      });
    }

    setState({ grid: g });
  }, [source, state.grid]);

  // ...
}
