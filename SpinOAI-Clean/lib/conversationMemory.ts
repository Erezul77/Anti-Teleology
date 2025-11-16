import { EmotionalState } from './types'

// Types for conversation memory
interface ConversationMemory {
  sessionId: string
  userId: string
  messages: MemoryMessage[]
  emotionalPatterns: EmotionalPattern[]
  relationshipContext: RelationshipContext
  lastUpdated: Date
}

interface MemoryMessage {
  id: string
  timestamp: Date
  role: 'user' | 'assistant'
  content: string
  emotionalAnalysis?: EmotionalAnalysis
  spinozisticAnalysis?: SpinozisticAnalysis
}

interface EmotionalAnalysis {
  primaryEmotion: string
  intensity: number
  confidence: number
  context: string
  subtleCues: string[]
}

interface SpinozisticAnalysis {
  primaryAffect: string
  powerChange: number
  adequacyScore: number
  freedomRatio: number
  inadequateIdeas: string[]
  coachingStrategy: string
}

interface EmotionalPattern {
  pattern: string
  frequency: number
  triggers: string[]
  responses: string[]
  effectiveness: number
}

interface RelationshipContext {
  trustLevel: number // 0-1
  vulnerabilityLevel: number // 0-1
  emotionalSafety: number // 0-1
  sharedTopics: string[]
  sensitiveTopics: string[]
  preferredCommunicationStyle: string
}

export class ConversationMemorySystem {
  private memories: Map<string, ConversationMemory> = new Map()
  private maxMemoryAge: number = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

  constructor() {
    console.log('🧠 Conversation Memory System initialized')
  }

  // Create or retrieve memory for a session
  getOrCreateMemory(sessionId: string, userId: string): ConversationMemory {
    const key = `${sessionId}-${userId}`
    
    if (!this.memories.has(key)) {
      const newMemory: ConversationMemory = {
        sessionId,
        userId,
        messages: [],
        emotionalPatterns: [],
        relationshipContext: {
          trustLevel: 0.5,
          vulnerabilityLevel: 0.3,
          emotionalSafety: 0.7,
          sharedTopics: [],
          sensitiveTopics: [],
          preferredCommunicationStyle: 'exploratory'
        },
        lastUpdated: new Date()
      }
      
      this.memories.set(key, newMemory)
      console.log('🧠 Created new conversation memory for:', key)
    }
    
    return this.memories.get(key)!
  }

  // Add a message to memory
  addMessage(
    sessionId: string, 
    userId: string, 
    role: 'user' | 'assistant', 
    content: string,
    emotionalAnalysis?: EmotionalAnalysis,
    spinozisticAnalysis?: SpinozisticAnalysis
  ): void {
    const memory = this.getOrCreateMemory(sessionId, userId)
    
    const message: MemoryMessage = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      role,
      content,
      emotionalAnalysis,
      spinozisticAnalysis
    }
    
    memory.messages.push(message)
    memory.lastUpdated = new Date()
    
    // Update emotional patterns
    this.updateEmotionalPatterns(memory, message)
    
    // Update relationship context
    this.updateRelationshipContext(memory, message)
    
