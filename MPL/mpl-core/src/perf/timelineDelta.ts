// Timeline Delta - Compact diff representation for ExecutionSnapshot timelines
// Optimized for memory efficiency and fast playback

import type { ExecutionSnapshot } from "../types";

export interface SnapshotSlim {
  id: string;
  timestamp: number;
  step: number;
  gridDelta: GridDelta;
  variablesDelta: VariablesDelta;
  performanceDelta: PerformanceDelta;
}

export interface GridDelta {
  changes: CellChange[];
  compression: 'none' | 'rle' | 'dct';
}

export interface CellChange {
  x: number;
  y: number;
  oldValue: number;
  newValue: number;
}

export interface VariablesDelta {
  added: Map<string, any>;
  modified: Map<string, { old: any; new: any }>;
  deleted: Set<string>;
}

export interface PerformanceDelta {
  fps: number;
  memoryUsage: number;
  executionTime: number;
}

export class TimelineDelta {
  private snapshots: SnapshotSlim[] = [];
  private baseSnapshot: ExecutionSnapshot | null = null;
  private compressionLevel: 'none' | 'rle' | 'dct' = 'rle';

  constructor(compressionLevel: 'none' | 'rle' | 'dct' = 'rle') {
    this.compressionLevel = compressionLevel;
  }

  addSnapshot(snapshot: ExecutionSnapshot): void {
    if (!this.baseSnapshot) {
      this.baseSnapshot = snapshot;
      this.snapshots.push(this.createSlimSnapshot(snapshot, null));
      return;
    }

    const slimSnapshot = this.createSlimSnapshot(snapshot, this.baseSnapshot);
    this.snapshots.push(slimSnapshot);
  }

  private createSlimSnapshot(snapshot: ExecutionSnapshot, base: ExecutionSnapshot | null): SnapshotSlim {
    if (!base) {
      // First snapshot - store full data
      return {
        id: snapshot.id,
        timestamp: snapshot.timestamp,
        step: snapshot.step,
        gridDelta: {
          changes: this.extractGridChanges(snapshot.grid, null),
          compression: 'none'
        },
        variablesDelta: {
          added: new Map(snapshot.variables),
          modified: new Map(),
          deleted: new Set()
        },
        performanceDelta: snapshot.performance
      };
    }

    // Calculate deltas from base
    return {
      id: snapshot.id,
      timestamp: snapshot.timestamp,
      step: snapshot.step,
      gridDelta: {
        changes: this.extractGridChanges(snapshot.grid, base.grid),
        compression: this.compressionLevel
      },
      variablesDelta: this.calculateVariablesDelta(snapshot.variables, base.variables),
      performanceDelta: this.calculatePerformanceDelta(snapshot.performance, base.performance)
    };
  }

  private extractGridChanges(current: any, base: any | null): CellChange[] {
    if (!base) {
      // First snapshot - extract all non-zero cells
      const changes: CellChange[] = [];
      const { width, height, data } = current;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const value = data[y * width + x];
          if (value !== 0) {
            changes.push({ x, y, oldValue: 0, newValue: value });
          }
        }
      }
      
