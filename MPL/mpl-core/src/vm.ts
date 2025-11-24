import { VMState, Grid, Expression, Statement, VarDecl, RuleDecl, FunctionDecl, ReturnStmt, ExprStmt, NumberLiteral, StringLiteral, VariableRef, BinaryExpr, CallExpr, ArrayLiteral, IndexExpr, ForOfStmt, ForInStmt, ObjectLiteral, PropertyAccess, Value } from './types';
import { createGrid, setCell, toggleCell, clearGrid } from './grid';
import { stdlib } from './stdlib'; // Stage 1K: Import standard library
import { MPLRuntimeError, MPLTypeError, withErrorContext } from './trycatch'; // Stage 1L: Import error handling
import { eventBus, emitTick, emitSimulationStart, emitSimulationStop, emitError, emitFunctionCall, emitVariableChange, emitGridUpdate, emitRuleApplied, emitPerformance, emitStateChange } from './events'; // Stage 1N: Import event system

// Stage 1F: Call frame for function execution
interface CallFrame {
  variables: Map<string, Value>; // Stage 1I: Variables can now hold strings
  returnValue: Value | null;     // Stage 1I: Return values can be strings
  hasReturned: boolean;
}

export class VM {
  private state: VMState;
  private commandHistory: string[] = [];
  private callStack: CallFrame[] = []; // Stage 1F: Call stack for functions
  private stepCounter: number = 0; // Stage 1N: Step counter for events

  constructor(width: number = 50, height: number = 50) {
    this.state = {
      grid: createGrid(width, height),
      variables: new Map<string, Value>(),
      rules: new Map<string, RuleDecl>(),
      functions: new Map<string, FunctionDecl>(), // Stage 1F: Initialize functions
      logBuffer: [] // Stage 1I: Initialize log buffer
    };
    
    // Stage 1K: Initialize standard constants
    this.state.variables.set('PI', Math.PI);
    this.state.variables.set('E', Math.E);
    this.state.variables.set('TAU', Math.PI * 2);
    this.state.variables.set('GRID_WIDTH', width);
    this.state.variables.set('GRID_HEIGHT', height);
    
    // Stage 1N: Emit simulation start event
    emitSimulationStart(this.state.grid);
  }

  getState(): VMState {
    return this.state;
  }

  getGrid(): Grid {
    return this.state.grid;
  }

  getCommandHistory(): string[] {
    return [...this.commandHistory];
  }

  // Stage 1N: Get current step for event tracking
  getCurrentStep(): number {
    return this.stepCounter;
  }

  // Stage 1F: Get current call frame (global scope or function scope)
  private getCurrentFrame(): CallFrame {
    return this.callStack.length > 0 ? this.callStack[this.callStack.length - 1] : { 
      variables: this.state.variables, 
      returnValue: null, 
      hasReturned: false 
    };
  }

  // Stage 1F: Get variable from current scope
  private getVariableFromScope(name: string): Value | undefined {
    const frame = this.getCurrentFrame();
    return frame.variables.get(name);
  }

  // Stage 1F: Set variable in current scope
  private setVariable(name: string, value: Value): void {
    const frame = this.getCurrentFrame();
    const prevValue = frame.variables.get(name);
    frame.variables.set(name, value);
    
    // Stage 1N: Emit variable change event
    if (prevValue !== value) {
      emitVariableChange(name, prevValue, value, this.getCurrentStep());
    }
  }

  // Stage 1I: Helper to get numeric value (for grid operations)
  private getNumericValue(value: Value): number {
    if (typeof value === 'number') {
      return value;
    } else if (Array.isArray(value)) {
      // For arrays, use length or first element
      return value.length > 0 ? this.getNumericValue(value[0]) : 0;
    } else if (typeof value === 'string') {
      // For strings, try to parse as number or use length
      const num = Number(value);
      return isNaN(num) ? value.length : num;
    } else {
      // For objects, use first property value or 0
      const keys = Object.keys(value);
      return keys.length > 0 ? this.getNumericValue(value[keys[0]]) : 0;
    }
  }

