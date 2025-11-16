import OpenAI from 'openai'
import { EmotionalState } from './types'

// Type definitions for RAG system
interface RAGContext {
  content: string;
  source: string;
  relevance: number;
}

interface EmotionalInsight {
  emotion: string;
  intensity: number;
  confidence: number;
}

interface CausalLink {
  cause: string;
  effect: string;
  confidence: number;
}

interface EnhancedRAGResponse {
  response: string;
  confidence: number;
  sources: string[];
  emotionalAnalysis?: any;
}

interface SpinozisticAffect {
  name: string
  definition: string
  powerChange: 'increase' | 'decrease' | 'mixed'
  adequacyLevel: 'adequate' | 'inadequate' | 'mixed'
  bondageLevel: 'high' | 'medium' | 'low'
  relatedConcepts: string[]
  inadequateIdeas: string[]
  coachingApproach: string
}

interface SpinozisticAnalysis {
  primaryAffect: SpinozisticAffect
  secondaryAffects: SpinozisticAffect[]
  powerChange: number // -1 to 1
  adequacyScore: number // 0 to 1
  bondageLevel: 'high' | 'medium' | 'low'
  freedomRatio: number // 0 to 1
  blessednessLevel: number // 0 to 1
  inadequateIdeas: string[]
  causalChain: string[]
  coachingStrategy: string
}

// Minimal UserContext type for compatibility
interface UserContext {
  userId?: string;
  sessionId?: string;
  [key: string]: any;
}

export class EnhancedRAG {
  private openai: OpenAI | undefined
  private knowledgeBase: any // This would typically be a KnowledgeBase object

  constructor(openai: OpenAI, knowledgeBase: any) {
    this.openai = openai
    this.knowledgeBase = knowledgeBase
  }

