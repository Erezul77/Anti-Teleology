// Enhanced RAG System - The Best RAG for Spinozistic Philosophy
// World-class retrieval-augmented generation with advanced embeddings and comprehensive knowledge
// SHARED LIBRARY VERSION - Used by both Spino and Noesis projects

import { OpenAI } from 'openai'

// Empowerapy Training Program Integration
export interface EmpowerapyEmotion {
  name: string
  userUtterance: string
  detectedBelief: string
  inadequateIdea: string
  causalReconstruction: {
    event: string
    misinterpretedCause: string
    realCause: string
    rootProblem: string
  }
  reframe: string
  philosophicalSource: string[]
  intervention: string[]
  adequateIdea: string
}

export interface EmpowerapyTherapeuticPractice {
  name: string
  goal: string
  script: string[]
  therapeuticRole: string
  adequacyLevel: 'beginner' | 'intermediate' | 'advanced'
  emotionalStates: string[]
}

export interface EmpowerapyTrainingDialogue {
  scenario: string
  userInput: string
  coachResponse: string
  userFollowUp: string
  coachGuidance: string
  userInsight: string
  finalClarity: string
  emotionalTransformation: string
  adequacyImprovement: number
}

export interface EmpowerapyRAGIndex {
  query: string
  emotion: string
  beliefDetected: string
  inadequateIdea: string
  reframe: string
  intervention: string[]
  adequateIdea: string
  quotes: string[]
  therapeuticPractice: string
  dialogueExample: string
}

// Spinozistic Affect Analysis Interfaces
interface SpinozisticAffect {
  name: string
  definition: string
  powerChange: 'increase' | 'decrease' | 'mixed'
  adequacyLevel: 'adequate' | 'inadequate' | 'mixed'
  bondageLevel: 'high' | 'medium' | 'low'
  relatedConcepts: string[]
  inadequateIdeas: string[]
  coachingApproach: string
  // Empowerapy Integration
  empowerapyMapping?: EmpowerapyEmotion
  therapeuticPractices?: string[]
  transformationPath?: string[]
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

// Real-time Analysis Dashboard Interfaces
export interface RealTimeAnalysis {
  emotionalState: {
    primaryAffect: string
    intensity: number
    powerChange: number
    adequacyScore: number
    valence: number
    arousal: number
    dominance: number
  }
  deconstruction: {
    inadequateIdeas: string[]
    causalChains: CausalLink[]
    transformationPath: string[]
    bondageLevel: string
    freedomRatio: number
  }
  translation: {
    chatLanguage: string
    spinozisticTerms: string[]
    practicalGuidance: string
    conceptMapping: Array<{
      everyday: string
      philosophical: string
      explanation: string
    }>
  }
  sessionProgress: {
    totalMessages: number
    adequacyTrend: number[]
    powerTrend: number[]
    emotionalPatterns: string[]
    sessionDuration: number
  }
  insights: {
    coachingStrategy: string
    nextSteps: string[]
    transformationPotential: number
    blessednessLevel: number
  }
}

export interface EnhancedRAGResponse {
  answer: string
  detailedAnalysis?: string | undefined
  realTimeAnalysis?: RealTimeAnalysis | undefined
  context: RAGContext[]
  confidence: number
  ethicsPart: number
  relatedConcepts: string[]
  source: string
  reasoning: string
  adequacyScore: number
  emotionalInsights: EmotionalInsight[]
  causalChain: CausalLink[]
}

export interface RAGContext {
  text: string
  source: string
  relevance: number
  concepts: string[]
  part: number
}

export interface EmotionalInsight {
  emotion: string
  intensity: number
  cause: string
  transformation: string
}

export interface CausalLink {
  from: string
  to: string
  type: 'adequate' | 'inadequate' | 'neutral'
  confidence: number
}

export interface EnhancedRAGQuery {
  question: string
  context?: UserContext
  emotionalState?: EmotionalState
  maxResults?: number
  includeReasoning?: boolean
}

export interface UserContext {
  currentPart: number
  substanceUnderstanding: number
  emotionalState: EmotionalState
  freedomRatio: number
  blessednessLevel: number
  previousQueries: string[]
}

export interface EmotionalState {
  valence: number
  arousal: number
  dominance: number
  primaryEmotion: string
  secondaryEmotions: string[]
}

export interface SpinozisticKnowledge {
  concepts: Map<string, SpinozisticConcept>
  propositions: SpinozisticProposition[]
  definitions: SpinozisticDefinition[]
  examples: SpinozisticExample[]
  causalChains: CausalChain[]
  emotionalMappings: EmotionalMapping[]
  // Empowerapy Integration
  empowerapyEmotions: Map<string, EmpowerapyEmotion>
  therapeuticPractices: EmpowerapyTherapeuticPractice[]
  trainingDialogues: EmpowerapyTrainingDialogue[]
  ragIndex: EmpowerapyRAGIndex[]
}

export interface SpinozisticConcept {
  name: string
  definition: string
  part: number
  relatedConcepts: string[]
  examples: string[]
  adequacyLevel: 'adequate' | 'inadequate' | 'neutral'
  emotionalImpact: string[]
  causalStructure: string
}

export interface SpinozisticProposition {
  id: string
  text: string
  part: number
  concepts: string[]
  adequacy: number
  emotionalContext: string[]
  causalImplications: string[]
}

export interface SpinozisticDefinition {
  term: string
  definition: string
  part: number
  adequacy: number
  examples: string[]
}

export interface SpinozisticExample {
  scenario: string
  concepts: string[]
  part: number
  adequacy: boolean
  emotionalOutcome: string
  causalAnalysis: string
}

export interface CausalChain {
  id: string
  steps: CausalStep[]
  adequacy: number
  emotionalImpact: string[]
  part: number
}

export interface CausalStep {
  from: string
  to: string
  mechanism: string
  adequacy: 'adequate' | 'inadequate' | 'neutral'
}

export interface EmotionalMapping {
  emotion: string
  causes: string[]
  transformations: string[]
  adequacy: number
  part: number
}

export class EnhancedRAG {
  private static instance: EnhancedRAG
  private knowledgeBase: SpinozisticKnowledge
  private openai?: OpenAI
  private embeddings: Map<string, number[]>
  private isInitialized: boolean = false