  // Stage 1D: Evaluate expressions
  private evaluateExpression(expr: Expression): Value {
    switch (expr.kind) {
      case 'NumberLiteral':
        return expr.value;
      
      case 'StringLiteral':
        return expr.value;
      
      case 'VariableRef':
        const value = this.getVariableFromScope(expr.name);
        if (value === undefined) {
          throw new MPLRuntimeError(`Undefined variable: ${expr.name}`, expr.line, expr.column);
        }
        return value;
      
      case 'BinaryExpr':
        const left = this.evaluateExpression(expr.left);
        const right = this.evaluateExpression(expr.right);
        
        // Stage 1I: Handle string concatenation
        if (expr.operator === '+' && (typeof left === 'string' || typeof right === 'string')) {
          return String(left) + String(right);
        }
        
        // Stage 1H: Handle array and object operations
        if (Array.isArray(left) || Array.isArray(right) || 
            (typeof left === 'object' && !Array.isArray(left)) || 
            (typeof right === 'object' && !Array.isArray(right))) {
          // For now, convert to numbers for operations
          const leftNum = this.getNumericValue(left);
          const rightNum = this.getNumericValue(right);
          
          switch (expr.operator) {
            case '+': return leftNum + rightNum;
            case '-': return leftNum - rightNum;
            case '*': return leftNum * rightNum;
            case '/': return Math.floor(leftNum / rightNum);
            case '%': return leftNum % rightNum;
            case '==': return leftNum === rightNum ? 1 : 0;
            case '!=': return leftNum !== rightNum ? 1 : 0;
            case '<': return leftNum < rightNum ? 1 : 0;
            case '>': return leftNum > rightNum ? 1 : 0;
            case '<=': return leftNum <= rightNum ? 1 : 0;
            case '>=': return leftNum >= rightNum ? 1 : 0;
            default: throw new Error(`Unknown operator: ${expr.operator}`);
          }
        } else {
          // Both are numbers
          switch (expr.operator) {
            case '+': return (left as number) + (right as number);
            case '-': return (left as number) - (right as number);
            case '*': return (left as number) * (right as number);
            case '/': return Math.floor((left as number) / (right as number));
            case '%': return (left as number) % (right as number);
            case '==': return (left as number) === (right as number) ? 1 : 0;
            case '!=': return (left as number) !== (right as number) ? 1 : 0;
            case '<': return (left as number) < (right as number) ? 1 : 0;
            case '>': return (left as number) > (right as number) ? 1 : 0;
            case '<=': return (left as number) <= (right as number) ? 1 : 0;
            case '>=': return (left as number) >= (right as number) ? 1 : 0;
            default: throw new Error(`Unknown operator: ${expr.operator}`);
          }
        }
      
      case 'ArrayLiteral':
        // Stage 1G: Evaluate array elements
        const elements: Value[] = [];
        for (const element of expr.elements) {
          elements.push(this.evaluateExpression(element));
        }
        return elements;
      
      case 'IndexExpr':
        // Stage 1G: Array indexing
        const target = this.evaluateExpression(expr.array);
        const index = this.evaluateExpression(expr.index);
        
        if (!Array.isArray(target)) {
          throw new MPLTypeError(`Cannot index non-array value: ${target}`, expr.line, expr.column);
        }
        
        const indexNum = this.getNumericValue(index);
        if (indexNum < 0 || indexNum >= target.length) {
          throw new MPLRuntimeError(`Array index out of bounds: ${indexNum}`, expr.line, expr.column);
        }
        
        return target[indexNum];
      
      case 'ObjectLiteral':
        // Stage 1H: Evaluate object properties
        const obj: Record<string, Value> = {};
        for (const prop of expr.properties) {
          obj[prop.key] = this.evaluateExpression(prop.value);
        }
        return obj;
      
      case 'PropertyAccess':
        // Stage 1H: Object property access
        const targetObj = this.evaluateExpression(expr.object);
        if (typeof targetObj !== 'object' || Array.isArray(targetObj)) {
          throw new MPLTypeError(`Cannot access property of non-object value: ${targetObj}`, expr.line, expr.column);
        }
        
        const propValue = (targetObj as Record<string, Value>)[expr.property];
        if (propValue === undefined) {
          throw new MPLRuntimeError(`Property '${expr.property}' not found in object`, expr.line, expr.column);
        }
        
        return propValue;
      
      case 'CallExpr':
        // Stage 1K: Handle standard library functions first
        if (expr.name.startsWith('math.')) {
          const funcName = expr.name.substring(5); // Remove 'math.' prefix
          const func = stdlib.math[funcName as keyof typeof stdlib.math];
          if (func && typeof func === 'function') {
            const args = expr.args.map(arg => this.evaluateExpression(arg));
            const numericArgs = args.map(arg => this.getNumericValue(arg));
            return (func as Function)(...numericArgs);
          }
        } else if (expr.name.startsWith('string.')) {
          const funcName = expr.name.substring(7); // Remove 'string.' prefix
          const func = stdlib.string[funcName as keyof typeof stdlib.string];
          if (func && typeof func === 'function') {
            const args = expr.args.map(arg => this.evaluateExpression(arg));
            if (funcName === 'length' || funcName === 'toUpperCase' || funcName === 'toLowerCase' || funcName === 'trim') {
              const str = String(args[0]);
              return (func as Function)(str);
            } else if (funcName === 'substring') {
              const str = String(args[0]);
              const start = this.getNumericValue(args[1]);
              const end = args[2] !== undefined ? this.getNumericValue(args[2]) : undefined;
              return (func as Function)(str, start, end);
            }
          }
        } else if (expr.name.startsWith('array.')) {
          const funcName = expr.name.substring(6); // Remove 'array.' prefix
          const func = stdlib.array[funcName as keyof typeof stdlib.array];
          if (func && typeof func === 'function') {
            const args = expr.args.map(arg => this.evaluateExpression(arg));
            if (funcName === 'length') {
              const arr = args[0];
              if (Array.isArray(arr)) {
                return (func as Function)(arr);
              }
            } else if (funcName === 'push' || funcName === 'pop' || funcName === 'slice') {
              const arr = args[0];
              if (Array.isArray(arr)) {
                if (funcName === 'push') {
                  return (func as Function)(arr, args[1]);
                } else if (funcName === 'pop') {
                  return (func as Function)(arr);
                } else if (funcName === 'slice') {
                  const start = this.getNumericValue(args[1]);
                  const end = args[2] !== undefined ? this.getNumericValue(args[2]) : undefined;
                  return (func as Function)(arr, start, end);
                }
              }
            }
          }
        } else if (expr.name.startsWith('io.')) {
          const funcName = expr.name.substring(3); // Remove 'io.' prefix
          const func = stdlib.io[funcName as keyof typeof stdlib.io];
          if (func && typeof func === 'function') {
            const args = expr.args.map(arg => this.evaluateExpression(arg));
            (func as Function)(...args);
            return 0;
          }
        }
        
        // Stage 1I: Handle built-in functions
        if (expr.name === 'print' && expr.args.length === 1) {
          const value = this.evaluateExpression(expr.args[0]);
          const output = String(value);
          this.state.logBuffer.push(output);
          console.log(output); // Also log to console
          return 0;
        } else if (expr.name === 'len' && expr.args.length === 1) {
          const value = this.evaluateExpression(expr.args[0]);
          if (Array.isArray(value)) {
            return value.length;
          } else if (typeof value === 'string') {
            return value.length;
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            return Object.keys(value).length;
          } else {
            throw new Error(`Cannot get length of non-array/string/object value: ${value}`);
          }
        }
        
        // Stage 1F: Handle function calls with parameters
        if (expr.name === 'set' && expr.args.length === 2) {
          const x = this.getNumericValue(this.evaluateExpression(expr.args[0]));
          const y = this.getNumericValue(this.evaluateExpression(expr.args[1]));
          const prevValue = this.state.grid.data[y * this.state.grid.width + x];
          setCell(this.state.grid, x, y, 1);
          
          // Stage 1N: Emit grid update event
          emitGridUpdate(x, y, prevValue, 1, this.getCurrentStep());
          
          return 0;
        } else if (expr.name === 'toggle' && expr.args.length === 2) {
          const x = this.getNumericValue(this.evaluateExpression(expr.args[0]));
          const y = this.getNumericValue(this.evaluateExpression(expr.args[1]));
          const prevValue = this.state.grid.data[y * this.state.grid.width + x];
          toggleCell(this.state.grid, x, y);
          
          // Stage 1N: Emit grid update event
          emitGridUpdate(x, y, prevValue, this.state.grid.data[y * this.state.grid.width + x], this.getCurrentStep());
          
          return 0;
        } else if (expr.name === 'clear' && expr.args.length === 0) {
          clearGrid(this.state.grid);
          
          // Stage 1N: Emit state change event for grid clear
          emitStateChange(0, 0, { type: 'grid', state: 'populated' }, { type: 'grid', state: 'empty' }, this.getCurrentStep());
          
          return 0;
        } else if (expr.name === 'step' && expr.args.length === 0) {
          this.stepGrid();
          return 0;
        } else {
          // Stage 1F: Check for user-defined functions first
          const func = this.state.functions.get(expr.name);
          if (func) {
            return this.executeFunction(func, expr.args);
          }
          
          // Check if it's a user-defined rule
          const rule = this.state.rules.get(expr.name);
          if (rule) {
            this.executeRule(rule);
            return 0;
          } else {
            throw new MPLRuntimeError(`Unknown function: ${expr.name}`, expr.line, expr.column);
          }
        }
      
      default:
        throw new Error(`Unknown expression type: ${(expr as any).kind}`);
    }
  }

