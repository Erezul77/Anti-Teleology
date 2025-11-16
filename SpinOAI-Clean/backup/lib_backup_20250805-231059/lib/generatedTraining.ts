// Generated Training System for SpiñO
// Creates training data from Spinozistic principles and ECPU patterns

export interface TrainingExample {
  userInput: string;
  expectedResponse: string;
  emotionalState: any;
  adequacyScore: number;
  clarityScore: number;
  joyDelta: number;
  therapeuticStage: string;
  onionLayer: string;
}

export class GeneratedTrainingSystem {
  
  private trainingExamples: TrainingExample[] = [];
  
  constructor() {
    this.initializeTrainingData();
  }

  // Export training examples for external use
  public static get TRAINING_EXAMPLES(): TrainingExample[] {
    const system = new GeneratedTrainingSystem();
    return system.getTrainingExamples();
  }

  // Move this method inside the class
  private initializeTrainingData(): void {
    // Core training examples based on ECPU patterns
    // Sadness examples
    this.trainingExamples.push({
      userInput: "I feel like everything is meaningless",
      expectedResponse: "Your feeling of meaninglessness indicates a disconnect between your understanding and reality. What used to give your actions meaning?",
      emotionalState: {
        primaryEmotion: "sadness",
        causalPattern: "Loss of Meaning – Life feels devoid of purpose or coherence",
        inadequacySignature: "Inability to see causal connections in life events"
      },
      adequacyScore: 30,
      clarityScore: 40,
      joyDelta: -20,
      therapeuticStage: "identification",
      onionLayer: "substance"
    });
    this.trainingExamples.push({
      userInput: "I'm disappointed that things didn't work out as expected",
      expectedResponse: "Your disappointment reveals a gap between your expectations and reality. What did you expect to happen that didn't?",
      emotionalState: {
        primaryEmotion: "sadness",
        causalPattern: "Unmet Expectations – Emotional pain from outcomes not matching internal models",
        inadequacySignature: "Confusion between expectation and reality"
      },
      adequacyScore: 45,
      clarityScore: 60,
      joyDelta: -15,
      therapeuticStage: "identification",
      onionLayer: "substance"
    });
    // Fear examples
    this.trainingExamples.push({
      userInput: "I'm worried about what might happen",
      expectedResponse: "Your worry suggests uncertainty about causes. What exactly do you believe might happen?",
      emotionalState: {
        primaryEmotion: "fear",
        causalPattern: "Uncertainty of Cause – Anxiety due to unknown or invisible threat",
        inadequacySignature: "Inability to identify the true cause of threat"
      },
      adequacyScore: 35,
      clarityScore: 50,
      joyDelta: -25,
      therapeuticStage: "identification",
      onionLayer: "substance"
    });
    // Anger examples
    this.trainingExamples.push({
      userInput: "I'm angry because this isn't fair",
      expectedResponse: "Your anger points to a perceived injustice. What standard do you believe was violated?",
      emotionalState: {
        primaryEmotion: "anger",
        causalPattern: "Perceived Injustice – Belief that external causes violated rightful order",
        inadequacySignature: "Confusion about the nature of justice and causality"
      },
      adequacyScore: 40,
      clarityScore: 55,
      joyDelta: -10,
      therapeuticStage: "identification",
      onionLayer: "substance"
    });
    // Despair examples
    this.trainingExamples.push({
      userInput: "Nothing I do seems to make a difference",
      expectedResponse: "Your despair reflects a belief that nothing can change. What makes you believe nothing can change?",
      emotionalState: {
        primaryEmotion: "despair",
        causalPattern: "Causal Exhaustion – Belief that nothing can change the situation",
        inadequacySignature: "Confusion about the nature of causality and change"
      },
      adequacyScore: 25,
      clarityScore: 45,
      joyDelta: -30,
      therapeuticStage: "identification",
      onionLayer: "substance"
    });
    // Joy examples
    this.trainingExamples.push({
      userInput: "I finally understand why this happened",
      expectedResponse: "Your understanding shows clarity of cause. Let's deepen this understanding. What did you discover?",
      emotionalState: {
        primaryEmotion: "joy",
        causalPattern: "Clarity of Cause – Peace arising from understanding why things are",
        inadequacySignature: "Adequate understanding of causality"
      },
      adequacyScore: 85,
      clarityScore: 90,
      joyDelta: 15,
      therapeuticStage: "reconstruction",
      onionLayer: "substance"
    });
  }

