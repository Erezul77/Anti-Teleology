import type { Grid, Value } from "./types";
import { setCell, toggleCell, clearGrid } from "./grid";

// Stage 1K: Standard library functions for MPL
export const stdlib = {
  // Mathematical functions
  math: {
    abs: Math.abs,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    sqrt: Math.sqrt,
    pow: Math.pow,
    min: Math.min,
    max: Math.max,
    random: Math.random,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    log: Math.log,
    exp: Math.exp
  },
  
  // Grid utility functions
  grid: {
    set: (g: Grid, x: number, y: number) => setCell(g, x, y, 1),
    toggle: (g: Grid, x: number, y: number) => toggleCell(g, x, y),
    clear: (g: Grid) => clearGrid(g),
    get: (g: Grid, x: number, y: number) => {
      if (x < 0 || x >= g.width || y < 0 || y >= g.height) return 0;
      return g.data[y * g.width + x];
    },
    width: (g: Grid) => g.width,
    height: (g: Grid) => g.height
  },
  
  // I/O and utility functions
  io: {
    log: (...args: unknown[]) => console.log("[MPL]", ...args),
    error: (...args: unknown[]) => console.error("[MPL ERROR]", ...args),
    warn: (...args: unknown[]) => console.warn("[MPL WARN]", ...args)
  },
  
  // String utility functions
  string: {
    length: (s: string) => s.length,
    substring: (s: string, start: number, end?: number) => s.substring(start, end),
    toUpperCase: (s: string) => s.toUpperCase(),
    toLowerCase: (s: string) => s.toLowerCase(),
    trim: (s: string) => s.trim()
  },
  
  // Array utility functions
  array: {
    length: (arr: Value[]) => arr.length,
    push: (arr: Value[], item: Value) => [...arr, item],
    pop: (arr: Value[]) => arr.slice(0, -1),
    slice: (arr: Value[], start: number, end?: number) => arr.slice(start, end)
  }
};

// Stage 1K: Export individual function groups for easier access
export const math = stdlib.math;
export const grid = stdlib.grid;
export const io = stdlib.io;
export const string = stdlib.string;
export const array = stdlib.array;
