// Spino Error Handler - Comprehensive Error Management with Graceful Degradation
// Handles edge cases, error recovery, and context-aware error messaging

import { UnifiedAdequacyScore, EmotionalState, TherapeuticStage, OnionLayer, CausalLink, StageProgression, ResponseGenerationResult } from './types'

// Error Types and Interfaces
export enum ErrorType {
  LOGIC_ERROR = 'logic_error',
  EMOTIONAL_ANALYSIS_ERROR = 'emotional_analysis_error',
  CAUSAL_CHAIN_ERROR = 'causal_chain_error',
  STAGE_PROGRESSION_ERROR = 'stage_progression_error',
  RESPONSE_GENERATION_ERROR = 'response_generation_error',
  ADEQUACY_CALCULATION_ERROR = 'adequacy_calculation_error',
  KNOWLEDGE_INTEGRATION_ERROR = 'knowledge_integration_error',
  PERFORMANCE_ERROR = 'performance_error',
  EDGE_CASE_ERROR = 'edge_case_error'
}

export interface SpinoError {
  type: ErrorType
  message: string
  context: ErrorContext
  severity: 'low' | 'medium' | 'high' | 'critical'
  recoverable: boolean
  fallbackStrategy: string
  timestamp: Date
  processingTime?: number
}

export interface ErrorContext {
  userInput: string
  currentStage: TherapeuticStage
  emotionalState?: EmotionalState
  adequacyScore?: UnifiedAdequacyScore
  causalChain?: CausalLink[];
  stageProgression?: StageProgression
  responseQuality?: ResponseGenerationResult
  language: string
  sessionId?: string
}

export interface ErrorRecoveryResult {
  success: boolean
  recoveredData: any
  fallbackUsed: string
  confidence: number
  errorHandled: boolean
  userMessage: string
}

export interface EdgeCaseHandler {
  caseType: string
  detectionPattern: string[]
  handlingStrategy: string
  fallbackResponse: string
  confidence: number
}

// Main Error Handler Class
export class SpinoErrorHandler {
  private static instance: SpinoErrorHandler
  private errorPatterns!: Map<ErrorType, ErrorPattern>
  private edgeCaseHandlers!: Map<string, EdgeCaseHandler>
  private recoveryStrategies!: Map<ErrorType, RecoveryStrategy>
  private errorHistory: SpinoError[] = []

  private constructor() {
    this.initializeErrorPatterns()
    this.initializeEdgeCaseHandlers()
    this.initializeRecoveryStrategies()
  }

  public static getInstance(): SpinoErrorHandler {
    if (!SpinoErrorHandler.instance) {
      SpinoErrorHandler.instance = new SpinoErrorHandler()
    }
    return SpinoErrorHandler.instance
  }

  // Comprehensive Error Handling

  // A. Error Detection and Classification
  public detectAndClassifyError(
    error: any,
    context: ErrorContext
  ): SpinoError {
    const errorType = this.classifyError(error)
    const severity = this.assessErrorSeverity(error, context)
    const recoverable = this.assessRecoverability(error, context)
    const fallbackStrategy = this.determineFallbackStrategy(errorType, context)

    const spinoError: SpinoError = {
      type: errorType,
      message: this.generateErrorMessage(error, context),
      context,
      severity,
      recoverable,
      fallbackStrategy,
      timestamp: new Date()
    }

    this.errorHistory.push(spinoError)
    return spinoError
  }

  // B. Edge Case Detection and Handling
  public detectAndHandleEdgeCases(
    userInput: string,
    context: ErrorContext
  ): EdgeCaseHandler[] {
    const detectedCases: EdgeCaseHandler[] = []

    for (const [caseType, handler] of this.edgeCaseHandlers) {
      if (this.matchesEdgeCase(userInput, handler.detectionPattern)) {
        detectedCases.push(handler)
      }
    }

    return detectedCases
  }