  getTrainingExamples(): TrainingExample[] {
    return this.trainingExamples;
  }

  generateTrainingExample(userInput: string, emotionalState: any): TrainingExample {
    return {
      userInput,
      expectedResponse: this.generateExpectedResponse(userInput, emotionalState),
      emotionalState,
      adequacyScore: emotionalState?.adequacyScore || 50,
      clarityScore: emotionalState?.clarityScore || 50,
      joyDelta: emotionalState?.joyDelta || 0,
      therapeuticStage: this.determineTherapeuticStage(emotionalState),
      onionLayer: this.determineOnionLayer(emotionalState)
    };
  }

  private generateExpectedResponse(userInput: string, emotionalState: any): string {
    if (!emotionalState) {
      return "Let's identify what's causing this feeling. What specific aspect of this situation feels most unclear to you?";
    }

    const { primaryEmotion, causalPattern } = emotionalState;

    // Generate response based on emotional pattern
    switch (primaryEmotion.toLowerCase()) {
      case 'sadness':
        if (causalPattern.includes('Loss of Meaning')) {
          return "Your feeling of meaninglessness indicates a disconnect between your understanding and reality. What used to give your actions meaning?";
        } else if (causalPattern.includes('Unmet Expectations')) {
          return "Your disappointment reveals a gap between your expectations and reality. What did you expect to happen that didn't?";
        }
        break;
      
      case 'fear':
        if (causalPattern.includes('Uncertainty of Cause')) {
          return "Your worry suggests uncertainty about causes. What exactly do you believe might happen?";
        }
        break;
      
      case 'anger':
        if (causalPattern.includes('Perceived Injustice')) {
          return "Your anger points to a perceived injustice. What standard do you believe was violated?";
        }
        break;
      
      case 'despair':
        if (causalPattern.includes('Causal Exhaustion')) {
          return "Your despair reflects a belief that nothing can change. What makes you believe nothing can change?";
        }
        break;
      
      case 'joy':
        if (causalPattern.includes('Clarity of Cause')) {
          return "Your understanding shows clarity of cause. Let's deepen this understanding. What did you discover?";
        }
        break;
    }

    return "Let's identify what's causing this feeling. What specific aspect of this situation feels most unclear to you?";
  }

  private determineTherapeuticStage(emotionalState: any): string {
    if (!emotionalState) return 'identification';
    
    const adequacyScore = emotionalState.adequacyScore || 50;
    
    if (adequacyScore < 40) return 'identification';
    if (adequacyScore < 70) return 'deconstruction';
    return 'reconstruction';
  }

  private determineOnionLayer(emotionalState: any): string {
    if (!emotionalState) return 'substance';
    
    const clarityScore = emotionalState.clarityScore || 50;
    
    if (clarityScore < 40) return 'substance';
    if (clarityScore < 70) return 'mode';
    return 'attribute';
  }

  // Quality control for training data
  validateTrainingExample(example: TrainingExample): boolean {
    return (
      example.userInput.length > 0 &&
      example.expectedResponse.length > 0 &&
      example.adequacyScore >= 0 &&
      example.adequacyScore <= 100 &&
      example.clarityScore >= 0 &&
      example.clarityScore <= 100
    );
  }

  getTrainingStats(): {
    totalExamples: number;
    emotionDistribution: Record<string, number>;
    averageAdequacy: number;
    averageClarity: number;
  } {
    const emotionDistribution: Record<string, number> = {};
    let totalAdequacy = 0;
    let totalClarity = 0;

    this.trainingExamples.forEach(example => {
      const emotion = example.emotionalState?.primaryEmotion || 'unknown';
      emotionDistribution[emotion] = (emotionDistribution[emotion] || 0) + 1;
      totalAdequacy += example.adequacyScore;
      totalClarity += example.clarityScore;
    });

    return {
      totalExamples: this.trainingExamples.length,
      emotionDistribution,
      averageAdequacy: totalAdequacy / this.trainingExamples.length,
      averageClarity: totalClarity / this.trainingExamples.length
    };
  }
} 