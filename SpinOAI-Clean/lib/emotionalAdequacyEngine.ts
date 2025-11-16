import { AdvancedEmotionalAnalysis } from './emotionalAnalysis'

// Enhanced Spinozistic types for the Emotional Adequacy Engine
interface EnhancedSpinozisticAffect {
  name: string
  definition: string
  powerChange: 'increase' | 'decrease' | 'mixed'
  adequacyLevel: 'adequate' | 'inadequate' | 'mixed'
  bondageLevel: 'high' | 'medium' | 'low'
  relatedConcepts: string[]
  inadequateIdeas: string[]
  coachingApproach: string
  emotionalManipulation: EmotionalManipulationStrategy
}

interface EmotionalManipulationStrategy {
  name: string
  description: string
  techniques: string[]
  targetOutcome: string
  riskLevel: 'low' | 'medium' | 'high'
  effectiveness: number
}

export interface AdequacyAnalysis {
  primaryAffect: EnhancedSpinozisticAffect
  secondaryAffects: EnhancedSpinozisticAffect[]
  powerChange: number // -1 to 1
  adequacyScore: number // 0 to 1
  bondageLevel: 'high' | 'medium' | 'low'
  freedomRatio: number // 0 to 1
  blessednessLevel: number // 0 to 1
  inadequateIdeas: string[]
  causalChain: string[]
  coachingStrategy: string
  manipulationStrategy: EmotionalManipulationStrategy
  emotionalGap: number // Difference between current and target emotional state
  transformationPath: string[]
}

interface EmotionalContext {
  currentEmotionalState: AdvancedEmotionalAnalysis
  conversationHistory: any[]
  relationshipContext: any
  userProfile: any
  therapeuticGoals: string[]
}

export class EmotionalAdequacyEngine {
  private enhancedAffects: EnhancedSpinozisticAffect[]
  private manipulationStrategies: Map<string, EmotionalManipulationStrategy>

  constructor() {
    this.enhancedAffects = this.initializeEnhancedSpinozisticAffects()
    this.manipulationStrategies = this.initializeManipulationStrategies()
    console.log('🧙‍♂️ Emotional Adequacy Engine initialized')
  }

  // Core emotional adequacy analysis
  async analyzeEmotionalAdequacy(
    emotionalAnalysis: AdvancedEmotionalAnalysis,
    context: EmotionalContext
  ): Promise<AdequacyAnalysis> {
    console.log('🧙‍♂️ Analyzing emotional adequacy...')

    // Map AI emotional analysis to Spinozistic framework
    const spinozisticAffect = this.mapEmotionToSpinozistic(emotionalAnalysis)
    
    // Calculate adequacy metrics
    const adequacyScore = this.calculateAdequacyScore(spinozisticAffect, emotionalAnalysis)
    const powerChange = this.calculatePowerChange(spinozisticAffect, emotionalAnalysis)
    const freedomRatio = this.calculateFreedomRatio(spinozisticAffect, context)
    const blessednessLevel = adequacyScore * freedomRatio
    
    // Identify inadequate ideas
    const inadequateIdeas = this.identifyInadequateIdeas(spinozisticAffect, emotionalAnalysis, context)
    
    // Build causal chain
    const causalChain = this.buildCausalChain(spinozisticAffect, emotionalAnalysis, context)
    
    // Determine coaching strategy
    const coachingStrategy = this.determineCoachingStrategy(spinozisticAffect, inadequateIdeas, context)
    
    // Select manipulation strategy
    const manipulationStrategy = this.selectManipulationStrategy(spinozisticAffect, emotionalAnalysis, context)
    
    // Calculate emotional gap and transformation path
    const emotionalGap = this.calculateEmotionalGap(emotionalAnalysis, context)
    const transformationPath = this.buildTransformationPath(spinozisticAffect, emotionalAnalysis, context)

    const analysis: AdequacyAnalysis = {
      primaryAffect: spinozisticAffect,
      secondaryAffects: [],
      powerChange,
      adequacyScore,
      bondageLevel: spinozisticAffect.bondageLevel,
      freedomRatio,
      blessednessLevel,
      inadequateIdeas,
      causalChain,
      coachingStrategy,
      manipulationStrategy,
      emotionalGap,
      transformationPath
    }

    console.log('🧙‍♂️ Emotional adequacy analysis completed:', {
      affect: spinozisticAffect.name,
      adequacyScore,
      powerChange,
      freedomRatio,
      manipulationStrategy: manipulationStrategy.name
    })

    return analysis
  }

