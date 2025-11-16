// SpiñO Training Generator Script
// Run this to generate training data automatically

const { OpenAI } = require('openai')
const { SpinoTrainingGenerator } = require('../lib/agents/trainingGenerator')

interface TrainingExample {
  category: string
  user: string
  spino: string
  source: 'theory' | 'session' | 'generated'
  confidence: number
}

async function main() {
  console.log('🚀 Starting SpiñO Training Generator...')
  
  // Initialize OpenAI
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
  
  // Create training generator
  const generator = new SpinoTrainingGenerator(openai)
  
  try {
    // Generate comprehensive training dataset
    const examples = await generator.generateTrainingDataset()
    
    // Export to file
    await generator.exportTrainingData(examples, '../lib/generatedTraining.ts')
    
    console.log('✅ Training generation completed!')
    console.log(`📊 Generated ${examples.length} training examples`)
    
    // Show some statistics
    const bySource = examples.reduce((acc: Record<string, number>, ex: TrainingExample) => {
      acc[ex.source] = (acc[ex.source] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('📈 Training examples by source:')
    Object.entries(bySource).forEach(([source, count]) => {
      console.log(`  ${source}: ${count}`)
    })
    
    // Show some examples
    console.log('\n📝 Sample generated examples:')
    examples.slice(0, 3).forEach((ex: TrainingExample, i: number) => {
      console.log(`\nExample ${i + 1} (${ex.category}):`)
      console.log(`User: ${ex.user}`)
      console.log(`SpiñO: ${ex.spino}`)
    })
    
  } catch (error) {
    console.error('❌ Error generating training data:', error)
  }
}

// Run the generator
if (require.main === module) {
  main().catch(console.error)
} 