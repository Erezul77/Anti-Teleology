// Stage 4X — Performance autotuning with HUD meters, batched rendering, frame-budget autotuner

export interface PerformanceTargets {
  targetFPS: number;
  maxFrameTime: number;
  maxMemoryUsage: number;
  maxMonadCount: number;
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  activeMonads: number;
  rulesFired: number;
  gpuAccelerated: boolean;
  renderBatches: number;
  batchSize: number;
}

export interface AutotuneSettings {
  enableDynamicScaling: boolean;
  enableBatchOptimization: boolean;
  enableMemoryOptimization: boolean;
  enableGPUFallback: boolean;
  adaptiveQuality: boolean;
}

export class PerformanceAutotuner {
  private targets: PerformanceTargets;
  private settings: AutotuneSettings;
  private metrics: PerformanceMetrics;
  private frameHistory: number[] = [];
  private maxHistorySize = 120; // 2 seconds at 60fps
  
  private currentBatchSize = 1000;
  private currentQualityLevel = 1.0;
  private gpuFallbackEnabled = false;
  
  constructor(targets: PerformanceTargets, settings: AutotuneSettings) {
    this.targets = targets;
    this.settings = settings;
    this.metrics = this.createDefaultMetrics();
  }
  
  updateMetrics(newMetrics: Partial<PerformanceMetrics>): void {
    this.metrics = { ...this.metrics, ...newMetrics };
    
    // Update frame history
    if (newMetrics.frameTime !== undefined) {
      this.frameHistory.push(newMetrics.frameTime);
      if (this.frameHistory.length > this.maxHistorySize) {
        this.frameHistory.shift();
      }
    }
    
    // Run autotuning
    this.autotune();
  }
  
  getOptimizedSettings(): {
    batchSize: number;
    qualityLevel: number;
    gpuFallback: boolean;
    renderOptimizations: string[];
  } {
    return {
      batchSize: this.currentBatchSize,
      qualityLevel: this.currentQualityLevel,
      gpuFallback: this.gpuFallbackEnabled,
      renderOptimizations: this.getActiveOptimizations(),
    };
  }
  
  getPerformanceReport(): {
    current: PerformanceMetrics;
    targets: PerformanceTargets;
    recommendations: string[];
    health: 'excellent' | 'good' | 'fair' | 'poor';
  } {
    const recommendations: string[] = [];
    let healthScore = 0;
    
    // FPS analysis
    if (this.metrics.fps >= this.targets.targetFPS * 0.9) {
      healthScore += 3;
    } else if (this.metrics.fps >= this.targets.targetFPS * 0.7) {
      healthScore += 2;
      recommendations.push('Consider reducing visual quality to improve FPS');
    } else {
      healthScore += 1;
      recommendations.push('Performance below target. Enable GPU acceleration or reduce complexity.');
    }
    
    // Frame time analysis
    if (this.metrics.frameTime <= this.targets.maxFrameTime) {
      healthScore += 2;
    } else {
      healthScore += 1;
      recommendations.push('Frame time exceeds target. Optimize rendering or reduce batch size.');
    }
    
    // Memory analysis
    if (this.metrics.memoryUsage <= this.targets.maxMemoryUsage) {
      healthScore += 2;
    } else {
      healthScore += 1;
      recommendations.push('Memory usage high. Consider clearing unused data or reducing grid size.');
    }
    
    // Monad count analysis
    if (this.metrics.activeMonads <= this.targets.maxMonadCount) {
      healthScore += 1;
    } else {
      recommendations.push('High monad count. Consider using GPU acceleration or reducing simulation complexity.');
    }
    
    // GPU acceleration
    if (this.metrics.gpuAccelerated) {
      healthScore += 1;
    } else if (this.settings.enableGPUFallback) {
      recommendations.push('GPU acceleration not available. Consider enabling fallback mode.');
    }
    
    let health: 'excellent' | 'good' | 'fair' | 'poor';
    if (healthScore >= 8) health = 'excellent';
    else if (healthScore >= 6) health = 'good';
    else if (healthScore >= 4) health = 'fair';
    else health = 'poor';
    
    return {
      current: this.metrics,
      targets: this.targets,
      recommendations,
      health,
    };
  }
  