  // Map AI emotional analysis to Spinozistic affects
  private mapEmotionToSpinozistic(emotionalAnalysis: AdvancedEmotionalAnalysis): EnhancedSpinozisticAffect {
    const emotion = emotionalAnalysis.primaryEmotion.toLowerCase()
    
    // Enhanced mapping with emotional intelligence
    const emotionMapping: { [key: string]: string } = {
      'sadness': 'sadness',
      'depression': 'sadness',
      'melancholy': 'sadness',
      'grief': 'sadness',
      'joy': 'joy',
      'happiness': 'joy',
      'excitement': 'joy',
      'elation': 'joy',
      'anger': 'hate',
      'rage': 'hate',
      'frustration': 'hate',
      'fear': 'fear',
      'anxiety': 'fear',
      'worry': 'fear',
      'love': 'love',
      'affection': 'love',
      'passion': 'love',
      'hope': 'hope',
      'optimism': 'hope',
      'confidence': 'confidence',
      'assurance': 'confidence',
      'despair': 'despair',
      'hopelessness': 'despair',
      'pride': 'pride',
      'arrogance': 'pride',
      'humility': 'humility',
      'shame': 'humility',
      'envy': 'envy',
      'jealousy': 'envy',
      'pity': 'pity',
      'compassion': 'pity',
      'indignation': 'indignation',
      'outrage': 'indignation',
      'contempt': 'contempt',
      'disgust': 'contempt',
      'favor': 'favor',
      'gratitude': 'favor'
    }

    const spinozisticEmotion = emotionMapping[emotion] || 'sadness'
    return this.enhancedAffects.find(a => a.name === spinozisticEmotion) || this.enhancedAffects[0]
  }

  // Calculate adequacy score based on emotional intelligence
  private calculateAdequacyScore(
    affect: EnhancedSpinozisticAffect, 
    emotionalAnalysis: AdvancedEmotionalAnalysis
  ): number {
    let score = affect.adequacyLevel === 'adequate' ? 0.8 : 
                affect.adequacyLevel === 'inadequate' ? 0.2 : 0.5

    // Adjust based on emotional intelligence insights
    if (emotionalAnalysis.underlyingThemes.includes('self-awareness')) {
      score += 0.1
    }
    
    if (emotionalAnalysis.vulnerabilityIndicators.length > 0) {
      score -= 0.1 // Vulnerability can indicate inadequate ideas
    }
    
    if (emotionalAnalysis.safetySignals.length > 0) {
      score += 0.1 // Safety signals indicate adequate understanding
    }

    return Math.max(0, Math.min(1, score))
  }

  // Calculate power change with emotional intelligence
  private calculatePowerChange(
    affect: EnhancedSpinozisticAffect,
    emotionalAnalysis: AdvancedEmotionalAnalysis
  ): number {
    let powerChange = affect.powerChange === 'increase' ? 0.8 : 
                     affect.powerChange === 'decrease' ? -0.8 : 0

    // Adjust based on emotional intensity and context
    powerChange *= emotionalAnalysis.intensity

    // Consider communication style
    if (emotionalAnalysis.communicationStyle === 'assertive') {
      powerChange += 0.2
    } else if (emotionalAnalysis.communicationStyle === 'submissive') {
      powerChange -= 0.2
    }

    return Math.max(-1, Math.min(1, powerChange))
  }

  // Calculate freedom ratio with relationship context
  private calculateFreedomRatio(
    affect: EnhancedSpinozisticAffect,
    context: EmotionalContext
  ): number {
    let freedomRatio = affect.bondageLevel === 'high' ? 0.2 :
                      affect.bondageLevel === 'medium' ? 0.5 : 0.8

    // Adjust based on relationship context
    if (context.relationshipContext) {
      const rel = context.relationshipContext
      freedomRatio *= rel.trustLevel
      freedomRatio *= rel.emotionalSafety
    }

    return Math.max(0, Math.min(1, freedomRatio))
  }

