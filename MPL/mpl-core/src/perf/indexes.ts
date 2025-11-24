// Performance Indexes - Lightweight rolling indexes for rule activity and performance monitoring
// Stage 4: Performance & Scale

import type { ExecutionSnapshot } from '../types';

export interface RuleIndex {
  ruleId: string;
  recent: Array<{ ruleId: string; step: number; timestamp: number }>;
  maxRecent: number;
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  executionTime: number;
  gridDensity: number;
  activeCells: number;
  step: number;
  timestamp: number;
}

export class PerformanceMonitor {
  private ruleIndexes: Map<string, RuleIndex> = new Map();
  private performanceHistory: PerformanceMetrics[] = [];
  private maxHistorySize: number = 1000;

  constructor(maxHistorySize: number = 1000) {
    this.maxHistorySize = maxHistorySize;
  }

  recordSnapshot(snapshot: ExecutionSnapshot): void {
    // Extract performance metrics from snapshot
    const metrics: PerformanceMetrics = {
      fps: snapshot.performance.fps,
      memoryUsage: snapshot.performance.memoryUsage,
      executionTime: snapshot.performance.executionTime,
      gridDensity: this.calculateGridDensity(snapshot.grid),
      activeCells: this.countActiveCells(snapshot.grid),
      step: snapshot.step,
      timestamp: snapshot.timestamp
    };

    this.performanceHistory.push(metrics);
    
    // Trim history if it exceeds max size
    if (this.performanceHistory.length > this.maxHistorySize) {
      this.performanceHistory.shift();
    }

    // Update rule indexes (simplified - no rulesFired in new structure)
    this.updateRuleIndexes(snapshot);
  }

  private calculateGridDensity(grid: any): number {
    const { width, height, data } = grid;
    let activeCells = 0;
    
    for (let i = 0; i < data.length; i++) {
      if (data[i] === 1) activeCells++;
    }
    
    return activeCells / (width * height);
  }

  private countActiveCells(grid: any): number {
    const { data } = grid;
    let count = 0;
    
    for (let i = 0; i < data.length; i++) {
      if (data[i] === 1) count++;
    }
    
    return count;
  }

  private updateRuleIndexes(snapshot: ExecutionSnapshot): void {
    // In the new structure, we don't have rulesFired
    // This is a placeholder for future rule tracking
    const ruleId = 'default_rule';
    
    if (!this.ruleIndexes.has(ruleId)) {
      this.ruleIndexes.set(ruleId, {
        ruleId,
        recent: [],
        maxRecent: 100
      });
    }

    const index = this.ruleIndexes.get(ruleId)!;
    index.recent.push({
      ruleId,
      step: snapshot.step,
      timestamp: snapshot.timestamp
    });

    // Trim recent history
    if (index.recent.length > index.maxRecent) {
      index.recent.shift();
    }
  }

  getPerformanceMetrics(): PerformanceMetrics[] {
    return [...this.performanceHistory];
  }

  getAverageFPS(windowSize: number = 10): number {
    const recent = this.performanceHistory.slice(-windowSize);
    if (recent.length === 0) return 0;
    
    const sum = recent.reduce((acc, metrics) => acc + metrics.fps, 0);
    return sum / recent.length;
  }

  getAverageMemoryUsage(windowSize: number = 10): number {
    const recent = this.performanceHistory.slice(-windowSize);
    if (recent.length === 0) return 0;
    
    const sum = recent.reduce((acc, metrics) => acc + metrics.memoryUsage, 0);
    return sum / recent.length;
  }

  getGridDensityTrend(windowSize: number = 10): 'increasing' | 'decreasing' | 'stable' {
    const recent = this.performanceHistory.slice(-windowSize);
    if (recent.length < 2) return 'stable';
    
    const first = recent[0].gridDensity;
    const last = recent[recent.length - 1].gridDensity;
    const threshold = 0.01; // 1% change threshold
    
    if (last > first + threshold) return 'increasing';
    if (last < first - threshold) return 'decreasing';
    return 'stable';
  }

  getRuleActivity(ruleId: string): number {
    const index = this.ruleIndexes.get(ruleId);
    if (!index) return 0;
    
    return index.recent.length;
  }

  getMostActiveRules(limit: number = 5): Array<{ ruleId: string; activity: number }> {
    const activities: Array<{ ruleId: string; activity: number }> = [];
    
    for (const [ruleId, index] of this.ruleIndexes) {
      activities.push({
        ruleId,
        activity: index.recent.length
      });
    }
    
    return activities
      .sort((a, b) => b.activity - a.activity)
      .slice(0, limit);
  }

  clear(): void {
    this.ruleIndexes.clear();
    this.performanceHistory = [];
  }
}

export class TimelineOptimizer {
  private monitor: PerformanceMonitor;
  private optimizationThresholds = {
    lowFPS: 30,
    highMemoryUsage: 100 * 1024 * 1024, // 100MB
    highGridDensity: 0.8
  };

  constructor(monitor: PerformanceMonitor) {
    this.monitor = monitor;
  }

  shouldOptimize(): boolean {
    const recent = this.monitor.getPerformanceMetrics().slice(-5);
    if (recent.length === 0) return false;

    const latest = recent[recent.length - 1];
    
    return (
      latest.fps < this.optimizationThresholds.lowFPS ||
      latest.memoryUsage > this.optimizationThresholds.highMemoryUsage ||
      latest.gridDensity > this.optimizationThresholds.highGridDensity
    );
  }

  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const recent = this.monitor.getPerformanceMetrics().slice(-5);
    
    if (recent.length === 0) return suggestions;

    const latest = recent[recent.length - 1];
    
    if (latest.fps < this.optimizationThresholds.lowFPS) {
      suggestions.push('Consider reducing grid size or enabling GPU acceleration');
    }
    
    if (latest.memoryUsage > this.optimizationThresholds.highMemoryUsage) {
      suggestions.push('Consider enabling memory optimization or reducing history size');
    }
    
    if (latest.gridDensity > this.optimizationThresholds.highGridDensity) {
      suggestions.push('High grid density detected - consider using sparse representation');
    }
    
    return suggestions;
  }

  updateThresholds(thresholds: Partial<typeof this.optimizationThresholds>): void {
    this.optimizationThresholds = { ...this.optimizationThresholds, ...thresholds };
  }
}