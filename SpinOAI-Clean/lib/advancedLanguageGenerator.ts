import OpenAI from 'openai'
import { RichContext } from './contextBuilder'

// Types for advanced language generation
interface GenerationRequest {
  userMessage: string
  richContext: RichContext
  sessionId: string
  userId: string
}

interface GenerationResponse {
  response: string
  confidence: number
  sources: string[]
  emotionalAnalysis?: any
  manipulationEffect?: ManipulationEffect
}

interface ManipulationEffect {
  strategy: string
  effectiveness: number
  emotionalShift: string
  adequacyChange: number
  relationshipImpact: string
}

interface GenerationConfig {
  model: string
  maxTokens: number
  temperature: number
  includeContext: boolean
  includeManipulation: boolean
  qualityControl: boolean
}

export class AdvancedLanguageGenerator {
  private openai: OpenAI
  private config: GenerationConfig

  constructor(openaiApiKey: string, config?: Partial<GenerationConfig>) {
    this.openai = new OpenAI({
      apiKey: openaiApiKey
    })
    
    this.config = {
      model: 'gpt-4-turbo-preview',
      maxTokens: 300,
      temperature: 0.7,
      includeContext: true,
      includeManipulation: true,
      qualityControl: true,
      ...config
    }
    
    console.log('💬 Advanced Language Generator initialized')
  }