  // Stage 1F: Execute function with parameters and return value
  private executeFunction(func: FunctionDecl, args: Expression[]): Value {
    // Validate argument count
    if (args.length !== func.params.length) {
      throw new Error(`Function ${func.name} expects ${func.params.length} arguments, got ${args.length}`);
    }

    // Stage 1N: Emit function call event
    const startTime = performance.now();
    emitFunctionCall(func.name, args.map(arg => this.evaluateExpression(arg)), this.getCurrentStep());

    // Create new call frame
    const frame: CallFrame = {
      variables: new Map<string, Value>(),
      returnValue: null,
      hasReturned: false
    };

    // Set parameter values
    for (let i = 0; i < func.params.length; i++) {
      frame.variables.set(func.params[i], this.evaluateExpression(args[i]));
    }

    // Push frame onto call stack
    this.callStack.push(frame);

    try {
      // Execute function body
      for (const stmt of func.body) {
        if (frame.hasReturned) break;
        this.executeStatement(stmt);
      }

      // Stage 1N: Emit performance event for function execution
      const duration = performance.now() - startTime;
      emitPerformance(`function:${func.name}`, duration, this.getCurrentStep(), { 
        paramCount: args.length, 
        bodyLength: func.body.length 
      });

      // Return value (default to 0 if no return statement)
      return frame.returnValue ?? 0;
    } finally {
      // Pop frame from call stack
      this.callStack.pop();
    }
  }

