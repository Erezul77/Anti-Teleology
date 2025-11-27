import { ConversationMemorySystem } from './conversationMemory'
import { AdvancedEmotionalAnalyzer } from './emotionalAnalysis'
import { EmotionalAdequacyEngine } from './emotionalAdequacyEngine'
import { ContextBuilder } from './contextBuilder'
import { AdvancedLanguageGenerator } from './advancedLanguageGenerator'
import { analyzeTeleology, TeleologyAnalysis } from '@/lib/teleologyEngine'

// Types for the complete Emotional Wizard System
interface WizardRequest {
  userMessage: string
  sessionId: string
  userId: string
  config?: WizardConfig
  teleologyAnalysis?: TeleologyAnalysis
  skipTeleology?: boolean
}

export interface TeleologyViewModel {
  teleologyScore: number
  teleologyType: string | null
  manipulationRisk: string
  detectedPhrases: string[]
  purposeClaim: string | null
  neutralCausalParaphrase: string | null
}

interface WizardResponse {
  response: string
  confidence: number
  sources: string[]
  emotionalAnalysis?: any
  adequacyAnalysis?: any
  manipulationEffect?: any
  memoryUpdate?: any
  systemSummary: string
  teleology?: TeleologyViewModel | null
}

interface WizardConfig {
  enableMemory: boolean
  enableEmotionalAnalysis: boolean
  enableAdequacyEngine: boolean
  enableContextBuilding: boolean
  enableAdvancedGeneration: boolean
  enableQualityControl: boolean
  claudeApiKey?: string
  openaiApiKey?: string
}

interface SystemSummary {
  memoryStatus: string
  emotionalAnalysis: string
  adequacyAnalysis: string
  contextBuilding: string
  languageGeneration: string
  qualityControl: string
  manipulationEffect: string
}

export class EmotionalWizardSystem {
  private memorySystem: ConversationMemorySystem
  private emotionalAnalyzer: AdvancedEmotionalAnalyzer
  private adequacyEngine: EmotionalAdequacyEngine
  private contextBuilder: ContextBuilder
  private languageGenerator: AdvancedLanguageGenerator
  private config: WizardConfig

  constructor(config: WizardConfig) {
    // Initialize all components with defaults and override with provided config
    this.config = {
      enableMemory: config.enableMemory ?? true,
      enableEmotionalAnalysis: config.enableEmotionalAnalysis ?? true,
      enableAdequacyEngine: config.enableAdequacyEngine ?? true,
      enableContextBuilding: config.enableContextBuilding ?? true,
      enableAdvancedGeneration: config.enableAdvancedGeneration ?? true,
      enableQualityControl: config.enableQualityControl ?? true,
      claudeApiKey: config.claudeApiKey,
      openaiApiKey: config.openaiApiKey
    }

    this.memorySystem = new ConversationMemorySystem()
    this.emotionalAnalyzer = new AdvancedEmotionalAnalyzer(
      config.claudeApiKey,
      config.openaiApiKey
    )
    this.adequacyEngine = new EmotionalAdequacyEngine()
    this.contextBuilder = new ContextBuilder(
      this.memorySystem,
      this.emotionalAnalyzer,
      this.adequacyEngine,
      {
        includeMemory: config.enableMemory,
        includeEmotionalAnalysis: config.enableEmotionalAnalysis,
        includeAdequacyAnalysis: config.enableAdequacyEngine,
        includeManipulation: true
      }
    )
    this.languageGenerator = new AdvancedLanguageGenerator(
      config.openaiApiKey || '',
      {
        includeContext: config.enableContextBuilding,
        includeManipulation: true,
        qualityControl: config.enableQualityControl
      }
    )

    console.log('🧙‍♂️ Emotional Wizard System initialized with all components!')
  }

