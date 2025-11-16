// Plugin System with Sandboxed Workers
// Stage 4: Plugins & Extensibility

import type { ExecutionSnapshot, Plugin } from '../types';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  permissions: PluginPermission[];
  entryPoint: string;
}

export interface PluginPermission {
  type: 'grid_read' | 'grid_write' | 'variables_read' | 'variables_write' | 'network' | 'storage';
  scope?: string;
}

export interface PluginContext {
  grid: {
    width: number;
    height: number;
    data: Uint8Array;
  };
  variables: Map<string, any>;
  step: number;
  timestamp: number;
}

export interface DrawOperation {
  type: 'circle' | 'rect' | 'line' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  x2?: number;
  y2?: number;
  text?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private workers: Map<string, Worker> = new Map();
  private permissions: Map<string, Set<PluginPermission>> = new Map();

  constructor() {
    this.initializeBuiltinPlugins();
  }

  private initializeBuiltinPlugins(): void {
    // Register built-in plugins
    this.registerPlugin(new HaloPlugin());
    this.registerPlugin(new PerformancePlugin());
  }

  registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.id, plugin);
    console.log(`Plugin registered: ${plugin.name} v${plugin.version}`);
  }

  async loadPlugin(manifest: PluginManifest): Promise<boolean> {
    try {
      // Create sandboxed worker
      const worker = new Worker(manifest.entryPoint);
      this.workers.set(manifest.id, worker);

      // Store permissions
      this.permissions.set(manifest.id, new Set(manifest.permissions));

      // Create plugin wrapper
      const plugin: Plugin = {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        execute: (context: PluginContext) => {
          this.executeInWorker(manifest.id, context);
        }
      };

      this.registerPlugin(plugin);
      return true;
    } catch (error) {
      console.error(`Failed to load plugin ${manifest.name}:`, error);
      return false;
    }
  }

  private executeInWorker(pluginId: string, context: PluginContext): void {
    const worker = this.workers.get(pluginId);
    if (!worker) return;

    // Send context to worker
    worker.postMessage({
      type: 'execute',
      context: this.sanitizeContext(context, pluginId)
    });
  }

  private sanitizeContext(context: PluginContext, pluginId: string): PluginContext {
    const permissions = this.permissions.get(pluginId);
    if (!permissions) return context;

    const sanitized: PluginContext = {
      grid: { ...context.grid },
      variables: new Map(),
      step: context.step,
      timestamp: context.timestamp
    };

    // Apply permission-based filtering
    for (const permission of permissions) {
      switch (permission.type) {
        case 'grid_read':
          // Grid is already included
          break;
        case 'variables_read':
          if (permission.scope) {
            const value = context.variables.get(permission.scope);
            if (value !== undefined) {
              sanitized.variables.set(permission.scope, value);
            }
          } else {
            sanitized.variables = new Map(context.variables);
          }
          break;
      }
    }

    return sanitized;
  }

  executeAll(context: PluginContext): DrawOperation[] {
    const allOperations: DrawOperation[] = [];

    for (const plugin of this.plugins.values()) {
      try {
        plugin.execute(context);
        // Collect operations from worker responses
        // This would be handled by message listeners in a real implementation
      } catch (error) {
        console.error(`Plugin ${plugin.name} execution failed:`, error);
      }
    }

    return allOperations;
  }

  unloadPlugin(pluginId: string): void {
    const worker = this.workers.get(pluginId);
    if (worker) {
      worker.terminate();
      this.workers.delete(pluginId);
    }

    this.plugins.delete(pluginId);
    this.permissions.delete(pluginId);
  }

  getPluginList(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  destroy(): void {
    for (const worker of this.workers.values()) {
      worker.terminate();
    }
    this.workers.clear();
    this.plugins.clear();
    this.permissions.clear();
  }
}

// Built-in plugins
export class HaloPlugin implements Plugin {
  id = 'halo';
  name = 'Halo Effect';
  version = '1.0.0';

  execute(context: PluginContext): void {
    // This would normally send draw operations to the main thread
    // For now, just log the execution
    console.log(`Halo plugin executed at step ${context.step}`);
  }
}

export class PerformancePlugin implements Plugin {
  id = 'performance';
  name = 'Performance Monitor';
  version = '1.0.0';

  execute(context: PluginContext): void {
    // Monitor performance metrics
    const { width, height, data } = context.grid;
    let activeCells = 0;
    
    for (let i = 0; i < data.length; i++) {
      if (data[i] === 1) activeCells++;
    }

    const density = activeCells / (width * height);
    
    if (density > 0.8) {
      console.warn('High grid density detected:', density);
    }
  }

  destroy(): void {
    // Cleanup if needed
  }
}

// Plugin development utilities
export class PluginBuilder {
  static createManifest(
    id: string,
    name: string,
    version: string,
    description: string,
    author: string,
    permissions: PluginPermission[],
    entryPoint: string
  ): PluginManifest {
    return {
      id,
      name,
      version,
      description,
      author,
      permissions,
      entryPoint
    };
  }

  static createPermission(type: PluginPermission['type'], scope?: string): PluginPermission {
    return { type, scope };
  }
}