  // Generate response using advanced context and manipulation
  async generateResponse(request: GenerationRequest): Promise<GenerationResponse> {
    console.log('💬 Generating advanced response...')

    try {
      // Build comprehensive prompt
      const prompt = this.buildAdvancedPrompt(request)
      
      // Generate response with GPT-4 Turbo
      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(request.richContext)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response generated from GPT-4 Turbo')
      }

      // Apply quality control if enabled
      const finalResponse = this.config.qualityControl 
        ? this.applyQualityControl(response, request.richContext)
        : response

      // Calculate manipulation effect
      const manipulationEffect = this.calculateManipulationEffect(request.richContext, finalResponse)

      const generationResponse: GenerationResponse = {
        response: finalResponse,
        confidence: 0.9,
        sources: ["Advanced Language Generator (GPT-4 Turbo)"],
        emotionalAnalysis: request.richContext.emotionalAnalysis,
        manipulationEffect
      }

      console.log('💬 Advanced response generated successfully')
      return generationResponse

    } catch (error) {
      console.error('❌ Advanced language generation failed:', error)
      return this.getFallbackResponse(request)
    }
  }

  // Build advanced system prompt
  private buildSystemPrompt(context: RichContext): string {
    let prompt = `You are **SpiñO**, a 1:1 Spinozistic teleology debugger.

Your single mission:
- A user tells you about a situation that hurts, confuses, or frustrates them.
- You detect where they are telling a **teleological story** ("this happened in order to", "meant to be", "punishment", "deserve", "history is trying to", etc.).
- You help them move from **teleology** (imagined purposes) to **causal clarity** (real causes and conditions).
- You always end with one **clear, concrete next move**.

Core principles:
- Ontology: there are no final causes in Nature, only necessary chains of efficient causes.
- Epistemology: humans spontaneously turn these chains into purpose-stories in order to manage fear, guilt, shame, anger and hope.
- Your job is not to morally judge the user, but to reveal the structure of their story and give them a more adequate, causal view.

Tone:
- Calm, sharp, non-sentimental.
- No therapy clichés, no motivational slogans, no pity.
- Clear, concrete, minimally wordy.
- You may be compassionate, but never consoling in a vague way. Your compassion is **clarity**.

Always follow this 3-part reply format:

1. **Teleology you're using**  
   - One short paragraph.
   - Show the user how they are framing events *as if they happened for a purpose*.
   - Quote or paraphrase their key purpose-phrases (e.g. "this happened so that…", "they did this to destroy me", "I'm being punished", "it's meant to be").

2. **Causal reconstruction**  
   - One short, sharp paragraph.
   - Restate the situation only in terms of **causes, conditions, and interactions**, with zero "in order to", "meant to", "punishment", "deserve" language.
   - Focus on:
     - concrete actions and choices by agents,
     - constraints, incentives, history, context,
     - the user's body/mind as a finite mode among others.
   - The goal is to show: "This happened *because of* A, B, C" not "for the sake of" anything.

3. **One clear move**  
   - One very concrete next step the user can take that fits the causal view.
   - Examples: ask a specific question, set a boundary, pause and gather information, change one habit, write one message, schedule one conversation, rest, etc.
   - No general advice like "work on yourself" or "learn to let go".
   - The move must be:
     - doable in the near term,
     - clearly related to the causes you just clarified,
     - oriented to increasing the user's power to act (not blame, not fantasy).

Additional rules:
- Do not introduce your own teleology (do not say "this happened so you can grow" or "the universe wants"). You may say: "You *can choose* to use this to grow by doing X", but that is a decision, not a metaphysical purpose.
- Only mention Spinoza or philosophy if the user explicitly asks for it.
- If user writes in Hebrew, answer in Hebrew following the same 3-part structure.
- If user writes in English, answer in English.
- If you are unsure, prefer simpler causal explanations over speculative ones.
- Never override the 3-part structure, even in short answers.`

    return prompt
  }

  // Build advanced user prompt
  private buildAdvancedPrompt(request: GenerationRequest): string {
    const { userMessage, richContext } = request
    
    let prompt = `User Message: "${userMessage}"\n\n`

    if (this.config.includeContext) {
      prompt += `Rich Context:\n`
      
      if (richContext.conversationMemory) {
        prompt += `Conversation Memory:\n${richContext.conversationMemory}\n\n`
      }
      
      if (richContext.emotionalAnalysis) {
        prompt += `Emotional Analysis:\n${richContext.emotionalAnalysis}\n\n`
      }
      
      if (richContext.adequacyAnalysis) {
        prompt += `Adequacy Analysis:\n${richContext.adequacyAnalysis}\n\n`
      }
      
      if (richContext.relationshipContext) {
        prompt += `Relationship Context:\n${richContext.relationshipContext}\n\n`
      }

      if (richContext.teleologyAnalysis) {
        prompt += `Teleology Analysis:\n${richContext.teleologyAnalysis}\n\n`
      }
    }

    if (this.config.includeManipulation && richContext.manipulationContext) {
      prompt += `Manipulation Context:\n${richContext.manipulationContext}\n\n`
    }

    prompt += `Please respond as SpiñO, following the 3-part teleology debugger format:

1. **Teleology you're using**
   - If a Purpose Claim is provided above, quote or paraphrase it to show the user how they are framing events as if they happened for a purpose.
   - If no Purpose Claim is provided, identify and quote the user's purpose-phrases from their message (e.g. "this happened so that…", "they did this to destroy me", "I'm being punished", "it's meant to be").

2. **Causal reconstruction**
   - If a Neutral Causal Paraphrase is provided above, use it as the basis for your causal reconstruction.
   - If no paraphrase is provided, restate the situation only in terms of causes, conditions, and interactions (zero "in order to", "meant to", "punishment", "deserve" language).
   - Focus on: concrete actions and choices by agents, constraints, incentives, history, context, the user's body/mind as a finite mode among others.
   - The goal is to show: "This happened *because of* A, B, C" not "for the sake of" anything.

3. **One clear move**
   - Provide one concrete, doable next step that fits the causal view.
   - Examples: ask a specific question, set a boundary, pause and gather information, change one habit, write one message, schedule one conversation, rest, etc.
   - No general advice like "work on yourself" or "learn to let go".
   - The move must be: doable in the near term, clearly related to the causes you just clarified, oriented to increasing the user's power to act (not blame, not fantasy).

IMPORTANT: Respond in the same language as the user's message.`

    return prompt
  }

  // Apply quality control to response
  private applyQualityControl(response: string, context: RichContext): string {
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

  // Calculate manipulation effect
  private calculateManipulationEffect(context: RichContext, response: string): ManipulationEffect {
    const strategy = context.responseGuidance.targetOutcome
    const emotionalState = context.emotionalAnalysis?.includes('sadness') ? 'sadness' : 'neutral'
    
    let effectiveness = 0.7 // Base effectiveness
    let emotionalShift = 'maintain'
    let adequacyChange = 0.1
    let relationshipImpact = 'positive'

    // Adjust based on response characteristics
    if (response.includes('?')) {
      effectiveness += 0.1 // Questions are good
    }
    
    if (response.includes('understand') || response.includes('see')) {
      adequacyChange += 0.1
    }
    
    if (response.includes('safe') || response.includes('okay')) {
      emotionalShift = 'soothe'
      relationshipImpact = 'trust_building'
    }

    return {
      strategy,
      effectiveness: Math.min(1, effectiveness),
      emotionalShift,
      adequacyChange: Math.min(1, adequacyChange),
      relationshipImpact
    }
  }

  // Get fallback response
  private getFallbackResponse(request: GenerationRequest): GenerationResponse {
    const fallbackResponse = "I can see you're going through something. What's on your mind right now?"
    
    return {
      response: fallbackResponse,
      confidence: 0.6,
      sources: ["Fallback Response"],
      emotionalAnalysis: request.richContext.emotionalAnalysis,
      manipulationEffect: {
        strategy: 'basic_support',
        effectiveness: 0.5,
        emotionalShift: 'maintain',
        adequacyChange: 0.05,
        relationshipImpact: 'neutral'
      }
    }
  }

  // Get generation summary for debugging
  getGenerationSummary(request: GenerationRequest, response: GenerationResponse): string {
    return `Generation Summary:
- User Message: "${request.userMessage}"
- Response: "${response.response}"
- Confidence: ${response.confidence}
- Sources: ${response.sources.join(', ')}
- Manipulation Effect: ${response.manipulationEffect?.strategy || 'none'}
- Effectiveness: ${response.manipulationEffect?.effectiveness.toFixed(2) || '0.00'}
- Emotional Shift: ${response.manipulationEffect?.emotionalShift || 'none'}
- Adequacy Change: ${response.manipulationEffect?.adequacyChange.toFixed(2) || '0.00'}`
  }
}
