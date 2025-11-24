import type { Diagnostic } from './types';

// Stage 1J: Enhanced linter with better error detection and suggestions
export function lint(source: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const lines = source.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Check for common issues
    checkLine(line, lineNum, diagnostics);
  }
  
  // Check for global issues
  checkGlobal(source, diagnostics);
  
  return diagnostics;
}

function checkLine(line: string, lineNum: number, diagnostics: Diagnostic[]): void {
  const trimmed = line.trim();
  
  // Skip empty lines and comments
  if (!trimmed || trimmed.startsWith('//')) {
    return;
  }
  
  // Check for missing semicolons
  if (isStatement(trimmed) && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}')) {
    diagnostics.push({
      message: 'Missing semicolon at end of statement',
      line: lineNum,
      column: line.length + 1,
      severity: 'warning'
    });
  }
  
  // Check for unbalanced braces
  const openBraces = (line.match(/\{/g) || []).length;
  const closeBraces = (line.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    diagnostics.push({
      message: 'Unbalanced braces detected',
      line: lineNum,
      column: 1,
      severity: 'warning'
    });
  }
  
  // Check for unbalanced parentheses
  const openParens = (line.match(/\(/g) || []).length;
  const closeParens = (line.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    diagnostics.push({
      message: 'Unbalanced parentheses detected',
      line: lineNum,
      column: 1,
      severity: 'warning'
    });
  }
  
  // Check for unbalanced brackets
  const openBrackets = (line.match(/\[/g) || []).length;
  const closeBrackets = (line.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    diagnostics.push({
      message: 'Unbalanced brackets detected',
      line: lineNum,
      column: 1,
      severity: 'warning'
    });
  }
  
  // Check for common typos
  const typos = [
    { pattern: /\bvar\s+(\w+)\s*=\s*\1\b/, message: 'Variable assigned to itself - did you mean to use a different value?' },
    { pattern: /\bif\s*\(\s*(\w+)\s*\)\s*\{/, message: 'Consider adding a comparison operator in if condition' },
    { pattern: /\bwhile\s*\(\s*(\w+)\s*\)\s*\{/, message: 'Consider adding a comparison operator in while condition' },
    { pattern: /\bfor\s*\(\s*var\s+(\w+)\s*=\s*(\w+)\s*;\s*\1\s*<\s*\2\s*;\s*\1\+\+/, message: 'Potential infinite loop detected' }
  ];
  
  for (const typo of typos) {
    if (typo.pattern.test(line)) {
      diagnostics.push({
        message: typo.message,
        line: lineNum,
        column: 1,
        severity: 'warning'
      });
    }
  }
  
  // Check for unused variables (basic check)
  if (trimmed.startsWith('var ')) {
    const varName = trimmed.match(/var\s+(\w+)/)?.[1];
    if (varName) {
      // This is a basic check - a full implementation would track variable usage
      if (varName.length === 1 && !['i', 'j', 'k', 'x', 'y'].includes(varName)) {
        diagnostics.push({
          message: `Single-letter variable '${varName}' - consider using a more descriptive name`,
          line: lineNum,
          column: 5,
          severity: 'warning'
        });
      }
    }
  }
}

function checkGlobal(source: string, diagnostics: Diagnostic[]): void {
  // Check for overall structure issues
  
  // Check if main function exists
  if (!source.includes('function main') && !source.includes('rule main')) {
    diagnostics.push({
      message: 'Consider adding a main function or rule as an entry point',
      line: 1,
      column: 1,
      severity: 'info'
    });
  }
  
  // Check for proper spacing
  const lines = source.split('\n');
  let consecutiveEmptyLines = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '') {
      consecutiveEmptyLines++;
      if (consecutiveEmptyLines > 2) {
        diagnostics.push({
          message: 'Too many consecutive empty lines - consider reducing to improve readability',
          line: i + 1,
          column: 1,
          severity: 'info'
        });
      }
    } else {
      consecutiveEmptyLines = 0;
    }
  }
  
  // Check for consistent indentation
  let expectedIndent = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed || trimmed.startsWith('//')) continue;
    
    const actualIndent = line.length - line.trimStart().length;
    
    if (trimmed.endsWith('{')) {
      if (actualIndent !== expectedIndent) {
        diagnostics.push({
          message: 'Inconsistent indentation detected',
          line: i + 1,
          column: 1,
          severity: 'warning'
        });
      }
      expectedIndent += 2;
    } else if (trimmed.startsWith('}')) {
      expectedIndent = Math.max(0, expectedIndent - 2);
      if (actualIndent !== expectedIndent) {
        diagnostics.push({
          message: 'Inconsistent indentation detected',
          line: i + 1,
          column: 1,
          severity: 'warning'
        });
      }
    }
  }
}

function isStatement(line: string): boolean {
  const trimmed = line.trim();
  
  // Keywords that start statements
  const statementStarters = [
    'var', 'rule', 'function', 'if', 'while', 'for', 'return',
    'set', 'toggle', 'clear', 'step'
  ];
  
  return statementStarters.some(starter => trimmed.startsWith(starter));
}

// Stage 1J: Export linting utilities for better IDE integration
export const lintingRules = {
  // Built-in function documentation
  builtins: {
    'set': 'Sets a cell at position (x, y) to alive state',
    'toggle': 'Toggles a cell at position (x, y) between alive/dead',
    'clear': 'Clears all cells in the grid',
    'step': 'Advances the grid by one step (Conway\'s Game of Life)',
    'print': 'Outputs a value to the console and log buffer',
    'len': 'Returns the length of a string, array, or object'
  },
  
  // Keyword documentation
  keywords: {
    'var': 'Declares a variable',
    'rule': 'Defines a named rule that can be executed',
    'function': 'Defines a function with parameters',
    'return': 'Returns a value from a function',
    'if': 'Conditional statement',
    'else': 'Alternative branch for if statement',
    'while': 'Loop that continues while condition is true',
    'for': 'Loop with initialization, condition, and increment',
    'of': 'Used in for-of loops to iterate over array elements',
    'in': 'Used in for-in loops to iterate over object properties'
  },
  
  // Common patterns and suggestions
  suggestions: {
    'grid_patterns': 'Try creating patterns like gliders, oscillators, or still lifes',
    'functions': 'Break complex logic into reusable functions',
    'arrays': 'Use arrays to store multiple related values',
    'objects': 'Use objects to group related data with named properties',
    'strings': 'Use strings for text output and debugging'
  }
};
