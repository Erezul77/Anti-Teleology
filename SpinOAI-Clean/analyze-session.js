// Script to analyze SpiñO session and identify issues
// Run this in browser console to get detailed analysis

function analyzeSpinoFunctionality() {
    console.log('🔍 Analyzing SpiñO functionality...');
    
    try {
        const sessions = JSON.parse(localStorage.getItem('spino-sessions') || '[]');
        
        if (sessions.length === 0) {
            console.log('❌ No sessions found. Please start a conversation with SpiñO first.');
            return;
        }
        
        // Get the most recent session
        const latestSession = sessions[sessions.length - 1];
        console.log(`📋 Analyzing session: ${latestSession.sessionId}`);
        console.log(`⏰ Time: ${new Date(latestSession.timestamp).toLocaleString()}`);
        console.log(`💬 Messages: ${latestSession.messages.length}`);
        
        // Analyze SpiñO responses
        const assistantMessages = latestSession.messages.filter(msg => msg.role === 'assistant');
        const userMessages = latestSession.messages.filter(msg => msg.role === 'user');
        
        console.log(`\n🤖 SpiñO Responses Analysis:`);
        console.log(`   Total SpiñO messages: ${assistantMessages.length}`);
        
        // Check for SpiñO characteristics
        let issues = [];
        let strengths = [];
        
        assistantMessages.forEach((msg, index) => {
            const content = msg.content.toLowerCase();
            console.log(`\n   Message ${index + 1}:`);
            console.log(`   "${msg.content}"`);
            
            // Check for issues
            if (content.includes('spino analysis') || content.includes('chat response')) {
                issues.push(`Message ${index + 1}: Contains unwanted prefixes`);
            }
            
            if (content.includes('okay') || content.includes('everything will be') || content.includes('just hang in')) {
                issues.push(`Message ${index + 1}: Uses sentimental/generic language`);
            }
            
            if (!content.includes('?') && !content.includes('what') && !content.includes('how') && !content.includes('why')) {
                issues.push(`Message ${index + 1}: No questions asked (passive)`);
            }
            
            if (!content.includes('cause') && !content.includes('causal') && !content.includes('because')) {
                issues.push(`Message ${index + 1}: No causal language used`);
            }
            
            if (content.includes('let\'s') || content.includes('systematically') || content.includes('step')) {
                strengths.push(`Message ${index + 1}: Uses structured approach`);
            }
            
            if (content.includes('clarify') || content.includes('understand') || content.includes('clear')) {
                strengths.push(`Message ${index + 1}: Provides clarity`);
            }
        });
        
        // Check conversation flow
        console.log(`\n🔄 Conversation Flow Analysis:`);
        
        if (assistantMessages.length < userMessages.length) {
            issues.push('SpiñO is not responding enough (passive)');
        }
        
        // Check for 5-stage therapeutic process
        const therapeuticStages = ['initial', 'deconstruction', 'interactive', 'reconstruction', 'summary'];
        const stageMentions = therapeuticStages.map(stage => 
            assistantMessages.some(msg => msg.content.toLowerCase().includes(stage))
        );
        
        console.log(`   Therapeutic stages mentioned: ${therapeuticStages.filter((_, i) => stageMentions[i]).join(', ')}`);
        
        if (stageMentions.filter(Boolean).length < 2) {
            issues.push('Not following 5-stage therapeutic process');
        }
        
        // Check adequacy scores
        const adequacyScores = latestSession.messages
            .filter(msg => msg.adequacyScore?.unifiedScore)
            .map(msg => msg.adequacyScore.unifiedScore);
            
        if (adequacyScores.length > 0) {
            const avgAdequacy = adequacyScores.reduce((a, b) => a + b, 0) / adequacyScores.length;
            console.log(`   Average adequacy score: ${(avgAdequacy * 100).toFixed(1)}%`);
            
            if (avgAdequacy < 0.3) {
                issues.push('Low adequacy scores - SpiñO not helping effectively');
            }
        }
        
        // Summary
        console.log(`\n📊 ANALYSIS SUMMARY:`);
        console.log(`   ✅ Strengths (${strengths.length}):`);
        strengths.forEach(strength => console.log(`      - ${strength}`));
        
        console.log(`   ❌ Issues Found (${issues.length}):`);
        issues.forEach(issue => console.log(`      - ${issue}`));
        
        // Export session data for further analysis
        const exportData = {
            sessionId: latestSession.sessionId,
            timestamp: latestSession.timestamp,
            totalMessages: latestSession.messages.length,
            userMessages: userMessages.length,
            assistantMessages: assistantMessages.length,
            issues: issues,
            strengths: strengths,
            messages: latestSession.messages,
            analytics: latestSession.analytics
        };
        
        console.log(`\n📤 Exporting session data for analysis...`);
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `spino-analysis-${latestSession.sessionId}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        console.log(`\n💡 Copy this data and share it with me to get specific fixes:`);
        console.log(JSON.stringify(exportData, null, 2));
        
        return exportData;
        
    } catch (error) {
        console.error('❌ Error analyzing session:', error);
    }
}

// Run the analysis
analyzeSpinoFunctionality();

// Export for browser console
if (typeof window !== 'undefined') {
    window.analyzeSpinoFunctionality = analyzeSpinoFunctionality;
} 