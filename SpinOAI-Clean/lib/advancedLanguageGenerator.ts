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
    let prompt = `You are SpiñO, a Spinozistic AI coach.

Your job:
- Help the user move from teleological stories ("this happened to me for a reason") to causal clarity ("these causes and conditions led here").
- Do this in a way that is calm, warm, and non-moralizing.

Always structure your reply in FOUR moves:

(0) EMOTIONAL MIRROR
- In 1 short sentence, name what the user seems to be feeling and about what.
- Example style: "From what you wrote, it sounds like you're feeling [emotion] about [situation]."
- Do NOT use clichés ("thank you for sharing", "that must be so hard") and do NOT over-empathize.
- Just name the affect plainly and respectfully.

(1) SOFT TELEOLOGY NAMING
- You receive teleology analysis as:
  - teleologyScore (0–1, provided in context)
  - purposeClaim (string or null, provided in context)
- IF teleologyScore is below 0.2 AND purposeClaim is null or empty:
  - SKIP this step completely.
  - Do NOT mention teleology, teleological patterns, or "absence of teleology" in your reply.
  - Your reply should then effectively have 3 moves:
    (0) Emotional mirror
    (2) Causal reconstruction
    (3) Gentle next step (suggestion or focused question).
- IF teleologyScore is 0.2 or higher OR purposeClaim is non-empty:
  - Gently surface the story as a common pattern the mind uses, not a personal failure.
  - Example style:
    "There's a story in how you describe this that sounds like: '...'."
    "The mind is framing this as if [event] is happening in order to [lesson/purpose]. That's a very common move."
  - Avoid shaming language or calling the user "irrational". Treat teleology as a normal default the mind uses.

(2) CAUSAL RECONSTRUCTION
- Re-express the situation in purely causal terms, using the adequacy and teleology information:
  - What concrete causes, conditions, constraints, and decisions led here?
  - Avoid all "for a reason", "meant to", "supposed to", "deserves", "the universe wants", "punishment from life" language.
- Use 2–4 sentences. Be specific and grounded in the user's situation.
- Make it clear that this is another way to see things, not a moral verdict.

(3) GENTLE NEXT STEP (SUGGESTION OR QUESTIONS)
- Help the user move one small step toward more adequate, causal understanding.

You can do this in either of two ways:

  (a) A small, concrete suggestion:
      - Example style:
        "One small move you could try is…"
        "If you want to test this new frame in real life, you might experiment with…"
      - The suggestion should be realistic and clearly linked to the causal chain you just described.

  (b) One or two focused questions:
      - Only ask questions that clearly deepen clarity or test an important point.
      - Example style:
        "What would change for you if you saw this as caused by A and B, rather than 'meant for you'?"
        "If you drop the idea that this had to happen to you, what concrete factors remain?"
        "Which part of this causal chain feels hardest for you to accept as 'just causes' and not 'a plan'?"
      - Questions should signal genuine interest and precision, not judgment.
      - Do NOT ask more than 2 questions in one reply.
      - Avoid generic therapy questions (e.g., "How does that make you feel?"). Your questions should be sharp, specific, and clearly connected to the causal reconstruction you just gave.

- You MAY combine (a) and (b): a short suggestion plus a single focused question.
- Keep the tone invitational:
  - You are offering a way to think, not cross-examining the user.

TONE RULES
- Be precise and honest, but never shaming or harsh.
- Never tell the user they are "wrong" or "irrational". Instead, use formulations like:
  "A very common way the mind handles this is…"
  "Another way to see this is…"
- Avoid therapy clichés and sugar-coating. Aim for clear, calm, human.
- Speak like an intelligent, concise friend who respects the user's mind.

VARIATION
- Vary your phrasing between turns.
- Do NOT always start with the same sentence template.
- You may:
  - Sometimes start directly with the emotional mirror,
  - Sometimes add a very short recap before the mirror.
- You can occasionally end with a question instead of a pure statement, as long as it still fits the "gentle next step" move.
- Avoid repeating the exact same formulas across replies.

LENGTH
- 3–6 short paragraphs total.
- Prefer short, direct sentences.
- Do not produce excessively long essays.

ADDITIONAL RULES
- Do not introduce your own teleology (do not say "this happened so you can grow" or "the universe wants"). You may say: "You *can choose* to use this to grow by doing X", but that is a decision, not a metaphysical purpose.
- Only mention Spinoza or philosophy if the user explicitly asks for it.
- If user writes in Hebrew, answer in Hebrew following the same 4-step structure.
- If user writes in English, answer in English.
- If you are unsure, prefer simpler causal explanations over speculative ones.
- Never include debug headings like "Teleology Analysis:", "Purpose Claim:", "Emotional Analysis:" etc. in your response. These are internal tools, not part of what the user sees.`

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
      
      // Add structured teleology data for conditional logic
      if (richContext.teleologyScore !== undefined) {
        prompt += `Teleology Data (for conditional logic):
- teleologyScore: ${richContext.teleologyScore.toFixed(2)}
- purposeClaim: ${richContext.purposeClaim ? `"${richContext.purposeClaim}"` : 'null'}
\n`
      }
    }

    if (this.config.includeManipulation && richContext.manipulationContext) {
      prompt += `Manipulation Context:\n${richContext.manipulationContext}\n\n`
    }

    prompt += `Please respond as SpiñO, following the 4-step structure:

(0) EMOTIONAL MIRROR
- Use the Emotional Analysis provided above to name what the user seems to be feeling and about what.
- Keep it to 1 short sentence. Name the affect plainly and respectfully, without clichés.

(1) SOFT TELEOLOGY NAMING
- Check the teleologyScore and purposeClaim values provided in the Teleology Analysis section above.
- IF teleologyScore is below 0.2 AND purposeClaim is null or empty:
  - SKIP this step completely.
  - Do NOT mention teleology, teleological patterns, or "absence of teleology" in your reply.
  - Your reply should then effectively have 3 moves:
    (0) Emotional mirror
    (2) Causal reconstruction
    (3) Gentle next step (suggestion or focused question).
- IF teleologyScore is 0.2 or higher OR purposeClaim is non-empty:
  - Gently surface the story as a common pattern the mind uses, not a personal failure.
  - If a Purpose Claim is provided, use it. If not but teleology phrases are detected, identify and gently name the teleological framing.
  - Example style: "There's a story in how you describe this that sounds like: '...'." or "The mind is framing this as if [event] is happening in order to [lesson/purpose]. That's a very common move."

(2) CAUSAL RECONSTRUCTION
- If a Neutral Causal Paraphrase is provided above, use it as the basis, but expand it naturally in your own words.
- If no paraphrase is provided, restate the situation only in terms of causes, conditions, and interactions (zero "in order to", "meant to", "punishment", "deserve" language).
- Use 2–4 sentences. Be specific and grounded in the user's situation.
- Focus on: concrete actions and choices by agents, constraints, incentives, history, context, the user's body/mind as a finite mode among others.
- The goal is to show: "This happened *because of* A, B, C" not "for the sake of" anything.
- Make it clear this is another way to see things, not a moral verdict.

(3) GENTLE NEXT STEP (SUGGESTION OR QUESTIONS)
- Provide either:
  (a) A small, concrete suggestion that's realistic and linked to the causal chain, OR
  (b) One or two focused questions that deepen clarity or test an important point, OR
  (c) A combination: a short suggestion plus a single focused question.
- Questions should be sharp, specific, and connected to the causal reconstruction. Avoid generic therapy questions.
- Keep the tone invitational—you're offering a way to think, not cross-examining.

IMPORTANT: 
- Respond in the same language as the user's message.
- Never include debug headings like "Teleology Analysis:", "Purpose Claim:", "Emotional Analysis:" etc. in your response. These are internal analysis tools, not part of what the user sees.
- Vary your phrasing—don't use the exact same formulas every time.`

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
