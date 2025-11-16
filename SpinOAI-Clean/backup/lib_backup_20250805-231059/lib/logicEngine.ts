// Logic Engine for SpiñO
// Processes Spinozistic logic and causal reasoning

export interface LogicContext {
  userInput: string;
  emotionalState?: any;
  adequacyScore?: number;
  clarityScore?: number;
  joyDelta?: number;
}

export class SpinoLogicEngine {
  
  constructor() {
    // Initialize logic processing system
  }

  processLogic(context: LogicContext): {
    adequacyAnalysis: string;
    clarityAnalysis: string;
    joyAnalysis: string;
    causalChain: string[];
    recommendations: string[];
  } {
    const { userInput, emotionalState, adequacyScore, clarityScore, joyDelta } = context;

    // Analyze adequacy (α)
    const adequacyAnalysis = this.analyzeAdequacy(adequacyScore || 0, emotionalState);

    // Analyze clarity (χ)
    const clarityAnalysis = this.analyzeClarity(clarityScore || 0, userInput);

    // Analyze joy potential (ΔA)
    const joyAnalysis = this.analyzeJoyDelta(joyDelta || 0, emotionalState);

    // Extract causal chain
    const causalChain = this.extractCausalChain(userInput, emotionalState);

    // Generate recommendations
    const recommendations = this.generateRecommendations(context);

    return {
      adequacyAnalysis,
      clarityAnalysis,
      joyAnalysis,
      causalChain,
      recommendations
    };
  }

  private analyzeAdequacy(score: number, emotionalState?: any): string {
    if (score >= 80) {
      return "High adequacy - clear understanding of causal relationships";
    } else if (score >= 60) {
      return "Moderate adequacy - some clarity but room for improvement";
    } else if (score >= 40) {
      return "Low adequacy - significant confusion about causes";
    } else {
      return "Very low adequacy - major inadequacy in understanding";
    }
  }

  private analyzeClarity(score: number, userInput: string): string {
    if (score >= 80) {
      return "High clarity - clear expression of understanding";
    } else if (score >= 60) {
      return "Moderate clarity - some confusion in expression";
    } else if (score >= 40) {
      return "Low clarity - significant confusion in communication";
    } else {
      return "Very low clarity - major inadequacy in expression";
    }
  }

  private analyzeJoyDelta(score: number, emotionalState?: any): string {
    if (score > 0) {
      return `Positive joy potential (+${score}) - movement toward adequacy`;
    } else if (score < 0) {
      return `Negative joy potential (${score}) - movement away from adequacy`;
    } else {
      return "Neutral joy potential - no significant movement";
    }
  }

  private extractCausalChain(userInput: string, emotionalState?: any): string[] {
    const chain: string[] = [];
    
    // Extract causal patterns from user input
    if (userInput.toLowerCase().includes('because')) {
      chain.push("User identifies a cause");
    }
    
    if (userInput.toLowerCase().includes('feel')) {
      chain.push("User reports emotional state");
    }
    
    if (userInput.toLowerCase().includes('think')) {
      chain.push("User reports cognitive state");
    }

    // Add emotional state analysis if available
    if (emotionalState?.causalPattern) {
      chain.push(`Emotional pattern: ${emotionalState.causalPattern}`);
    }

    return chain;
  }

  private generateRecommendations(context: LogicContext): string[] {
    const recommendations: string[] = [];
    const { adequacyScore = 0, clarityScore = 0, emotionalState } = context;

    // Adequacy-based recommendations
    if (adequacyScore < 60) {
      recommendations.push("Guide user to identify specific causes");
      recommendations.push("Help trace causal relationships");
    }

    // Clarity-based recommendations
    if (clarityScore < 60) {
      recommendations.push("Encourage clearer expression of thoughts");
      recommendations.push("Help user articulate their confusion");
    }

    // Emotional state recommendations
    if (emotionalState?.inadequacySignature) {
      recommendations.push(`Address inadequacy: ${emotionalState.inadequacySignature}`);
    }

    return recommendations;
  }

  // Spinozistic reasoning methods
  calculateAdequacy(ideas: string[]): number {
    // Simplified adequacy calculation
    const adequateIdeas = ideas.filter(idea => 
      idea.includes('cause') || idea.includes('because') || idea.includes('why')
    ).length;
    
    return (adequateIdeas / ideas.length) * 100;
  }

  calculateClarity(expression: string): number {
    // Simplified clarity calculation
    const clearIndicators = ['because', 'since', 'therefore', 'thus', 'hence'];
    const clarityScore = clearIndicators.filter(indicator => 
      expression.toLowerCase().includes(indicator)
    ).length;
    
    return Math.min(clarityScore * 20, 100);
  }

  calculateJoyDelta(currentAdequacy: number, previousAdequacy: number): number {
    return currentAdequacy - previousAdequacy;
  }
} 