  private autotune(): void {
    if (!this.settings.enableDynamicScaling) return;
    
    // FPS-based autotuning
    this.autotuneFPS();
    
    // Memory-based autotuning
    this.autotuneMemory();
    
    // Batch optimization
    if (this.settings.enableBatchOptimization) {
      this.autotuneBatching();
    }
    
    // Quality adaptation
    if (this.settings.adaptiveQuality) {
      this.autotuneQuality();
    }
  }
  
  private autotuneFPS(): void {
    if (this.frameHistory.length < 30) return; // Need enough data
    
    const recentFPS = 1000 / (this.frameHistory.slice(-30).reduce((a, b) => a + b, 0) / 30);
    
    if (recentFPS < this.targets.targetFPS * 0.8) {
      // Performance is poor, reduce quality
      this.currentQualityLevel = Math.max(0.5, this.currentQualityLevel * 0.9);
      this.currentBatchSize = Math.max(100, this.currentBatchSize * 0.9);
      
      if (this.settings.enableGPUFallback && !this.gpuFallbackEnabled) {
        this.gpuFallbackEnabled = true;
      }
    } else if (recentFPS > this.targets.targetFPS * 1.1) {
      // Performance is good, can increase quality
      this.currentQualityLevel = Math.min(1.0, this.currentQualityLevel * 1.05);
      this.currentBatchSize = Math.min(2000, this.currentBatchSize * 1.05);
    }
  }
  
  private autotuneMemory(): void {
    if (this.metrics.memoryUsage > this.targets.maxMemoryUsage * 0.8) {
      // Memory usage is high, reduce batch size
      this.currentBatchSize = Math.max(100, this.currentBatchSize * 0.8);
      this.currentQualityLevel = Math.max(0.5, this.currentQualityLevel * 0.9);
    }
  }
  
  private autotuneBatching(): void {
    const avgFrameTime = this.frameHistory.length > 0 
      ? this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length 
      : 16.67;
    
    if (avgFrameTime > this.targets.maxFrameTime) {
      // Reduce batch size to improve responsiveness
      this.currentBatchSize = Math.max(100, this.currentBatchSize * 0.9);
    } else if (avgFrameTime < this.targets.maxFrameTime * 0.7) {
      // Increase batch size for better throughput
      this.currentBatchSize = Math.min(2000, this.currentBatchSize * 1.1);
    }
  }
  
  private autotuneQuality(): void {
    const performanceRatio = this.metrics.fps / this.targets.targetFPS;
    
    if (performanceRatio < 0.8) {
      // Reduce quality
      this.currentQualityLevel = Math.max(0.3, this.currentQualityLevel * 0.9);
    } else if (performanceRatio > 1.2) {
      // Increase quality
      this.currentQualityLevel = Math.min(1.0, this.currentQualityLevel * 1.05);
    }
  }
  
  private getActiveOptimizations(): string[] {
    const optimizations: string[] = [];
    
    if (this.currentQualityLevel < 1.0) {
      optimizations.push(`Quality: ${Math.round(this.currentQualityLevel * 100)}%`);
    }
    
    if (this.currentBatchSize !== 1000) {
      optimizations.push(`Batch: ${this.currentBatchSize}`);
    }
    
    if (this.gpuFallbackEnabled) {
      optimizations.push('GPU Fallback');
    }
    
    if (this.metrics.renderBatches > 1) {
      optimizations.push(`Multi-batch: ${this.metrics.renderBatches}`);
    }
    
    return optimizations;
  }
  
  private createDefaultMetrics(): PerformanceMetrics {
    return {
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 0,
      activeMonads: 0,
      rulesFired: 0,
      gpuAccelerated: false,
      renderBatches: 1,
      batchSize: 1000,
    };
  }
  
  reset(): void {
    this.currentBatchSize = 1000;
    this.currentQualityLevel = 1.0;
    this.gpuFallbackEnabled = false;
    this.frameHistory = [];
  }
  
