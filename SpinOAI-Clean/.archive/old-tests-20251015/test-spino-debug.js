// Debug test for Spino system
async function testSpinoDebug() {
  console.log('🧠 Testing Spino system debug...');

  try {
    const response = await fetch('http://localhost:3000/api/unified-philosophical', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "I feel sad because I lost my job and I can't find another one",
        conversationHistory: [],
        language: 'en'
      })
    });

    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Full response:');
      console.log(JSON.stringify(result, null, 2));
      
      console.log('\n📊 Analysis:');
      console.log('Response length:', result.response?.length || 0);
      console.log('Response preview:', result.response?.substring(0, 100) + '...');
      console.log('Adequacy score:', result.adequacyScore?.unifiedScore);
      console.log('Emotional state:', result.emotionalState?.primaryAffect);
      console.log('Therapeutic stage:', result.therapeuticStage);
      console.log('Onion layer:', result.onionLayer);
      console.log('Causal chain length:', result.causalChain?.length || 0);
      console.log('Detailed analysis length:', result.detailedAnalysis?.length || 0);
    } else {
      console.error('❌ API failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSpinoDebug();
