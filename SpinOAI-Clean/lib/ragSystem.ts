// Spino RAG System - Powered by Local Library
// Complete integration with EnhancedRAG and Empowerapy emotional transformation
// This gives Spino complete independence with its own RAG capabilities

import { 
  EnhancedRAG, 
  EnhancedRAGQuery, 
  EnhancedRAGResponse
} from './enhancedRAG'

import {
  EMPOWERAPY_KNOWLEDGE_BASE,
  EMPOWERAPY_EMOTIONS,
  EMPOWERAPY_THERAPEUTIC_PRACTICES,
  EMPOWERAPY_TRAINING_DIALOGUES,
  EMPOWERAPY_RAG_INDEX
} from './empowerapy/empowerapyKnowledge'

export class SpinoRAGSystem {
  private static instance: SpinoRAGSystem
  private enhancedRAG: EnhancedRAG
  private isInitialized: boolean = false

  constructor() {
    this.enhancedRAG = EnhancedRAG.getInstance()
  }

  // Singleton pattern
  static getInstance(): SpinoRAGSystem {
    if (!SpinoRAGSystem.instance) {
      SpinoRAGSystem.instance = new SpinoRAGSystem()
    }
    return SpinoRAGSystem.instance
  }

  // Initialize the RAG system
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('✅ Spino RAG System already initialized')
      return
    }

    try {
      console.log('🔄 Initializing Spino RAG System...')
      
      // Initialize the underlying EnhancedRAG
      await this.enhancedRAG.initialize()
      
      this.isInitialized = true
      console.log('✅ Spino RAG System initialized successfully')
      
    } catch (error) {
      console.error('❌ Failed to initialize Spino RAG System:', error)
      throw error
    }
  }

  // Main query method with Spino-specific enhancements
  async query(query: EnhancedRAGQuery): Promise<EnhancedRAGResponse> {
    if (!this.isInitialized) {
      console.log('🔄 Initializing Spino RAG System...')
      await this.initialize()
    }

    console.log('🔍 Spino RAG Query:', { 
      question: query.question,
      hasContext: !!query.context,
      hasEmotionalState: !!query.emotionalState
    })

    try {
      // Use the shared EnhancedRAG system
      const response = await this.enhancedRAG.query(query)
      
      // Enhance with Spino-specific Empowerapy insights
      const enhancedResponse = await this.enhanceWithEmpowerapyInsights(query.question, response)
      
      console.log('✅ Spino RAG response generated successfully')
      return enhancedResponse
      
    } catch (error) {
      console.error('❌ Spino RAG query error:', error)
      throw error
    }
  }

  // Enhanced Empowerapy emotional coaching
  async enhanceWithEmpowerapyInsights(question: string, baseResponse: EnhancedRAGResponse): Promise<EnhancedRAGResponse> {
    try {
      // Detect emotional patterns in the question
      const emotionalPattern = this.detectEmotionalPattern(question)
      
      if (emotionalPattern) {
        console.log('🎭 Detected emotional pattern:', emotionalPattern.name)
        
        // Get Empowerapy insights
        const empowerapyInsights = this.getEmpowerapyInsights(emotionalPattern.name, question)
        
        if (empowerapyInsights) {
          // Enhance the response with therapeutic guidance
          const enhancedAnswer = this.buildTherapeuticResponse(baseResponse.answer, empowerapyInsights)
          
          return {
            ...baseResponse,
            answer: enhancedAnswer,
            source: "spino-rag-system",
            emotionalInsights: [
              ...baseResponse.emotionalInsights,
              {
                emotion: emotionalPattern.name,
                intensity: 0.8,
                cause: empowerapyInsights.beliefDetected,
                transformation: empowerapyInsights.adequateIdea
              }
            ]
          }
        }
      }
      
      return baseResponse
      
    } catch (error) {
      console.warn('⚠️ Empowerapy enhancement failed:', error)
      return baseResponse
    }
  }

  // Detect emotional patterns in user questions
  private detectEmotionalPattern(question: string): any {
    const questionLower = question.toLowerCase()
    
    // Check for fear patterns
    if (questionLower.includes('afraid') || questionLower.includes('scared') || questionLower.includes('terrified') || 
        questionLower.includes('fear') || questionLower.includes('worried') || questionLower.includes('anxious')) {
      return EMPOWERAPY_EMOTIONS.get('fear')
    }
    
    // Check for anger patterns
    if (questionLower.includes('angry') || questionLower.includes('furious') || questionLower.includes('mad') || 
        questionLower.includes('hate') || questionLower.includes('disrespect') || questionLower.includes('rage')) {
      return EMPOWERAPY_EMOTIONS.get('anger')
    }
    
    // Check for shame patterns
    if (questionLower.includes('ashamed') || questionLower.includes('shame') || questionLower.includes('guilty') || 
        questionLower.includes('failure') || questionLower.includes('embarrassed') || questionLower.includes('worthless')) {
      return EMPOWERAPY_EMOTIONS.get('shame')
    }
    
    // Check for envy patterns
    if (questionLower.includes('envy') || questionLower.includes('jealous') || questionLower.includes('better than me') || 
        questionLower.includes('success') || questionLower.includes('struggle') || questionLower.includes('comparison')) {
      return EMPOWERAPY_EMOTIONS.get('envy')
    }
    
    // Check for sadness patterns
    if (questionLower.includes('sad') || questionLower.includes('grieving') || questionLower.includes('lost') || 
        questionLower.includes('grief') || questionLower.includes('depressed') || questionLower.includes('hopeless')) {
      return EMPOWERAPY_EMOTIONS.get('sadness')
    }
    
    return null
  }

  // Get Empowerapy insights for emotional transformation
  private getEmpowerapyInsights(emotion: string, question: string): any {
    try {
      // Find matching pattern in RAG index
      const pattern = EMPOWERAPY_RAG_INDEX.find((item: any) => 
        item.emotion.toLowerCase() === emotion.toLowerCase()
      )
      
      if (pattern) {
        return pattern
      }
      
      // Fallback to direct emotion lookup
      return EMPOWERAPY_EMOTIONS.get(emotion)
      
    } catch (error) {
      console.warn('⚠️ Failed to get Empowerapy insights:', error)
      return null
    }
  }

  // Build therapeutic response with Empowerapy guidance
  private buildTherapeuticResponse(baseAnswer: string, empowerapyInsights: any): string {
    if (!empowerapyInsights) {
      return baseAnswer
    }

    const therapeuticGuidance = `
${baseAnswer}

🎭 **Emotional Transformation Guidance**

**Detected Pattern**: ${empowerapyInsights.emotion}
**Core Belief**: ${empowerapyInsights.beliefDetected}
**Inadequate Idea**: ${empowerapyInsights.inadequateIdea}

**Transformative Reframe**: ${empowerapyInsights.reframe}

**Therapeutic Practice**: ${empowerapyInsights.therapeuticPractice}
**Adequate Idea**: ${empowerapyInsights.adequateIdea}

**Philosophical Wisdom**:
${empowerapyInsights.quotes?.map((quote: string) => `• "${quote}"`).join('\n') || '• "Understanding is the path to freedom"'}
`

    return therapeuticGuidance
  }

  // Get therapeutic practice recommendations
  getTherapeuticPractice(emotion: string): any {
    try {
          return EMPOWERAPY_THERAPEUTIC_PRACTICES.find((practice: any) => 
      practice.emotionalStates.includes(emotion.toLowerCase()) ||
      practice.emotionalStates.includes('all')
    )
    } catch (error) {
      console.warn('⚠️ Failed to get therapeutic practice:', error)
      return null
    }
  }

  // Get training dialogue examples
  getTrainingDialogue(scenario: string): any {
    try {
      return EMPOWERAPY_TRAINING_DIALOGUES.find((dialogue: any) => 
        dialogue.scenario.toLowerCase().includes(scenario.toLowerCase())
      )
    } catch (error) {
      console.warn('⚠️ Failed to get training dialogue:', error)
      return null
    }
  }

  // Get complete Empowerapy knowledge base
  getEmpowerapyKnowledgeBase() {
    return EMPOWERAPY_KNOWLEDGE_BASE
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      if (!this.isInitialized) {
        return { status: 'not_initialized', details: { message: 'RAG system not initialized' } }
      }

      // Test a simple query
      const testResponse = await this.query({
        question: "Test query for health check",
        maxResults: 1
      })

      return {
        status: 'healthy',
        details: {
          isInitialized: this.isInitialized,
          testQuerySuccessful: !!testResponse,
          responseSource: testResponse.source,
          empowerapyAvailable: !!EMPOWERAPY_KNOWLEDGE_BASE
        }
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          isInitialized: this.isInitialized
        }
      }
    }
  }
}

// Export the Spino RAG System
export default SpinoRAGSystem

// Convenience exports
export { EnhancedRAG } from './enhancedRAG'
export type { 
  EnhancedRAGQuery,
  EnhancedRAGResponse
} from './enhancedRAG'
export {
  EMPOWERAPY_KNOWLEDGE_BASE,
  EMPOWERAPY_EMOTIONS,
  EMPOWERAPY_THERAPEUTIC_PRACTICES,
  EMPOWERAPY_TRAINING_DIALOGUES,
  EMPOWERAPY_RAG_INDEX
} from './empowerapy/empowerapyKnowledge'
