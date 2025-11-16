// Test UnifiedPhilosophicalSystem initialization
console.log('🧠 Testing UnifiedPhilosophicalSystem import...');

try {
  // Test if we can import the system
  const { UnifiedPhilosophicalSystem } = require('./lib/unifiedPhilosophicalSystem.ts');
  console.log('✅ Import successful');
  
  // Test if we can get an instance
  const system = UnifiedPhilosophicalSystem.getInstance();
  console.log('✅ Instance created');
  
  // Test initialization
  system.initialize().then(() => {
    console.log('✅ Initialization successful');
  }).catch(err => {
    console.error('❌ Initialization failed:', err.message);
  });
  
} catch (error) {
  console.error('❌ Import failed:', error.message);
  console.error('Full error:', error);
} 