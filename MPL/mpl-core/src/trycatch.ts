// Stage 1L: Error handling and runtime safety for MPL

// Custom error types for better error handling
export class MPLRuntimeError extends Error {
  constructor(message: string, public line?: number, public column?: number) {
    super(message);
    this.name = "MPLRuntimeError";
  }
}

export class MPLSyntaxError extends Error {
  constructor(message: string, public line?: number, public column?: number) {
    super(message);
    this.name = "MPLSyntaxError";
  }
}

export class MPLTypeError extends Error {
  constructor(message: string, public line?: number, public column?: number) {
    super(message);
    this.name = "MPLTypeError";
  }
}

// Safe execution wrapper with error handling
export function executeWithCatch<T>(
  fn: () => T, 
  onError: (err: Error) => void,
  context?: { line?: number; column?: number }
): T | undefined {
  try {
    return fn();
  } catch (err) {
    let mplError: Error;
    
    if (err instanceof MPLRuntimeError || err instanceof MPLSyntaxError || err instanceof MPLTypeError) {
      mplError = err;
    } else {
      // Convert generic errors to MPL errors
      mplError = new MPLRuntimeError(
        err instanceof Error ? err.message : String(err),
        context?.line,
        context?.column
      );
    }
    
    onError(mplError);
    return undefined;
  }
}

// Error recovery utilities
export function createSafeFunction<T extends any[], R>(
  fn: (...args: T) => R,
  errorHandler: (err: Error, args: T) => R
): (...args: T) => R {
  return (...args: T) => {
    try {
      return fn(...args);
    } catch (err) {
      return errorHandler(err instanceof Error ? err : new Error(String(err)), args);
    }
  };
}

// Error context utilities
export function withErrorContext<T>(
  fn: () => T,
  line: number,
  column: number
): T {
  try {
    return fn();
  } catch (err) {
    if (err instanceof MPLRuntimeError || err instanceof MPLSyntaxError || err instanceof MPLTypeError) {
      err.line = line;
      err.column = column;
    }
    throw err;
  }
}

// Error formatting utilities
export function formatError(error: Error): string {
  if (error instanceof MPLRuntimeError || error instanceof MPLSyntaxError || error instanceof MPLTypeError) {
    const location = error.line && error.column 
      ? ` at line ${error.line}, column ${error.column}`
      : '';
    return `${error.name}: ${error.message}${location}`;
  }
  return error.message;
}
