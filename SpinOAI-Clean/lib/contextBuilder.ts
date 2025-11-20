import { ConversationMemorySystem } from './conversationMemory'
import { AdvancedEmotionalAnalyzer, AdvancedEmotionalAnalysis } from './emotionalAnalysis'
import { EmotionalAdequacyEngine, AdequacyAnalysis } from './emotionalAdequacyEngine'
import { TeleologyAnalysis } from '@/lib/teleologyEngine'

// Types for rich context building
export interface RichContext {
  userMessage: string
  conversationMemory: string
  emotionalAnalysis: string
  adequacyAnalysis: string
  relationshipContext: string
  manipulationContext: string
  teleologyAnalysis?: string // Teleology analysis summary
  teleologyScore?: number // Teleology score for conditional logic
  purposeClaim?: string | null // Purpose claim for conditional logic
  therapeuticGoals: string[]
  responseGuidance: ResponseGuidance
}

interface ResponseGuidance {
  tone: string
  approach: string
  focus: string
  techniques: string[]
  avoid: string[]
  targetOutcome: string
}

interface ContextBuilderConfig {
  includeMemory: boolean
  includeEmotionalAnalysis: boolean
  includeAdequacyAnalysis: boolean
  includeManipulation: boolean
  maxContextLength: number
}

export class ContextBuilder {
  private memorySystem: ConversationMemorySystem
  private emotionalAnalyzer: AdvancedEmotionalAnalyzer
  private adequacyEngine: EmotionalAdequacyEngine
  private config: ContextBuilderConfig

  constructor(
    memorySystem: ConversationMemorySystem,
    emotionalAnalyzer: AdvancedEmotionalAnalyzer,
    adequacyEngine: EmotionalAdequacyEngine,
    config?: Partial<ContextBuilderConfig>
  ) {
    this.memorySystem = memorySystem
    this.emotionalAnalyzer = emotionalAnalyzer
    this.adequacyEngine = adequacyEngine
    this.config = {
      includeMemory: true,
      includeEmotionalAnalysis: true,
      includeAdequacyAnalysis: true,
      includeManipulation: true,
      maxContextLength: 2000,
      ...config
    }
    
    console.log('🏗️ Context Builder initialized')
  }