  // Stage 1D: Execute statements
  private executeStatement(stmt: Statement): void {
    switch (stmt.kind) {
      case 'VarDecl':
        const value = this.evaluateExpression(stmt.value);
        this.setVariable(stmt.name, value);
        break;
      
      case 'RuleDecl':
        this.state.rules.set(stmt.name, stmt);
        break;

      case 'FunctionDecl': // Stage 1F: Handle function declarations
        this.state.functions.set(stmt.name, stmt);
        break;

      case 'Return': // Stage 1F: Handle return statements
        const frame = this.getCurrentFrame();
        if (frame.returnValue !== null) { // Only global scope
          frame.returnValue = stmt.value ? this.evaluateExpression(stmt.value) : 0;
          frame.hasReturned = true;
        }
        break;
      
      case 'ExprStmt':
        this.evaluateExpression(stmt.expression);
        break;

      case 'ForOf': // Stage 1G: Handle for-of loops
        this.executeForOf(stmt);
        break;

      case 'ForIn': // Stage 1H: Handle for-in loops
        this.executeForIn(stmt);
        break;
    }
  }

  // Stage 1G: Execute for-of loop
  private executeForOf(stmt: ForOfStmt): void {
    const iterable = this.evaluateExpression(stmt.iterable);
    
    if (!Array.isArray(iterable)) {
      throw new Error(`Cannot iterate over non-array value: ${iterable}`);
    }
    
    for (const element of iterable) {
      // Set the loop variable
      this.setVariable(stmt.varName, element);
      
      // Execute the loop body
      for (const bodyStmt of stmt.body) {
        this.executeStatement(bodyStmt);
      }
    }
  }

