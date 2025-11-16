// Test minimal hello endpoint
async function testHello() {
  console.log('🧠 Testing hello endpoint...');

  try {
    const response = await fetch('http://localhost:3000/api/hello');
    console.log('📡 Response status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Hello endpoint works!');
      console.log('Response:', result);
    } else {
      console.error('❌ Hello endpoint failed:', response.status, response.statusText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testHello(); 