  private initializeSpinozisticAffects(): SpinozisticAffect[] {
    return [
      // Primary Affects (Part 3)
      {
        name: 'joy',
        definition: 'Increase in power of acting, accompanied by the idea of its cause',
        powerChange: 'increase',
        adequacyLevel: 'adequate',
        bondageLevel: 'low',
        relatedConcepts: ['power_increase', 'adequate_ideas', 'freedom'],
        inadequateIdeas: [],
        coachingApproach: 'reinforce_adequate_ideas'
      },
      {
        name: 'sadness',
        definition: 'Decrease in power of acting, accompanied by the idea of its cause',
        powerChange: 'decrease',
        adequacyLevel: 'inadequate',
        bondageLevel: 'high',
        relatedConcepts: ['power_decrease', 'inadequate_ideas', 'bondage'],
        inadequateIdeas: ['external_causes', 'lack_of_control', 'meaninglessness'],
        coachingApproach: 'identify_inadequate_ideas'
      },
      {
        name: 'love',
        definition: 'Joy accompanied by the idea of an external cause',
        powerChange: 'increase',
        adequacyLevel: 'mixed',
        bondageLevel: 'medium',
        relatedConcepts: ['joy', 'external_causes', 'attachment'],
        inadequateIdeas: ['external_dependency'],
        coachingApproach: 'balance_attachment_freedom'
      },
      {
        name: 'hate',
        definition: 'Sadness accompanied by the idea of an external cause',
        powerChange: 'decrease',
        adequacyLevel: 'inadequate',
        bondageLevel: 'high',
        relatedConcepts: ['sadness', 'external_causes', 'aversion'],
        inadequateIdeas: ['external_blame', 'victim_mentality'],
        coachingApproach: 'transform_aversion_to_understanding'
      },
      {
        name: 'hope',
        definition: 'Inconstant joy, arising from the idea of something future or past',
        powerChange: 'mixed',
        adequacyLevel: 'inadequate',
        bondageLevel: 'medium',
        relatedConcepts: ['uncertainty', 'imagination', 'future_focus'],
        inadequateIdeas: ['uncertainty', 'lack_of_present_focus'],
        coachingApproach: 'ground_in_present_reality'
      },
      {
        name: 'fear',
        definition: 'Inconstant sadness, arising from the idea of something future or past',
        powerChange: 'decrease',
        adequacyLevel: 'inadequate',
        bondageLevel: 'high',
        relatedConcepts: ['uncertainty', 'imagination', 'power_decrease'],
        inadequateIdeas: ['uncertainty', 'lack_of_control', 'future_worry'],
        coachingApproach: 'transform_fear_to_understanding'
      },
      {
        name: 'confidence',
        definition: 'Joy arising from the idea of a past or future thing',
        powerChange: 'increase',
        adequacyLevel: 'adequate',
        bondageLevel: 'low',
        relatedConcepts: ['power_increase', 'adequate_ideas', 'certainty'],
        inadequateIdeas: [],
        coachingApproach: 'reinforce_adequate_ideas'
      },
      {
        name: 'despair',
        definition: 'Sadness arising from the idea of a past or future thing',
        powerChange: 'decrease',
        adequacyLevel: 'inadequate',
        bondageLevel: 'high',
        relatedConcepts: ['power_decrease', 'inadequate_ideas', 'hopelessness'],
        inadequateIdeas: ['hopelessness', 'meaninglessness', 'lack_of_purpose'],
        coachingApproach: 'transform_despair_to_understanding'
      },
      {
        name: 'pride',
        definition: 'Joy arising from a man thinking too highly of himself',
        powerChange: 'increase',
        adequacyLevel: 'inadequate',
        bondageLevel: 'medium',
        relatedConcepts: ['self_overestimation', 'inadequate_ideas'],
        inadequateIdeas: ['self_importance', 'external_validation'],
        coachingApproach: 'transform_pride_to_adequate_self_understanding'
      },
      {
        name: 'humility',
        definition: 'Sadness arising from a man thinking too little of himself',
        powerChange: 'decrease',
        adequacyLevel: 'inadequate',
        bondageLevel: 'high',
        relatedConcepts: ['self_underestimation', 'inadequate_ideas'],
        inadequateIdeas: ['self_deprecation', 'lack_of_self_worth'],
        coachingApproach: 'transform_humility_to_adequate_self_understanding'
      },
      {
        name: 'envy',
        definition: 'Hate, insofar as it affects a man so that he is sad at the good fortune of another',
        powerChange: 'decrease',
        adequacyLevel: 'inadequate',
        bondageLevel: 'high',
        relatedConcepts: ['hate', 'external_comparison', 'inadequate_ideas'],
        inadequateIdeas: ['external_comparison', 'lack_of_self_worth'],
        coachingApproach: 'transform_envy_to_self_adequacy'
      },
      {
        name: 'pity',
        definition: 'Love, insofar as it affects a man so that he is sad at the ill fortune of another',
        powerChange: 'decrease',
        adequacyLevel: 'mixed',
        bondageLevel: 'medium',
        relatedConcepts: ['love', 'external_suffering', 'compassion'],
        inadequateIdeas: ['external_suffering'],
        coachingApproach: 'transform_pity_to_understanding'
      },
      {
        name: 'indignation',
        definition: 'Hate toward one who has done evil to another',
        powerChange: 'decrease',
        adequacyLevel: 'inadequate',
        bondageLevel: 'high',
        relatedConcepts: ['hate', 'external_judgment', 'inadequate_ideas'],
        inadequateIdeas: ['external_judgment', 'moral_condemnation'],
        coachingApproach: 'transform_indignation_to_understanding'
      },
      {
        name: 'overestimation',
        definition: 'Love toward one who has done good to another',
        powerChange: 'increase',
        adequacyLevel: 'mixed',
        bondageLevel: 'medium',
        relatedConcepts: ['love', 'external_validation', 'gratitude'],
        inadequateIdeas: ['external_validation'],
        coachingApproach: 'balance_gratitude_with_adequacy'
      },
      {
        name: 'contempt',
        definition: 'Hate toward one who has done evil to us',
        powerChange: 'decrease',
        adequacyLevel: 'inadequate',
        bondageLevel: 'high',
        relatedConcepts: ['hate', 'personal_aversion', 'inadequate_ideas'],
        inadequateIdeas: ['personal_aversion', 'lack_of_understanding'],
        coachingApproach: 'transform_contempt_to_understanding'
      },
      {
        name: 'favor',
        definition: 'Love toward one who has done good to us',
        powerChange: 'increase',
        adequacyLevel: 'mixed',
        bondageLevel: 'medium',
        relatedConcepts: ['love', 'personal_gratitude', 'attachment'],
        inadequateIdeas: ['personal_attachment'],
        coachingApproach: 'balance_gratitude_with_freedom'
      }
    ]
  }