  // Identify inadequate ideas with emotional intelligence
  private identifyInadequateIdeas(
    affect: EnhancedSpinozisticAffect,
    emotionalAnalysis: AdvancedEmotionalAnalysis,
    context: EmotionalContext
  ): string[] {
    let inadequateIdeas = [...affect.inadequateIdeas]

    // Add inadequate ideas based on emotional analysis
    if (emotionalAnalysis.vulnerabilityIndicators.length > 0) {
      inadequateIdeas.push('external_dependency', 'lack_of_self_worth')
    }

    if (emotionalAnalysis.underlyingThemes.includes('control')) {
      inadequateIdeas.push('need_for_control', 'external_blame')
    }

    if (emotionalAnalysis.underlyingThemes.includes('perfectionism')) {
      inadequateIdeas.push('unrealistic_expectations', 'self_criticism')
    }

    return [...new Set(inadequateIdeas)] // Remove duplicates
  }

  // Build causal chain with emotional intelligence
  private buildCausalChain(
    affect: EnhancedSpinozisticAffect,
    emotionalAnalysis: AdvancedEmotionalAnalysis,
    context: EmotionalContext
  ): string[] {
    const chain = [
      `User expresses ${affect.name}`,
      `This indicates ${affect.powerChange} in power`,
      `Root cause: ${affect.inadequateIdeas.length > 0 ? affect.inadequateIdeas.join(', ') : 'adequate ideas'}`
    ]

    // Add emotional intelligence insights
    if (emotionalAnalysis.underlyingThemes.length > 0) {
      chain.push(`Underlying themes: ${emotionalAnalysis.underlyingThemes.join(', ')}`)
    }

    if (emotionalAnalysis.vulnerabilityIndicators.length > 0) {
      chain.push(`Vulnerability indicators: ${emotionalAnalysis.vulnerabilityIndicators.join(', ')}`)
    }

    return chain
  }

  // Determine coaching strategy with emotional intelligence
  private determineCoachingStrategy(
    affect: EnhancedSpinozisticAffect,
    inadequateIdeas: string[],
    context: EmotionalContext
  ): string {
    // Use affect's coaching approach as base
    let strategy = affect.coachingApproach

    // Adjust based on emotional context
    if (context.currentEmotionalState.vulnerabilityIndicators.length > 0) {
      strategy = 'build_emotional_safety'
    }

    if (context.currentEmotionalState.intensity > 0.8) {
      strategy = 'regulate_emotional_intensity'
    }

    if (inadequateIdeas.includes('external_dependency')) {
      strategy = 'foster_self_adequacy'
    }

    return strategy
  }

  // Select emotional manipulation strategy
  private selectManipulationStrategy(
    affect: EnhancedSpinozisticAffect,
    emotionalAnalysis: AdvancedEmotionalAnalysis,
    context: EmotionalContext
  ): EmotionalManipulationStrategy {
    // Use affect's manipulation strategy as base
    let strategy = affect.emotionalManipulation

    // Adjust based on emotional intelligence
    if (emotionalAnalysis.communicationStyle === 'defensive') {
      strategy = this.manipulationStrategies.get('build_trust') || strategy
    }

    if (emotionalAnalysis.intensity > 0.8) {
      strategy = this.manipulationStrategies.get('regulate_intensity') || strategy
    }

    if (emotionalAnalysis.vulnerabilityIndicators.length > 0) {
      strategy = this.manipulationStrategies.get('foster_safety') || strategy
    }

    return strategy
  }

  // Calculate emotional gap (current vs target state)
  private calculateEmotionalGap(
    emotionalAnalysis: AdvancedEmotionalAnalysis,
    context: EmotionalContext
  ): number {
    // For now, calculate gap based on adequacy score
    // In a full implementation, this would compare current state to therapeutic goals
    return 1 - emotionalAnalysis.confidence
  }

