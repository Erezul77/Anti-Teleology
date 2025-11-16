// Test minimal API endpoint
async function testMinimal() {
  console.log('🧠 Testing minimal API endpoint...');

  try {
    // Test GET
    console.log('📡 Testing GET...');
    const getResponse = await fetch('http://localhost:3000/api/minimal');
    console.log('📡 GET Response status:', getResponse.status);

    if (getResponse.ok) {
      const getResult = await getResponse.json();
      console.log('✅ GET works!');
      console.log('Response:', getResult);
    } else {
      console.error('❌ GET failed:', getResponse.status, getResponse.statusText);
    }

    // Test POST
    console.log('📡 Testing POST...');
    const postResponse = await fetch('http://localhost:3000/api/minimal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' })
    });
    console.log('📡 POST Response status:', postResponse.status);

    if (postResponse.ok) {
      const postResult = await postResponse.json();
      console.log('✅ POST works!');
      console.log('Response:', postResult);
    } else {
      console.error('❌ POST failed:', postResponse.status, postResponse.statusText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMinimal();
