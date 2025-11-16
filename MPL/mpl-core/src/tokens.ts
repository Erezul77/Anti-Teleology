export type TokenType =
  | "identifier" | "number" | "string"
  | "lparen" | "rparen" | "lbrace" | "rbrace" | "lbracket" | "rbracket" | "comma" | "semicolon" | "assign" | "colon" | "dot"
  | "plus" | "minus" | "star" | "slash" | "percent"
  | "eq" | "neq" | "lt" | "gt" | "lte" | "gte"
  | "kw_var" | "kw_rule" | "kw_function" | "kw_return" | "kw_if" | "kw_else" | "kw_while" | "kw_for" | "kw_of" | "kw_in"
  | "eof";

export interface Token { 
  type: TokenType; 
  value?: string; 
  line: number; 
  column: number; 
}

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0, line = 1, col = 1;
  
  const push = (type: TokenType, value?: string) => {
    tokens.push({ type, value, line, column: col });
  };
  
  const advance = (n = 1) => {
    while (n--) {
      const ch = source[i++];
      if (ch === "\n") {
        line++;
        col = 1;
      } else {
        col++;
      }
    }
  };
  
  const peek = () => source[i];
  const peek2 = () => source[i + 1];

  while (i < source.length) {
    const ch = peek();
    
    // Skip whitespace
    if (ch === " " || ch === "\t" || ch === "\r") {
      advance();
      continue;
    }
    
    // Skip newlines
    if (ch === "\n") {
      advance();
      continue;
    }
    
    // Skip comments
    if (ch === "/" && peek2() === "/") {
      while (i < source.length && peek() !== "\n") advance();
      continue;
    }

    // Single character tokens
    if (ch === "(") { push("lparen"); advance(); continue; }
    if (ch === ")") { push("rparen"); advance(); continue; }
    if (ch === "{") { push("lbrace"); advance(); continue; }
    if (ch === "}") { push("rbrace"); advance(); continue; }
    if (ch === "[") { push("lbracket"); advance(); continue; } // Stage 1G: Array brackets
    if (ch === "]") { push("rbracket"); advance(); continue; } // Stage 1G: Array brackets
    if (ch === ",") { push("comma"); advance(); continue; }
    if (ch === ";") { push("semicolon"); advance(); continue; }
    if (ch === ":") { push("colon"); advance(); continue; } // Stage 1H: Object property separator
    if (ch === ".") { push("dot"); advance(); continue; }   // Stage 1H: Property access separator
    
    // Assignment and equality
    if (ch === "=") {
      if (peek2() === "=") {
        advance(2);
        push("eq");
      } else {
        advance();
        push("assign");
      }
      continue;
    }
    
    // Not equals
    if (ch === "!") {
      if (peek2() === "=") {
        advance(2);
        push("neq");
      } else {
        advance();
      }
      continue;
    }
    
    // Arithmetic operators
    if (ch === "+") { push("plus"); advance(); continue; }
    if (ch === "-") { push("minus"); advance(); continue; }
    if (ch === "*") { push("star"); advance(); continue; }
    if (ch === "/") { push("slash"); advance(); continue; }
    if (ch === "%") { push("percent"); advance(); continue; }
    
    // Comparison operators
    if (ch === "<") {
      if (peek2() === "=") {
        advance(2);
        push("lte");
      } else {
        advance();
        push("lt");
      }
      continue;
    }
    
    if (ch === ">") {
      if (peek2() === "=") {
        advance(2);
        push("gte");
      } else {
        advance();
        push("gt");
      }
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      let s = "";
      const startCol = col;
      while (/[0-9]/.test(peek())) {
        s += peek();
        advance();
      }
      tokens.push({ type: "number", value: s, line, column: startCol });
      continue;
    }
    
    // Stage 1I: String literals
    if (ch === '"') {
      let s = "";
      const startCol = col;
      advance(); // consume opening quote
      
      while (i < source.length && peek() !== '"') {
        if (peek() === '\\') {
          advance(); // consume backslash
          if (i < source.length) {
            const next = peek();
            if (next === 'n') s += '\n';
            else if (next === 't') s += '\t';
            else if (next === 'r') s += '\r';
            else if (next === '\\') s += '\\';
            else if (next === '"') s += '"';
            else s += '\\' + next;
            advance();
          }
        } else {
          s += peek();
          advance();
        }
      }
      
      if (i < source.length && peek() === '"') {
        advance(); // consume closing quote
        tokens.push({ type: "string", value: s, line, column: startCol });
      } else {
        // Unterminated string
        tokens.push({ type: "string", value: s, line, column: startCol });
      }
      continue;
    }
    
    // Identifiers and keywords
    if (/[A-Za-z_]/.test(ch)) {
      let s = "";
      const startCol = col;
      while (/[A-Za-z0-9_]/.test(peek())) {
        s += peek();
        advance();
      }
      
      // Check for keywords
      if (s === "var") {
        tokens.push({ type: "kw_var", line, column: startCol });
      } else if (s === "rule") {
        tokens.push({ type: "kw_rule", line, column: startCol });
      } else if (s === "function") {
        tokens.push({ type: "kw_function", line, column: startCol });
      } else if (s === "return") {
        tokens.push({ type: "kw_return", line, column: startCol });
      } else if (s === "if") {
        tokens.push({ type: "kw_if", line, column: startCol });
      } else if (s === "else") {
        tokens.push({ type: "kw_else", line, column: startCol });
      } else if (s === "while") {
        tokens.push({ type: "kw_while", line, column: startCol });
      } else if (s === "for") {
        tokens.push({ type: "kw_for", line, column: startCol });
      } else if (s === "of") {
        tokens.push({ type: "kw_of", line, column: startCol }); // Stage 1G: Add 'of' keyword
      } else if (s === "in") {
        tokens.push({ type: "kw_in", line, column: startCol }); // Stage 1H: Add 'in' keyword
      } else {
        tokens.push({ type: "identifier", value: s, line, column: startCol });
      }
      continue;
    }

    // Skip unknown characters
    advance();
  }
  
  tokens.push({ type: "eof", line, column: col });
  return tokens;
}
