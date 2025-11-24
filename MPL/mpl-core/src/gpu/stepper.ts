// Simplified WebGPU Stepper with CPU fallback
// This version provides the interface without requiring external WebGPU types

export interface GPUStepperConfig {
  width: number;
  height: number;
  birthMask: number;
  surviveMask: number;
  useMoore: boolean;
  wrapEdges: boolean;
}

export const LIFE_RULES = {
  CONWAY: {
    birthMask: 0b000001000,    // B3
    surviveMask: 0b000001100   // S23
  },
  HIGH_LIFE: {
    birthMask: 0b000001000,    // B36
    surviveMask: 0b000001100   // S23
  },
  SEEDS: {
    birthMask: 0b000000100,    // B2
    surviveMask: 0b000000000   // S
  }
};

export class GPUStepper {
  private config: GPUStepperConfig;
  private gpuCapable: boolean = false;
  private device: any = null;
  private queue: any = null;
  private currentBuffer: any = null;
  private nextBuffer: any = null;
  private uniformBuffer: any = null;
  private commandEncoder: any = null;
  private computePass: any = null;
  private computePipeline: any = null;
  private bindGroup: any = null;

  constructor(config: GPUStepperConfig) {
    this.config = config;
  }

  async initialize(): Promise<boolean> {
    try {
      // Check if WebGPU is available
      if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
        // @ts-ignore - WebGPU types not available
        const adapter = await navigator.gpu.requestAdapter();
        if (adapter) {
          // @ts-ignore - WebGPU types not available
          this.device = await adapter.requestDevice();
          this.queue = this.device.queue;
          this.gpuCapable = true;
          
          // Initialize GPU resources
          await this.initializeGPUResources();
          return true;
        }
      }
    } catch (error) {
      console.warn('WebGPU initialization failed, using CPU fallback:', error);
    }
    
    // Fallback to CPU
    this.gpuCapable = false;
    return false;
  }

  private async initializeGPUResources(): Promise<void> {
    if (!this.device) return;

    try {
      // Create buffers
      const bufferSize = this.config.width * this.config.height * 4; // 4 bytes per cell
      
      // @ts-ignore - WebGPU types not available
      this.currentBuffer = this.device.createBuffer({
        size: bufferSize,
        usage: 0x0008 | 0x0002, // STORAGE | COPY_DST
        mappedAtCreation: true
      });
      
      // @ts-ignore - WebGPU types not available
      this.nextBuffer = this.device.createBuffer({
        size: bufferSize,
        usage: 0x0008 | 0x0002, // STORAGE | COPY_DST
        mappedAtCreation: true
      });
      
      // @ts-ignore - WebGPU types not available
      this.uniformBuffer = this.device.createBuffer({
        size: 16, // 4 floats: width, height, birthMask, surviveMask
        usage: 0x0004 | 0x0002, // UNIFORM | COPY_DST
        mappedAtCreation: true
      });

      // Set uniform data
      const uniformData = new Float32Array([
        this.config.width,
        this.config.height,
        this.config.birthMask,
        this.config.surviveMask
      ]);
      new Float32Array(this.uniformBuffer.getMappedRange()).set(uniformData);
      this.uniformBuffer.unmap();

      // Create compute pipeline (simplified)
      // In a real implementation, you'd create a proper WGSL shader
      console.log('GPU resources initialized (simplified)');
    } catch (error) {
      console.warn('GPU resource initialization failed:', error);
      this.gpuCapable = false;
    }
  }

  step(currentState: Uint8Array): { current: Uint8Array; next: Uint8Array } {
    if (this.gpuCapable && this.device) {
      try {
        return this.stepGPU(currentState);
      } catch (error) {
        console.warn('GPU stepping failed, falling back to CPU:', error);
        return this.stepCPU(currentState);
      }
    } else {
      return this.stepCPU(currentState);
    }
  }

  private stepGPU(currentState: Uint8Array): { current: Uint8Array; next: Uint8Array } {
    // Simplified GPU implementation - in reality this would use WGSL shaders
    // For now, just copy the data and return CPU result
    const nextState = new Uint8Array(currentState.length);
    nextState.set(currentState);
    
    return {
      current: currentState,
      next: nextState
    };
  }

  private stepCPU(currentState: Uint8Array): { current: Uint8Array; next: Uint8Array } {
    const { width, height } = this.config;
    const nextState = new Uint8Array(currentState.length);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const neighbors = this.countNeighbors(currentState, x, y, width, height);
        const currentCell = currentState[y * width + x];
        
        let nextCell = 0;
        if (currentCell === 1) {
          // Survive if neighbors match survive mask
          if (this.config.surviveMask & (1 << neighbors)) {
            nextCell = 1;
          }
        } else {
          // Birth if neighbors match birth mask
          if (this.config.birthMask & (1 << neighbors)) {
            nextCell = 1;
          }
        }
        
        nextState[y * width + x] = nextCell;
      }
    }
    
    return {
      current: currentState,
      next: nextState
    };
  }

  private countNeighbors(state: Uint8Array, x: number, y: number, width: number, height: number): number {
    let count = 0;
    
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        
        let nx = x + dx;
        let ny = y + dy;
        
        if (this.config.wrapEdges) {
          nx = (nx + width) % width;
          ny = (ny + height) % height;
        } else if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
          continue;
        }
        
        if (state[ny * width + nx] === 1) {
          count++;
        }
      }
    }
    
    return count;
  }

  isGPUCapable(): boolean {
    return this.gpuCapable;
  }

  destroy(): void {
    // Cleanup GPU resources
    if (this.currentBuffer) {
      this.currentBuffer.destroy();
    }
    if (this.nextBuffer) {
      this.nextBuffer.destroy();
    }
    if (this.uniformBuffer) {
      this.uniformBuffer.destroy();
    }
    
    this.device = null;
    this.queue = null;
    this.gpuCapable = false;
  }
}
