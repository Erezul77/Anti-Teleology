import OpenAI from 'openai'

// Types for advanced emotional analysis
export interface AdvancedEmotionalAnalysis {
  primaryEmotion: string
  secondaryEmotions: string[]
  intensity: number
  confidence: number
  context: string
  subtleCues: string[]
  emotionalState: string
  underlyingThemes: string[]
  vulnerabilityIndicators: string[]
  safetySignals: string[]
  communicationStyle: string
  emotionalNeeds: string[]
}

interface EmotionalContext {
  conversationHistory: string[]
  relationshipContext: any
  currentMessage: string
  previousEmotionalState?: string
}

export class AdvancedEmotionalAnalyzer {
  private claude: OpenAI | undefined
  private openai: OpenAI | undefined

  constructor(claudeApiKey?: string, openaiApiKey?: string) {
    if (claudeApiKey) {
      this.claude = new OpenAI({
        apiKey: claudeApiKey,
        baseURL: 'https://api.anthropic.com/v1'
      })
    }
    
    if (openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: openaiApiKey
      })
    }
    
    console.log('🧠 Advanced Emotional Analyzer initialized')
  }

  // Analyze emotions using Claude (preferred) or GPT-4 as fallback
  async analyzeEmotions(
    message: string, 
    context: EmotionalContext
  ): Promise<AdvancedEmotionalAnalysis> {
    console.log('🧠 Analyzing emotions with advanced AI...')

    try {
      if (this.claude) {
        return await this.analyzeWithClaude(message, context)
      } else if (this.openai) {
        return await this.analyzeWithGPT4(message, context)
      } else {
        throw new Error('No AI model available for emotional analysis')
      }
    } catch (error) {
      console.error('❌ Emotional analysis failed:', error)
      return this.getFallbackAnalysis(message)
    }
  }

  // Claude analysis (preferred for emotional intelligence)
  private async analyzeWithClaude(
    message: string, 
    context: EmotionalContext
  ): Promise<AdvancedEmotionalAnalysis> {
    const prompt = this.buildClaudePrompt(message, context)
    
    const completion = await this.claude!.chat.completions.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [
        {
          role: 'system',
          content: `You are an expert emotional intelligence analyst. Analyze the user's emotional state with deep understanding and empathy. Focus on:
          
1. Primary and secondary emotions
2. Emotional intensity and confidence
3. Subtle emotional cues and body language indicators
4. Underlying themes and patterns
5. Vulnerability indicators and safety signals
6. Communication style and emotional needs
7. Context from conversation history

Respond in JSON format with these fields:
{
  "primaryEmotion": "string",
  "secondaryEmotions": ["string"],
  "intensity": 0.0-1.0,
  "confidence": 0.0-1.0,
  "context": "string",
  "subtleCues": ["string"],
  "emotionalState": "string",
  "underlyingThemes": ["string"],
  "vulnerabilityIndicators": ["string"],
  "safetySignals": ["string"],
  "communicationStyle": "string",
  "emotionalNeeds": ["string"]
}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from Claude')
    }

    try {
      const analysis = JSON.parse(response)
      console.log('🧠 Claude emotional analysis completed')
      return analysis
    } catch (error) {
      console.error('❌ Failed to parse Claude response:', error)
      return this.getFallbackAnalysis(message)
    }
  }

  // GPT-4 analysis (fallback)
  private async analyzeWithGPT4(
    message: string, 
    context: EmotionalContext
  ): Promise<AdvancedEmotionalAnalysis> {
    const prompt = this.buildGPT4Prompt(message, context)
    
    const completion = await this.openai!.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert emotional intelligence analyst. Analyze the user's emotional state with deep understanding and empathy. Focus on:
          
1. Primary and secondary emotions
2. Emotional intensity and confidence
3. Subtle emotional cues and body language indicators
4. Underlying themes and patterns
5. Vulnerability indicators and safety signals
6. Communication style and emotional needs
7. Context from conversation history

Respond in JSON format with these fields:
{
  "primaryEmotion": "string",
  "secondaryEmotions": ["string"],
  "intensity": 0.0-1.0,
  "confidence": 0.0-1.0,
  "context": "string",
  "subtleCues": ["string"],
  "emotionalState": "string",
  "underlyingThemes": ["string"],
  "vulnerabilityIndicators": ["string"],
  "safetySignals": ["string"],
  "communicationStyle": "string",
  "emotionalNeeds": ["string"]
}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from GPT-4')
    }

    try {
      const analysis = JSON.parse(response)
      console.log('🧠 GPT-4 emotional analysis completed')
      return analysis
    } catch (error) {
      console.error('❌ Failed to parse GPT-4 response:', error)
      return this.getFallbackAnalysis(message)
    }
  }

  // Build prompt for Claude
  private buildClaudePrompt(message: string, context: EmotionalContext): string {
    let prompt = `Analyze the emotional state of this message: "${message}"\n\n`
    
    if (context.conversationHistory.length > 0) {
      prompt += `Conversation History:\n${context.conversationHistory.slice(-3).join('\n')}\n\n`
    }
    
    if (context.relationshipContext) {
      const rel = context.relationshipContext
      prompt += `Relationship Context:\n`
      prompt += `- Trust Level: ${rel.trustLevel}\n`
      prompt += `- Vulnerability Level: ${rel.vulnerabilityLevel}\n`
      prompt += `- Emotional Safety: ${rel.emotionalSafety}\n`
      prompt += `- Shared Topics: ${rel.sharedTopics?.join(', ') || 'none'}\n\n`
    }
    
    if (context.previousEmotionalState) {
      prompt += `Previous Emotional State: ${context.previousEmotionalState}\n\n`
    }
    
    prompt += `Please provide a comprehensive emotional analysis in JSON format.`
    
    return prompt
  }

  // Build prompt for GPT-4
  private buildGPT4Prompt(message: string, context: EmotionalContext): string {
    return this.buildClaudePrompt(message, context) // Same prompt structure
  }

  // Fallback analysis when AI is unavailable
  private getFallbackAnalysis(message: string): AdvancedEmotionalAnalysis {
    const textLower = message.toLowerCase()
    
    // Basic keyword analysis
    let primaryEmotion = 'neutral'
    let intensity = 0.5
    let confidence = 0.6
    
    if (textLower.includes('sad') || textLower.includes('down') || textLower.includes('depressed')) {
      primaryEmotion = 'sadness'
      intensity = 0.7
    } else if (textLower.includes('angry') || textLower.includes('mad') || textLower.includes('frustrated')) {
      primaryEmotion = 'anger'
      intensity = 0.8
    } else if (textLower.includes('happy') || textLower.includes('joy') || textLower.includes('excited')) {
      primaryEmotion = 'joy'
      intensity = 0.6
    } else if (textLower.includes('afraid') || textLower.includes('scared') || textLower.includes('anxious')) {
      primaryEmotion = 'fear'
      intensity = 0.7
    }
    
    return {
      primaryEmotion,
      secondaryEmotions: [],
      intensity,
      confidence,
      context: 'Basic keyword analysis',
      subtleCues: [],
      emotionalState: primaryEmotion,
      underlyingThemes: [],
      vulnerabilityIndicators: [],
      safetySignals: [],
      communicationStyle: 'direct',
      emotionalNeeds: ['understanding', 'support']
    }
  }

  // Get emotional summary for context building
  getEmotionalSummary(analysis: AdvancedEmotionalAnalysis): string {
    return `Emotional Analysis:
- Primary: ${analysis.primaryEmotion} (${analysis.intensity.toFixed(2)} intensity)
- Confidence: ${analysis.confidence.toFixed(2)}
- Context: ${analysis.context}
- Communication Style: ${analysis.communicationStyle}
- Emotional Needs: ${analysis.emotionalNeeds.join(', ')}
- Underlying Themes: ${analysis.underlyingThemes.join(', ')}`
  }
}
