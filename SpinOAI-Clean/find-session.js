// Simple script to find and analyze saved sessions
// Run this in the browser console or as a Node.js script

function findSavedSessions() {
  console.log('🔍 Searching for saved sessions...');
  
  // Check localStorage
  try {
    const localStorageSessions = JSON.parse(localStorage.getItem('spino-sessions') || '[]');
    console.log(`📱 Found ${localStorageSessions.length} sessions in localStorage:`);
    
    localStorageSessions.forEach((session, index) => {
      console.log(`\n📋 Session ${index + 1}:`);
      console.log(`   ID: ${session.sessionId}`);
      console.log(`   Timestamp: ${new Date(session.timestamp).toLocaleString()}`);
      console.log(`   Messages: ${session.messages.length}`);
      console.log(`   Mode: ${session.sessionMode}`);
      console.log(`   Language: ${session.language}`);
      
      if (session.analytics) {
        console.log(`   Analytics:`);
        console.log(`     - Total Messages: ${session.analytics.totalMessages}`);
        console.log(`     - Average Adequacy: ${(session.analytics.averageAdequacyScore * 100).toFixed(1)}%`);
        console.log(`     - Dominant Emotion: ${session.analytics.dominantEmotion}`);
        console.log(`     - User Messages: ${session.analytics.userMessages}`);
        console.log(`     - Assistant Messages: ${session.analytics.assistantMessages}`);
      }
      
      // Show first few messages
      console.log(`   Recent Messages:`);
      session.messages.slice(-3).forEach((msg, msgIndex) => {
        const role = msg.role === 'user' ? '👤 You' : '🤖 SpiñO';
        const content = msg.content.length > 100 ? msg.content.substring(0, 100) + '...' : msg.content;
        console.log(`     ${role}: ${content}`);
      });
    });
    
    return localStorageSessions;
  } catch (error) {
    console.error('❌ Error reading localStorage sessions:', error);
    return [];
  }
}

// Function to analyze session quality
function analyzeSession(session) {
  console.log(`\n🔬 Analyzing session: ${session.sessionId}`);
  
  const userMessages = session.messages.filter(msg => msg.role === 'user');
  const assistantMessages = session.messages.filter(msg => msg.role === 'assistant');
  
  console.log(`   Conversation Length: ${session.messages.length} messages`);
  console.log(`   User Messages: ${userMessages.length}`);
  console.log(`   Assistant Messages: ${assistantMessages.length}`);
  
  // Check for SpiñO characteristics
  let spinoCharacteristics = {
    usesCausalLanguage: 0,
    asksQuestions: 0,
    providesClarity: 0,
    avoidsSentimentality: 0,
    usesStructuredApproach: 0
  };
  
  assistantMessages.forEach(msg => {
    const content = msg.content.toLowerCase();
    
    if (content.includes('cause') || content.includes('causal') || content.includes('because')) {
      spinoCharacteristics.usesCausalLanguage++;
    }
    if (content.includes('?') || content.includes('what') || content.includes('how') || content.includes('why')) {
      spinoCharacteristics.asksQuestions++;
    }
    if (content.includes('clarify') || content.includes('understand') || content.includes('clear')) {
      spinoCharacteristics.providesClarity++;
    }
    if (!content.includes('okay') && !content.includes('everything will be') && !content.includes('just hang in')) {
      spinoCharacteristics.avoidsSentimentality++;
    }
    if (content.includes('let\'s') || content.includes('systematically') || content.includes('step')) {
      spinoCharacteristics.usesStructuredApproach++;
    }
  });
  
  console.log(`   SpiñO Characteristics:`);
  console.log(`     - Uses Causal Language: ${spinoCharacteristics.usesCausalLanguage}/${assistantMessages.length}`);
  console.log(`     - Asks Questions: ${spinoCharacteristics.asksQuestions}/${assistantMessages.length}`);
  console.log(`     - Provides Clarity: ${spinoCharacteristics.providesClarity}/${assistantMessages.length}`);
  console.log(`     - Avoids Sentimentality: ${spinoCharacteristics.avoidsSentimentality}/${assistantMessages.length}`);
  console.log(`     - Uses Structured Approach: ${spinoCharacteristics.usesStructuredApproach}/${assistantMessages.length}`);
  
  return spinoCharacteristics;
}

// Run the analysis
const sessions = findSavedSessions();
if (sessions.length > 0) {
  console.log(`\n🎯 Analyzing most recent session...`);
  analyzeSession(sessions[sessions.length - 1]);
} else {
  console.log('❌ No sessions found in localStorage');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.findSavedSessions = findSavedSessions;
  window.analyzeSession = analyzeSession;
} 