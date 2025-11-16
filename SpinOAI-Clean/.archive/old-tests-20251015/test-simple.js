// Test simple API endpoint
async function testSimpleAPI() {
  console.log('🧠 Testing simple API endpoint...');

  try {
    const response = await fetch('http://localhost:3000/api/test', {
      method: 'GET'
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Simple API works!');
      console.log('Response:', result);
    } else {
      console.error('❌ Simple API failed:', response.status, response.statusText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSimpleAPI(); 