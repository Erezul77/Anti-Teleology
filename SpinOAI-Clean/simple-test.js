// Simple test to check if server is running
const http = require('http');

function testServer() {
  console.log('🔍 Testing if server is running...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('✅ Server is responding!');
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
  });

  req.on('error', (err) => {
    console.log('❌ Server not responding:', err.message);
  });

  req.end();
}

testServer(); 