  // Stage 1H: Execute for-in loop
  private executeForIn(stmt: ForInStmt): void {
    const object = this.evaluateExpression(stmt.object);
    
    if (typeof object !== 'object' || Array.isArray(object)) {
      throw new MPLTypeError(`Cannot iterate over non-object value: ${object}`, stmt.line, stmt.column);
    }
    
    for (const key in object) {
      // Set the loop variable to the property name (convert to Value type)
      this.setVariable(stmt.varName, key as unknown as Value);
      
      // Execute the loop body
      for (const bodyStmt of stmt.body) {
        this.executeStatement(bodyStmt);
      }
    }
  }

  // Stage 1D: Execute a rule
  private executeRule(rule: RuleDecl): void {
    const startTime = performance.now();
    
    for (const stmt of rule.body) {
      this.executeStatement(stmt);
    }
    
    // Stage 1N: Emit rule applied event
    const duration = performance.now() - startTime;
    emitRuleApplied(rule.name, 0, 0, this.getCurrentStep(), { 
      bodyLength: rule.body.length,
      duration 
    });
    
    emitPerformance(`rule:${rule.name}`, duration, this.getCurrentStep(), { 
      bodyLength: rule.body.length 
    });
  }

  // Enhanced step function implementing Conway's Game of Life
  private stepGrid(): void {
    const startTime = performance.now();
    this.stepCounter++; // Stage 1N: Increment step counter
    
    const oldGrid = this.state.grid;
    const newGrid = createGrid(oldGrid.width, oldGrid.height);
    
    for (let y = 0; y < oldGrid.height; y++) {
      for (let x = 0; x < oldGrid.width; x++) {
        // Count live neighbors
        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue; // Skip self
            
            const nx = x + dx;
            const ny = y + dy;
            
            // Check bounds
            if (nx >= 0 && nx < oldGrid.width && ny >= 0 && ny < oldGrid.height) {
              neighbors += oldGrid.data[ny * oldGrid.width + nx];
            }
          }
        }
        
        const currentCell = oldGrid.data[y * oldGrid.width + x];
        
        // Apply Conway's Game of Life rules
        if (currentCell === 1) {
          // Live cell
          if (neighbors === 2 || neighbors === 3) {
            newGrid.data[y * newGrid.width + x] = 1; // Survives
          } else {
            newGrid.data[y * newGrid.width + x] = 0; // Dies
          }
        } else {
          // Dead cell
          if (neighbors === 3) {
            newGrid.data[y * newGrid.width + x] = 1; // Born
          } else {
            newGrid.data[y * newGrid.width + x] = 0; // Stays dead
          }
        }
      }
    }
    
    this.state.grid = newGrid;
    
    // Stage 1N: Emit tick event with performance data
    const duration = performance.now() - startTime;
    emitTick(this.stepCounter, this.state.grid);
    emitPerformance('stepGrid', duration, this.stepCounter, { 
      gridSize: `${oldGrid.width}x${oldGrid.height}`,
      changes: this.countGridChanges(oldGrid, newGrid)
    });
  }

  // Stage 1N: Helper to count grid changes for performance monitoring
  private countGridChanges(oldGrid: Grid, newGrid: Grid): number {
    let changes = 0;
    for (let i = 0; i < oldGrid.data.length; i++) {
      if (oldGrid.data[i] !== newGrid.data[i]) {
        changes++;
      }
    }
    return changes;
  }

  // Stage 1D: Execute parsed program
  executeProgram(ast: any): void {
    if (ast && ast.body) {
      for (const stmt of ast.body) {
        try {
          this.executeStatement(stmt);
        } catch (error) {
          console.warn(`Error executing statement: ${error}`);
          
          // Stage 1N: Emit error event
          emitError(
            error instanceof Error ? error.message : String(error),
            'executeProgram',
            { statement: stmt },
            stmt.line,
            stmt.column
          );
        }
      }
    }
  }

  executeCommand(command: string): void {
    this.commandHistory.push(command);
    
    // Simple command parsing for backward compatibility
    const trimmed = command.trim();
    
    if (trimmed === 'clear') {
      clearGrid(this.state.grid);
      return;
    }
    
    if (trimmed === 'step') {
      // Stage 1C: Now implements Conway's Game of Life!
      this.stepGrid();
      return;
    }
    
    // Parse set(x,y) command
    const setMatch = trimmed.match(/^set\((\d+),(\d+)\)$/);
    if (setMatch) {
      const x = parseInt(setMatch[1]);
      const y = parseInt(setMatch[2]);
      setCell(this.state.grid, x, y, 1);
      return;
    }
    
    // Parse toggle(x,y) command
    const toggleMatch = trimmed.match(/^toggle\((\d+),(\d+)\)$/);
    if (toggleMatch) {
      const x = parseInt(toggleMatch[1]);
      const y = parseInt(toggleMatch[2]);
      toggleCell(this.state.grid, x, y);
      return;
    }
    
    // Unknown command - could add error handling here
    console.warn(`Unknown command: ${command}`);
  }

  reset(): void {
    this.state.grid = createGrid(this.state.grid.width, this.state.grid.height);
    this.state.variables.clear();
    this.state.rules.clear();
    this.state.functions.clear(); // Stage 1F: Clear functions
    this.callStack = []; // Stage 1F: Clear call stack
    this.commandHistory = [];
    this.state.logBuffer = []; // Stage 1I: Clear log buffer
    this.stepCounter = 0; // Stage 1N: Reset step counter
    
    // Stage 1N: Emit simulation stop and restart events
    emitSimulationStop(this.state.grid);
    emitSimulationStart(this.state.grid);
  }

  // Stage 1D: Get variable value from global scope
  getVariable(name: string): Value | undefined {
    return this.state.variables.get(name);
  }

  // Stage 1D: Get all variables
  getVariables(): Map<string, Value> {
    return new Map(this.state.variables);
  }

  // Stage 1D: Get all rules
  getRules(): Map<string, RuleDecl> {
    return new Map(this.state.rules);
  }

  // Stage 1F: Get all functions
  getFunctions(): Map<string, FunctionDecl> {
    return new Map(this.state.functions);
  }

  // Stage 1I: Get log buffer
  getLogBuffer(): string[] {
    return [...this.state.logBuffer];
  }

  // Stage 1I: Clear log buffer
  clearLogBuffer(): void {
    this.state.logBuffer = [];
  }

  // Stage 1O: Create grid snapshot for 3D visualization
  createGridSnapshot(): { size: { x: number; y: number; z: number }; channel: Uint8Array; getStateAt?: (x: number, y: number, z: number) => Record<string, any> | undefined } {
    const { width, height } = this.state.grid;
    
    // Create a 3D grid snapshot (z=1 for now, can be extended later)
    const size = { x: width, y: height, z: 1 };
    const channel = new Uint8Array(width * height);
    
    // Fill channel with grid data (0-255 for visualization)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const cellValue = this.state.grid.data[index];
        // Convert 0/1 to 0-255 range for better visualization
        channel[index] = cellValue === 1 ? 255 : 0;
      }
    }
    
    // Provide state access function
    const getStateAt = (x: number, y: number, z: number) => {
      if (x < 0 || x >= width || y < 0 || y >= height || z !== 0) {
        return undefined;
      }
      const index = y * width + x;
      const cellValue = this.state.grid.data[index];
      return {
        value: cellValue,
        position: { x, y, z },
        step: this.stepCounter,
        timestamp: Date.now()
      };
    };
    
    return { size, channel, getStateAt };
  }
}