  constructor() {
    this.knowledgeBase = {
      concepts: new Map(),
      propositions: [],
      definitions: [],
      examples: [],
      causalChains: [],
      emotionalMappings: [],
      // Initialize Empowerapy knowledge base
      empowerapyEmotions: new Map(),
      therapeuticPractices: [],
      trainingDialogues: [],
      ragIndex: []
    }
    this.embeddings = new Map()
    
    // Initialize OpenAI if API key is available
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey && openaiKey.trim() !== '') {
      try {
        this.openai = new OpenAI({
          apiKey: openaiKey,
        })
        console.log('✅ OpenAI initialized successfully')
      } catch (error) {
        console.error('❌ Failed to initialize OpenAI:', error)
        this.openai = undefined as any
      }
    } else {
      console.log('⚠️ No OpenAI API key found - system will use fallback responses')
      this.openai = undefined as any
    }
  }

  // Singleton pattern
  static getInstance(): EnhancedRAG {
    if (!EnhancedRAG.instance) {
      EnhancedRAG.instance = new EnhancedRAG()
    }
    return EnhancedRAG.instance
  }

  // Initialize the system
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('✅ EnhancedRAG already initialized')
      return
    }

    try {
      console.log('🔄 Initializing EnhancedRAG...')
      
      // Initialize knowledge base
      await this.initializeKnowledgeBase()
      
      // Initialize embeddings
      await this.generateEmbeddings()
      
      this.isInitialized = true
      console.log('✅ EnhancedRAG initialized successfully')
      
    } catch (error) {
      console.error('❌ Failed to initialize EnhancedRAG:', error)
      throw error
    }
  }

  // Main query method
  async query(query: EnhancedRAGQuery): Promise<EnhancedRAGResponse> {
    if (!this.isInitialized) {
      console.log('🔄 Initializing EnhancedRAG...')
      await this.initialize()
    }

    const { question, context, emotionalState, maxResults = 5, includeReasoning = true } = query
    
    console.log('🔍 EnhancedRAG Query:', { 
      questionLength: question.length, 
      hasOpenAI: !!this.openai, 
      isInitialized: this.isInitialized 
    })

    try {
      // Perform Spinozistic affect analysis
      const spinozisticAnalysis = this.analyzeSpinozisticAffects(question)
      console.log('🎭 Spinozistic analysis completed')

      // 1. Semantic search for relevant content (via microservice)
      const relevantContent = await this.semanticSearch(question, maxResults)
      console.log('📚 Found relevant content:', relevantContent.length, 'items')
      
      // 2. Analyze emotional context
      const emotionalInsights = this.analyzeEmotionalContext(question, emotionalState)
      console.log('💭 Emotional insights analyzed')
      
      // 3. Identify causal chains
      const causalChain = this.identifyCausalChain(question, relevantContent)
      console.log('🔗 Causal chain identified')
      
      // 4. Generate comprehensive response using Spinozistic coaching
      const response = await this.generateComprehensiveResponse(question, relevantContent, emotionalInsights, causalChain, context, spinozisticAnalysis)
      console.log('✅ Generated response successfully')
      
      return response
    } catch (error) {
      console.error('❌ EnhancedRAG query error:', error)
      throw error
    }
  }

  // Core methods (simplified for brevity)
  private async initializeKnowledgeBase(): Promise<void> {
    console.log('📚 Initializing knowledge base...')
  }

  private async generateEmbeddings(): Promise<void> {
    console.log('🧠 Generating embeddings...')
  }

  private analyzeSpinozisticAffects(question: string): any {
    return {
      primaryAffect: { name: 'neutral' },
      powerChange: 0,
      adequacyScore: 0.5,
      bondageLevel: 'medium',
      inadequateIdeas: [],
      coachingStrategy: 'identify_inadequate_ideas'
    }
  }

  // Call the local FAISS microservice for retrieval
  private async semanticSearch(query: string, maxResults: number): Promise<RAGContext[]> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const serviceUrl = process.env.VECTOR_SERVICE_URL || 'http://127.0.0.1:8811/search'

    try {
      const res = await fetch(serviceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: maxResults }),
        signal: controller.signal as any,
      })
      clearTimeout(timeout)
      if (!res.ok) {
        console.warn('Vector service returned non-OK:', res.status)
        return []
      }
      const data = await res.json().catch(() => ({} as any)) as any
      const results = Array.isArray(data?.results) ? data.results : []
      return results.map((r: any): RAGContext => ({
        text: r.text || '',
        source: `${r.source}#chunk_${r.chunk_id}`,
        relevance: typeof r.score === 'number' ? r.score : 0,
        concepts: [],
        part: 0,
      }))
    } catch (err) {
      clearTimeout(timeout)
      console.warn('Vector service fetch failed, using empty results:', (err as Error)?.message)
      return []
    }
  }

  private analyzeEmotionalContext(question: string, emotionalState?: EmotionalState): EmotionalInsight[] {
    return []
  }

  private identifyCausalChain(question: string, relevantContent: RAGContext[]): CausalLink[] {
    return []
  }

  private async generateComprehensiveResponse(
    question: string,
    relevantContent: RAGContext[],
    emotionalInsights: EmotionalInsight[],
    causalChain: CausalLink[],
    context?: UserContext,
    spinozisticAnalysis?: any
  ): Promise<EnhancedRAGResponse> {
    return {
      answer: "This is a placeholder response from the shared RAG library.",
      context: relevantContent,
      confidence: 0.8,
      ethicsPart: 1,
      relatedConcepts: [],
      source: "shared-rag-library",
      reasoning: "Placeholder reasoning",
      adequacyScore: 0.7,
      emotionalInsights,
      causalChain
    }
  }

  // Empowerapy Integration Methods
  private getEmpowerapyInsights(emotion: string, question: string): any {
    try {
      const { EMPOWERAPY_RAG_INDEX } = require('./empowerapy/empowerapyKnowledge')
      
      const emotionMatch = EMPOWERAPY_RAG_INDEX.find((item: any) => 
        item.emotion.toLowerCase() === emotion.toLowerCase()
      )
      if (emotionMatch) return emotionMatch
      
      const questionMatch = EMPOWERAPY_RAG_INDEX.find((item: any) => 
        question.toLowerCase().includes(item.emotion.toLowerCase()) ||
        item.query.toLowerCase().includes(question.toLowerCase().split(' ').slice(0, 3).join(' '))
      )
      return questionMatch || null
    } catch (error) {
      console.warn('Empowerapy knowledge base not available:', error)
      return null
    }
  }

  private getTherapeuticPractice(emotion: string): any {
    try {
      const { EMPOWERAPY_THERAPEUTIC_PRACTICES } = require('./empowerapy/empowerapyKnowledge')
      return EMPOWERAPY_THERAPEUTIC_PRACTICES.find((practice: any) => 
        practice.emotionalStates.includes(emotion.toLowerCase()) ||
        practice.emotionalStates.includes('all')
      ) || null
    } catch (error) {
      console.warn('Empowerapy therapeutic practices not available:', error)
      return null
    }
  }

  private getTrainingDialogue(emotion: string): any {
    try {
      const { EMPOWERAPY_TRAINING_DIALOGUES } = require('./empowerapy/empowerapyKnowledge')
      return EMPOWERAPY_TRAINING_DIALOGUES.find((dialogue: any) => 
        dialogue.scenario.toLowerCase().includes(emotion.toLowerCase())
      ) || null
    } catch (error) {
      console.warn('Empowerapy training dialogues not available:', error)
      return null
    }
  }
}

export default EnhancedRAG