  // Build rich context for language generation
  async buildRichContext(
    userMessage: string,
    sessionId: string,
    userId: string,
    teleologyAnalysis?: TeleologyAnalysis
  ): Promise<RichContext> {
    console.log('🏗️ Building rich context...')

    // Get conversation memory
    const memorySummary = this.config.includeMemory 
      ? this.memorySystem.getMemorySummary(sessionId, userId)
      : ''

    // Get conversation history for emotional analysis
    const history = this.memorySystem.getConversationHistory(sessionId, userId, 5)
    const relationshipContext = this.memorySystem.getRelationshipContext(sessionId, userId)

    // Build emotional context
    const emotionalContext = {
      conversationHistory: history.map(m => `${m.role}: ${m.content}`),
      relationshipContext,
      currentMessage: userMessage,
      previousEmotionalState: history.length > 0 ? history[history.length - 1].emotionalAnalysis?.primaryEmotion : undefined
    }

    // Perform advanced emotional analysis
    const emotionalAnalysis = this.config.includeEmotionalAnalysis
      ? await this.emotionalAnalyzer.analyzeEmotions(userMessage, emotionalContext)
      : this.getFallbackEmotionalAnalysis(userMessage)

    // Build adequacy analysis context
    const adequacyContext = {
      currentEmotionalState: emotionalAnalysis,
      conversationHistory: history,
      relationshipContext,
      userProfile: {},
      therapeuticGoals: ['build_adequacy', 'foster_freedom', 'enhance_understanding']
    }

    // Perform adequacy analysis
    const adequacyAnalysis = this.config.includeAdequacyAnalysis
      ? await this.adequacyEngine.analyzeEmotionalAdequacy(emotionalAnalysis, adequacyContext)
      : this.getFallbackAdequacyAnalysis()

    // Build manipulation context
    const manipulationContext = this.config.includeManipulation
      ? this.buildManipulationContext(adequacyAnalysis, emotionalAnalysis, relationshipContext)
      : ''

    // Build response guidance
    const responseGuidance = this.buildResponseGuidance(adequacyAnalysis, emotionalAnalysis, relationshipContext)

    // Convert AdequacyAnalysis to SpinozisticAnalysis format for memory
    const spinozisticAnalysis = {
      primaryAffect: adequacyAnalysis.primaryAffect.name,
      powerChange: adequacyAnalysis.powerChange,
      adequacyScore: adequacyAnalysis.adequacyScore,
      freedomRatio: adequacyAnalysis.freedomRatio,
      inadequateIdeas: adequacyAnalysis.inadequateIdeas,
      coachingStrategy: adequacyAnalysis.coachingStrategy
    }

    // Add message to memory
    this.memorySystem.addMessage(
      sessionId,
      userId,
      'user',
      userMessage,
      emotionalAnalysis,
      spinozisticAnalysis
    )

    // Build teleology analysis summary
    let teleologySummary = ''
    if (teleologyAnalysis) {
      // Only include teleology summary if score is meaningful (>= 0.2) or purposeClaim exists
      if (teleologyAnalysis.teleologyScore >= 0.2 || teleologyAnalysis.purposeClaim) {
        teleologySummary = `Teleology Analysis:
- Teleology Score: ${teleologyAnalysis.teleologyScore.toFixed(2)}
- Teleology Type: ${teleologyAnalysis.teleologyType || 'none'}
- Manipulation Risk: ${teleologyAnalysis.manipulationRisk}
- Detected phrases: ${teleologyAnalysis.detectedPhrases.join(', ')}

Purpose Claim (the teleological story the user is telling):
${teleologyAnalysis.purposeClaim ? `"${teleologyAnalysis.purposeClaim}"` : 'None detected - user is not framing events as having a purpose.'}

Neutral Causal Paraphrase (same content in causal terms):
${teleologyAnalysis.neutralCausalParaphrase ? `"${teleologyAnalysis.neutralCausalParaphrase}"` : 'Not generated - use the detected phrases and your analysis to construct a causal view.'}`
      }
      // If score is below 0.2 and no purposeClaim, don't include teleology summary at all
      // The structured data (teleologyScore, purposeClaim) will still be passed for conditional logic
    }

    const richContext: RichContext = {
      userMessage,
      conversationMemory: memorySummary,
      emotionalAnalysis: this.emotionalAnalyzer.getEmotionalSummary(emotionalAnalysis),
      adequacyAnalysis: this.adequacyEngine.getManipulationSummary(adequacyAnalysis),
      relationshipContext: this.buildRelationshipSummary(relationshipContext),
      manipulationContext,
      teleologyAnalysis: teleologySummary,
      teleologyScore: teleologyAnalysis?.teleologyScore,
      purposeClaim: teleologyAnalysis?.purposeClaim || null,
      therapeuticGoals: adequacyContext.therapeuticGoals,
      responseGuidance
    }

    console.log('🏗️ Rich context built successfully')
    return richContext
  }

  // Build manipulation context for language generation
  private buildManipulationContext(
    adequacyAnalysis: AdequacyAnalysis,
    emotionalAnalysis: AdvancedEmotionalAnalysis,
    relationshipContext: any
  ): string {
    const strategy = adequacyAnalysis.manipulationStrategy
    
    let context = `Manipulation Context:\n`
    context += `- Strategy: ${strategy.name}\n`
    context += `- Description: ${strategy.description}\n`
    context += `- Techniques: ${strategy.techniques.join(', ')}\n`
    context += `- Target Outcome: ${strategy.targetOutcome}\n`
    context += `- Risk Level: ${strategy.riskLevel}\n`
    context += `- Effectiveness: ${strategy.effectiveness.toFixed(2)}\n`
    context += `- Emotional Gap: ${adequacyAnalysis.emotionalGap.toFixed(2)}\n`
    context += `- Transformation Path: ${adequacyAnalysis.transformationPath.join(' → ')}\n`
    
    // Add relationship-aware manipulation
    if (relationshipContext) {
      context += `- Trust Level: ${relationshipContext.trustLevel.toFixed(2)}\n`
      context += `- Vulnerability Level: ${relationshipContext.vulnerabilityLevel.toFixed(2)}\n`
      context += `- Emotional Safety: ${relationshipContext.emotionalSafety.toFixed(2)}\n`
    }
    
    return context
  }

