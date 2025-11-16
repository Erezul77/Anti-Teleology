const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function testEmotionalWizardSystem() {
  console.log('🧙‍♂️ Testing Emotional Wizard System...\n')

  const testCases = [
    {
      message: "I'm feeling down today",
      description: "Basic sadness test"
    },
    {
      message: "I'm really angry at my boss",
      description: "Anger test"
    },
    {
      message: "I'm so happy about my new job!",
      description: "Joy test"
    },
    {
      message: "I'm afraid I'll never find love",
      description: "Fear test"
    }
  ]

  for (const testCase of testCases) {
    console.log(`\n📝 Testing: ${testCase.description}`)
    console.log(`Message: "${testCase.message}"`)
    
    try {
      const response = await fetch('http://localhost:3000/api/unified-philosophical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testCase.message,
          sessionId: 'test-session-1',
          userId: 'test-user-1'
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Response:', data.response)
        console.log('📊 Confidence:', data.confidence)
        console.log('🔍 Sources:', data.sources)
        console.log('🧠 System Summary:', data.systemSummary)
        
        if (data.emotionalAnalysis) {
          console.log('😊 Emotional Analysis:', data.emotionalAnalysis)
        }
        
        if (data.adequacyAnalysis) {
          console.log('🧙‍♂️ Adequacy Analysis:', data.adequacyAnalysis)
        }
        
        if (data.manipulationEffect) {
          console.log('🎭 Manipulation Effect:', data.manipulationEffect)
        }
      } else {
        console.log('❌ Error:', response.status, response.statusText)
        const errorData = await response.json()
        console.log('Error details:', errorData)
      }
    } catch (error) {
      console.log('❌ Network error:', error.message)
    }
    
    console.log('─'.repeat(50))
  }

  // Test health check
  console.log('\n🏥 Testing health check...')
  try {
    const healthResponse = await fetch('http://localhost:3000/api/unified-philosophical', {
      method: 'GET'
    })
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('✅ Health check passed:', healthData)
    } else {
      console.log('❌ Health check failed:', healthResponse.status)
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message)
  }
}

// Run the test
testEmotionalWizardSystem().catch(console.error)