  // C. Graceful Degradation
  public handleErrorWithGracefulDegradation(
    error: SpinoError,
    context: ErrorContext
  ): ErrorRecoveryResult {
    console.error('SPINO ERROR:', error)

    if (error.recoverable) {
      return this.performContextAwareRecovery(error, context)
    } else {
      return this.createGenericRecoveryResult(error, context)
    }
  }

  // D. Context-Aware Recovery
  public performContextAwareRecovery(
    error: SpinoError,
    context: ErrorContext
  ): ErrorRecoveryResult {
    const contextAnalysis = this.analyzeErrorContext(error, context)
    const strategy = this.selectRecoveryStrategy(error, contextAnalysis)
    
    return this.executeContextAwareRecovery(error, context, strategy)
  }

  // Private Methods

  private classifyError(error: any): ErrorType {
    if (error.message?.includes('logic')) return ErrorType.LOGIC_ERROR
    if (error.message?.includes('emotional')) return ErrorType.EMOTIONAL_ANALYSIS_ERROR
    if (error.message?.includes('causal')) return ErrorType.CAUSAL_CHAIN_ERROR
    if (error.message?.includes('stage')) return ErrorType.STAGE_PROGRESSION_ERROR
    if (error.message?.includes('response')) return ErrorType.RESPONSE_GENERATION_ERROR
    if (error.message?.includes('adequacy')) return ErrorType.ADEQUACY_CALCULATION_ERROR
    if (error.message?.includes('knowledge')) return ErrorType.KNOWLEDGE_INTEGRATION_ERROR
    if (error.message?.includes('performance')) return ErrorType.PERFORMANCE_ERROR
    
    return ErrorType.EDGE_CASE_ERROR
  }

  private assessErrorSeverity(error: any, context: ErrorContext): SpinoError['severity'] {
    if (error.message?.includes('critical')) return 'critical'
    if (error.message?.includes('high')) return 'high'
    if (error.message?.includes('medium')) return 'medium'
    return 'low'
  }

  private assessRecoverability(error: any, context: ErrorContext): boolean {
    return error.severity !== 'critical'
  }

  private determineFallbackStrategy(errorType: ErrorType, context: ErrorContext): string {
    const strategies = this.recoveryStrategies.get(errorType)
    return strategies ? strategies.name : 'generic_fallback'
  }

  private generateErrorMessage(error: any, context: ErrorContext): string {
    return error.message || 'Unknown error occurred'
  }

  private matchesEdgeCase(userInput: string, patterns: string[]): boolean {
    return patterns.some(pattern => 
      userInput.toLowerCase().includes(pattern.toLowerCase())
    )
  }

  private analyzeErrorContext(error: SpinoError, context: ErrorContext): any {
    return {
      stageComplexity: this.calculateStageComplexity(context.currentStage),
      languageComplexity: this.calculateLanguageComplexity(context.language),
      emotionalState: context.emotionalState,
      adequacyScore: context.adequacyScore
    }
  }

  private selectRecoveryStrategy(error: SpinoError, contextAnalysis: any): RecoveryStrategy {
    const strategies = this.recoveryStrategies.get(error.type)
    if (!strategies) {
      return {
        name: 'generic_fallback',
        supportedErrors: [ErrorType.EDGE_CASE_ERROR],
        confidence: 0.5,
        handler: this.createGenericRecoveryResult.bind(this)
      }
    }
    return strategies
  }

  private executeContextAwareRecovery(
    error: SpinoError,
    context: ErrorContext,
    strategy: RecoveryStrategy
  ): ErrorRecoveryResult {
    try {
      const recoveredData = strategy.handler(error, context)
      return {
        success: true,
        recoveredData,
        fallbackUsed: strategy.name,
        confidence: strategy.confidence,
        errorHandled: true,
        userMessage: this.generateUserFriendlyMessage(error, context)
      }
    } catch (recoveryError) {
      return this.createGenericRecoveryResult(error, context)
    }
  }