  // Build response guidance based on analysis
  private buildResponseGuidance(
    adequacyAnalysis: AdequacyAnalysis,
    emotionalAnalysis: AdvancedEmotionalAnalysis,
    relationshipContext: any
  ): ResponseGuidance {
    const strategy = adequacyAnalysis.manipulationStrategy
    const emotionalState = emotionalAnalysis.primaryEmotion
    const intensity = emotionalAnalysis.intensity
    
    let tone = 'warm'
    let approach = 'exploratory'
    let focus = 'emotional_understanding'
    let techniques: string[] = []
    let avoid: string[] = []
    let targetOutcome = strategy.targetOutcome

    // Determine tone based on emotional state
    if (emotionalState === 'sadness' || emotionalState === 'fear') {
      tone = 'gentle'
      approach = 'supportive'
      focus = 'emotional_safety'
      techniques = ['validation', 'empathy', 'safety_building']
      avoid = ['minimizing', 'advice_giving', 'problem_solving']
    } else if (emotionalState === 'anger' || emotionalState === 'frustration') {
      tone = 'calm'
      approach = 'de_escalating'
      focus = 'emotional_regulation'
      techniques = ['validation', 'perspective', 'grounding']
      avoid = ['confrontation', 'defensiveness', 'minimizing']
    } else if (emotionalState === 'joy' || emotionalState === 'excitement') {
      tone = 'celebratory'
      approach = 'amplifying'
      focus = 'positive_reinforcement'
      techniques = ['celebration', 'connection', 'validation']
      avoid = ['dampening', 'skepticism', 'caution']
    }

    // Adjust based on relationship context
    if (relationshipContext) {
      if (relationshipContext.trustLevel < 0.5) {
        tone = 'building_trust'
        approach = 'trust_building'
        techniques = ['consistency', 'safety_signals', 'validation']
      }
      
      if (relationshipContext.vulnerabilityLevel > 0.7) {
        tone = 'extra_gentle'
        approach = 'safety_first'
        techniques = ['acceptance', 'non_judgment', 'support']
      }
    }

    // Adjust based on manipulation strategy
    if (strategy.name === 'build_trust') {
      tone = 'trustworthy'
      approach = 'consistent_safety'
      techniques = ['consistency', 'validation', 'safety_signals']
    } else if (strategy.name === 'regulate_intensity') {
      tone = 'calming'
      approach = 'emotional_regulation'
      techniques = ['grounding', 'perspective', 'validation']
    } else if (strategy.name === 'foster_safety') {
      tone = 'accepting'
      approach = 'safety_creation'
      techniques = ['acceptance', 'non_judgment', 'support']
    }

    return {
      tone,
      approach,
      focus,
      techniques,
      avoid,
      targetOutcome
    }
  }

  // Build relationship summary
  private buildRelationshipSummary(relationshipContext: any): string {
    if (!relationshipContext) return 'No relationship context available'
    
    let summary = `Relationship Context:\n`
    summary += `- Trust Level: ${relationshipContext.trustLevel.toFixed(2)}\n`
    summary += `- Vulnerability Level: ${relationshipContext.vulnerabilityLevel.toFixed(2)}\n`
    summary += `- Emotional Safety: ${relationshipContext.emotionalSafety.toFixed(2)}\n`
    summary += `- Communication Style: ${relationshipContext.preferredCommunicationStyle}\n`
    
    if (relationshipContext.sharedTopics.length > 0) {
      summary += `- Shared Topics: ${relationshipContext.sharedTopics.slice(-3).join(', ')}\n`
    }
    
    return summary
  }

