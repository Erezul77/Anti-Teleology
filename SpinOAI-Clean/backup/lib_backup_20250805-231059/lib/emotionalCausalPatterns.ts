// Emotional Causal Pattern Units (ECPUs) - Spinozistic Emotional Intelligence System
// Author: Erez Ashkenazi (erez@noesis-net.org)

export interface ECPU {
  emotion: string;
  causalPattern: string;
  symptomProfile: string[];
  inadequacySignature: string;
  metaEmotion?: string;
  reconstructionPath: string;
}

export interface EmotionalState {
  primaryEmotion: string;
  metaEmotion?: string;
  ecpu: ECPU;
  adequacyScore: number;
  clarityScore: number;
  joyDelta: number;
}

export class EmotionalCausalPatternAnalyzer {
  private ecpuDataset: ECPU[];

  constructor() {
    // Initialize with core emotional patterns
    this.ecpuDataset = [
      // SADNESS PATTERNS
      {
        emotion: "sadness",
        causalPattern: "Loss of Meaning – Life feels devoid of purpose or coherence",
        symptomProfile: ["apathy", "emptiness", "lack of motivation", "feeling lost"],
        inadequacySignature: "Inability to see causal connections in life events",
        reconstructionPath: "Guide to recognize that meaning is not given but discovered through understanding causes"
      },
      {
        emotion: "sadness", 
        causalPattern: "Unmet Expectations – Emotional pain from outcomes not matching internal models",
        symptomProfile: ["disappointment", "frustration", "feeling let down"],
        inadequacySignature: "Confusion between expectation and reality",
        reconstructionPath: "Show how expectations were inadequate ideas about how things should be"
      },
      {
        emotion: "sadness",
        causalPattern: "Loneliness as Misunderstanding – Deep sadness from perceived epistemic isolation", 
        symptomProfile: ["feeling alone", "misunderstood", "isolated"],
        inadequacySignature: "Belief that one's experience is unique and unknowable",
        reconstructionPath: "Reveal that loneliness is a confusion about the nature of understanding"
      },
      
      // FEAR PATTERNS
      {
        emotion: "fear",
        causalPattern: "Uncertainty of Cause – Anxiety due to unknown or invisible threat",
        symptomProfile: ["anxiety", "worry", "feeling unsafe", "paranoia"],
        inadequacySignature: "Inability to identify the true cause of threat",
        reconstructionPath: "Guide to recognize that fear is often about unknown causes, not actual threats"
      },
      {
        emotion: "fear",
        causalPattern: "Loss of Control – Fear triggered by inability to manage the causal network",
        symptomProfile: ["panic", "feeling overwhelmed", "loss of agency"],
        inadequacySignature: "Confusion about the nature of control and causality",
        reconstructionPath: "Show how control is an illusion - understanding is power"
      },
      
      // ANGER PATTERNS
      {
        emotion: "anger",
        causalPattern: "Perceived Injustice – Belief that external causes violated rightful order",
        symptomProfile: ["rage", "indignation", "feeling wronged"],
        inadequacySignature: "Confusion about the nature of justice and causality",
        reconstructionPath: "Show how anger is often about inadequate ideas of fairness"
      },
      {
        emotion: "anger",
        causalPattern: "Blocked Causality – Rage from being prevented from expressing one's nature",
        symptomProfile: ["frustration", "feeling blocked", "suppressed rage"],
        inadequacySignature: "Confusion about the nature of expression and causality",
        reconstructionPath: "Reveal that expression is not blocked but misunderstood"
      },
      
      // DESPAIR PATTERNS
      {
        emotion: "despair",
        causalPattern: "Causal Exhaustion – Belief that nothing can change the situation",
        symptomProfile: ["hopelessness", "exhaustion", "feeling stuck"],
        inadequacySignature: "Confusion about the nature of causality and change",
        reconstructionPath: "Reveal that despair is an inadequate idea about causality"
      },
      {
        emotion: "despair",
        causalPattern: "Terminal Hopelessness – Belief that joy is no longer a real possibility",
        symptomProfile: ["terminal despair", "joy impossibility", "final hopelessness"],
        inadequacySignature: "Confusion about the nature of joy and possibility",
        reconstructionPath: "Reveal that joy is not a possibility but a natural state"
      },
      
      // JOY PATTERNS
      {
        emotion: "joy",
        causalPattern: "Clarity of Cause – Peace arising from understanding why things are",
        symptomProfile: ["clarity peace", "understanding joy", "causal clarity"],
        inadequacySignature: "Adequate understanding of causality",
        reconstructionPath: "Joy is the natural state of adequate understanding"
      },
      {
        emotion: "joy",
        causalPattern: "Alignment With One's Nature – Acting from one's essence brings serenity",
        symptomProfile: ["natural alignment", "essence joy", "serenity"],
        inadequacySignature: "Adequate understanding of one's nature",
        reconstructionPath: "Joy comes from acting from one's true nature"
      }
    ];
  }