  private analyzeSpinozisticAffects(text: string): SpinozisticAnalysis {
    const affects = this.initializeSpinozisticAffects()
    const textLower = text.toLowerCase()
    
    console.log('🔍 Analyzing text for Spinozistic affects:', textLower)
    
    // Detect primary affect
    let primaryAffect = affects[0] // default to joy
    let maxScore = 0
    
    for (const affect of affects) {
      const keywords = this.getAffectKeywords(affect.name)
      let score = 0
      
      for (const keyword of keywords) {
        if (textLower.includes(keyword)) {
          score += 1
          console.log(`✅ Found keyword "${keyword}" for affect "${affect.name}"`)
        }
      }
      
      if (score > maxScore) {
        maxScore = score
        primaryAffect = affect
        console.log(`🎯 New primary affect: ${affect.name} (score: ${score})`)
      }
    }
    
    console.log(`🏆 Final primary affect: ${primaryAffect.name}`)
    
    // Calculate power change (-1 to 1)
    const powerChange = primaryAffect.powerChange === 'increase' ? 0.8 : 
                       primaryAffect.powerChange === 'decrease' ? -0.8 : 0
    
    // Calculate adequacy score (0 to 1)
    const adequacyScore = primaryAffect.adequacyLevel === 'adequate' ? 0.8 :
                         primaryAffect.adequacyLevel === 'inadequate' ? 0.2 : 0.5
    
    // Calculate freedom ratio (0 to 1)
    const bondageLevel = primaryAffect.bondageLevel === 'high' ? 0.2 :
                        primaryAffect.bondageLevel === 'medium' ? 0.5 : 0.8
    const freedomRatio = bondageLevel
    
    // Calculate blessedness level (0 to 1)
    const blessednessLevel = adequacyScore * freedomRatio
    
    // Identify inadequate ideas
    const inadequateIdeas = primaryAffect.inadequateIdeas
    
    // Build causal chain
    const causalChain = [
      `User expresses ${primaryAffect.name}`,
      `This indicates ${primaryAffect.powerChange} in power`,
      `Root cause: ${inadequateIdeas.length > 0 ? inadequateIdeas.join(', ') : 'adequate ideas'}`
    ]
    
    // Determine coaching strategy
    const coachingStrategy = this.determineCoachingStrategy(primaryAffect, inadequateIdeas)
    
    const analysis = {
      primaryAffect,
      secondaryAffects: [], // Could be enhanced to detect multiple affects
      powerChange,
      adequacyScore,
      bondageLevel: primaryAffect.bondageLevel,
      freedomRatio,
      blessednessLevel,
      inadequateIdeas,
      causalChain,
      coachingStrategy
    }
    
    console.log('📊 Spinozistic Analysis Results:', {
      affect: primaryAffect.name,
      powerChange,
      adequacyScore,
      bondageLevel: primaryAffect.bondageLevel,
      freedomRatio,
      inadequateIdeas,
      coachingStrategy
    })
    
    return analysis
  }

