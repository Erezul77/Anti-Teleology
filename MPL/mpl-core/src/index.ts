// MPL Core Library - Unified Export
// Includes Stage 1O (current) + Stage 3-4 (new advanced features)

// Core MPL functionality (Stage 1O)
export * from './types';
export * from './vm';
export * from './parser';
export * from './tokens';
export * from './compile';
export * from './lint';
export * from './grid';
export * from './stdlib';
export * from './constants';
export * from './events';
export * from './fileio';
export * from './trycatch';
export * from './visBridge';

// Stage 3: Performance & Scale
export * from './gpu';
export * from './perf';

// Stage 4: Advanced Features & Collaboration
// Export specific items to avoid conflicts
export { ExportManager } from './export/exporters';
export { PluginManager, HaloPlugin, PerformancePlugin } from './plugins/pluginSystem';
export { CollaborationManager } from './collab/collaboration';
export { GraphDBBridge } from './db/graphBridge';
export * from './accessibility/accessibility';

// Unified Stage 3-4 Integration
export * from './integration/stage3-4-integration';