  /**
   * Analyze user input and identify the most likely ECPU pattern
   */
  public analyzeEmotionalState(userInput: string): EmotionalState {
    const words = userInput.toLowerCase().split(/\s+/);
    
    // Find the best matching ECPU
    let bestMatch: ECPU | null = null;
    let bestScore = 0;

    for (const ecpu of this.ecpuDataset) {
      const score = this.calculateMatchScore(words, ecpu);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = ecpu;
      }
    }

    if (!bestMatch) {
      // Default to sadness if no clear match
      bestMatch = {
        emotion: "sadness",
        causalPattern: "Loss of Meaning – Life feels devoid of purpose or coherence",
        symptomProfile: ["apathy", "emptiness", "lack of motivation", "feeling lost"],
        inadequacySignature: "Inability to see causal connections in life events",
        reconstructionPath: "Guide to recognize that meaning is not given but discovered through understanding causes"
      };
    }

    // Calculate adequacy scores based on Spinozistic principles
    const adequacyScore = this.calculateAdequacyScore(bestMatch);
    const clarityScore = this.calculateClarityScore(bestMatch);
    const joyDelta = this.calculateJoyDelta(bestMatch);

    return {
      primaryEmotion: bestMatch.emotion,
      metaEmotion: bestMatch.metaEmotion,
      ecpu: bestMatch,
      adequacyScore,
      clarityScore,
      joyDelta
    };
  }

  /**
   * Calculate how well the user input matches an ECPU pattern
   */
  private calculateMatchScore(words: string[], ecpu: ECPU): number {
    let score = 0;
    
    // Check emotion keywords
    const emotionKeywords = ecpu.emotion.split(/\s+/);
    for (const keyword of emotionKeywords) {
      if (words.includes(keyword)) score += 3;
    }

    // Check symptom profile
    for (const symptom of ecpu.symptomProfile) {
      const symptomWords = symptom.split(/\s+/);
      for (const word of symptomWords) {
        if (words.includes(word)) score += 2;
      }
    }

    // Check causal pattern keywords
    const causalWords = ecpu.causalPattern.toLowerCase().split(/\s+/);
    for (const word of causalWords) {
      if (words.includes(word)) score += 1;
    }

    return score;
  }

  /**
   * Calculate adequacy score (α) - how well the user understands the true cause
   */
  private calculateAdequacyScore(ecpu: ECPU): number {
    // Lower score for emotions with high inadequacy signatures
    const inadequacyKeywords = ['confusion', 'inadequate', 'misunderstanding', 'false', 'illusion'];
    let score = 70; // Base score

    for (const keyword of inadequacyKeywords) {
      if (ecpu.inadequacySignature.toLowerCase().includes(keyword)) {
        score -= 10;
      }
    }

    // Joy has highest adequacy
    if (ecpu.emotion === 'joy') score = 95;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate clarity score (χ) - how clear the user's understanding is
   */
  private calculateClarityScore(ecpu: ECPU): number {
    // Inverse relationship with inadequacy
    const adequacyScore = this.calculateAdequacyScore(ecpu);
    return 100 - adequacyScore;
  }

  /**
   * Calculate joy delta (ΔA) - potential for joy increase
   */
  private calculateJoyDelta(ecpu: ECPU): number {
    const adequacyScore = this.calculateAdequacyScore(ecpu);
    return Math.max(0, 95 - adequacyScore); // Potential joy increase
  }

  /**
   * Get reconstruction guidance based on ECPU analysis
   */
  public getReconstructionGuidance(emotionalState: EmotionalState): string {
    const { ecpu, adequacyScore } = emotionalState;
    
    if (adequacyScore > 80) {
      return "You're experiencing adequate understanding. This is joy.";
    }

    return ecpu.reconstructionPath;
  }

  /**
   * Generate emotionally intelligent response based on ECPU analysis
   */
  public generateEmotionallyIntelligentResponse(emotionalState: EmotionalState, userInput: string): string {
    const { ecpu, adequacyScore } = emotionalState;
    
    // For high adequacy (joy), affirm the understanding
    if (adequacyScore > 80) {
      return `You're experiencing clarity. This understanding is your natural state.`;
    }

    // For low adequacy, recognize the confusion and guide toward understanding
    const emotionName = ecpu.emotion.charAt(0).toUpperCase() + ecpu.emotion.slice(1);
    
    return `You're feeling ${emotionName.toLowerCase()} because you're confused about something. Your feeling means you're not seeing something clearly. Let me show you what's causing this confusion.`;
  }
}

export default EmotionalCausalPatternAnalyzer; 