  private getAffectKeywords(affectName: string): string[] {
    const keywordMap: { [key: string]: string[] } = {
      'joy': ['happy', 'joy', 'excited', 'elated', 'thrilled', 'delighted', 'pleased'],
      'sadness': ['sad', 'down', 'depressed', 'melancholy', 'sorrow', 'grief', 'despair'],
      'love': ['love', 'adore', 'cherish', 'passion', 'affection', 'devotion'],
      'hate': ['hate', 'despise', 'loathe', 'abhor', 'detest', 'rage', 'anger'],
      'hope': ['hope', 'optimistic', 'expectant', 'anticipating', 'looking forward'],
      'fear': ['afraid', 'scared', 'terrified', 'anxious', 'worried', 'fearful'],
      'confidence': ['confident', 'assured', 'certain', 'secure', 'trusting'],
      'despair': ['hopeless', 'despair', 'desperate', 'forlorn', 'defeated'],
      'pride': ['proud', 'arrogant', 'conceited', 'vain', 'self-important'],
      'humility': ['humble', 'modest', 'self-deprecating', 'inferior', 'worthless'],
      'envy': ['envious', 'jealous', 'covetous', 'resentful', 'bitter'],
      'pity': ['pity', 'compassion', 'sympathy', 'empathy', 'sorrow for others'],
      'indignation': ['indignant', 'outraged', 'righteous anger', 'moral outrage'],
      'overestimation': ['grateful', 'thankful', 'appreciative', 'indebted'],
      'contempt': ['contempt', 'disdain', 'scorn', 'disgust', 'revulsion'],
      'favor': ['favor', 'kindness', 'generosity', 'benevolence', 'goodwill']
    }
    
    return keywordMap[affectName] || []
  }

  private determineCoachingStrategy(affect: SpinozisticAffect, inadequateIdeas: string[]): string {
    switch (affect.coachingApproach) {
      case 'reinforce_adequate_ideas':
        return 'reinforce_adequate_ideas'
      case 'identify_inadequate_ideas':
        return 'identify_inadequate_ideas'
      case 'transform_inadequate_ideas':
        return 'transform_inadequate_ideas'
      case 'balance_attachment_freedom':
        return 'balance_attachment_freedom'
      case 'transform_aversion_to_understanding':
        return 'transform_aversion_to_understanding'
      case 'ground_in_present_reality':
        return 'ground_in_present_reality'
      case 'transform_fear_to_understanding':
        return 'transform_fear_to_understanding'
      case 'transform_despair_to_understanding':
        return 'transform_despair_to_understanding'
      case 'transform_pride_to_adequate_self_understanding':
        return 'transform_pride_to_adequate_self_understanding'
      case 'transform_humility_to_adequate_self_understanding':
        return 'transform_humility_to_adequate_self_understanding'
      case 'transform_envy_to_self_adequacy':
        return 'transform_envy_to_self_adequacy'
      case 'transform_pity_to_understanding':
        return 'transform_pity_to_understanding'
      case 'transform_indignation_to_understanding':
        return 'transform_indignation_to_understanding'
      case 'balance_gratitude_with_adequacy':
        return 'balance_gratitude_with_adequacy'
      case 'transform_contempt_to_understanding':
        return 'transform_contempt_to_understanding'
      case 'balance_gratitude_with_freedom':
        return 'balance_gratitude_with_freedom'
      default:
        return 'identify_inadequate_ideas'
    }
  }