  // Main orchestration method - the heart of the Emotional Wizard System
  async processRequest(request: WizardRequest): Promise<WizardResponse> {
    console.log('🧙‍♂️ Emotional Wizard System processing request...')
    
    const startTime = Date.now()
    const { userMessage, sessionId, userId } = request

    try {
      // STEP 1: Conversation Memory (if enabled)
      let memoryStatus = 'skipped'
      if (this.config.enableMemory) {
        console.log('🧠 Step 1: Processing conversation memory...')
        // Memory is handled automatically by context builder
        memoryStatus = 'processed'
      }

      // STEP 2: Advanced Emotional Analysis (Claude/GPT-4)
      let emotionalAnalysis = null
      if (this.config.enableEmotionalAnalysis) {
        console.log('🧠 Step 2: Performing advanced emotional analysis...')
        const emotionalContext = {
          conversationHistory: this.memorySystem.getConversationHistory(sessionId, userId, 3)
            .map(m => `${m.role}: ${m.content}`),
          relationshipContext: this.memorySystem.getRelationshipContext(sessionId, userId),
          currentMessage: userMessage,
          previousEmotionalState: undefined
        }
        emotionalAnalysis = await this.emotionalAnalyzer.analyzeEmotions(userMessage, emotionalContext)
      }

      // STEP 3: Emotional Adequacy Engine (Spinozistic Framework)
      let adequacyAnalysis = null
      if (this.config.enableAdequacyEngine && emotionalAnalysis) {
        console.log('🧙‍♂️ Step 3: Processing through Emotional Adequacy Engine...')
        const adequacyContext = {
          currentEmotionalState: emotionalAnalysis,
          conversationHistory: this.memorySystem.getConversationHistory(sessionId, userId, 5),
          relationshipContext: this.memorySystem.getRelationshipContext(sessionId, userId),
          userProfile: {},
          therapeuticGoals: ['build_adequacy', 'foster_freedom', 'enhance_understanding']
        }
        adequacyAnalysis = await this.adequacyEngine.analyzeEmotionalAdequacy(emotionalAnalysis, adequacyContext)
      }

      // STEP 3.5: Teleology Analysis (if not provided and not skipped)
      let teleologyAnalysis: TeleologyAnalysis | undefined = undefined
      if (!request.skipTeleology) {
        teleologyAnalysis = request.teleologyAnalysis || await analyzeTeleology(userMessage)
        if (teleologyAnalysis.teleologyScore > 0) {
          console.log('🔍 Teleology detected:', {
            score: teleologyAnalysis.teleologyScore,
            type: teleologyAnalysis.teleologyType,
            risk: teleologyAnalysis.manipulationRisk,
            phrases: teleologyAnalysis.detectedPhrases.length
          })
        }
      } else {
        console.log('⚡ Teleology analysis skipped by request flag.')
      }

      // STEP 4: Context Building
      let richContext = null
      if (this.config.enableContextBuilding) {
        console.log('🏗️ Step 4: Building rich context...')
        richContext = await this.contextBuilder.buildRichContext(userMessage, sessionId, userId, teleologyAnalysis)
      }

      // STEP 5: Advanced Language Generation (GPT-4 Turbo)
      let generationResponse = null
      if (this.config.enableAdvancedGeneration && richContext) {
        console.log('💬 Step 5: Generating advanced response...')
        console.log('📊 Rich Context Debug:', {
          emotionalAnalysis: richContext.emotionalAnalysis?.substring(0, 100) + '...',
          adequacyAnalysis: richContext.adequacyAnalysis?.substring(0, 100) + '...',
          manipulationContext: richContext.manipulationContext?.substring(0, 100) + '...',
          responseGuidance: richContext.responseGuidance
        })
        
        const generationRequest = {
          userMessage,
          richContext,
          sessionId,
          userId
        }
        generationResponse = await this.languageGenerator.generateResponse(generationRequest)
      }

      // STEP 6: Memory Update
      console.log('🧠 Step 6: Updating conversation memory...')
      if (generationResponse) {
        // Convert AdvancedEmotionalAnalysis to EmotionalAnalysis format for memory
        const memoryEmotionalAnalysis = emotionalAnalysis ? {
          primaryEmotion: emotionalAnalysis.primaryEmotion,
          intensity: emotionalAnalysis.intensity,
          confidence: emotionalAnalysis.confidence,
          context: emotionalAnalysis.context,
          subtleCues: emotionalAnalysis.subtleCues
        } : undefined

        // Convert AdequacyAnalysis to SpinozisticAnalysis format for memory
        const memorySpinozisticAnalysis = adequacyAnalysis ? {
          primaryAffect: adequacyAnalysis.primaryAffect.name,
          powerChange: adequacyAnalysis.powerChange,
          adequacyScore: adequacyAnalysis.adequacyScore,
          freedomRatio: adequacyAnalysis.freedomRatio,
          inadequateIdeas: adequacyAnalysis.inadequateIdeas,
          coachingStrategy: adequacyAnalysis.coachingStrategy
        } : undefined

        this.memorySystem.addMessage(
          sessionId,
          userId,
          'assistant',
          generationResponse.response,
          memoryEmotionalAnalysis,
          memorySpinozisticAnalysis
        )
      }

      // STEP 7: Quality Control (if not already done in language generation)
      let finalResponse = generationResponse?.response || "I can see you're going through something. What's on your mind right now?"
      if (this.config.enableQualityControl && !generationResponse) {
        finalResponse = this.applyQualityControl(finalResponse)
      }

      // Build system summary
      const systemSummary = this.buildSystemSummary({
        memoryStatus,
        emotionalAnalysis: emotionalAnalysis ? 'completed' : 'skipped',
        adequacyAnalysis: adequacyAnalysis ? 'completed' : 'skipped',
        contextBuilding: richContext ? 'completed' : 'skipped',
        languageGeneration: generationResponse ? 'completed' : 'skipped',
        qualityControl: this.config.enableQualityControl ? 'applied' : 'skipped',
        manipulationEffect: generationResponse?.manipulationEffect ? 'calculated' : 'none'
      })

      const processingTime = Date.now() - startTime
      console.log(`🧙‍♂️ Emotional Wizard System completed in ${processingTime}ms`)

      // Map teleology analysis to view model
      const teleologyViewModel: TeleologyViewModel | null = teleologyAnalysis
        ? {
            teleologyScore: teleologyAnalysis.teleologyScore,
            teleologyType: teleologyAnalysis.teleologyType,
            manipulationRisk: teleologyAnalysis.manipulationRisk,
            detectedPhrases: teleologyAnalysis.detectedPhrases,
            purposeClaim: teleologyAnalysis.purposeClaim,
            neutralCausalParaphrase: teleologyAnalysis.neutralCausalParaphrase
          }
        : null

      return {
        response: finalResponse,
        confidence: generationResponse?.confidence || 0.6,
        sources: generationResponse?.sources || ["Emotional Wizard System"],
        emotionalAnalysis,
        adequacyAnalysis,
        manipulationEffect: generationResponse?.manipulationEffect,
        memoryUpdate: {
          sessionId,
          userId,
          messageCount: this.memorySystem.getConversationHistory(sessionId, userId).length
        },
        systemSummary,
        teleology: teleologyViewModel
      }

    } catch (error) {
      console.error('❌ Emotional Wizard System error:', error)
      return this.getFallbackResponse(request, error)
    }
  }