  updateTargets(newTargets: Partial<PerformanceTargets>): void {
    this.targets = { ...this.targets, ...newTargets };
  }
  
  updateSettings(newSettings: Partial<AutotuneSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }
}

export class RenderBatcher {
  private batchSize: number;
  private currentBatch: any[] = [];
  private batches: any[][] = [];
  
  constructor(batchSize: number = 1000) {
    this.batchSize = batchSize;
  }
  
  addToBatch(item: any): void {
    this.currentBatch.push(item);
    
    if (this.currentBatch.length >= this.batchSize) {
      this.flushBatch();
    }
  }
  
  flushBatch(): void {
    if (this.currentBatch.length > 0) {
      this.batches.push([...this.currentBatch]);
      this.currentBatch = [];
    }
  }
  
  getBatches(): any[][] {
    this.flushBatch(); // Ensure current batch is included
    return [...this.batches];
  }
  
  clearBatches(): void {
    this.batches = [];
    this.currentBatch = [];
  }
  
  setBatchSize(size: number): void {
    this.batchSize = size;
  }
  
  getBatchCount(): number {
    return this.batches.length + (this.currentBatch.length > 0 ? 1 : 0);
  }
  
  getTotalItems(): number {
    return this.batches.reduce((sum, batch) => sum + batch.length, 0) + this.currentBatch.length;
  }
}

export class PerformanceHUD {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private metrics: PerformanceMetrics | null = null;
  private autotuner: PerformanceAutotuner | null = null;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupCanvas();
  }
  
  setMetrics(metrics: PerformanceMetrics): void {
    this.metrics = metrics;
    this.render();
  }
  
  setAutotuner(autotuner: PerformanceAutotuner): void {
    this.autotuner = autotuner;
  }
  
  private setupCanvas(): void {
    this.canvas.width = 300;
    this.canvas.height = 200;
  }
  
  private render(): void {
    if (!this.metrics) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw metrics
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '12px monospace';
    
    let y = 20;
    const lineHeight = 16;
    
    // FPS
    this.ctx.fillStyle = this.getFPSColor(this.metrics.fps);
    this.ctx.fillText(`FPS: ${this.metrics.fps.toFixed(1)}`, 10, y);
    y += lineHeight;
    
    // Frame time
    this.ctx.fillStyle = this.getFrameTimeColor(this.metrics.frameTime);
    this.ctx.fillText(`Frame: ${this.metrics.frameTime.toFixed(1)}ms`, 10, y);
    y += lineHeight;
    
    // Memory
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(`Memory: ${this.metrics.memoryUsage.toFixed(1)}KB`, 10, y);
    y += lineHeight;
    
    // Monads
    this.ctx.fillText(`Monads: ${this.metrics.activeMonads}`, 10, y);
    y += lineHeight;
    
    // GPU status
    this.ctx.fillStyle = this.metrics.gpuAccelerated ? '#00ff00' : '#ff0000';
    this.ctx.fillText(`GPU: ${this.metrics.gpuAccelerated ? 'ON' : 'OFF'}`, 10, y);
    y += lineHeight;
    
    // Batch info
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(`Batches: ${this.metrics.renderBatches}`, 10, y);
    y += lineHeight;
    
    // Autotuner info
    if (this.autotuner) {
      const settings = this.autotuner.getOptimizedSettings();
      this.ctx.fillText(`Quality: ${Math.round(settings.qualityLevel * 100)}%`, 10, y);
      y += lineHeight;
      this.ctx.fillText(`Batch Size: ${settings.batchSize}`, 10, y);
    }
  }
  
  private getFPSColor(fps: number): string {
    if (fps >= 55) return '#00ff00';
    if (fps >= 45) return '#ffff00';
    if (fps >= 30) return '#ff8000';
    return '#ff0000';
  }
  
  private getFrameTimeColor(frameTime: number): string {
    if (frameTime <= 16.67) return '#00ff00';
    if (frameTime <= 22.22) return '#ffff00';
    if (frameTime <= 33.33) return '#ff8000';
    return '#ff0000';
  }
}
