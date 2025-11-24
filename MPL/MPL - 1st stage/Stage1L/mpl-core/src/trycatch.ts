export class MPLRuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MPLRuntimeError";
  }
}

export function executeWithCatch(fn: () => void, onError: (err: Error) => void) {
  try {
    fn();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}
