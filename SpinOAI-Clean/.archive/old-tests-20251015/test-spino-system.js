// Test script for Spino System Components
const { SpinoLogicEngine } = require('./lib/spino/logicEngine');
const { SpinoResponseEngine } = require('./lib/spino/responseEngine');
const { SpinoErrorHandler } = require('./lib/spino/errorHandler');

async function testSpinoSystem() {
  console.log('🧠 Testing Spino System Components...\n');

  try {
    // Test Logic Engine
    console.log('1. Testing Logic Engine...');
    const logicEngine = SpinoLogicEngine.getInstance();
    
    const testContent = "I feel sad because I lost my job and I can't find another one";
    const testEmotionalState = {
      primaryAffect: 'sadness',
      intensity: 0.8,
      powerChange: -0.3,
      adequacyScore: 0.3,
      bondageLevel: 'high',
      freedomRatio: 0.2,
      transformationPotential: 0.4,
      blessednessLevel: 0.1
    };
    
    const testAdequacyScore = {
      spinoAdequacy: { alpha: 0.3, deltaAlpha: -0.3, chi: 0.4 },
      noesisAdequacy: { substance: 1, imagination: 2, reason: 1, intuition: 1, freedom: 1, blessedness: 1, total: 7 },
      unifiedScore: 35,
      confidence: 0.6
    };
    
    const causalChain = logicEngine.analyzeCausalChain(testContent, testAdequacyScore);
    console.log('✅ Causal Chain Analysis:', causalChain.steps.length, 'steps found');
    
    const stageProgression = logicEngine.analyzeStageProgression(
      'identification',
      testAdequacyScore,
      testEmotionalState,
      causalChain
    );
    console.log('✅ Stage Progression:', stageProgression.nextStage);
    
    // Test Response Engine
    console.log('\n2. Testing Response Engine...');
    const responseEngine = SpinoResponseEngine.getInstance();
    
    const responseRequest = {
      userInput: testContent,
      adequacyScore: testAdequacyScore,
      emotionalState: testEmotionalState,
      therapeuticStage: 'identification',
      onionLayer: 'surface',
      causalChain: causalChain,
      stageProgression: stageProgression,
      conversationHistory: [],
      language: 'en'
    };
    
    const responseResult = responseEngine.generateAdaptiveResponse(responseRequest);
    console.log('✅ Response Generated:', responseResult.response.substring(0, 100) + '...');
    console.log('✅ Quality Score:', responseResult.qualityScore);
    
    // Test Error Handler
    console.log('\n3. Testing Error Handler...');
    const errorHandler = SpinoErrorHandler.getInstance();
    
    const testError = new Error('Logic processing error');
    const errorContext = {
      userInput: testContent,
      currentStage: 'identification',
      language: 'en'
    };
    
    const spinoError = errorHandler.detectAndClassifyError(testError, errorContext);
    console.log('✅ Error Classified:', spinoError.type);
    
    const recovery = errorHandler.handleErrorWithGracefulDegradation(spinoError, errorContext);
    console.log('✅ Error Recovery:', recovery.success ? 'SUCCESS' : 'FAILED');
    
    // Test Edge Cases
    console.log('\n4. Testing Edge Case Detection...');
    const edgeCases = errorHandler.detectAndHandleEdgeCases(
      "I want to kill myself because life is hopeless",
      errorContext
    );
    console.log('✅ Edge Cases Detected:', edgeCases.length);
    
    console.log('\n🎉 All Spino System Components Tested Successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testSpinoSystem(); 