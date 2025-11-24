export type Cell = 0 | 1;

export interface Grid {
  width: number;
  height: number;
  data: Uint8Array;
}

export interface Diagnostic {
  message: string;
  line: number;
  column: number;
  severity: "error" | "warning" | "info";
}

// Stage 1I: Value type that can be number, string, array, or object
export type Value = number | string | Value[] | { [key: string]: Value };

export interface VMState {
  grid: Grid;
  variables: Map<string, Value>; // Stage 1I: Variables can now hold strings
  rules: Map<string, RuleDecl>;
  functions: Map<string, FunctionDecl>; // Stage 1F: Add functions
  logBuffer: string[]; // Stage 1I: Add log buffer for print output
}

export interface Program<AST = unknown> {
  source: string;
  ast: AST;
}

export interface CompileResult<AST = unknown> {
  program: Program<AST>;
  errors: Diagnostic[];
}

// Add missing ExecutionSnapshot type for performance monitoring
export interface ExecutionSnapshot {
  id: string;
  timestamp: number;
  step: number;
  grid: Grid;
  variables: Map<string, Value>;
  performance: {
    fps: number;
    memoryUsage: number;
    executionTime: number;
  };
}

// Stage 1D: Enhanced AST types
export type Expression = 
  | NumberLiteral
  | StringLiteral   // Stage 1I: String literals
  | VariableRef
  | BinaryExpr
  | CallExpr
  | ParenExpr
  | ArrayLiteral    // Stage 1G: Array literals
  | IndexExpr       // Stage 1G: Array indexing
  | ObjectLiteral   // Stage 1H: Object literals
  | PropertyAccess; // Stage 1H: Property access

export interface NumberLiteral {
  kind: "NumberLiteral";
  value: number;
  line: number;
  column: number;
}

export interface StringLiteral {
  kind: "StringLiteral";
  value: string;
  line: number;
  column: number;
}

export interface VariableRef {
  kind: "VariableRef";
  name: string;
  line: number;
  column: number;
}

export interface BinaryExpr {
  kind: "BinaryExpr";
  left: Expression;
  operator: "+" | "-" | "*" | "/" | "%" | "==" | "!=" | "<" | ">" | "<=" | ">=";
  right: Expression;
  line: number;
  column: number;
}

export interface CallExpr {
  kind: "CallExpr";
  name: string;
  args: Expression[];
  line: number;
  column: number;
}

export interface ParenExpr {
  kind: "ParenExpr";
  expr: Expression;
  line: number;
  column: number;
}

// Stage 1G: Array literal expression
export interface ArrayLiteral {
  kind: "ArrayLiteral";
  elements: Expression[];
  line: number;
  column: number;
}

// Stage 1G: Array indexing expression
export interface IndexExpr {
  kind: "IndexExpr";
  array: Expression;
  index: Expression;
  line: number;
  column: number;
}

// Stage 1H: Object literal expression
export interface ObjectLiteral {
  kind: "ObjectLiteral";
  properties: Property[];
  line: number;
  column: number;
}

// Stage 1H: Property access expression
export interface PropertyAccess {
  kind: "PropertyAccess";
  object: Expression;
  property: string;
  line: number;
  column: number;
}

// Stage 1H: Object property
export interface Property {
  key: string;
  value: Expression;
}

// Stage 1D: Statement types
export type Statement = 
  | VarDecl
  | RuleDecl
  | FunctionDecl
  | ReturnStmt
  | ExprStmt
  | IfStmt
  | WhileStmt
  | ForStmt
  | ForOfStmt
  | ForInStmt
  | BlockStmt
  | SetStmt
  | ToggleStmt
  | ClearStmt
  | StepStmt;

export interface VarDecl {
  kind: "VarDecl";
  name: string;
  value: Expression;
  line: number;
  column: number;
}

export interface RuleDecl {
  kind: "RuleDecl";
  name: string;
  body: Statement[];
  line: number;
  column: number;
}

export interface FunctionDecl {
  kind: "FunctionDecl";
  name: string;
  params: string[];
  body: Statement[];
  line: number;
  column: number;
}

export interface ReturnStmt {
  kind: "Return";
  value: Expression | null;
  line: number;
  column: number;
}

export interface ExprStmt {
  kind: "ExprStmt";
  expression: Expression;
  line: number;
  column: number;
}

export interface ForOfStmt {
  kind: "ForOf";
  varName: string;
  iterable: Expression;
  body: Statement[];
  line: number;
  column: number;
}

export interface ForInStmt {
  kind: "ForIn";
  varName: string;
  object: Expression;
  body: Statement[];
  line: number;
  column: number;
}

// Additional statement types for parser compatibility
export interface IfStmt {
  kind: "If";
  test: Expression;
  then: BlockStmt;
  otherwise?: BlockStmt;
  line: number;
  column: number;
}

export interface WhileStmt {
  kind: "While";
  test: Expression;
  body: BlockStmt;
  line: number;
  column: number;
}

export interface ForStmt {
  kind: "For";
  init?: Statement | null;
  test?: Expression | null;
  post?: Statement | null;
  body: BlockStmt;
  line: number;
  column: number;
}

export interface BlockStmt {
  kind: "Block";
  body: Statement[];
  line: number;
  column: number;
}

export interface SetStmt {
  kind: "Set";
  x: Expression;
  y: Expression;
  line: number;
  column: number;
}

export interface ToggleStmt {
  kind: "Toggle";
  x: Expression;
  y: Expression;
  line: number;
  column: number;
}

export interface ClearStmt {
  kind: "Clear";
  line: number;
  column: number;
}

export interface StepStmt {
  kind: "Step";
  line: number;
  column: number;
}

// Stage 1N: Event types for performance monitoring
export interface GridUpdateEvent {
  x: number;
  y: number;
  oldValue: Cell;
  newValue: Cell;
  step: number;
  timestamp: number;
}

export interface RuleAppliedEvent {
  ruleName: string;
  x: number;
  y: number;
  step: number;
  metadata: {
    bodyLength: number;
    duration: number;
  };
}

export interface PerformanceEvent {
  metric: string;
  value: number;
  step: number;
  metadata: any;
}

export interface StateChangeEvent {
  type: 'grid' | 'variables' | 'rules' | 'functions';
  action: 'create' | 'update' | 'delete';
  target: string;
  step: number;
  timestamp: number;
}

// Stage 1O: 3D visualization types
export interface Grid3DSnapshot {
  size: {
    x: number;
    y: number;
    z: number;
  };
  channel: Uint8Array;
  getStateAt?: (x: number, y: number, z: number) => Record<string, any> | undefined;
}

// Stage 3-4: Advanced feature types
export interface Plugin {
  id: string;
  name: string;
  version: string;
  execute: (context: any) => void;
  destroy?: () => void;
}

export interface PerformanceTargets {
  targetFPS: number;
  maxFrameTime: number;
  maxMemoryUsage: number;
  maxMonadCount: number;
}

export interface AutotuneSettings {
  enableDynamicScaling: boolean;
  enableBatchOptimization: boolean;
  enableMemoryOptimization: boolean;
  enableGPUFallback: boolean;
  adaptiveQuality: boolean;
}

export interface SharePack {
  id: string;
  snapshots: ExecutionSnapshot[];
  metadata: any;
  settings: any;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  position?: { x: number; y: number };
}

export interface GraphConnection {
  id: string;
  type: 'neo4j' | 'gremlin' | 'graphql';
  url: string;
  credentials?: any;
}
