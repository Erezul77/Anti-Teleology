// src/engine/layersBridge.ts
import { eventBus } from './events';

export type LayerSnapshot = {
  id: string;
  name: string;
  visible?: boolean;
  opacity?: number; // 0..1
  size: { x:number; y:number; z:number };
  channel: Uint8Array; // flattened x-major
  getStateAt?: (x:number,y:number,z:number) => Record<string, any> | undefined;
};

class LayersBridge {
  private provider: (() => LayerSnapshot[]) | null = null;
  private version = 0;

  setProvider(fn: () => LayerSnapshot[]) { this.provider = fn; }
  hasProvider() { return !!this.provider; }
  getSnapshot(): { version:number; layers: LayerSnapshot[] } {
    return { version: this.version, layers: this.provider ? this.provider() : [] };
  }

  constructor() {
    eventBus.on('tick', () => { this.version++; });
    eventBus.on('simulationStop', () => { this.version++; });
  }
}

export const layersBridge = new LayersBridge();
export type { LayerSnapshot as VisLayerSnapshot };