  // Get fallback emotional analysis
  private getFallbackEmotionalAnalysis(message: string): AdvancedEmotionalAnalysis {
    const textLower = message.toLowerCase()
    
    let primaryEmotion = 'neutral'
    let intensity = 0.5
    
    if (textLower.includes('sad') || textLower.includes('down')) {
      primaryEmotion = 'sadness'
      intensity = 0.7
    } else if (textLower.includes('angry') || textLower.includes('mad')) {
      primaryEmotion = 'anger'
      intensity = 0.8
    } else if (textLower.includes('happy') || textLower.includes('joy')) {
      primaryEmotion = 'joy'
      intensity = 0.6
    }
    
    return {
      primaryEmotion,
      secondaryEmotions: [],
      intensity,
      confidence: 0.6,
      context: 'Fallback analysis',
      subtleCues: [],
      emotionalState: primaryEmotion,
      underlyingThemes: [],
      vulnerabilityIndicators: [],
      safetySignals: [],
      communicationStyle: 'direct',
      emotionalNeeds: ['understanding', 'support']
    }
  }

  // Get fallback adequacy analysis
  private getFallbackAdequacyAnalysis(): AdequacyAnalysis {
    return {
      primaryAffect: {
        name: 'sadness',
        definition: 'Decrease in power of acting',
        powerChange: 'decrease',
        adequacyLevel: 'inadequate',
        bondageLevel: 'high',
        relatedConcepts: ['power_decrease'],
        inadequateIdeas: ['external_causes'],
        coachingApproach: 'identify_inadequate_ideas',
        emotionalManipulation: {
          name: 'transform_sadness',
          description: 'Transform sadness through understanding',
          techniques: ['validation', 'reframing'],
          targetOutcome: 'adequate_understanding',
          riskLevel: 'medium',
          effectiveness: 0.8
        }
      },
      secondaryAffects: [],
      powerChange: -0.8,
      adequacyScore: 0.2,
      bondageLevel: 'high',
      freedomRatio: 0.2,
      blessednessLevel: 0.04,
      inadequateIdeas: ['external_causes'],
      causalChain: ['User expresses sadness', 'This indicates decrease in power'],
      coachingStrategy: 'identify_inadequate_ideas',
      manipulationStrategy: {
        name: 'transform_sadness',
        description: 'Transform sadness through understanding',
        techniques: ['validation', 'reframing'],
        targetOutcome: 'adequate_understanding',
        riskLevel: 'medium',
        effectiveness: 0.8
      },
      emotionalGap: 0.4,
      transformationPath: ['Current: sadness (decrease power)', 'Target: adequate understanding']
    }
  }

  // Get context summary for language generation
  getContextSummary(context: RichContext): string {
    let summary = `Context Summary:\n`
    summary += `User: "${context.userMessage}"\n\n`
    
    if (context.conversationMemory) {
      summary += `${context.conversationMemory}\n\n`
    }
    
    if (context.emotionalAnalysis) {
      summary += `${context.emotionalAnalysis}\n\n`
    }
    
    if (context.adequacyAnalysis) {
      summary += `${context.adequacyAnalysis}\n\n`
    }
    
    if (context.relationshipContext) {
      summary += `${context.relationshipContext}\n\n`
    }
    
    if (context.manipulationContext) {
      summary += `${context.manipulationContext}\n\n`
    }
    
    summary += `Response Guidance:\n`
    summary += `- Tone: ${context.responseGuidance.tone}\n`
    summary += `- Approach: ${context.responseGuidance.approach}\n`
    summary += `- Focus: ${context.responseGuidance.focus}\n`
    summary += `- Techniques: ${context.responseGuidance.techniques.join(', ')}\n`
    summary += `- Avoid: ${context.responseGuidance.avoid.join(', ')}\n`
    summary += `- Target: ${context.responseGuidance.targetOutcome}\n`
    
    return summary
  }
}