  private generateSpinozisticCoachingResponse(analysis: SpinozisticAnalysis, originalText: string): string {
    const { primaryAffect, inadequateIdeas, powerChange, adequacyScore, freedomRatio, coachingStrategy } = analysis
    
    console.log('🎭 Generating Spinozistic coaching response for:', {
      affect: primaryAffect.name,
      strategy: coachingStrategy,
      inadequateIdeas
    })
    
    // Spinozistic coaching responses based on affect and strategy
    const coachingResponses: { [key: string]: string } = {
      'reinforce_adequate_ideas': `I see you're experiencing ${primaryAffect.name}. This is a sign of adequate ideas - your power is increasing. This is the path toward freedom and blessedness. What do you think is enabling this clarity in your understanding?`,
      
      'identify_inadequate_ideas': `I hear the ${primaryAffect.name} in what you're saying. This indicates a decrease in your power - you're being affected by inadequate ideas. The root cause is likely: ${inadequateIdeas.join(', ')}. What do you think might be the inadequate idea behind this feeling?`,
      
      'transform_inadequate_ideas': `Your ${primaryAffect.name} shows you're being affected by inadequate ideas. This is bondage - you're being controlled by external causes rather than acting from your own nature. What would it look like to understand this situation from adequate ideas instead?`,
      
      'balance_attachment_freedom': `I sense ${primaryAffect.name} in your words. While this can be a source of joy, it also creates attachment to external causes. True freedom comes from understanding that we are part of nature's necessity. How might you balance this attachment with your own power?`,
      
      'transform_aversion_to_understanding': `Your ${primaryAffect.name} indicates aversion - you're being affected by what you hate. This is bondage. Instead of being controlled by what you oppose, what would it look like to understand the necessity behind this situation?`,
      
      'ground_in_present_reality': `I hear ${primaryAffect.name} in your words. This affect arises from imagination - focusing on uncertain future or past events. To move toward freedom, we need to ground ourselves in present reality. What's actually happening right now?`,
      
      'transform_fear_to_understanding': `Your ${primaryAffect.name} shows you're being affected by uncertainty and imagination. Fear is bondage - it decreases your power. What would it look like to understand the necessity behind what you're fearing?`,
      
      'transform_despair_to_understanding': `I sense ${primaryAffect.name} in what you're saying. This is the lowest point of bondage - complete powerlessness. But even here, you can begin to understand the necessity of your situation. What would it look like to see this as part of nature's order?`,
      
      'transform_pride_to_adequate_self_understanding': `Your ${primaryAffect.name} shows you're thinking too highly of yourself. This is inadequate because it depends on external validation. What would it look like to understand your true nature without comparison to others?`,
      
      'transform_humility_to_adequate_self_understanding': `I hear ${primaryAffect.name} in your words. You're thinking too little of yourself, which is also inadequate. True understanding comes from seeing yourself as part of nature's necessity. What would adequate self-understanding look like?`,
      
      'transform_envy_to_self_adequacy': `Your ${primaryAffect.name} shows you're comparing yourself to others. This is bondage - you're being controlled by external standards. What would it look like to understand your own adequacy without comparison?`,
      
      'transform_pity_to_understanding': `I sense ${primaryAffect.name} in your words. While compassion can be good, pity often involves inadequate ideas about suffering. What would it look like to understand the necessity behind suffering?`,
      
      'transform_indignation_to_understanding': `Your ${primaryAffect.name} shows moral judgment. This is bondage - you're being controlled by ideas of good and evil. What would it look like to understand the necessity behind all actions?`,
      
      'balance_gratitude_with_adequacy': `I hear ${primaryAffect.name} in your words. While gratitude can be good, it can also create dependency on external causes. How might you balance this gratitude with understanding your own power?`,
      
      'transform_contempt_to_understanding': `Your ${primaryAffect.name} shows personal aversion. This is bondage - you're being controlled by what you oppose. What would it look like to understand the necessity behind this person's actions?`,
      
      'balance_gratitude_with_freedom': `I sense ${primaryAffect.name} in your words. While this gratitude is good, it can create attachment to external causes. How might you balance this gratitude with your own freedom?`
    }
    
    const response = coachingResponses[coachingStrategy] || coachingResponses['identify_inadequate_ideas']
    
    console.log('💬 Generated Spinozistic response:', response.substring(0, 100) + '...')
    
    return response
  }

