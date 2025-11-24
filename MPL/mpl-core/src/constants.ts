// Stage 1K: Standard constants for MPL
export const STD_CONSTANTS = {
  PI: Math.PI,
  E: Math.E,
  TAU: Math.PI * 2,
  GRID_WIDTH: 50,
  GRID_HEIGHT: 50
} as const;

// Stage 1K: Export individual constants for easier access
export const PI = STD_CONSTANTS.PI;
export const E = STD_CONSTANTS.E;
export const TAU = STD_CONSTANTS.TAU;
export const GRID_WIDTH = STD_CONSTANTS.GRID_WIDTH;
export const GRID_HEIGHT = STD_CONSTANTS.GRID_HEIGHT;