      return changes;
    }

    // Calculate differences between current and base
    const changes: CellChange[] = [];
    const { width, height, data: currentData } = current;
    const { data: baseData } = base;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const currentValue = currentData[y * width + x];
        const baseValue = baseData[y * width + x];
        
        if (currentValue !== baseValue) {
          changes.push({ x, y, oldValue: baseValue, newValue: currentValue });
        }
      }
    }

    return changes;
  }

  private calculateVariablesDelta(current: Map<string, any>, base: Map<string, any>): VariablesDelta {
    const added = new Map<string, any>();
    const modified = new Map<string, { old: any; new: any }>();
    const deleted = new Set<string>();

    // Find added and modified variables
    for (const [key, value] of current) {
      if (!base.has(key)) {
        added.set(key, value);
      } else {
        const baseValue = base.get(key);
        if (baseValue !== value) {
          modified.set(key, { old: baseValue, new: value });
        }
      }
    }

    // Find deleted variables
    for (const key of base.keys()) {
      if (!current.has(key)) {
        deleted.add(key);
      }
    }

    return { added, modified, deleted };
  }

  private calculatePerformanceDelta(current: any, base: any): PerformanceDelta {
    return {
      fps: current.fps - base.fps,
      memoryUsage: current.memoryUsage - base.memoryUsage,
      executionTime: current.executionTime - base.executionTime
    };
  }

  // Reconstruct full snapshot from base + deltas
  reconstructSnapshot(index: number): ExecutionSnapshot | null {
    if (index < 0 || index >= this.snapshots.length) {
      return null;
    }

    if (!this.baseSnapshot) {
      return null;
    }

    const slimSnapshot = this.snapshots[index];
    
    // Reconstruct grid
    const reconstructedGrid = this.reconstructGrid(slimSnapshot.gridDelta);
    
    // Reconstruct variables
    const reconstructedVariables = this.reconstructVariables(slimSnapshot.variablesDelta);
    
    // Reconstruct performance
    const reconstructedPerformance = this.reconstructPerformance(slimSnapshot.performanceDelta);

    return {
      id: slimSnapshot.id,
      timestamp: slimSnapshot.timestamp,
      step: slimSnapshot.step,
      grid: reconstructedGrid,
      variables: reconstructedVariables,
      performance: reconstructedPerformance
    };
  }

  private reconstructGrid(gridDelta: GridDelta): any {
    if (!this.baseSnapshot) {
      return this.baseSnapshot!.grid;
    }

    const { width, height, data } = this.baseSnapshot.grid;
    const reconstructedData = new Uint8Array(data);

    for (const change of gridDelta.changes) {
      const index = change.y * width + change.x;
      if (index >= 0 && index < reconstructedData.length) {
        reconstructedData[index] = change.newValue;
      }
    }

    return {
      width,
      height,
      data: reconstructedData
    };
  }

  private reconstructVariables(variablesDelta: VariablesDelta): Map<string, any> {
    if (!this.baseSnapshot) {
      return new Map();
    }

    const reconstructed = new Map(this.baseSnapshot.variables);

    // Apply additions
    for (const [key, value] of variablesDelta.added) {
      reconstructed.set(key, value);
    }

    // Apply modifications
    for (const [key, { new: newValue }] of variablesDelta.modified) {
      reconstructed.set(key, newValue);
    }

    // Apply deletions
    for (const key of variablesDelta.deleted) {
      reconstructed.delete(key);
    }

    return reconstructed;
  }

  private reconstructPerformance(performanceDelta: PerformanceDelta): any {
    if (!this.baseSnapshot) {
      return performanceDelta;
    }

    const base = this.baseSnapshot.performance;
    return {
      fps: base.fps + performanceDelta.fps,
      memoryUsage: base.memoryUsage + performanceDelta.memoryUsage,
      executionTime: base.executionTime + performanceDelta.executionTime
    };
  }

  // Compression methods
  compress(): void {
    if (this.compressionLevel === 'none') return;

    for (const snapshot of this.snapshots) {
      if (snapshot.gridDelta.compression === 'none') {
        snapshot.gridDelta = this.compressGridDelta(snapshot.gridDelta);
      }
    }
  }

  private compressGridDelta(gridDelta: GridDelta): GridDelta {
    if (this.compressionLevel === 'rle') {
      return this.compressRLE(gridDelta);
    } else if (this.compressionLevel === 'dct') {
      return this.compressDCT(gridDelta);
    }
    
    return gridDelta;
  }

  private compressRLE(gridDelta: GridDelta): GridDelta {
    // Run-length encoding compression
    const compressedChanges: CellChange[] = [];
    const changes = gridDelta.changes;
    
    if (changes.length === 0) return gridDelta;

    let current = changes[0];
    let count = 1;

    for (let i = 1; i < changes.length; i++) {
      const change = changes[i];
      if (change.newValue === current.newValue && 
          change.x === current.x + count && 
          change.y === current.y) {
        count++;
      } else {
        compressedChanges.push({ ...current });
        current = change;
        count = 1;
      }
    }
    
    compressedChanges.push({ ...current });

    return {
      changes: compressedChanges,
      compression: 'rle'
    };
  }

  private compressDCT(gridDelta: GridDelta): GridDelta {
    // Discrete Cosine Transform compression (simplified)
    // In practice, this would involve FFT and frequency domain compression
    return gridDelta;
  }

  // Utility methods
  getSnapshotCount(): number {
    return this.snapshots.length;
  }

  getTimelineRange(): { start: number; end: number } | null {
    if (this.snapshots.length === 0) return null;
    
    return {
      start: this.snapshots[0].timestamp,
      end: this.snapshots[this.snapshots.length - 1].timestamp
    };
  }

  clear(): void {
    this.snapshots = [];
    this.baseSnapshot = null;
  }

  // Memory usage estimation
  getMemoryUsage(): number {
    let total = 0;
    
    for (const snapshot of this.snapshots) {
      total += this.estimateSnapshotSize(snapshot);
    }
    
    return total;
  }

  private estimateSnapshotSize(snapshot: SnapshotSlim): number {
    let size = 0;
    
    // Basic fields
    size += snapshot.id.length * 2; // UTF-16
    size += 8; // timestamp (number)
    size += 4; // step (number)
    
    // Grid delta
    size += snapshot.gridDelta.changes.length * 16; // 4 numbers * 4 bytes
    
    // Variables delta
    size += snapshot.variablesDelta.added.size * 32; // Estimate
    size += snapshot.variablesDelta.modified.size * 64; // Estimate
    size += snapshot.variablesDelta.deleted.size * 16; // Estimate
    
    // Performance delta
    size += 24; // 3 numbers * 8 bytes
    
    return size;
  }
}
