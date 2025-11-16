import { Grid, Cell } from './types';

export function createGrid(width: number, height: number): Grid {
  return {
    width,
    height,
    data: new Uint8Array(width * height)
  };
}

export function getCell(grid: Grid, x: number, y: number): Cell {
  if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
    return 0;
  }
  return grid.data[y * grid.width + x] as Cell;
}

export function setCell(grid: Grid, x: number, y: number, value: Cell): void {
  if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
    return;
  }
  grid.data[y * grid.width + x] = value;
}

export function toggleCell(grid: Grid, x: number, y: number): void {
  if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
    return;
  }
  const index = y * grid.width + x;
  grid.data[index] = grid.data[index] === 0 ? 1 : 0;
}

export function clearGrid(grid: Grid): void {
  grid.data.fill(0);
}

export function copyGrid(grid: Grid): Grid {
  return {
    width: grid.width,
    height: grid.height,
    data: new Uint8Array(grid.data)
  };
}