  // Build transformation path
  private buildTransformationPath(
    affect: EnhancedSpinozisticAffect,
    emotionalAnalysis: AdvancedEmotionalAnalysis,
    context: EmotionalContext
  ): string[] {
    const path = []

    // Start with current state
    path.push(`Current: ${affect.name} (${affect.powerChange} power)`)

    // Add transformation steps based on inadequate ideas
    if (affect.inadequateIdeas.length > 0) {
      path.push(`Transform: ${affect.inadequateIdeas.join(' → ')}`)
    }

    // Add emotional intelligence steps
    if (emotionalAnalysis.vulnerabilityIndicators.length > 0) {
      path.push(`Build: emotional safety and self-worth`)
    }

    // Target state
    path.push(`Target: adequate understanding and freedom`)

    return path
  }

  // Initialize enhanced Spinozistic affects with manipulation strategies
  private initializeEnhancedSpinozisticAffects(): EnhancedSpinozisticAffect[] {
    return [
      {
        name: 'joy',
        definition: 'Increase in power of acting, accompanied by the idea of its cause',
        powerChange: 'increase',
        adequacyLevel: 'adequate',
        bondageLevel: 'low',
        relatedConcepts: ['power_increase', 'adequate_ideas', 'freedom'],
        inadequateIdeas: [],
        coachingApproach: 'reinforce_adequate_ideas',
        emotionalManipulation: {
          name: 'amplify_joy',
          description: 'Enhance and sustain positive emotional states',
          techniques: ['validation', 'celebration', 'connection'],
          targetOutcome: 'sustained_adequacy',
          riskLevel: 'low',
          effectiveness: 0.9
        }
      },
      {
        name: 'sadness',
        definition: 'Decrease in power of acting, accompanied by the idea of its cause',
        powerChange: 'decrease',
        adequacyLevel: 'inadequate',
        bondageLevel: 'high',
        relatedConcepts: ['power_decrease', 'inadequate_ideas', 'bondage'],
        inadequateIdeas: ['external_causes', 'lack_of_control', 'meaninglessness'],
        coachingApproach: 'identify_inadequate_ideas',
        emotionalManipulation: {
          name: 'transform_sadness',
          description: 'Transform sadness through understanding and adequacy building',
          techniques: ['validation', 'reframing', 'adequacy_building'],
          targetOutcome: 'adequate_understanding',
          riskLevel: 'medium',
          effectiveness: 0.8
        }
      }
      // ... Add all other affects with their manipulation strategies
    ]
  }

  // Initialize manipulation strategies
  private initializeManipulationStrategies(): Map<string, EmotionalManipulationStrategy> {
    const strategies = new Map<string, EmotionalManipulationStrategy>()
    
    strategies.set('build_trust', {
      name: 'build_trust',
      description: 'Build trust through consistent, safe responses',
      techniques: ['validation', 'consistency', 'safety_signals'],
      targetOutcome: 'increased_trust',
      riskLevel: 'low',
      effectiveness: 0.8
    })

    strategies.set('regulate_intensity', {
      name: 'regulate_intensity',
      description: 'Help regulate emotional intensity',
      techniques: ['grounding', 'validation', 'perspective'],
      targetOutcome: 'regulated_emotions',
      riskLevel: 'medium',
      effectiveness: 0.7
    })

    strategies.set('foster_safety', {
      name: 'foster_safety',
      description: 'Create emotional safety for vulnerability',
      techniques: ['acceptance', 'non_judgment', 'support'],
      targetOutcome: 'emotional_safety',
      riskLevel: 'low',
      effectiveness: 0.9
    })

    return strategies
  }

  // Get manipulation summary for context building
  getManipulationSummary(analysis: AdequacyAnalysis): string {
    return `Emotional Adequacy Analysis:
- Primary Affect: ${analysis.primaryAffect.name}
- Adequacy Score: ${analysis.adequacyScore.toFixed(2)}
- Power Change: ${analysis.powerChange.toFixed(2)}
- Freedom Ratio: ${analysis.freedomRatio.toFixed(2)}
- Manipulation Strategy: ${analysis.manipulationStrategy.name}
- Target Outcome: ${analysis.manipulationStrategy.targetOutcome}
- Effectiveness: ${analysis.manipulationStrategy.effectiveness.toFixed(2)}
- Emotional Gap: ${analysis.emotionalGap.toFixed(2)}
- Transformation Path: ${analysis.transformationPath.join(' → ')}`
  }
}
