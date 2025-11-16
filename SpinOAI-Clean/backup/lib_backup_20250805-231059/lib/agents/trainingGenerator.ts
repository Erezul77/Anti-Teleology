// SpiñO Training Generator Agent
// Automatically converts Spinoza's theory and coaching sessions into training data

interface TrainingExample {
  category: string
  user: string
  spino: string
  source: 'theory' | 'session' | 'generated'
  confidence: number
}

interface SpinozaTheory {
  concept: string
  explanation: string
  practicalApplication: string
  emotionalCategories: string[]
}

interface CoachingSession {
  userInput: string
  spinoResponse: string
  emotionalState: string
  therapeuticStage: string
  effectiveness: number
}

class SpinoTrainingGenerator {
  private openai: any
  private theoryDatabase: SpinozaTheory[] = []
  private sessionDatabase: CoachingSession[] = []
  private generatedExamples: TrainingExample[] = []

  constructor(openai: any) {
    this.openai = openai
    this.loadTheoryDatabase()
  }

  // Load Spinoza's theory database
  private loadTheoryDatabase() {
    this.theoryDatabase = [
      {
        concept: "Adequate Ideas",
        explanation: "Clear and distinct ideas that lead to understanding and joy",
        practicalApplication: "Help users identify when their ideas are inadequate and guide them toward clarity",
        emotionalCategories: ["confusion", "clarity", "understanding"]
      },
      {
        concept: "Affects (Emotions)",
        explanation: "Passive states that arise from inadequate ideas",
        practicalApplication: "Help users understand the causes of their emotions",
        emotionalCategories: ["sadness", "joy", "fear", "anger"]
      },
      {
        concept: "Conatus",
        explanation: "The striving to persist in being",
        practicalApplication: "Help users align their actions with their true nature",
        emotionalCategories: ["purpose", "meaning", "direction"]
      },
      {
        concept: "Determinism",
        explanation: "Everything follows from the necessity of divine nature",
        practicalApplication: "Help users understand that their situation has causes",
        emotionalCategories: ["control", "freedom", "responsibility"]
      },
      {
        concept: "Substance",
        explanation: "That which is in itself and conceived through itself",
        practicalApplication: "Help users understand their essential nature",
        emotionalCategories: ["identity", "self", "essence"]
      }
    ]
  }

