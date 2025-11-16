// Emotional Intelligence Types
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
  primaryAffect?: string; // For backward compatibility
  metaEmotion?: string;
  ecpu?: ECPU;
  adequacyScore: number;
  clarityScore: number;
  joyDelta: number;
  intensity?: number;
  powerChange?: number;
  bondageLevel?: 'high' | 'medium' | 'low';
  freedomRatio?: number;
  transformationPotential?: number;
  blessednessLevel?: number;
}

// Unified System Types
export interface UnifiedAdequacyScore {
  spinoAdequacy: {
    alpha: number;
    deltaAlpha: number;
    chi: number;
  };
  noesisAdequacy: {
    substance: number;
    imagination: number;
    reason: number;
    intuition: number;
    freedom: number;
    blessedness: number;
    total: number;
  };
  unifiedScore: number;
  confidence: number;
}

export enum TherapeuticStage {
  IDENTIFICATION = 'identification',
  DECONSTRUCTION = 'deconstruction',
  RECONSTRUCTION = 'reconstruction'
}

export enum OnionLayer {
  SURFACE = 'surface',
  SUBSTANCE = 'substance',
  MODE = 'mode',
  ATTRIBUTE = 'attribute'
}

export interface UnifiedMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  adequacyScore?: UnifiedAdequacyScore;
  emotionalState?: EmotionalState;
  therapeuticStage?: TherapeuticStage;
  onionLayer?: OnionLayer;
  causalChain?: string[];
  detailedAnalysis?: string;
  realTimeAnalysis?: RealTimeAnalysis;
}

export interface RealTimeAnalysis {
  timestamp: Date;
  adequacyScore: UnifiedAdequacyScore;
  emotionalState: EmotionalState;
  therapeuticStage: TherapeuticStage;
  onionLayer: OnionLayer;
  processingTime: number;
  confidence: number;
}

// Causal reasoning types
export interface CausalLink {
  cause: string;
  effect: string;
  confidence: number;
}

// Stage progression type
export interface StageProgression {
  previousStage: TherapeuticStage;
  nextStage: TherapeuticStage;
  confidence: number;
  notes?: string;
}

// Response generation result type
export interface ResponseGenerationResult {
  response: string;
  directive: string;
  investigation: string;
  clarity: string;
}

// Logic analysis type
export interface LogicAnalysis {
  adequacyAnalysis: string;
  clarityAnalysis: string;
  joyAnalysis: string;
  causalChain: string[];
  recommendations: string[];
}

// Response generation request type
export interface ResponseGenerationRequest {
  userInput: string;
  emotionalState?: EmotionalState;
  logicAnalysis?: LogicAnalysis;
  therapeuticStage?: TherapeuticStage;
  onionLayer?: OnionLayer;
} 