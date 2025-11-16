import { EnhancedRAG } from './enhancedRAG'
import { SpinoLogicEngine } from './logicEngine'
import { SpinoResponseEngine } from './responseEngine'
import { SpinoErrorHandler, ErrorContext, ErrorRecoveryResult } from './errorHandler'
import { 
  UnifiedAdequacyScore, 
  EmotionalState, 
  TherapeuticStage, 
  OnionLayer, 
  UnifiedMessage, 
  RealTimeAnalysis,
  LogicAnalysis,
  StageProgression,
  ResponseGenerationRequest,
  ResponseGenerationResult
} from './types'
import { OpenAI } from 'openai';

// Main Unified Philosophical System
export class UnifiedPhilosophicalSystem {
  private static instance: UnifiedPhilosophicalSystem
  private enhancedRAG: EnhancedRAG
  private logicEngine: SpinoLogicEngine
  private responseEngine: SpinoResponseEngine
  private errorHandler: SpinoErrorHandler
  private currentStage: TherapeuticStage = TherapeuticStage.IDENTIFICATION
  private currentLayer: OnionLayer = OnionLayer.SURFACE
  private sessionHistory: UnifiedMessage[] = []

  private constructor() {
    // Initialize with default OpenAI and knowledge base
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ''
    });
    this.enhancedRAG = new EnhancedRAG(openai, {});
    this.logicEngine = new SpinoLogicEngine()
    this.responseEngine = new SpinoResponseEngine()
    this.errorHandler = SpinoErrorHandler.getInstance()
  }

  public static getInstance(): UnifiedPhilosophicalSystem {
    if (!UnifiedPhilosophicalSystem.instance) {
      UnifiedPhilosophicalSystem.instance = new UnifiedPhilosophicalSystem()
    }
    return UnifiedPhilosophicalSystem.instance
  }

  // Initialize the system
  public async initialize(): Promise<void> {
    console.log('🚨 UNIFIED SYSTEM: Starting initialization...')
    console.log('🚨 UNIFIED SYSTEM: EnhancedRAG instance:', !!this.enhancedRAG)
    
    console.log('✅ Unified Philosophical System initialized')
    console.log('🧠 Logic Engine integrated')
    console.log('🎯 Response Engine integrated')
    console.log('🛡️ Error Handler integrated')
  }

  // Process user input through unified system with enhanced logic and error handling
  public async processUserInput(
    content: string, 
    conversationHistory: UnifiedMessage[] = [],
    language: string = 'en'
  ): Promise<{
    response: string
    adequacyScore: UnifiedAdequacyScore
    emotionalState: EmotionalState
    therapeuticStage: TherapeuticStage
    onionLayer: OnionLayer
    causalChain: string[]
    detailedAnalysis: string
    realTimeAnalysis: RealTimeAnalysis
    logicAnalysis?: LogicAnalysis
    responseQuality?: ResponseGenerationResult
    errorHandled?: boolean
    errorRecovery?: ErrorRecoveryResult
  }> {
    
    // 1. Edge case detection and handling
    const edgeCases = this.errorHandler.detectAndHandleEdgeCases(content, {
      userInput: content,
      currentStage: this.currentStage,
      language
    })
    
    if (edgeCases.length > 0) {
      const edgeCase = edgeCases[0] // Use the first detected edge case
      return {
        response: edgeCase.fallbackResponse,
        adequacyScore: this.createDefaultAdequacyScore(),
        emotionalState: this.createDefaultEmotionalState(),
        therapeuticStage: this.currentStage,
        onionLayer: OnionLayer.SURFACE,
        causalChain: [],
        detailedAnalysis: `Edge case handled: ${edgeCase.caseType}`,
        realTimeAnalysis: this.createDefaultRealTimeAnalysis(),
        errorHandled: true,
        errorRecovery: {
          success: true,
          recoveredData: null,
          fallbackUsed: edgeCase.handlingStrategy,
          confidence: edgeCase.confidence,
          errorHandled: true,
          userMessage: edgeCase.fallbackResponse
        }
      }
    }

    // 2. Analyze emotional state with error handling
    let emotionalState: EmotionalState
    try {
      emotionalState = this.analyzeEmotionalState(content)
    } catch (error) {
      const errorContext: ErrorContext = {
        userInput: content,
        currentStage: this.currentStage,
        language
      }
      const spinoError = this.errorHandler.detectAndClassifyError(error, errorContext)
      const recovery = this.errorHandler.handleErrorWithGracefulDegradation(spinoError, errorContext)
      emotionalState = recovery.recoveredData?.emotionalState || this.createDefaultEmotionalState()
    }
    
    // 3. Calculate unified adequacy score with error handling
    let adequacyScore: UnifiedAdequacyScore
    try {
      adequacyScore = this.calculateUnifiedAdequacy(content, emotionalState)
    } catch (error) {
      const errorContext: ErrorContext = {
        userInput: content,
        currentStage: this.currentStage,
        emotionalState,
        language
      }
      const spinoError = this.errorHandler.detectAndClassifyError(error, errorContext)
      const recovery = this.errorHandler.handleErrorWithGracefulDegradation(spinoError, errorContext)
      adequacyScore = recovery.recoveredData?.adequacyScore || this.createDefaultAdequacyScore()
    }
    
    // 4. Determine therapeutic stage progression
    const therapeuticStage = this.determineTherapeuticStage(content, adequacyScore, conversationHistory)
    
    // 5. Determine onion layer depth
    const onionLayer = this.determineOnionLayer(content, adequacyScore, conversationHistory)
    
    // 6. Enhanced Logic Analysis
    const logicResult = this.logicEngine.processLogic({
      userInput: content,
      emotionalState,
      adequacyScore: adequacyScore.unifiedScore,
      clarityScore: adequacyScore.spinoAdequacy.chi,
      joyDelta: adequacyScore.spinoAdequacy.deltaAlpha
    });
    const causalChain = logicResult.causalChain;
    
    // 7. Generate response using EnhancedRAG with logic analysis
    const ragQuery = {
      question: content,
      context: {
        currentPart: this.getEthicsPart(adequacyScore),
        substanceUnderstanding: adequacyScore.spinoAdequacy.alpha,
        emotionalState: {
          valence: emotionalState.powerChange,
          arousal: emotionalState.intensity,
          dominance: emotionalState.freedomRatio,
          primaryEmotion: emotionalState.primaryAffect,
          secondaryEmotions: []
        },
        freedomRatio: emotionalState.freedomRatio,
        blessednessLevel: emotionalState.blessednessLevel,
        previousQueries: conversationHistory.map(msg => msg.content)
      },
      maxResults: 5,
      includeReasoning: true,
      language: language
    }

    console.log('🚨 UNIFIED SYSTEM: Calling EnhancedRAG with query:', ragQuery.question)
    console.log('🚨 UNIFIED SYSTEM: RAG Query details:', {
      question: ragQuery.question,
      hasOpenAI: !!this.enhancedRAG,
      language: ragQuery.language
    })
    
    console.log('🚨 UNIFIED SYSTEM: About to call enhancedRAG.query...')
    let ragResponse
    try {
      ragResponse = await this.enhancedRAG.query(content, {
        currentPart: this.getEthicsPart(adequacyScore),
        substanceUnderstanding: adequacyScore.noesisAdequacy.substance,
        emotionalState: {
          valence: emotionalState.intensity || 0.5,
          arousal: emotionalState.intensity || 0.5,
          dominance: emotionalState.powerChange || 0,
          primaryEmotion: emotionalState.primaryAffect,
          secondaryEmotions: []
        },
        freedomRatio: adequacyScore.noesisAdequacy.freedom,
        blessednessLevel: adequacyScore.noesisAdequacy.blessedness
      }, emotionalState)
      console.log('🚨 UNIFIED SYSTEM: RAG query completed successfully')
    } catch (ragError) {
      console.error('🚨 UNIFIED SYSTEM: RAG query failed:', ragError)
      // Fallback response
      ragResponse = {
        answer: "I need to understand your situation better. What specific event or circumstance triggered this feeling?",
        source: 'fallback',
        confidence: 0.5
      }
    }
    
    console.log('🚨 UNIFIED SYSTEM: RAG Response received:', {
      response: (ragResponse.response || '').substring(0, 100) + '...',
      sources: ragResponse.sources,
      confidence: ragResponse.confidence
    })
    
    // 8. Enhanced Response Generation with Quality Assurance
    const responseRequest: ResponseGenerationRequest = {
      userInput: content,
      emotionalState,
      therapeuticStage: this.currentStage,
      onionLayer,
    }
    
    const responseQuality = this.responseEngine.generateResponse(responseRequest)
    
    // 7. Generate detailed analysis
    const detailedAnalysis = this.generateDetailedAnalysis(
      content, 
      adequacyScore, 
      emotionalState, 
      therapeuticStage, 
      onionLayer
    )

    // 8. Create real-time analysis
    const realTimeAnalysis = this.createRealTimeAnalysis(
      adequacyScore, 
      emotionalState, 
      therapeuticStage, 
      onionLayer
    )

    return {
      response: ragResponse.response || '', // Use the RAG response instead of generic response
      adequacyScore,
      emotionalState,
      therapeuticStage: this.currentStage,
      onionLayer,
      causalChain,
      detailedAnalysis,
      realTimeAnalysis,
      logicAnalysis: {
        adequacyAnalysis: logicResult.adequacyAnalysis,
        clarityAnalysis: logicResult.clarityAnalysis,
        joyAnalysis: logicResult.joyAnalysis,
        causalChain: logicResult.causalChain,
        recommendations: logicResult.recommendations
      },
      responseQuality,
      errorHandled: false
    }
  }

  // 🛠️ **Error Handling Helper Methods**

  private createDefaultAdequacyScore(): UnifiedAdequacyScore {
    return {
      spinoAdequacy: {
        alpha: 0.5,
        deltaAlpha: 0,
        chi: 0.5
      },
      noesisAdequacy: {
        substance: 1,
        imagination: 1,
        reason: 1,
        intuition: 1,
        freedom: 1,
        blessedness: 1,
        total: 6
      },
      unifiedScore: 50,
      confidence: 0.5
    }
  }

  private createDefaultEmotionalState(): EmotionalState {
    return {
      primaryEmotion: 'neutral',
      primaryAffect: 'neutral',
      intensity: 0.5,
      powerChange: 0,
      adequacyScore: 0.5,
      clarityScore: 0.5,
      joyDelta: 0,
      bondageLevel: 'medium',
      freedomRatio: 0.5,
      transformationPotential: 0.5,
      blessednessLevel: 0.5
    }
  }

  private createDefaultRealTimeAnalysis(): RealTimeAnalysis {
    return {
      timestamp: new Date(),
      adequacyScore: this.createDefaultAdequacyScore(),
      emotionalState: this.createDefaultEmotionalState(),
      therapeuticStage: TherapeuticStage.IDENTIFICATION,
      onionLayer: OnionLayer.SURFACE,
      processingTime: Date.now(),
      confidence: 0.5
    }
  }

  // Analyze emotional state using Spino logic
  private analyzeEmotionalState(content: string): EmotionalState {
    const words = content.toLowerCase().split(' ')
    
    // Primary affect detection
    let primaryAffect = 'neutral'
    let intensity = 0.5
    let powerChange = 0
    
    if (words.some(w => ['sad', 'depressed', 'hopeless', 'despair'].includes(w))) {
      primaryAffect = 'sadness'
      intensity = 0.8
      powerChange = -0.3
    } else if (words.some(w => ['angry', 'furious', 'rage', 'hate'].includes(w))) {
      primaryAffect = 'anger'
      intensity = 0.9
      powerChange = -0.4
    } else if (words.some(w => ['joy', 'happy', 'excited', 'elated'].includes(w))) {
      primaryAffect = 'joy'
      intensity = 0.7
      powerChange = 0.4
    } else if (words.some(w => ['fear', 'anxious', 'worried', 'terrified'].includes(w))) {
      primaryAffect = 'fear'
      intensity = 0.8
      powerChange = -0.2
    }

    // Bondage level analysis
    const bondageIndicators = ['i feel', 'i can\'t', 'i have to', 'i must', 'i should']
    const freedomIndicators = ['i understand', 'i see', 'i realize', 'because']
    
    const bondageCount = bondageIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length
    
    const freedomCount = freedomIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length
    
    const bondageLevel = bondageCount > freedomCount ? 'high' : 
                        bondageCount === freedomCount ? 'medium' : 'low'
    
    const freedomRatio = Math.max(0, Math.min(1, (freedomCount - bondageCount + 3) / 6))
    
    // Transformation potential based on adequacy
    const transformationPotential = Math.max(0, 1 - bondageCount / 5)
    
    // Blessedness level
    const blessednessLevel = Math.max(0, freedomRatio * transformationPotential)

    return {
      primaryEmotion: primaryAffect,
      primaryAffect,
      intensity,
      powerChange,
      adequacyScore: Math.max(0, 0.5 + powerChange),
      clarityScore: Math.max(0, 0.5 + freedomRatio),
      joyDelta: powerChange,
      bondageLevel,
      freedomRatio,
      transformationPotential,
      blessednessLevel
    }
  }

  // Calculate unified adequacy score
  private calculateUnifiedAdequacy(content: string, emotionalState: EmotionalState): UnifiedAdequacyScore {
    // Spino adequacy calculation (α/Δα/χ)
    const alpha = emotionalState.adequacyScore || 0.5
    const deltaAlpha = emotionalState.powerChange || 0
    const chi = emotionalState.clarityScore || 0.5

    // Noesis 6-dimensional calculation
    const substance = this.calculateSubstanceUnderstanding(content)
    const imagination = this.calculateImagination(content)
    const reason = this.calculateReason(content)
    const intuition = this.calculateIntuition(content)
    const freedom = this.calculateFreedom(content, emotionalState)
    const blessedness = this.calculateBlessedness(content, emotionalState)
    const total = substance + imagination + reason + intuition + freedom + blessedness

    // Unified score (0-100)
    const unifiedScore = Math.round(
      (alpha * 30) + // Spino adequacy (30%)
      (Math.max(0, (deltaAlpha || 0) + 1) * 20) + // Spino change (20%)
      ((chi || 0.5) * 20) + // Spino conatus (20%)
      ((total / 19) * 30) // Noesis total (30%)
    )

    const confidence = Math.min(1, (substance + reason + intuition) / 10)

    return {
      spinoAdequacy: { alpha, deltaAlpha: deltaAlpha || 0, chi: chi || 0.5 },
      noesisAdequacy: { substance, imagination, reason, intuition, freedom, blessedness, total },
      unifiedScore,
      confidence
    }
  }

  // Noesis adequacy calculations
  private calculateSubstanceUnderstanding(content: string): number {
    const substanceTerms = ['cause', 'effect', 'substance', 'attribute', 'mode', 'because', 'therefore']
    const matches = substanceTerms.filter(term => content.toLowerCase().includes(term)).length
    return Math.min(3, matches * 0.5)
  }

  private calculateImagination(content: string): number {
    const imaginationTerms = ['feel', 'imagine', 'picture', 'sense', 'seem', 'appear']
    const matches = imaginationTerms.filter(term => content.toLowerCase().includes(term)).length
    return Math.min(3, matches * 0.5)
  }

  private calculateReason(content: string): number {
    const reasonTerms = ['think', 'reason', 'logic', 'understand', 'analyze', 'consider']
    const matches = reasonTerms.filter(term => content.toLowerCase().includes(term)).length
    return Math.min(3, matches * 0.5)
  }

  private calculateIntuition(content: string): number {
    const intuitionTerms = ['clear', 'obvious', 'direct', 'immediate', 'evident', 'certain']
    const matches = intuitionTerms.filter(term => content.toLowerCase().includes(term)).length
    return Math.min(4, matches * 0.7)
  }

  private calculateFreedom(content: string, emotionalState: EmotionalState): number {
    const baseScore = 1
    return Math.min(3, baseScore + (emotionalState.freedomRatio || 0.5) * 2)
  }

  private calculateBlessedness(content: string, emotionalState: EmotionalState): number {
    const baseScore = 1
    return Math.min(3, baseScore + (emotionalState.blessednessLevel || 0.5) * 2)
  }

  // Determine therapeutic stage progression
  private determineTherapeuticStage(
    content: string, 
    adequacyScore: UnifiedAdequacyScore, 
    history: UnifiedMessage[]
  ): TherapeuticStage {
    const adequacy = adequacyScore.unifiedScore

    switch (this.currentStage) {
      case TherapeuticStage.IDENTIFICATION:
        return adequacy > 30 ? TherapeuticStage.DECONSTRUCTION : TherapeuticStage.IDENTIFICATION
      
      case TherapeuticStage.DECONSTRUCTION:
        return adequacy > 70 ? TherapeuticStage.RECONSTRUCTION : TherapeuticStage.DECONSTRUCTION
      
      case TherapeuticStage.RECONSTRUCTION:
        return adequacy > 85 ? TherapeuticStage.RECONSTRUCTION : TherapeuticStage.DECONSTRUCTION
      
      default:
        return adequacy > 30 ? TherapeuticStage.DECONSTRUCTION : TherapeuticStage.IDENTIFICATION
    }
  }

  // Determine onion layer depth
  private determineOnionLayer(
    content: string, 
    adequacyScore: UnifiedAdequacyScore, 
    history: UnifiedMessage[]
  ): OnionLayer {
    const adequacy = adequacyScore.unifiedScore

    if (adequacy < 30) return OnionLayer.SURFACE
    if (adequacy < 60) return OnionLayer.SUBSTANCE
    if (adequacy < 80) return OnionLayer.MODE
    return OnionLayer.ATTRIBUTE
  }

  // Extract causal chain
  private extractCausalChain(content: string, adequacyScore: UnifiedAdequacyScore): string[] {
    const causalTerms = ['because', 'therefore', 'since', 'as a result', 'consequently']
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    return sentences.filter(sentence => 
      causalTerms.some(term => sentence.toLowerCase().includes(term))
    ).map(s => s.trim())
  }

  // Get Ethics part based on adequacy
  private getEthicsPart(adequacyScore: UnifiedAdequacyScore): number {
    const score = adequacyScore.unifiedScore
    if (score < 20) return 1 // God
    if (score < 40) return 2 // Mind
    if (score < 60) return 3 // Emotions
    if (score < 80) return 4 // Bondage
    return 5 // Freedom
  }

  // Generate detailed analysis
  private generateDetailedAnalysis(
    content: string,
    adequacyScore: UnifiedAdequacyScore,
    emotionalState: EmotionalState,
    therapeuticStage: TherapeuticStage,
    onionLayer: OnionLayer
  ): string {
    return `
## Spinozistic Analysis

### Emotional State
- **Primary Emotion**: ${emotionalState.primaryEmotion || 'neutral'}
- **Intensity**: ${((emotionalState.intensity || 0.5) * 100).toFixed(1)}%
- **Power Change**: ${(emotionalState.powerChange || 0).toFixed(2)}
- **Freedom Ratio**: ${((emotionalState.freedomRatio || 0.5) * 100).toFixed(1)}%
- **Transformation Potential**: ${((emotionalState.transformationPotential || 0.5) * 100).toFixed(1)}%

### Adequacy Analysis
- **Spino Adequacy (α)**: ${(adequacyScore.spinoAdequacy.alpha * 100).toFixed(1)}%
- **Spino Change (Δα)**: ${(adequacyScore.spinoAdequacy.deltaAlpha * 100).toFixed(1)}%
- **Spino Clarity (χ)**: ${(adequacyScore.spinoAdequacy.chi * 100).toFixed(1)}%

### Therapeutic Stage
- **Current Stage**: ${therapeuticStage}
- **Onion Layer**: ${onionLayer}

### Noesis Analysis
- **Substance**: ${adequacyScore.noesisAdequacy.substance.toFixed(1)}/3
- **Imagination**: ${adequacyScore.noesisAdequacy.imagination.toFixed(1)}/3
- **Reason**: ${adequacyScore.noesisAdequacy.reason.toFixed(1)}/3
- **Intuition**: ${adequacyScore.noesisAdequacy.intuition.toFixed(1)}/3
- **Freedom**: ${adequacyScore.noesisAdequacy.freedom.toFixed(1)}/3
- **Blessedness**: ${adequacyScore.noesisAdequacy.blessedness.toFixed(1)}/3

### Unified Score
- **Overall Adequacy**: ${adequacyScore.unifiedScore}/100
- **Confidence**: ${(adequacyScore.confidence * 100).toFixed(1)}%
`
  }

  // Create real-time analysis
  private createRealTimeAnalysis(
    adequacyScore: UnifiedAdequacyScore,
    emotionalState: EmotionalState,
    therapeuticStage: TherapeuticStage,
    onionLayer: OnionLayer
  ): RealTimeAnalysis {
    return {
      timestamp: new Date(),
      adequacyScore,
      emotionalState,
      therapeuticStage,
      onionLayer,
      processingTime: Date.now(),
      confidence: adequacyScore.confidence
    }
  }

  // Save session data
  public saveSession(message: UnifiedMessage): void {
    this.sessionHistory.push(message)
  }

  // Get session analytics
  public getSessionAnalytics(): {
    totalMessages: number
    averageAdequacy: number
    stageProgression: TherapeuticStage[]
    layerDepth: OnionLayer[]
    emotionalTrends: EmotionalState[]
  } {
    const adequacyScores = this.sessionHistory
      .map(msg => msg.adequacyScore?.unifiedScore || 0)
      .filter(score => score > 0)
    
    const averageAdequacy = adequacyScores.length > 0 
      ? adequacyScores.reduce((a, b) => a + b, 0) / adequacyScores.length 
      : 0

    return {
      totalMessages: this.sessionHistory.length,
      averageAdequacy,
      stageProgression: this.sessionHistory.map(msg => msg.therapeuticStage || TherapeuticStage.IDENTIFICATION),
      layerDepth: this.sessionHistory.map(msg => msg.onionLayer || OnionLayer.SURFACE),
      emotionalTrends: this.sessionHistory.map(msg => msg.emotionalState).filter(Boolean) as EmotionalState[]
    }
  }
} 