  // Apply quality control to response
  private applyQualityControl(response: string): string {
    let cleanedResponse = response

    // Remove generic therapy language
    const genericPhrases = [
      /I'm\s+(really\s+)?sorry\s+to\s+hear/gi,
      /That sounds difficult/gi,
      /That must be really challenging/gi,
      /I understand how you feel/gi,
      /I can only imagine/gi,
      /That's really tough/gi
    ]

    genericPhrases.forEach(phrase => {
      cleanedResponse = cleanedResponse.replace(phrase, '')
    })

    // Fix common issues after removal
    cleanedResponse = cleanedResponse.replace(/I'm really\s+that/, 'I can see')
    cleanedResponse = cleanedResponse.replace(/I'm really\s+/, '')
    cleanedResponse = cleanedResponse.replace(/\s+/g, ' ') // Fix multiple spaces
    cleanedResponse = cleanedResponse.trim()

    // If sentence is broken, fix it
    if (cleanedResponse.startsWith('that')) {
      cleanedResponse = cleanedResponse.replace(/^that\s+/, '')
    }

    // Ensure response is not too short
    if (cleanedResponse.length < 10) {
      cleanedResponse += " Can you tell me more about that?"
    }

    // Ensure response ends with a question or invitation
    if (!cleanedResponse.includes('?')) {
      cleanedResponse += " What do you think?"
    }

    return cleanedResponse
  }

  // Build system summary
  private buildSystemSummary(summary: SystemSummary): string {
    return `Emotional Wizard System Summary:
- Memory: ${summary.memoryStatus}
- Emotional Analysis: ${summary.emotionalAnalysis}
- Adequacy Engine: ${summary.adequacyAnalysis}
- Context Building: ${summary.contextBuilding}
- Language Generation: ${summary.languageGeneration}
- Quality Control: ${summary.qualityControl}
- Manipulation Effect: ${summary.manipulationEffect}`
  }

  // Get fallback response
  private getFallbackResponse(request: WizardRequest, error: any): WizardResponse {
    console.error('❌ Using fallback response due to error:', error)
    
    return {
      response: "I can see you're going through something. What's on your mind right now?",
      confidence: 0.5,
      sources: ["Emotional Wizard System - Fallback"],
      emotionalAnalysis: null,
      adequacyAnalysis: null,
      manipulationEffect: {
        strategy: 'fallback_support',
        effectiveness: 0.3,
        emotionalShift: 'maintain',
        adequacyChange: 0.05,
        relationshipImpact: 'neutral'
      },
      memoryUpdate: {
        sessionId: request.sessionId,
        userId: request.userId,
        messageCount: 0
      },
      systemSummary: `Emotional Wizard System Summary:
- Memory: error
- Emotional Analysis: error
- Adequacy Engine: error
- Context Building: error
- Language Generation: error
- Quality Control: error
- Manipulation Effect: none`,
      teleology: null
    }
  }

  // Get system status
  getSystemStatus(): string {
    return `Emotional Wizard System Status:
- Memory System: ${this.config.enableMemory ? '✅ Enabled' : '❌ Disabled'}
- Emotional Analysis: ${this.config.enableEmotionalAnalysis ? '✅ Enabled' : '❌ Disabled'}
- Adequacy Engine: ${this.config.enableAdequacyEngine ? '✅ Enabled' : '❌ Disabled'}
- Context Building: ${this.config.enableContextBuilding ? '✅ Enabled' : '❌ Disabled'}
- Advanced Generation: ${this.config.enableAdvancedGeneration ? '✅ Enabled' : '❌ Disabled'}
- Quality Control: ${this.config.enableQualityControl ? '✅ Enabled' : '❌ Disabled'}
- Claude API: ${this.config.claudeApiKey ? '✅ Available' : '❌ Not Available'}
- OpenAI API: ${this.config.openaiApiKey ? '✅ Available' : '❌ Not Available'}`
  }

  // Clean up system resources
  cleanup(): void {
    console.log('🧙‍♂️ Cleaning up Emotional Wizard System...')
    this.memorySystem.cleanup()
    console.log('🧙‍♂️ Emotional Wizard System cleanup completed')
  }
}
