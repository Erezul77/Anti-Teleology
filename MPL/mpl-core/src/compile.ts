import { parse } from './parser';
import { lint as runLint } from './lint';
import type { CompileResult } from './types';

export function compile(source: string): CompileResult {
  const parseResult = parse(source);
  const lintErrors = runLint(source).filter((d) => d.severity === 'error');
  return { 
    program: parseResult.program, 
    errors: [...parseResult.errors, ...lintErrors] 
  };
}

// Stage 1D: Enhanced compilation with AST execution
export function compileAndExecute(source: string, vm: any): CompileResult {
  const result = compile(source);
  if (result.errors.length === 0) {
    try {
      vm.executeProgram(result.program.ast);
    } catch (error) {
      result.errors.push({
        message: `Runtime error: ${error}`,
        line: 1,
        column: 1,
        severity: 'error'
      });
    }
  }
  return result;
}