  private generateTrainingBasedResponse(question: string, relevantContent: RAGContext[], emotionalInsights: EmotionalInsight[], causalChain: CausalLink[]): EnhancedRAGResponse {
    console.log('🔄 Generating Spinozistic coaching response')
    const questionLower = question.toLowerCase()

    // Handle very short responses with specific Spinozistic responses
    if (questionLower.length <= 3) {
      if (questionLower === 'ok') {
        const response = "I hear you. Sometimes 'ok' can mean many things - maybe you're processing, maybe you're not sure what to say, or maybe you're feeling a bit stuck. What's really going on for you right now?"
        return {
          response: response,
          confidence: 0.6,
          sources: ["Spinozistic Coaching System"]
        }
      }

      if (questionLower === 'empty' || questionLower === 'emptiness') {
        const response = "That feeling of emptiness - it's like there's a void inside that nothing seems to fill. This indicates inadequate ideas about your own nature and purpose. What do you think might be the inadequate idea behind this emptiness?"
        return {
          response: response,
          confidence: 0.7,
          sources: ["Spinozistic Coaching System"]
        }
      }

      if (questionLower === 'lost') {
        const response = "Feeling lost - like you're not sure which direction to go. This indicates inadequate ideas about your own nature and the necessity of your situation. What would it look like to understand your situation as part of nature's order?"
        return {
          response: response,
          confidence: 0.7,
          sources: ["Spinozistic Coaching System"]
        }
      }
    }

    // Perform comprehensive Spinozistic analysis
    const spinozisticAnalysis = this.analyzeSpinozisticAffects(questionLower)
    console.log('🎭 Spinozistic analysis:', spinozisticAnalysis)

    // Generate Spinozistic coaching response
    const bestResponse = this.generateSpinozisticCoachingResponse(spinozisticAnalysis, questionLower)
    const reasoning = `Spinozistic analysis: ${spinozisticAnalysis.primaryAffect.name} (power: ${spinozisticAnalysis.powerChange}, adequacy: ${spinozisticAnalysis.adequacyScore}, freedom: ${spinozisticAnalysis.freedomRatio})`
    const relatedConcepts = spinozisticAnalysis.primaryAffect.relatedConcepts

    // If no response was generated, throw an error instead of returning generic response
    if (!bestResponse) {
      throw new Error('No appropriate Spinozistic response could be generated')
    }

    return {
      response: bestResponse,
      confidence: relevantContent.length > 0 ? 0.8 : 0.6,
      sources: ["Spinozistic Coaching System"]
    }
  }

  private fallbackSearch(query: string, maxResults: number): RAGContext[] {
    console.log('🔄 Using Spinozistic fallback search for query:', query)
    const queryLower = query.toLowerCase()
    const results: RAGContext[] = []

    // Get Spinozistic analysis for the query
    const spinozisticAnalysis = this.analyzeSpinozisticAffects(queryLower)
    const primaryAffect = spinozisticAnalysis.primaryAffect

    // Search through training examples with Spinozistic context
    for (const example of this.knowledgeBase.examples) {
      const scenarioLower = example.scenario.toLowerCase()
      const conceptsLower = example.concepts.join(' ').toLowerCase()
      const analysisLower = example.causalAnalysis.toLowerCase()
      let score = 0

      // Direct affect matching
      if (scenarioLower.includes(primaryAffect.name)) score += 15
      if (conceptsLower.includes(primaryAffect.name)) score += 12
      if (analysisLower.includes(primaryAffect.name)) score += 10

      // Inadequate ideas matching
      for (const inadequateIdea of primaryAffect.inadequateIdeas) {
        if (scenarioLower.includes(inadequateIdea)) score += 8
        if (conceptsLower.includes(inadequateIdea)) score += 6
        if (analysisLower.includes(inadequateIdea)) score += 4
      }

      // Related concepts matching
      for (const concept of primaryAffect.relatedConcepts) {
        if (scenarioLower.includes(concept)) score += 5
        if (conceptsLower.includes(concept)) score += 4
        if (analysisLower.includes(concept)) score += 3
      }

      // General emotional keyword matching
      const emotionalKeywords = this.getAffectKeywords(primaryAffect.name)
      for (const keyword of emotionalKeywords) {
        if (queryLower.includes(keyword) && scenarioLower.includes(keyword)) {
          score += 6
          break
        }
      }

      // Power change matching
      if (primaryAffect.powerChange === 'decrease' && (scenarioLower.includes('power_decrease') || scenarioLower.includes('inadequate'))) {
        score += 4
      }
      if (primaryAffect.powerChange === 'increase' && (scenarioLower.includes('power_increase') || scenarioLower.includes('adequate'))) {
        score += 4
      }

      // Bondage level matching
      if (primaryAffect.bondageLevel === 'high' && (scenarioLower.includes('bondage') || scenarioLower.includes('external'))) {
        score += 3
      }
      if (primaryAffect.bondageLevel === 'low' && (scenarioLower.includes('freedom') || scenarioLower.includes('adequate'))) {
        score += 3
      }

      // Individual word matches for longer queries
      const queryWords = queryLower.split(' ')
      for (const word of queryWords) {
        if (word.length > 2) {
          if (scenarioLower.includes(word)) score += 2
          if (conceptsLower.includes(word)) score += 1
          if (analysisLower.includes(word)) score += 1
        }
      }

      if (score > 0) {
        results.push({
          content: example.scenario,
          source: "spinozistic_training_example",
          relevance: score / 25 // Normalize to 0-1
        })
      }
    }

    results.sort((a, b) => b.relevance - a.relevance)
    const limitedResults = results.slice(0, maxResults)
    console.log('📚 Spinozistic fallback search found:', limitedResults.length, 'relevant examples')
    return limitedResults
  }

