'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import TeleologyPanel from './TeleologyPanel'
import ChatInput from './ChatInput'

interface UnifiedMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  adequacyScore?: {
    spinoAdequacy: {
      alpha: number
      deltaAlpha: number
      chi: number
    }
    noesisAdequacy: {
      substance: number
      imagination: number
      reason: number
      intuition: number
      freedom: number
      blessedness: number
      total: number
    }
    unifiedScore: number
    confidence: number
  }
  emotionalState?: {
    primaryAffect: string
    intensity: number
    powerChange: number
    adequacyScore: number
    bondageLevel: 'high' | 'medium' | 'low'
    freedomRatio: number
    transformationPotential: number
    blessednessLevel: number
  }
  therapeuticStage?: string
  onionLayer?: string
  causalChain?: string[]
  detailedAnalysis?: string
  realTimeAnalysis?: any
  teleology?: {
    teleologyScore: number
    teleologyType: string | null
    manipulationRisk: string
    detectedPhrases: string[]
    purposeClaim: string | null
    neutralCausalParaphrase: string | null
  } | null
}

interface UnifiedChatBoxProps {
  messages: UnifiedMessage[]
  setMessages: React.Dispatch<React.SetStateAction<UnifiedMessage[]>>
  darkMode: boolean
  language?: string
  sessionMode?: 'coaching'
}

// Legacy analysis dashboard removed - using TeleologyPanel only

