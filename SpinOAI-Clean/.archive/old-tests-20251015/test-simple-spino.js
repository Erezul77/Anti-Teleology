// Test simple Spino API
async function testSimpleSpino() {
  console.log('🧠 Testing Simple Spino API...');

  try {
    const response = await fetch('http://localhost:3000/api/simple-spino', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "I feel sad because I lost my job and I can't find another one"
      })
    });

    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Simple Spino response:');
      console.log(JSON.stringify(result, null, 2));
      
      console.log('\n📊 Analysis:');
      console.log('Response:', result.response);
      console.log('Emotion:', result.emotionalState?.primaryAffect);
      console.log('Intensity:', result.emotionalState?.intensity);
      console.log('Adequacy score:', result.adequacyScore?.unifiedScore);
    } else {
      console.error('❌ API failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSimpleSpino();