    console.log('🧠 Added message to memory:', {
      sessionId,
      userId,
      role,
      contentLength: content.length,
      hasEmotionalAnalysis: !!emotionalAnalysis,
      hasSpinozisticAnalysis: !!spinozisticAnalysis
    })
  }

  // Get conversation history for context
  getConversationHistory(sessionId: string, userId: string, maxMessages: number = 10): MemoryMessage[] {
    const memory = this.getOrCreateMemory(sessionId, userId)
    return memory.messages.slice(-maxMessages)
  }

  // Get emotional patterns
  getEmotionalPatterns(sessionId: string, userId: string): EmotionalPattern[] {
    const memory = this.getOrCreateMemory(sessionId, userId)
    return memory.emotionalPatterns
  }

  // Get relationship context
  getRelationshipContext(sessionId: string, userId: string): RelationshipContext {
    const memory = this.getOrCreateMemory(sessionId, userId)
    return memory.relationshipContext
  }

  // Update emotional patterns based on new message
  private updateEmotionalPatterns(memory: ConversationMemory, message: MemoryMessage): void {
    if (message.role !== 'user' || !message.emotionalAnalysis) return
    
    const emotion = message.emotionalAnalysis.primaryEmotion
    const intensity = message.emotionalAnalysis.intensity
    
    // Find existing pattern or create new one
    let pattern = memory.emotionalPatterns.find(p => p.pattern === emotion)
    
    if (!pattern) {
      pattern = {
        pattern: emotion,
        frequency: 1,
        triggers: [message.content.substring(0, 50)],
        responses: [],
        effectiveness: 0.5
      }
      memory.emotionalPatterns.push(pattern)
    } else {
      pattern.frequency++
      pattern.triggers.push(message.content.substring(0, 50))
    }
    
    // Keep only recent triggers
    if (pattern.triggers.length > 5) {
      pattern.triggers = pattern.triggers.slice(-5)
    }
  }

  // Update relationship context based on conversation
  private updateRelationshipContext(memory: ConversationMemory, message: MemoryMessage): void {
    const context = memory.relationshipContext
    
    if (message.role === 'user') {
      // Analyze vulnerability indicators
      const vulnerabilityWords = ['afraid', 'scared', 'worried', 'anxious', 'lonely', 'hurt', 'pain']
      const hasVulnerability = vulnerabilityWords.some(word => 
        message.content.toLowerCase().includes(word)
      )
      
      if (hasVulnerability) {
        context.vulnerabilityLevel = Math.min(1, context.vulnerabilityLevel + 0.1)
        context.trustLevel = Math.min(1, context.trustLevel + 0.05)
      }
      
      // Analyze emotional safety indicators
      const safetyWords = ['safe', 'comfortable', 'understood', 'heard', 'accepted']
      const hasSafety = safetyWords.some(word => 
        message.content.toLowerCase().includes(word)
      )
      
      if (hasSafety) {
        context.emotionalSafety = Math.min(1, context.emotionalSafety + 0.1)
      }
      
      // Track shared topics
      const words = message.content.toLowerCase().split(' ')
      const topicWords = words.filter(word => word.length > 4)
      context.sharedTopics.push(...topicWords.slice(0, 3))
      
      // Remove duplicates and keep recent
      context.sharedTopics = [...new Set(context.sharedTopics)].slice(-20)
    }
  }

  // Get memory summary for AI context
  getMemorySummary(sessionId: string, userId: string): string {
    const memory = this.getOrCreateMemory(sessionId, userId)
    const history = this.getConversationHistory(sessionId, userId, 5)
    const patterns = memory.emotionalPatterns
    const relationship = memory.relationshipContext
    
    let summary = `Conversation Memory Summary:\n`
    summary += `- Session: ${sessionId}\n`
    summary += `- Messages: ${memory.messages.length}\n`
    summary += `- Trust Level: ${relationship.trustLevel.toFixed(2)}\n`
    summary += `- Vulnerability Level: ${relationship.vulnerabilityLevel.toFixed(2)}\n`
    summary += `- Emotional Safety: ${relationship.emotionalSafety.toFixed(2)}\n`
    
    if (patterns.length > 0) {
      summary += `- Emotional Patterns: ${patterns.map(p => `${p.pattern}(${p.frequency})`).join(', ')}\n`
    }
    
    if (relationship.sharedTopics.length > 0) {
      summary += `- Recent Topics: ${relationship.sharedTopics.slice(-5).join(', ')}\n`
    }
    
    summary += `- Recent Messages: ${history.map(m => `${m.role}: ${m.content.substring(0, 30)}...`).join(' | ')}\n`
    
    return summary
  }

  // Clean up old memories
  cleanup(): void {
    const now = new Date()
    const keysToDelete: string[] = []
    
    for (const [key, memory] of this.memories.entries()) {
      const age = now.getTime() - memory.lastUpdated.getTime()
      if (age > this.maxMemoryAge) {
        keysToDelete.push(key)
      }
    }
    
    keysToDelete.forEach(key => {
      this.memories.delete(key)
      console.log('🧠 Cleaned up old memory:', key)
    })
  }
}