export function UnifiedChatBox({ messages, setMessages, darkMode, language: externalLanguage, sessionMode = 'coaching' }: UnifiedChatBoxProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [expandedAnalysisMessages, setExpandedAnalysisMessages] = useState<Set<number>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Generate session and user IDs
  const sessionId = `spino-session-${Date.now()}`
  const userId = 'default-user'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Save messages to localStorage
  const saveToLocalStorage = (newMessages: UnifiedMessage[]) => {
    try {
      const sessionId = `spino-session-${Date.now()}`
      
      // Generate analytics data
      const userMessages = newMessages.filter(msg => msg.role === 'user')
      const assistantMessages = newMessages.filter(msg => msg.role === 'assistant')
      
      // Calculate average adequacy score
      const adequacyScores = newMessages
        .filter(msg => msg.adequacyScore?.unifiedScore !== undefined)
        .map(msg => msg.adequacyScore!.unifiedScore)
      
      const averageAdequacyScore = adequacyScores.length > 0 
        ? adequacyScores.reduce((a, b) => a + b, 0) / adequacyScores.length 
        : 0
      
      // Get dominant emotion
      const emotions = newMessages
        .filter(msg => msg.emotionalState?.primaryAffect)
        .map(msg => msg.emotionalState!.primaryAffect)
      
      const dominantEmotion = emotions.length > 0
        ? emotions.sort((a, b) => emotions.filter(v => v === a).length - emotions.filter(v => v === b).length).pop() || 'neutral'
        : 'neutral'
      
      // Get therapeutic stages
      const therapeuticStages = newMessages
        .filter(msg => msg.therapeuticStage)
        .map(msg => msg.therapeuticStage!)
      
      const sessionData = {
        sessionId,
        messages: newMessages,
        timestamp: new Date().toISOString(),
        sessionMode,
        language: externalLanguage || 'en',
        analytics: {
          totalMessages: newMessages.length,
          sessionDuration: 0, // Could calculate actual duration
          averageAdequacyScore,
          dominantEmotion,
          userMessages: userMessages.length,
          assistantMessages: assistantMessages.length,
          therapeuticStages,
          adequacyTrend: adequacyScores,
          emotionalTrend: emotions
        }
      }
      
      // Get existing sessions
      const existingSessions = JSON.parse(localStorage.getItem('spino-sessions') || '[]')
      
      // Add new session
      existingSessions.push(sessionData)
      
      // Keep only last 10 sessions
      if (existingSessions.length > 10) {
        existingSessions.splice(0, existingSessions.length - 10)
      }
      
      localStorage.setItem('spino-sessions', JSON.stringify(existingSessions))
      console.log('✅ Session saved to localStorage:', sessionId)
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error)
    }
  }

  const handleSendMessage = async (message: string) => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isLoading) return

    const userMessage: UnifiedMessage = {
      role: 'user',
      content: trimmedMessage,
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    // Save user message to localStorage
    saveToLocalStorage(newMessages)

    try {
      const requestBody = {
        message: trimmedMessage,
        sessionId: sessionId || 'default-session',
        userId: userId || 'default-user'
      }
      
      console.log('Sending unified request:', requestBody)
      
      const response = await fetch('/api/unified-philosophical', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      
      const data = await response.json()
      console.log('Unified API response:', data)
      console.log('🚨 CLIENT DEBUG: Response length:', data.response?.length || 0)
      console.log('🚨 CLIENT DEBUG: Response preview:', data.response?.substring(0, 100) + '...')
      console.log('🚨 CLIENT DEBUG: Adequacy score:', data.adequacyScore?.unifiedScore || 'N/A')
      console.log('🚨 CLIENT DEBUG: Therapeutic stage:', data.therapeuticStage || 'N/A')
      
      if (!response.ok) {
        console.error('Unified API error:', response.status, data)
        const errorMessage: UnifiedMessage = { 
          role: "assistant", 
          content: `API Error: ${response.status} - ${data.error || 'Unknown error'}`, 
          timestamp: new Date() 
        }
        const updatedMessages = [...newMessages, errorMessage]
        setMessages(updatedMessages)
        saveToLocalStorage(updatedMessages)
        return
      }
      
      if (data.response) {
        console.log('Creating assistant message with data:', {
          response: data.response?.substring(0, 100) + '...',
          adequacyScore: data.adequacyScore,
          emotionalState: data.emotionalState,
          therapeuticStage: data.therapeuticStage,
          onionLayer: data.onionLayer,
          causalChain: data.causalChain
        })
        
        const assistantMessage: UnifiedMessage = { 
          role: "assistant", 
          content: data.response, 
          timestamp: new Date(),
          adequacyScore: data.adequacyScore,
          emotionalState: data.emotionalState,
          therapeuticStage: data.therapeuticStage,
          onionLayer: data.onionLayer,
          causalChain: data.causalChain,
          detailedAnalysis: data.detailedAnalysis,
          realTimeAnalysis: data.realTimeAnalysis,
          teleology: data.teleology ?? null
        }
        console.log('✅ Assistant message created:', assistantMessage)
        const updatedMessages = [...newMessages, assistantMessage]
        console.log('✅ Updated messages array:', updatedMessages.length, 'messages')
        setMessages(updatedMessages)
        console.log('✅ Messages state updated')
        saveToLocalStorage(updatedMessages)
      } else {
        console.log('❌ No response in data:', data)
        const noReplyMessage: UnifiedMessage = { 
          role: "assistant", 
          content: "[No reply received]", 
          timestamp: new Date() 
        }
        const updatedMessages = [...newMessages, noReplyMessage]
        setMessages(updatedMessages)
        saveToLocalStorage(updatedMessages)
      }
    } catch (e) {
      const errorMessage: UnifiedMessage = { 
        role: "assistant", 
        content: "[Connection error - please try again]", 
        timestamp: new Date() 
      }
      const updatedMessages = [...newMessages, errorMessage]
      setMessages(updatedMessages)
      saveToLocalStorage(updatedMessages)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex flex-col h-full ${darkMode ? 'text-white' : 'text-black'}`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-full sm:max-w-3xl rounded-2xl p-3 sm:p-4 ${
                message.role === 'user' 
                  ? darkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : darkMode 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-black'
              }`}>
                <div className="flex items-start space-x-3">
                                     {message.role === 'assistant' && (
                     <Image 
                       src="/favicon.PNG" 
                       alt="SpiñO" 
                       width={96} 
                       height={96} 
                       className="rounded-full"
                     />
                   )}
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-medium mb-1" style={{fontFamily: 'Arial Unicode MS, Arial, sans-serif'}}>
                      {message.role === 'user' ? 'You' : 'SpiñO'}
                    </div>
                    <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    
                    {/* Show teleology analysis toggle for assistant messages */}
                    {message.role === 'assistant' && message.teleology && (
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            const newExpanded = new Set(expandedAnalysisMessages)
                            if (newExpanded.has(index)) {
                              newExpanded.delete(index)
                            } else {
                              newExpanded.add(index)
                            }
                            setExpandedAnalysisMessages(newExpanded)
                          }}
                          className={`flex items-center space-x-1 sm:space-x-2 text-xs ${
                            darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          {expandedAnalysisMessages.has(index) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          <span>Spino Analysis – Teleology & Causality</span>
                        </button>
                        
                        {expandedAnalysisMessages.has(index) && (
                          <div className="mt-3">
                            <TeleologyPanel teleology={message.teleology ?? null} darkMode={darkMode} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className={`max-w-full sm:max-w-3xl rounded-2xl p-3 sm:p-4 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
            }`}>
              <div className="flex items-center space-x-3">
                                 <Image 
                   src="/favicon.PNG" 
                   alt="SpiñO" 
                   width={96} 
                   height={96} 
                   className="rounded-full animate-pulse"
                 />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  )
} 