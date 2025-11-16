// Response Engine for SpiñO
// Generates emotionally intelligent and directive responses

export interface ResponseContext {
  userInput: string;
  emotionalState?: any;
  logicAnalysis?: any;
  therapeuticStage?: string;
  onionLayer?: string;
}

export class SpinoResponseEngine {
  
  constructor() {
    // Initialize response generation system
  }

  generateResponse(context: ResponseContext): {
    response: string;
    directive: string;
    investigation: string;
    clarity: string;
  } {
    const { userInput, emotionalState, logicAnalysis, therapeuticStage, onionLayer } = context;

    // Generate directive response
    const directive = this.generateDirective(userInput, emotionalState);

    // Generate investigation question
    const investigation = this.generateInvestigation(userInput, emotionalState);

    // Generate clarity guidance
    const clarity = this.generateClarity(userInput, emotionalState);

    // Combine into final response
    const response = this.combineResponse(directive, investigation, clarity);

    return {
      response,
      directive,
      investigation,
      clarity
    };
  }

  private generateDirective(userInput: string, emotionalState?: any): string {
    if (!emotionalState) {
      return "Let's identify what's causing this feeling.";
    }

    const { primaryEmotion, causalPattern, inadequacySignature } = emotionalState;

    // Generate directive based on emotional state
    switch (primaryEmotion.toLowerCase()) {
      case 'sadness':
        return `Your sadness indicates a disconnect between your understanding and reality. Let's trace the specific cause.`;
      
      case 'fear':
        return `Your fear suggests uncertainty about causes. Let's identify what's truly threatening.`;
      
      case 'anger':
        return `Your anger points to a perceived injustice. Let's examine what you believe should be different.`;
      
      case 'despair':
        return `Your despair reflects a belief that nothing can change. Let's challenge that assumption.`;
      
      case 'joy':
        return `Your joy shows clarity of cause. Let's deepen this understanding.`;
      
      default:
        return `Let's identify what's causing this feeling.`;
    }
  }

  private generateInvestigation(userInput: string, emotionalState?: any): string {
    if (!emotionalState) {
      return "What specific aspect of this situation feels most unclear to you?";
    }

    const { primaryEmotion, causalPattern } = emotionalState;

    // Generate investigation questions based on emotional pattern
    switch (primaryEmotion.toLowerCase()) {
      case 'sadness':
        if (causalPattern.includes('Loss of Meaning')) {
          return "What used to give your actions meaning?";
        } else if (causalPattern.includes('Unmet Expectations')) {
          return "What did you expect to happen that didn't?";
        } else if (causalPattern.includes('Loneliness')) {
          return "When do you feel most understood?";
        }
        break;
      
      case 'fear':
        if (causalPattern.includes('Uncertainty of Cause')) {
          return "What exactly do you believe might happen?";
        } else if (causalPattern.includes('Loss of Control')) {
          return "What do you think you need to control?";
        }
        break;
      
      case 'anger':
        if (causalPattern.includes('Perceived Injustice')) {
          return "What standard do you believe was violated?";
        } else if (causalPattern.includes('Blocked Causality')) {
          return "What do you think is preventing your expression?";
        }
        break;
      
      case 'despair':
        if (causalPattern.includes('Causal Exhaustion')) {
          return "What makes you believe nothing can change?";
        } else if (causalPattern.includes('Terminal Hopelessness')) {
          return "When did you first believe joy was impossible?";
        }
        break;
    }

    return "What specific aspect of this situation feels most unclear to you?";
  }

  private generateClarity(userInput: string, emotionalState?: any): string {
    if (!emotionalState) {
      return "Understanding the cause will bring clarity.";
    }

    const { reconstructionPath } = emotionalState;

    if (reconstructionPath) {
      return reconstructionPath;
    }

    return "Understanding the cause will bring clarity.";
  }

  private combineResponse(directive: string, investigation: string, clarity: string): string {
    // Combine elements into a coherent response
    let response = directive;
    
    if (investigation) {
      response += ` ${investigation}`;
    }
    
    if (clarity && !response.includes(clarity)) {
      response += ` ${clarity}`;
    }

    return response;
  }

  // Response templates for different therapeutic stages
  generateIdentificationResponse(userInput: string, emotionalState?: any): string {
    return this.generateResponse({
      userInput,
      emotionalState,
      therapeuticStage: 'identification'
    }).response;
  }

  generateDeconstructionResponse(userInput: string, emotionalState?: any): string {
    return this.generateResponse({
      userInput,
      emotionalState,
      therapeuticStage: 'deconstruction'
    }).response;
  }

  generateReconstructionResponse(userInput: string, emotionalState?: any): string {
    return this.generateResponse({
      userInput,
      emotionalState,
      therapeuticStage: 'reconstruction'
    }).response;
  }

  // Quality control for responses
  validateResponse(response: string): boolean {
    // Check for common issues
    const issues = [
      response.length < 10,
      response.includes('generic'),
      response.includes('philosophical'),
      response.includes('should'),
      response.includes('need to'),
      !response.includes('?') && !response.includes('Let\'s')
    ];

    return !issues.some(issue => issue);
  }
} 