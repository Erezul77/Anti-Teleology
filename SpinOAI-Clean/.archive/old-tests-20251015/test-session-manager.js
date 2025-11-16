const { SessionManager } = require('./lib/sessionManager.ts');

async function testSessionManager() {
  console.log('🧪 Testing SessionManager...');
  
  const sessionManager = SessionManager.getInstance();
  
  // Test data
  const testSession = {
    sessionId: `test-session-${Date.now()}`,
    messages: [
      {
        role: 'user',
        content: 'Hello, I am feeling anxious today.',
        timestamp: new Date(),
        adequacyScore: { unifiedScore: 0.7 },
        emotionalState: { primaryAffect: 'anxiety', intensity: 0.8 },
        therapeuticStage: 'assessment',
        onionLayer: 'emotional',
        causalChain: ['anxiety → fear → avoidance'],
        detailedAnalysis: 'User shows signs of anxiety with avoidance patterns.',
        realTimeAnalysis: { currentEmotion: 'anxiety', suggestedApproach: 'validation' }
      },
      {
        role: 'assistant',
        content: 'I understand you are feeling anxious. Let us explore what might be causing this anxiety.',
        timestamp: new Date(),
        adequacyScore: { unifiedScore: 0.85 },
        emotionalState: { primaryAffect: 'compassion', intensity: 0.9 },
        therapeuticStage: 'exploration',
        onionLayer: 'cognitive',
        causalChain: ['compassion → understanding → exploration'],
        detailedAnalysis: 'Assistant responds with compassion and invites exploration.',
        realTimeAnalysis: { currentEmotion: 'compassion', suggestedApproach: 'exploration' }
      }
    ],
    timestamp: new Date(),
    sessionMode: 'therapy',
    language: 'en',
    analytics: {
      totalMessages: 2,
      sessionDuration: 1,
      averageAdequacyScore: 0.775,
      dominantEmotion: 'anxiety',
      userMessages: 1,
      assistantMessages: 1,
      therapeuticStages: ['assessment', 'exploration'],
      adequacyTrend: [0.7, 0.85],
      emotionalTrend: ['anxiety', 'compassion']
    }
  };
  
  try {
    console.log('📝 Saving test session...');
    const saveResult = await sessionManager.saveSession(testSession);
    console.log('✅ Save result:', saveResult);
    
    console.log('📖 Loading sessions from localStorage...');
    const localStorageSessions = sessionManager.loadSessionsFromLocalStorage();
    console.log(`✅ Found ${localStorageSessions.length} sessions in localStorage`);
    
    console.log('📖 Loading sessions from Firebase...');
    const firebaseSessions = await sessionManager.loadSessionsFromFirebase();
    console.log(`✅ Found ${firebaseSessions.length} sessions in Firebase`);
    
    console.log('📊 Getting analytics...');
    const analytics = await sessionManager.getSessionAnalytics();
    console.log('✅ Analytics:', {
      totalSessions: analytics.totalSessions,
      totalMessages: analytics.totalMessages,
      averageSessionLength: analytics.averageSessionLength,
      mostCommonEmotions: analytics.mostCommonEmotions
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSessionManager(); 