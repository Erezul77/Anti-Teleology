import type { Diagnostic, Program, CompileResult } from './types';
import { tokenize, type Token, type TokenType } from './tokens';
import type { 
  Expression, Statement, VarDecl, RuleDecl, FunctionDecl, ReturnStmt, ExprStmt, 
  IfStmt, WhileStmt, ForStmt, ForOfStmt, ForInStmt, BlockStmt, 
  SetStmt, ToggleStmt, ClearStmt, StepStmt,
  NumberLiteral, StringLiteral, VariableRef, BinaryExpr, CallExpr, ParenExpr, ArrayLiteral, IndexExpr, ObjectLiteral, PropertyAccess
} from './types';

export interface ParseResult { 
  program: Program<any>; 
  errors: Diagnostic[]; 
}

export function parse(source: string): ParseResult {
  const tokens = tokenize(source);
  let current = 0;
  const errors: Diagnostic[] = [];

  const currentToken = () => tokens[current];
  const isAtEnd = () => currentToken().type === 'eof';
  const peek = () => tokens[current];
  const peekNext = () => tokens[current + 1];
  
  const match = (...types: TokenType[]) => {
    if (isAtEnd()) return false;
    return types.includes(currentToken().type);
  };
  
  const consume = (type: TokenType, message: string) => {
    if (match(type)) {
      return tokens[current++];
    }
    
    const token = currentToken();
    errors.push({
      message,
      line: token.line,
      column: token.column,
      severity: 'error'
    });
    
    // Skip to next statement boundary
    while (!isAtEnd() && !match('semicolon', 'rbrace', 'eof')) {
      current++;
    }
    
    return { type, line: token.line, column: token.column } as Token;
  };

  // Expression parsing with proper precedence
  function parsePrimary(): Expression {
    const token = currentToken();
    
    if (match('number')) {
      current++;
      return {
        kind: 'NumberLiteral',
        value: Number(token.value),
        line: token.line,
        column: token.column
      };
    }
    
    if (match('string')) {
      current++;
      return {
        kind: 'StringLiteral',
        value: token.value!,
        line: token.line,
        column: token.column
      };
    }
    
    if (match('identifier')) {
      current++;
      return {
        kind: 'VariableRef',
        name: token.value!,
        line: token.line,
        column: token.column
      };
    }
    
    if (match('lparen')) {
      current++; // consume '('
      const expr = parseExpression();
      consume('rparen', "Expected ')' after expression");
      return {
        kind: 'ParenExpr',
        expr,
        line: tokens[current - 1].line,
        column: tokens[current - 1].column
      };
    }

    // Stage 1G: Array literals
    if (match('lbracket')) {
      current++; // consume '['
      const elements: Expression[] = [];
      
      if (!match('rbracket')) {
        elements.push(parseExpression());
        while (match('comma')) {
          current++; // consume ','
          elements.push(parseExpression());
        }
      }
      
      consume('rbracket', "Expected ']' after array elements");
      return {
        kind: 'ArrayLiteral',
        elements,
        line: tokens[current - 1].line,
        column: tokens[current - 1].column
      };
    }

    // Stage 1H: Object literals
    if (match('lbrace')) {
      current++; // consume '{'
      const properties: Array<{ key: string; value: Expression }> = [];
      
      if (!match('rbrace')) {
        const key = consume('identifier', "Expected property name");
        consume('colon', "Expected ':' after property name");
        const value = parseExpression();
        properties.push({ key: key.value!, value });
        
        while (match('comma')) {
          current++; // consume ','
          const nextKey = consume('identifier', "Expected property name");
          consume('colon', "Expected ':' after property name");
          const nextValue = parseExpression();
          properties.push({ key: nextKey.value!, value: nextValue });
        }
      }
      
      consume('rbrace', "Expected '}' after object properties");
      return {
        kind: 'ObjectLiteral',
        properties,
        line: tokens[current - 1].line,
        column: tokens[current - 1].column
      };
    }
    
    // Error recovery - return a default value
    errors.push({
      message: 'Expected expression',
      line: token.line,
      column: token.column,
      severity: 'error'
    });
    current++;
    return {
      kind: 'NumberLiteral',
      value: 0,
      line: token.line,
      column: token.column
    };
  }

  function parsePostfix(): Expression {
    let expr = parsePrimary();
    
    while (true) {
      if (match('lparen')) {
        // Function call
        const start = currentToken();
        current++; // consume '('
        
        const args: Expression[] = [];
        if (!match('rparen')) {
          args.push(parseExpression());
          while (match('comma')) {
            current++; // consume ','
            args.push(parseExpression());
          }
        }
        
        consume('rparen', "Expected ')' after function arguments");
        
        expr = {
          kind: 'CallExpr',
          name: (expr as VariableRef).name,
          args,
          line: start.line,
          column: start.column
        };
      } else if (match('lbracket')) {
        // Stage 1G: Array indexing
        const start = currentToken();
        current++; // consume '['
        const index = parseExpression();
        consume('rbracket', "Expected ']' after array index");
        
        expr = {
          kind: 'IndexExpr',
          array: expr,
          index,
          line: start.line,
          column: start.column
        };
      } else if (match('dot')) {
        // Stage 1H: Property access (obj.property)
        const start = currentToken();
        current++; // consume '.'
        const property = consume('identifier', "Expected property name");
        
        expr = {
          kind: 'PropertyAccess',
          object: expr,
          property: property.value!,
          line: start.line,
          column: start.column
        };
      } else {
        break;
      }
    }
    
    return expr;
  }

  function parseMultiplicative(): Expression {
    let left = parsePostfix();
    
    while (match('star', 'slash', 'percent')) {
      const operator = currentToken();
      current++;
      const right = parsePostfix();
      
      left = {
        kind: 'BinaryExpr',
        left,
        operator: operator.type === 'star' ? '*' : operator.type === 'slash' ? '/' : '%',
        right,
        line: operator.line,
        column: operator.column
      };
    }
    
    return left;
  }

  function parseAdditive(): Expression {
    let left = parseMultiplicative();
    
    while (match('plus', 'minus')) {
      const operator = currentToken();
      current++;
      const right = parseMultiplicative();
      
      left = {
        kind: 'BinaryExpr',
        left,
        operator: operator.type === 'plus' ? '+' : '-',
        right,
        line: operator.line,
        column: operator.column
      };
    }
    
    return left;
  }

  function parseComparison(): Expression {
    let left = parseAdditive();
    
    while (match('eq', 'neq', 'lt', 'gt', 'lte', 'gte')) {
      const operator = currentToken();
      current++;
      const right = parseAdditive();
      
      const opMap: Record<string, any> = {
        'eq': '==',
        'neq': '!=',
        'lt': '<',
        'gt': '>',
        'lte': '<=',
        'gte': '>='
      };
      
      left = {
        kind: 'BinaryExpr',
        left,
        operator: opMap[operator.type],
        right,
        line: operator.line,
        column: operator.column
      };
    }
    
    return left;
  }

  function parseExpression(): Expression {
    return parseComparison();
  }

  // Statement parsing
  function parseVarDecl(): VarDecl {
    const start = consume('kw_var', "Expected 'var'");
    const name = consume('identifier', "Expected variable name");
    consume('assign', "Expected '=' after variable name");
    const value = parseExpression();
    consume('semicolon', "Expected ';' after variable declaration");
    
    return {
      kind: 'VarDecl',
      name: name.value!,
      value,
      line: start.line,
      column: start.column
    };
  }

  // Stage 1F: Parse function declarations
  function parseFunctionDecl(): FunctionDecl {
    const start = consume('kw_function', "Expected 'function'");
    const name = consume('identifier', "Expected function name");
    consume('lparen', "Expected '(' after function name");
    
    const params: string[] = [];
    if (!match('rparen')) {
      const param = consume('identifier', "Expected parameter name");
      params.push(param.value!);
      
      while (match('comma')) {
        current++; // consume ','
        const nextParam = consume('identifier', "Expected parameter name");
        params.push(nextParam.value!);
      }
    }
    
    consume('rparen', "Expected ')' after parameters");
    const body = parseBlock();
    
    return {
      kind: 'FunctionDecl',
      name: name.value!,
      params,
      body: body.body,
      line: start.line,
      column: start.column
    };
  }

  // Stage 1F: Parse return statements
  function parseReturnStmt(): ReturnStmt {
    const start = consume('kw_return', "Expected 'return'");
    
    let value: Expression | null = null;
    if (!match('semicolon')) {
      value = parseExpression();
    }
    
    consume('semicolon', "Expected ';' after return statement");
    
    return {
      kind: 'Return',
      value,
      line: start.line,
      column: start.column
    };
  }

  function parseBlock(): BlockStmt {
    const start = consume('lbrace', "Expected '{'");
    const body: Statement[] = [];
    
    while (!match('rbrace') && !isAtEnd()) {
      const stmt = parseStatement();
      if (stmt) body.push(stmt);
    }
    
    consume('rbrace', "Expected '}'");
    
    return {
      kind: 'Block',
      body,
      line: start.line,
      column: start.column
    };
  }

  function parseIf(): IfStmt {
    const start = consume('kw_if', "Expected 'if'");
    consume('lparen', "Expected '(' after 'if'");
    const test = parseExpression();
    consume('rparen', "Expected ')' after if condition");
    
    const then = parseBlock();
    let otherwise: BlockStmt | undefined;
    
    if (match('kw_else')) {
      current++; // consume 'else'
      otherwise = parseBlock();
    }
    
    return {
      kind: 'If',
      test,
      then,
      otherwise,
      line: start.line,
      column: start.column
    };
  }

  function parseWhile(): WhileStmt {
    const start = consume('kw_while', "Expected 'while'");
    consume('lparen', "Expected '(' after 'while'");
    const test = parseExpression();
    consume('rparen', "Expected ')' after while condition");
    const body = parseBlock();
    
    return {
      kind: 'While',
      test,
      body,
      line: start.line,
      column: start.column
    };
  }

  function parseFor(): ForStmt | ForOfStmt | ForInStmt {
    const start = consume('kw_for', "Expected 'for'");
    consume('lparen', "Expected '(' after 'for'");
    
    // Stage 1H: Lookahead for for-in: var IDENT in ...
    if (match('kw_var')) {
      const save = current;
      current++; // consume 'var'
      
      if (match('identifier')) {
        const nameTok = tokens[current++];
        if (match('kw_in')) {
          current++; // consume 'in'
          const object = parseExpression();
          consume('rparen', "Expected ')' after object");
          const body = parseBlock();
          
          return {
            kind: 'ForIn',
            varName: nameTok.value!,
            object,
            body: body.body,
            line: start.line,
            column: start.column
          };
        }
      }
      
      // Not a for-in; rewind to check for for-of
      current = save;
      
      if (match('kw_var')) {
        const save2 = current;
        current++; // consume 'var'
        
        if (match('identifier')) {
          const nameTok = tokens[current++];
          if (match('kw_of')) {
            current++; // consume 'of'
            const iterable = parseExpression();
            consume('rparen', "Expected ')' after iterable");
            const body = parseBlock();
            
            return {
              kind: 'ForOf',
              varName: nameTok.value!,
              iterable,
              body: body.body,
              line: start.line,
              column: start.column
            };
          }
        }
        
        // Not a for-of; rewind to parse classic for
        current = save2;
      }
    }
    
    // Classic for(init; test; post)
    let init: Statement | null = null;
    if (!match('semicolon')) {
      init = parseStatement();
    } else {
      consume('semicolon', "Expected ';'");
    }
    
    let test: Expression | null = null;
    if (!match('semicolon')) {
      test = parseExpression();
    }
    consume('semicolon', "Expected ';'");
    
    let post: Statement | null = null;
    if (!match('rparen')) {
      post = parseStatement();
    }
    consume('rparen', "Expected ')'");
    
    const body = parseBlock();
    
    return {
      kind: 'For',
      init,
      test,
      post,
      body,
      line: start.line,
      column: start.column
    };
  }

  function parseRuleDecl(): RuleDecl {
    const start = consume('kw_rule', "Expected 'rule'");
    const name = consume('identifier', "Expected rule name");
    const body = parseBlock();
    
    return {
      kind: 'RuleDecl',
      name: name.value!,
      body: body.body,
      line: start.line,
      column: start.column
    };
  }

  function parseBuiltinStatement(): Statement | null {
    const token = currentToken();
    
    if (token.type === 'identifier') {
      const name = token.value!.toLowerCase();
      
      if (name === 'set' || name === 'toggle') {
        current++; // consume identifier
        consume('lparen', "Expected '('");
        const x = parseExpression();
        consume('comma', "Expected ','");
        const y = parseExpression();
        consume('rparen', "Expected ')'");
        consume('semicolon', "Expected ';'");
        
        return name === 'set' ? {
          kind: 'Set',
          x,
          y,
          line: token.line,
          column: token.column
        } : {
          kind: 'Toggle',
          x,
          y,
          line: token.line,
          column: token.column
        };
      }
      
      if (name === 'clear') {
        current++; // consume identifier
        consume('lparen', "Expected '('");
        consume('rparen', "Expected ')'");
        consume('semicolon', "Expected ';'");
        
        return {
          kind: 'Clear',
          line: token.line,
          column: token.column
        };
      }
      
      if (name === 'step') {
        current++; // consume identifier
        consume('lparen', "Expected '('");
        consume('rparen', "Expected ')'");
        consume('semicolon', "Expected ';'");
        
        return {
          kind: 'Step',
          line: token.line,
          column: token.column
        };
      }
      
      // Must be an expression statement
      const expr = parseExpression();
      consume('semicolon', "Expected ';' after expression");
      
      return {
        kind: 'ExprStmt',
        expression: expr,
        line: token.line,
        column: token.column
      };
    }
    
    return null;
  }

  function parseStatement(): Statement | null {
    if (match('kw_var')) return parseVarDecl();
    if (match('kw_rule')) return parseRuleDecl();
    if (match('kw_function')) return parseFunctionDecl(); // Stage 1F: Add function parsing
    if (match('kw_return')) return parseReturnStmt();     // Stage 1F: Add return parsing
    if (match('kw_if')) return parseIf();
    if (match('kw_while')) return parseWhile();
    if (match('kw_for')) return parseFor();
    if (match('lbrace')) return parseBlock();
    if (match('identifier')) return parseBuiltinStatement();
    if (match('semicolon')) { current++; return null; }
    if (isAtEnd()) return null;
    
    // Error recovery
    const token = currentToken();
    errors.push({
      message: 'Unexpected token',
      line: token.line,
      column: token.column,
      severity: 'error'
    });
    current++;
    return null;
  }

  // Parse the entire program
  const body: Statement[] = [];
  while (!isAtEnd()) {
    const stmt = parseStatement();
    if (stmt) body.push(stmt);
  }

  return {
    program: { source, ast: { body } },
    errors
  };
}