  private createGenericRecoveryResult(error: SpinoError, context: ErrorContext): ErrorRecoveryResult {
    return {
      success: false,
      recoveredData: null,
      fallbackUsed: 'generic_fallback',
      confidence: 0.3,
      errorHandled: true,
      userMessage: this.generateGenericUserMessage(error, context)
    }
  }

  private calculateStrategyScore(strategy: RecoveryStrategy, contextAnalysis: any): number {
    let score = strategy.confidence
    
    if (contextAnalysis.stageComplexity > 0.7) score *= 0.8
    if (contextAnalysis.languageComplexity > 0.7) score *= 0.9
    
    return Math.min(score, 1.0)
  }

  private calculateStageComplexity(stage: TherapeuticStage): number {
    const complexityMap = {
      [TherapeuticStage.IDENTIFICATION]: 0.3,
      [TherapeuticStage.DECONSTRUCTION]: 0.6,
      [TherapeuticStage.RECONSTRUCTION]: 0.8
    }
    return complexityMap[stage] || 0.5
  }

  private calculateLanguageComplexity(language: string): number {
    const complexityMap = {
      'en': 0.5,
      'es': 0.6,
      'fr': 0.7,
      'de': 0.8
    }
    return complexityMap[language as keyof typeof complexityMap] || 0.5
  }

  private generateUserFriendlyMessage(error: SpinoError, context: ErrorContext): string {
    const messages: { [key in ErrorType]: string } = {
      [ErrorType.LOGIC_ERROR]: "A logic error occurred. Let's clarify the reasoning.",
      [ErrorType.EMOTIONAL_ANALYSIS_ERROR]: "There was an issue analyzing your emotional state. Let's try to understand it together.",
      [ErrorType.CAUSAL_CHAIN_ERROR]: "Trouble tracing the causal chain. Let's break it down step by step.",
      [ErrorType.STAGE_PROGRESSION_ERROR]: "There was a problem determining your therapeutic stage. Let's revisit your progress.",
      [ErrorType.RESPONSE_GENERATION_ERROR]: "I had trouble generating a response. Let's try a different approach.",
      [ErrorType.ADEQUACY_CALCULATION_ERROR]: "Adequacy calculation failed. Let's focus on understanding the causes.",
      [ErrorType.KNOWLEDGE_INTEGRATION_ERROR]: "There was an issue integrating knowledge. Let's clarify the information.",
      [ErrorType.PERFORMANCE_ERROR]: "A performance issue occurred. Let's proceed carefully.",
      [ErrorType.EDGE_CASE_ERROR]: "An edge case was detected. Let's address it together."
    }
    return messages[error.type as keyof typeof messages] || "I'm here to help you find clarity."
  }

  private generateGenericUserMessage(error: SpinoError, context: ErrorContext): string {
    return "I'm experiencing a technical difficulty. Let me help you with what you're feeling."
  }

  // Initialization Methods

  private initializeErrorPatterns(): void {
    this.errorPatterns = new Map()
    
    this.errorPatterns.set(ErrorType.LOGIC_ERROR, {
      pattern: /logic|reasoning|analysis/i,
      severity: 'medium'
    })
    
    this.errorPatterns.set(ErrorType.EMOTIONAL_ANALYSIS_ERROR, {
      pattern: /emotion|feeling|mood/i,
      severity: 'high'
    })
  }

  private initializeEdgeCaseHandlers(): void {
    this.edgeCaseHandlers = new Map()
    
    this.edgeCaseHandlers.set('empty_input', {
      caseType: 'empty_input',
      detectionPattern: ['', ' ', '   '],
      handlingStrategy: 'prompt_for_input',
      fallbackResponse: "I'm here to help. What would you like to explore?",
      confidence: 0.9
    })
    
    this.edgeCaseHandlers.set('very_long_input', {
      caseType: 'very_long_input',
      detectionPattern: ['very long text'],
      handlingStrategy: 'summarize_and_focus',
      fallbackResponse: "I hear you have a lot to share. Let's focus on what's most important to you right now.",
      confidence: 0.8
    })
  }