  /**
   * Enhance causal chain analysis based on user input
   */
  private enhanceCausalChain(question: string, emotionalAnalysis: any): string[] {
    const words = question.toLowerCase().split(/\s+/);
    const causalChain: string[] = [];

    // Basic causal analysis based on emotional keywords
    if (words.includes('sad') || words.includes('down') || words.includes('empty')) {
      causalChain.push('emotional_state → inadequate_understanding');
      causalChain.push('inadequate_understanding → confusion');
      causalChain.push('confusion → emotional_pain');
    }

    if (words.includes('fear') || words.includes('worry') || words.includes('anxiety')) {
      causalChain.push('uncertainty → fear');
      causalChain.push('fear → avoidance');
      causalChain.push('avoidance → inadequate_understanding');
    }

    if (words.includes('anger') || words.includes('frustrated') || words.includes('mad')) {
      causalChain.push('perceived_injustice → anger');
      causalChain.push('anger → inadequate_ideas');
      causalChain.push('inadequate_ideas → emotional_pain');
    }

    if (words.includes('lonely') || words.includes('alone') || words.includes('isolated')) {
      causalChain.push('misunderstanding → loneliness');
      causalChain.push('loneliness → epistemic_isolation');
      causalChain.push('epistemic_isolation → emotional_pain');
    }

    // Default causal chain if no specific patterns found
    if (causalChain.length === 0) {
      causalChain.push('user_input → inadequate_understanding');
      causalChain.push('inadequate_understanding → emotional_state');
      causalChain.push('emotional_state → need_for_clarity');
    }

    return causalChain;
  }

  async query(question: string, context?: UserContext, emotionalState?: EmotionalState): Promise<EnhancedRAGResponse> {
    console.log('🔍 EnhancedRAG Query:', { question, context, emotionalState })
    console.log('🧪 TEST: New Spinozistic system is active!')
    console.log('🚀 SPINOZA HIMSELF IS NOW ACTIVE!')
    console.log('🔥 FORCE DEPLOYMENT TEST - SPINOZA IS HERE!')
    console.log('🎯 ULTIMATE SPINOZA DEPLOYMENT - THIS IS THE REAL DEAL!')

    try {
      // Perform Spinozistic affect analysis
      const spinozisticAnalysis = this.analyzeSpinozisticAffects(question)
      console.log('🎭 Spinozistic analysis:', spinozisticAnalysis)

      // Search for relevant content using fallback search
      const relevantContent = this.fallbackSearch(question, 5)
      console.log('📚 Found relevant content:', relevantContent.length, 'items')

      // Generate emotional insights using existing method
      const emotionalAnalysis = this.analyzeSpinozisticAffects(question)
      const emotionalInsights = [{
        emotion: emotionalAnalysis.primaryAffect.name,
        intensity: 0.8, // Placeholder, actual intensity would require more sophisticated analysis
        confidence: 0.9,
        cause: 'inadequate_ideas',
        transformation: emotionalAnalysis.primaryAffect.powerChange === 'increase' ? 'power_increase' : 'power_decrease'
      }]
      console.log('💭 Emotional insights:', emotionalInsights)

      // Build causal chain using existing method
      const causalChain = this.enhanceCausalChain(question, emotionalInsights)
      console.log('🔗 Causal chain:', causalChain)

      // Convert string[] to CausalLink[] format
      const causalLinks: CausalLink[] = causalChain.map((link, index) => ({
        cause: link.split(' → ')[0] || 'unknown',
        effect: link.split(' → ')[1] || 'unknown',
        confidence: 0.7 - (index * 0.1) // Decreasing confidence for longer chains
      }))

      // Generate comprehensive response using Spinozistic coaching
      const response = await this.generateComprehensiveResponse(question, relevantContent, emotionalInsights, causalLinks, spinozisticAnalysis)
      
      return response
    } catch (error) {
      console.error('❌ EnhancedRAG query error:', error)
      throw error
    }
  }

