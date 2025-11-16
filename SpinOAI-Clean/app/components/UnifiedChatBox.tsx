'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Activity, TrendingUp, Brain, Zap, Target, Lightbulb, Layers, Heart, Sparkles } from 'lucide-react'
import Image from 'next/image'

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
}

interface UnifiedChatBoxProps {
  messages: UnifiedMessage[]
  setMessages: React.Dispatch<React.SetStateAction<UnifiedMessage[]>>
  darkMode: boolean
  language?: string
  sessionMode?: 'therapy' | 'philosophical'
}

// Enhanced Real-time Dashboard Component
const UnifiedRealTimeDashboard = ({ message }: { message: UnifiedMessage }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  if (!message.adequacyScore || !message.emotionalState) return null
  
  const adequacy = message.adequacyScore
  const emotional = message.emotionalState
  
  // Additional safety checks
  if (!adequacy.spinoAdequacy || !adequacy.noesisAdequacy) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl backdrop-blur-sm overflow-hidden"
    >
      <div 
        className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          <h3 className="text-sm sm:text-lg font-semibold text-white">Spino Analysis</h3>
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-3 sm:px-4 pb-3 sm:pb-4"
          >
      
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
        <div className="bg-black/20 rounded-lg p-2 sm:p-3 border border-white/10">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
            <Image src="/favicon.gif" alt="Spino" width={24} height={24} className="rounded" />
            <span className="text-xs text-white/60">Unified Score</span>
          </div>
          <div className="text-xs sm:text-sm font-medium text-white">{Math.round((adequacy.unifiedScore || 0) * 100) / 100}/100</div>
          <div className="text-xs text-white/40">Confidence: {((adequacy.confidence || 0) * 100).toFixed(0)}%</div>
        </div>
        
        <div className="bg-black/20 rounded-lg p-2 sm:p-3 border border-white/10">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
            <Image src="/favicon.gif" alt="Spino" width={24} height={24} className="rounded" />
            <span className="text-xs text-white/60">Spino α/Δα/χ</span>
          </div>
          <div className="text-xs sm:text-sm font-medium text-white">
            α:{(adequacy.spinoAdequacy?.alpha || 0 * 100).toFixed(0)}% 
            Δα:{(adequacy.spinoAdequacy?.deltaAlpha || 0 * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-white/40">χ:{(adequacy.spinoAdequacy?.chi || 0 * 100).toFixed(0)}%</div>
        </div>
        
        <div className="bg-black/20 rounded-lg p-2 sm:p-3 border border-white/10">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
            <Image src="/favicon.gif" alt="Spino" width={24} height={24} className="rounded" />
            <span className="text-xs text-white/60">Noesis Total</span>
          </div>
          <div className="text-xs sm:text-sm font-medium text-white">{Math.round((adequacy.noesisAdequacy?.total || 0) * 100) / 100}/19</div>
          <div className="text-xs text-white/40">Freedom: {Math.round((adequacy.noesisAdequacy?.freedom || 0) * 100) / 100}/3</div>
        </div>
        
        <div className="bg-black/20 rounded-lg p-2 sm:p-3 border border-white/10">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
            <Image src="/favicon.gif" alt="Spino" width={24} height={24} className="rounded" />
            <span className="text-xs text-white/60">Emotional State</span>
          </div>
          <div className="text-xs sm:text-sm font-medium text-white capitalize">{emotional.primaryAffect || 'neutral'}</div>
          <div className="text-xs text-white/40">Intensity: {((emotional.intensity || 0) * 100).toFixed(0)}%</div>
        </div>
      </div>
      
      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
        <div className="bg-black/20 rounded-lg p-2 sm:p-3 border border-white/10">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
            <Image src="/favicon.gif" alt="Spino" width={24} height={24} className="rounded" />
            <span className="text-xs text-white/60">Therapeutic Stage</span>
          </div>
          <div className="text-xs sm:text-sm font-medium text-white capitalize">{message.therapeuticStage || 'identification'}</div>
          <div className="text-xs text-white/40">Layer: {message.onionLayer || 'surface'}</div>
        </div>
        
        <div className="bg-black/20 rounded-lg p-2 sm:p-3 border border-white/10">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
            <Image src="/favicon.gif" alt="Spino" width={24} height={24} className="rounded" />
            <span className="text-xs text-white/60">Freedom Ratio</span>
          </div>
          <div className="text-xs sm:text-sm font-medium text-white">{((emotional.freedomRatio || 0) * 100).toFixed(0)}%</div>
          <div className="text-xs text-white/40">Bondage: {emotional.bondageLevel || 'unknown'}</div>
        </div>
      </div>
      
      {/* Causal Chain - Only show if exists */}
      {message.causalChain && message.causalChain.length > 0 && (
        <div className="bg-black/20 rounded-lg p-2 sm:p-3 border border-white/10">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-2">
            <Image src="/favicon.gif" alt="Spino" width={24} height={24} className="rounded" />
            <span className="text-xs text-white/60">Causal Chain</span>
          </div>
          <div className="text-xs text-white/80 space-y-1">
            {message.causalChain.slice(0, 2).map((chain, index) => (
              <div key={index} className="flex items-start">
                <span className="text-cyan-400 mr-1">•</span>
                <span>{chain}</span>
              </div>
            ))}
            {message.causalChain.length > 2 && (
              <div className="text-white/60 text-xs">+{message.causalChain.length - 2} more...</div>
            )}
          </div>
        </div>
      )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function UnifiedChatBox({ messages, setMessages, darkMode, language: externalLanguage, sessionMode = 'therapy' }: UnifiedChatBoxProps) {
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)
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

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: UnifiedMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputMessage('')
    setIsLoading(true)

    // Save user message to localStorage
    saveToLocalStorage(newMessages)

    try {
      const requestBody = {
        message: inputMessage,
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
          realTimeAnalysis: data.realTimeAnalysis
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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
                       src="/favicon.gif" 
                       alt="Spino AI" 
                       width={96} 
                       height={96} 
                       className="rounded-full"
                     />
                   )}
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-medium mb-1" style={{fontFamily: 'Arial Unicode MS, Arial, sans-serif'}}>
                      {message.role === 'user' ? 'You' : 'Spino AI'}
                    </div>
                    <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    
                    {/* Show technical details toggle for assistant messages */}
                    {message.role === 'assistant' && message.adequacyScore && (
                      <div className="mt-4">
                        <button
                          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                          className={`flex items-center space-x-1 sm:space-x-2 text-xs ${
                            darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          <span>Spino Analysis</span>
                        </button>
                        
                        {showTechnicalDetails && (
                          <UnifiedRealTimeDashboard message={message} />
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
                   src="/favicon.gif" 
                   alt="Spino AI" 
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
      <div className={`p-3 sm:p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-2 sm:space-x-4">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={sessionMode === 'therapy' 
                ? "Share your emotions, challenges, or what's on your mind..." 
                : "Share your philosophical thoughts, questions, or reflections..."
              }
              className={`w-full p-3 sm:p-4 rounded-xl resize-none ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-black placeholder-gray-500'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={2}
              maxLength={1000}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !inputMessage.trim()}
            className={`px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-medium transition-all duration-200 ${
              isLoading || !inputMessage.trim()
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105'
            } ${
              darkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 