  // Generate training examples from theory
  async generateFromTheory(): Promise<TrainingExample[]> {
    const examples: TrainingExample[] = []
    
    for (const theory of this.theoryDatabase) {
      for (const category of theory.emotionalCategories) {
        const prompt = `Convert this Spinoza theory into a practical coaching example:

Theory: ${theory.concept} - ${theory.explanation}
Practical Application: ${theory.practicalApplication}
Emotional Category: ${category}

Generate a user input and SpiñO response that demonstrates this theory in practice. The response should be STRONG ACTIVE and investigative, not philosophical.

User input should be a common emotional expression.
SpiñO response should be directive and investigative, asking specific questions about their situation.`

        try {
          const response = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are a training data generator. Convert Spinoza theory into practical coaching examples. Be STRONG ACTIVE and investigative, not philosophical."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7
          })

          const generatedText = response.choices[0].message.content
          const parsed = this.parseGeneratedExample(generatedText, category, 'theory')
          if (parsed) {
            examples.push(parsed)
          }
        } catch (error) {
          console.error('Error generating from theory:', error)
        }
      }
    }

    return examples
  }

  // Generate training examples from coaching sessions
  async generateFromSessions(sessions: CoachingSession[]): Promise<TrainingExample[]> {
    const examples: TrainingExample[] = []
    
    for (const session of sessions) {
      if (session.effectiveness > 0.7) { // Only use effective sessions
        const prompt = `Convert this coaching session into a training example:

User: ${session.userInput}
SpiñO: ${session.spinoResponse}
Emotional State: ${session.emotionalState}
Therapeutic Stage: ${session.therapeuticStage}

Make the SpiñO response more STRONG ACTIVE and investigative. Focus on asking specific questions about their situation, not giving philosophical explanations.`

        try {
          const response = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are a training data generator. Convert coaching sessions into STRONG ACTIVE training examples. Be directive and investigative."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7
          })

          const generatedText = response.choices[0].message.content
          const parsed = this.parseGeneratedExample(generatedText, session.emotionalState, 'session')
          if (parsed) {
            examples.push(parsed)
          }
        } catch (error) {
          console.error('Error generating from session:', error)
        }
      }
    }

    return examples
  }

  // Generate training examples from emotional categories
  async generateFromCategories(categories: string[]): Promise<TrainingExample[]> {
    const examples: TrainingExample[] = []
    
    for (const category of categories) {
      const prompt = `Generate a STRONG ACTIVE training example for emotional category: ${category}

Requirements:
- User input should be a common expression of this emotion
- SpiñO response should be DIRECTIVE and INVESTIGATIVE
- Ask specific questions: "What happened?" "When did this start?" "What changed?"
- NO philosophical explanations
- Focus on their SPECIFIC situation

Generate a user input and SpiñO response.`

      try {
        const response = await this.openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a training data generator. Create STRONG ACTIVE coaching examples. Be directive and investigative, not philosophical."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })

        const generatedText = response.choices[0].message.content
        const parsed = this.parseGeneratedExample(generatedText, category, 'generated')
        if (parsed) {
          examples.push(parsed)
        }
      } catch (error) {
        console.error('Error generating from category:', error)
      }
    }

    return examples
  }

  // Parse generated text into training example
  private parseGeneratedExample(text: string, category: string, source: 'theory' | 'session' | 'generated'): TrainingExample | null {
    try {
      // Simple parsing - look for patterns
      const lines = text.split('\n')
      let userInput = ''
      let spinoResponse = ''

      for (const line of lines) {
        if (line.toLowerCase().includes('user:') || line.toLowerCase().includes('patient:')) {
          userInput = line.split(':')[1]?.trim() || ''
        } else if (line.toLowerCase().includes('spiño:') || line.toLowerCase().includes('assistant:')) {
          spinoResponse = line.split(':')[1]?.trim() || ''
        }
      }

      if (userInput && spinoResponse) {
        return {
          category,
          user: userInput,
          spino: spinoResponse,
          source,
          confidence: 0.8
        }
      }
    } catch (error) {
      console.error('Error parsing generated example:', error)
    }

    return null
  }

  // Generate comprehensive training dataset
  async generateTrainingDataset(): Promise<TrainingExample[]> {
    console.log('🚀 Starting SpiñO Training Generator...')
    
    const theoryExamples = await this.generateFromTheory()
    console.log(`✅ Generated ${theoryExamples.length} examples from theory`)
    
    const sessionExamples = await this.generateFromSessions(this.sessionDatabase)
    console.log(`✅ Generated ${sessionExamples.length} examples from sessions`)
    
    const categoryExamples = await this.generateFromCategories([
      'anxiety', 'grief', 'identity', 'burnout', 'meaninglessness',
      'loneliness', 'rejection', 'stuck', 'happiness', 'trust',
      'intimacy', 'worthlessness', 'existential', 'independence',
      'purpose', 'caregiving', 'performance', 'desire', 'apathy', 'betrayal'
    ])
    console.log(`✅ Generated ${categoryExamples.length} examples from categories`)
    
    const allExamples = [...theoryExamples, ...sessionExamples, ...categoryExamples]
    console.log(`🎯 Total training examples generated: ${allExamples.length}`)
    
    return allExamples
  }

  // Export training data to file
  async exportTrainingData(examples: TrainingExample[], filename: string): Promise<void> {
    const fs = require('fs').promises
    const content = `// Auto-generated SpiñO Training Data
// Generated on: ${new Date().toISOString()}
// Total examples: ${examples.length}

export const TRAINING_EXAMPLES = ${JSON.stringify(examples, null, 2)}`
    
    await fs.writeFile(filename, content)
    console.log(`✅ Training data exported to: ${filename}`)
  }
}

export { SpinoTrainingGenerator }
export type { TrainingExample, SpinozaTheory, CoachingSession } 