  private async generateComprehensiveResponse(
    question: string, 
    relevantContent: RAGContext[], 
    emotionalInsights: EmotionalInsight[], 
    causalChain: CausalLink[],
    spinozisticAnalysis: SpinozisticAnalysis
  ): Promise<EnhancedRAGResponse> {
    console.log('🔄 Generating comprehensive Spinozistic response')

    try {
      if (this.openai) {
        // Use OpenAI for enhanced response generation
        const prompt = this.buildSpinozisticPrompt(question, relevantContent, emotionalInsights, causalChain, spinozisticAnalysis)
        
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are Spinoza himself, coaching someone toward freedom and blessedness. Use his philosophy to help them understand their affects and move toward adequate ideas. Be direct, rational, and compassionate.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })

        const response = completion.choices[0]?.message?.content
        if (!response) {
          throw new Error('No response generated from OpenAI')
        }

        return {
          response: response,
          confidence: relevantContent.length > 0 ? 0.8 : 0.6,
          sources: ["Enhanced RAG System (OpenAI + Spinozistic Analysis)"]
        }
      } else {
        // Fallback to training-based response with Spinozistic analysis
        console.log('🔄 OpenAI not available, using Spinozistic training data for response generation')
        return this.generateTrainingBasedResponse(question, relevantContent, emotionalInsights, causalChain)
      }
    } catch (error) {
      console.error('❌ Error in comprehensive response generation:', error)
      // Fallback to training-based response
      return this.generateTrainingBasedResponse(question, relevantContent, emotionalInsights, causalChain)
    }
  }

  private buildSpinozisticPrompt(
    question: string, 
    relevantContent: RAGContext[], 
    emotionalInsights: EmotionalInsight[], 
    causalChain: CausalLink[],
    spinozisticAnalysis: SpinozisticAnalysis
  ): string {
    const { primaryAffect, inadequateIdeas, powerChange, adequacyScore, freedomRatio, coachingStrategy } = spinozisticAnalysis

    return `As Spinoza, analyze this person's situation and provide coaching:

User's statement: "${question}"

Spinozistic Analysis:
- Primary Affect: ${primaryAffect.name} (${primaryAffect.definition})
- Power Change: ${powerChange > 0 ? 'Increase' : powerChange < 0 ? 'Decrease' : 'Mixed'}
- Adequacy Score: ${adequacyScore} (0-1, higher is more adequate)
- Freedom Ratio: ${freedomRatio} (0-1, higher is more free)
- Bondage Level: ${spinozisticAnalysis.bondageLevel}
- Inadequate Ideas: ${inadequateIdeas.join(', ') || 'None detected'}
- Coaching Strategy: ${coachingStrategy}

Relevant Spinozistic Concepts: [concept extraction unavailable]

Emotional Insights: ${emotionalInsights.map(e => `${e.emotion} (${e.intensity})`).join(', ')}

Causal Chain: ${causalChain.map(c => `${c.cause} → ${c.effect}`).join(' → ')}

Provide a Spinozistic coaching response that:
1. Acknowledges their affect and its meaning
2. Identifies the inadequate ideas causing bondage
3. Guides them toward adequate understanding
4. Helps them see their situation as part of nature's necessity
5. Moves them toward freedom and blessedness

Response:`
  }
}