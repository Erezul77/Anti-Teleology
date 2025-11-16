// Test API endpoint
async function testAPI() {
  console.log('🧠 Testing Spino API Endpoint...\n')
  
  try {
    const response = await fetch('http://localhost:3000/api/unified-philosophical', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "I'm furious at my boss for treating me unfairly and I want to quit",
        conversationHistory: [],
        language: 'en'
      })
    })

    console.log('📡 Response status:', response.status, response.statusText)
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ API Response Received!')
      console.log('Response:', result.response)
      console.log('Adequacy Score:', result.adequacyScore?.unifiedScore)
      console.log('Emotional State:', result.emotionalState?.primaryAffect)
      console.log('Therapeutic Stage:', result.therapeuticStage)
      console.log('Error Handled:', result.error ? true : false)
    } else {
      console.error('❌ API Error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error details:', errorText)
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testAPI() 