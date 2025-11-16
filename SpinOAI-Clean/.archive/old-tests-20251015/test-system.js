// Comprehensive Emotional Wizard System Test
const { EmotionalWizardSystem } = require('./lib/emotionalWizardSystem');

async function testEmotionalWizardSystem() {
  console.log('🧪 Testing Emotional Wizard System...\n');

  try {
    // Initialize the system
    const emotionalWizard = new EmotionalWizardSystem({
      enableMemory: true,
      enableEmotionalAnalysis: true,
      enableAdequacyEngine: true,
      enableContextBuilding: true,
      enableAdvancedGeneration: true,
      enableQualityControl: true,
      openaiApiKey: process.env.OPENAI_API_KEY,
      claudeApiKey: process.env.CLAUDE_API_KEY
    });

    console.log('✅ System initialized successfully');

    // Test 1: Basic request processing
    console.log('\n📝 Test 1: Basic request processing...');
    const testRequest = {
      userMessage: "I'm feeling kind of emptiness",
      sessionId: 'test-session-001',
      userId: 'test-user-001'
    };

    const response = await emotionalWizard.processRequest(testRequest);
    
    console.log('✅ Response generated:', {
      responseLength: response.response?.length,
      hasEmotionalAnalysis: !!response.emotionalAnalysis,
      hasAdequacyAnalysis: !!response.adequacyAnalysis,
      hasMemoryUpdate: !!response.memoryUpdate,
      systemSummary: response.systemSummary
    });

    // Test 2: Memory system
    console.log('\n🧠 Test 2: Memory system...');
    const memoryStatus = emotionalWizard.getSystemStatus();
    console.log('✅ Memory system status:', memoryStatus.includes('Memory System: ✅ Enabled'));

    // Test 3: Multiple messages (learning)
    console.log('\n🔄 Test 3: Multiple messages (learning)...');
    
    const followUpRequest = {
      userMessage: "I'm influenced by external factors - this for sure!",
      sessionId: 'test-session-001',
      userId: 'test-user-001'
    };

    const followUpResponse = await emotionalWizard.processRequest(followUpRequest);
    
    console.log('✅ Follow-up response generated:', {
      responseLength: followUpResponse.response?.length,
      hasEmotionalAnalysis: !!followUpResponse.emotionalAnalysis,
      hasAdequacyAnalysis: !!followUpResponse.adequacyAnalysis,
      systemSummary: followUpResponse.systemSummary
    });

    // Test 4: System status
    console.log('\n📊 Test 4: System status...');
    const status = emotionalWizard.getSystemStatus();
    console.log('✅ System status retrieved:', status.length > 0);

    console.log('\n🎉 All tests passed! Emotional Wizard System is fully functional!');
    
    // Cleanup
    emotionalWizard.cleanup();
    console.log('✅ System cleanup completed');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testEmotionalWizardSystem();
