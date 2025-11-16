import type { Grid } from "./types";
import { setCell, toggleCell, step } from "./vm";

export const stdlib = {
  math: {
    abs: Math.abs,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    sqrt: Math.sqrt,
    pow: Math.pow,
    min: Math.min,
    max: Math.max,
    random: Math.random
  },
  grid: {
    set: (g: Grid, x: number, y: number) => setCell(g, x, y, 1),
    toggle: (g: Grid, x: number, y: number) => toggleCell(g, x, y),
    step: (g: Grid) => step(g)
  },
  io: {
    log: (...args: unknown[]) => console.log("[MPL]", ...args)
  }
};
