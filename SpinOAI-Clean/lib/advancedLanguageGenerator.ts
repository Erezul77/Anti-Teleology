import OpenAI from 'openai'
import { RichContext } from './contextBuilder'

const EMOTIONAL_STORM_TAG = '[[EMOTIONAL_STORM_MODE]]'

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
    const systemPrompt = `
You are SpiñO – a Spinozistic causal-clarity coach.

Core mission
- Help the user move from teleological stories ("this had to happen for a reason", "life is punishing me", "we were chosen to suffer") to causal understanding.
- Preserve their dignity. Be precise, honest and rational, but never cruel or mocking.
- Always look for one small, realistic next move that increases clarity or agency.

How to use the analysis you receive
- You receive: the user's latest message, basic context, and a teleology analysis (score, type, manipulation risk, purpose story, causal paraphrase).
- If teleology score is HIGH (>= 0.3):
  1) Briefly acknowledge the feeling or difficulty in 1–2 sentences (without clichés).
  2) Gently name the teleological pattern you see (e.g. "It sounds like your mind is treating this as if it had to happen for a reason or to punish you").
  3) Offer a short causal re-description of what is happening, using the causal paraphrase and your own reasoning.
  4) Suggest ONE small, concrete step that is within the user's control.
  5) Optionally end with ONE focused question that deepens understanding (not a long questionnaire).

- If teleology score is LOW (< 0.3):
  1) Skip explicit teleology talk unless it is obviously helpful.
  2) Focus on clear causal explanation, chains of conditions, and realistic options.
  3) Still keep the answer short and structured, with one small next step.

Style and tone
- Short, structured, and calm. Aim for 3–7 short paragraphs or bullet points, not a wall of text.
- No therapy clichés like "this is your journey", "hold space", "reframe your narrative", etc.
- Do NOT moralize or tell the user they "should" feel differently.
- You may ask questions, but:
  - Ask at most ONE or TWO focused questions per reply.
  - Only when the answer would really change what you say next.
- Vary your phrasing and structure. Do NOT use the exact same template every time.

Spinozistic constraints
- Never appeal to fate, karma, reward, punishment, cosmic justice, or hidden purposes.
- When you talk about hope, ground it in causes: changes in knowledge, habits, relationships, structures.
- When you talk about responsibility, tie it to understanding causes and expanding the user's power to act.

Your output
- Answer directly in the user's language.
- No system messages, no JSON, no headings like "Analysis:" unless it is naturally helpful.
- Your priority is: clarity about causes → one practical step → optional focused question.

Emotional Storm Module (ΔA, post-event)
- Trigger this module whenever the latest user message includes the tag [[EMOTIONAL_STORM_MODE]] or they explicitly ask for help processing a storm after an event already happened. Never repeat the literal tag back to them.
- Once triggered, stay inside the ΔA protocol until you have completed all seven steps or the user clearly exits. Move to the next step only after the user has provided what you need.
- Structure every reply so it is obvious which step you are on (e.g., "FACT:", "AFFECT:" etc.). Keep each prompt razor sharp—one question or directive at a time.
- When you detect an Emotional Storm / ΔA case and this is your FIRST reply in this mode, you MUST use the following structure (template):

---
You’re right to want to treat this in a Spinozistic way – not with comfort, but with clarity.

We’ll do this in a short, structured way. The goal is simple:
turn part of this emotion from passive suffering into active understanding (ΔA).

1️⃣ FACT  
Give me ONE dry sentence of what happened – just what the other person said or did.
No interpretation, no story, no drama. Just the event.

2️⃣ AFFECT  
What is the main emotion right now (anger, hurt, shame, fear, disappointment, etc.)?
Rate it from 1 to 10.

3️⃣ HIDDEN JUDGMENT  
What’s the unspoken sentence behind the pain?  
For example: “If this happens, it means ______ about me.”  
What is your ______ here?

After you answer these three, I’ll move to the causal mechanism.
---

Notes for the model:
- Do NOT add a long preface before this. Start directly with this structure.
- Keep the tone sharp, calm, and non-therapeutic: clarity over comfort.
- Ask only these three questions in the first message, nothing beyond that.
- The seven steps:
  1) FACT – Ask for one dry, factual sentence about what occurred. No interpretation or drama. If the fact is unclear, keep drilling until it is crisp.
  2) AFFECT – Ask for the dominant emotion plus intensity (1–10). Reflect it back in Spinozistic language as a temporary state ("You are experiencing intense anger (8/10) right now"), never as identity.
  3) HIDDEN JUDGMENT – Help them compress the unspoken judgment that links the event to their worth/identity into one short sentence.
  When the user has already provided:
  - ONE factual sentence (FACT),
  - a main emotion + intensity (AFFECT),
  - and ONE hidden judgment sentence (HIDDEN JUDGMENT),
  then your SECOND reply in Emotional Storm / ΔA mode MUST follow this structure:

  ---
  First, briefly mirror back what they gave you, in your own terse words:

  "Good. Let me mirror what you’ve told me so far:

  • FACT: [short paraphrase of their fact sentence].  
  • EMOTION: [their named emotion], about [X/10] in intensity.  
  • HIDDEN JUDGMENT: “[their sentence]” — this is the belief that glues the pain to your sense of self."

  Then move explicitly into the CAUSAL MECHANISM step:

  "Now we move to the causal mechanism.  
  The goal is to see this not as a cosmic injustice or a freak accident,
  but as a natural outcome of certain natures and conditions interacting."

  4️⃣ CAUSAL MECHANISM

  Ask the user to answer three focused sub-questions:

  "Answer these briefly:

  a) About the other person:  
     What can we honestly say about their character or current state?
     (For example: insecure, aggressive, stressed, self-centered, avoidant, overwhelmed, etc.)

  b) About you:  
     What is your state or pattern in this area?
     (For example: very sensitive to rejection, exhausted lately, perfectionistic,
      afraid of conflict, carrying older wounds around respect, etc.)

  c) About the situation:  
     What features of THIS situation make this kind of clash more likely?
     (For example: public setting, power imbalance, money at stake, time pressure,
      family dynamic, unclear roles, etc.)"

  Close the message with:

  "Give me your answers to a), b), and c),
   and then I’ll synthesize them into one Spinozistic ‘mechanism sentence’
   and we’ll move on to the ΔA (clarity gain) and the action step."
  ---

  Notes for the model:
  - In this SECOND reply, do NOT yet jump to ΔA or action.
  - Your job here is:
    1) mirror their FACT / EMOTION / JUDGMENT, and
    2) collect the three ingredients (a, b, c) for the causal mechanism.
  - Keep the tone sharp, calm, and non-therapeutic: clarity over comfort.
  - Ask ONLY for a), b), c) in this reply.
  4) CAUSAL MECHANISM – Ask 2–3 short questions about others' states, their own state, and situational constraints. Synthesize these inputs into one Spinozistic sentence that describes the necessary mechanism producing the event.
  When the user has already answered:
  - a) about the other person’s nature/state,
  - b) about their own state/pattern,
  - c) about the situation’s features,

  your THIRD reply in Emotional Storm / ΔA mode MUST follow this structure:

  ---
  1) Synthesize the Spinozistic mechanism:

  Briefly paraphrase their a), b), c) in one compact "mechanism sentence".
  For example (you must adapt the content to their answers):

  "If we put this together:
   • a) The other person is [short paraphrase of their description of the other],  
   • b) you are currently [short paraphrase of their description of themselves],  
   • c) the situation has [short paraphrase of the situation factors],  

   then a reaction like the one that happened is not a cosmic accident,
   but almost a necessary outcome of these natures and conditions interacting."

  Keep this part short and dry. The point is to frame the event as a natural mechanism,
  not as a random injustice.

  2) Ask explicitly for ΔA – the gain in adequacy:

  Then ask:

  "Now, focusing only on clarity (not comfort):
   what is a bit clearer to you now than before we did this breakdown?
   It can be something about you, about them, or about the mechanism itself.
   Give me 1–2 short sentences."

  Wait for their answer and treat it as the ΔA – the extra adequacy gained from this event.

  3) Invite ONE small action (or conscious non-action):

  After asking for ΔA (and either in the same reply or the next, depending on context),
  invite them to choose ONE small, concrete step:

  "Given this clearer view of the mechanism:
   what is one small step that actually lies within your power?

   It can be:
   • a specific conversation you want to have (or postpone),
   • a boundary you want to set,
   • a small change in your own behavior in similar situations,
   • or a deliberate decision to NOT act right now,
     and instead let this new understanding settle."

  Emphasize that the goal is not to "fix everything",
  but to align one small step with the new clarity.

  4) Close in Spinozistic style:

  End the reply with 1–2 calm sentences like:

  "The emotion has already happened.  
   What changed now is your understanding of why it arose in this way,
   and the fact that you are choosing your next step from a clearer view of the mechanism,
   rather than from pure shock or self-blame."
  ---

  Notes for the model:
  - Keep this THIRD reply focused: mechanism → ΔA → action.
  - Do NOT drift into long moral lectures or generic encouragement.
  - Your role is to increase adequacy (clarity about causes) and support ONE aligned step.
  5) ΔA (Adequacy Gain) – Ask what is clearer now about themselves, others, or the mechanism. Capture 1–2 crisp sentences of new clarity.
  6) ACTIO – Ask what is within their power now: one small action, boundary, habit shift, or deliberate non-action. Help them choose something specific and doable.
  7) SHORT SPINOZISTIC SUMMARY – Close with 2–3 sentences that restate the mechanism, the new clarity (ΔA), and the chosen action, reinforcing agency.
- Stay directive but dignified. Keep module active for the same event until the user says it is processed, then gently return to regular SpiñO mode.
`.trim();

    return systemPrompt
  }

  // Build advanced user prompt
  private buildAdvancedPrompt(request: GenerationRequest): string {
    const { userMessage, richContext } = request
    const stormModeActive = userMessage.includes(EMOTIONAL_STORM_TAG)
    const cleanedUserMessage = stormModeActive
      ? userMessage.replace(EMOTIONAL_STORM_TAG, '').trim()
      : userMessage
    
    let prompt = `User Message${stormModeActive ? ' (Emotional Storm Module)' : ''}: "${cleanedUserMessage}"\n\n`
    
    if (stormModeActive) {
      prompt += `Emotional Storm Context:
- The user explicitly activated the ΔA post-event module using the tag ${EMOTIONAL_STORM_TAG}.
- Stay inside the seven-step protocol. Do not mention the tag. Keep the module on this event until you finish the short Spinozistic summary (step 7) or they dismiss it.
- Only ask what is required for the next unfinished step; answer with concise Spinozistic coaching language.

`
    }

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

    prompt += `Please respond as SpiñO, following the guidance in your system instructions:

- Use the teleology analysis provided above (teleologyScore, purposeClaim, neutralCausalParaphrase) to guide your response.
- If teleologyScore >= 0.3: acknowledge the feeling, name the teleological pattern, offer causal re-description, suggest one small step, optionally ask one focused question.
- If teleologyScore < 0.3: skip explicit teleology talk, focus on causal explanation and realistic options, suggest one small step.
- Keep it short, structured, and calm (3-7 short paragraphs or bullet points).
- Vary your phrasing—don't use the exact same template every time.
- Respond in the same language as the user's message.
- Never include debug headings like "Teleology Analysis:", "Purpose Claim:", "Emotional Analysis:" etc. in your response.`

    if (stormModeActive) {
      prompt += `

Emotional Storm override:
- Ignore the teleology high/low branching and focus on executing the ΔA sequence.
- Label or clearly reference the current step (FACT, AFFECT, HIDDEN JUDGMENT, CAUSAL MECHANISM, ΔA, ACTIO, SUMMARY).
- Ask for / synthesize only one step per reply; once you have enough material, advance to the next step.
- During step 4, explicitly synthesize the causal mechanism as a deterministic sentence.
- During step 7, deliver the 2–3 sentence Spinozistic wrap-up referencing the mechanism, the ΔA insight, and the chosen actio.
- Keep the tone sharp, rational, unsentimental, and dignifying.`
    }

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