  private initializeRecoveryStrategies(): void {
    this.recoveryStrategies = new Map()
    
    this.recoveryStrategies.set(ErrorType.LOGIC_ERROR, {
      name: 'logic_recovery',
      supportedErrors: [ErrorType.LOGIC_ERROR],
      confidence: 0.7,
      handler: this.handleLogicError.bind(this)
    })
    
    this.recoveryStrategies.set(ErrorType.EMOTIONAL_ANALYSIS_ERROR, {
      name: 'emotional_recovery',
      supportedErrors: [ErrorType.EMOTIONAL_ANALYSIS_ERROR],
      confidence: 0.6,
      handler: this.handleEmotionalAnalysisError.bind(this)
    })
  }

  // Specific Error Handlers

  private handleLogicError(error: SpinoError, context: ErrorContext): any {
    return {
      type: 'logic_recovery',
      message: "Let's work through this step by step. What specific aspect feels unclear?",
      confidence: 0.7
    }
  }

  private handleEmotionalAnalysisError(error: SpinoError, context: ErrorContext): any {
    return {
      type: 'emotional_recovery',
      message: "I want to understand what you're feeling. Can you help me see what's behind this?",
      confidence: 0.6
    }
  }

  private handleCausalChainError(error: SpinoError, context: ErrorContext): any {
    return {
      type: 'causal_recovery',
      message: "Let's trace what's causing this together. What happened first?",
      confidence: 0.5
    }
  }

  private handleStageProgressionError(error: SpinoError, context: ErrorContext): any {
    return {
      type: 'stage_recovery',
      message: "Let's take this one step at a time. What would be most helpful right now?",
      confidence: 0.6
    }
  }

  private handleResponseGenerationError(error: SpinoError, context: ErrorContext): any {
    return {
      type: 'response_recovery',
      message: "I'm here to help you find clarity. What's on your mind right now?",
      confidence: 0.5
    }
  }

  // Analytics and Monitoring

  public getErrorAnalytics(): {
    totalErrors: number
    errorTypes: Record<ErrorType, number>
    averageSeverity: string
    recoveryRate: number
    mostCommonErrors: ErrorType[]
  } {
    const errorTypes: Record<ErrorType, number> = {} as Record<ErrorType, number>
    const severities: string[] = []
    let recoveredCount = 0

    this.errorHistory.forEach(error => {
      errorTypes[error.type] = (errorTypes[error.type] || 0) + 1
      severities.push(error.severity)
      if (error.recoverable) recoveredCount++
    })

    const mostCommonErrors = Object.entries(errorTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type as ErrorType)

    return {
      totalErrors: this.errorHistory.length,
      errorTypes,
      averageSeverity: this.calculateAverageSeverity(severities),
      recoveryRate: this.errorHistory.length > 0 ? recoveredCount / this.errorHistory.length : 0,
      mostCommonErrors
    }
  }

  private calculateAverageSeverity(severities: string[]): string {
    if (severities.length === 0) return 'none'
    
    const severityValues = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'critical': 4
    }
    
    const average = severities.reduce((sum, severity) => 
      sum + (severityValues[severity as keyof typeof severityValues] || 0), 0
    ) / severities.length
    
    if (average <= 1.5) return 'low'
    if (average <= 2.5) return 'medium'
    if (average <= 3.5) return 'high'
    return 'critical'
  }
}

// Supporting Interfaces

interface ErrorPattern {
  pattern: RegExp
  severity: string
}

interface RecoveryStrategy {
  name: string
  supportedErrors: ErrorType[]
  confidence: number
  handler: (error: SpinoError, context: ErrorContext) => any
} 