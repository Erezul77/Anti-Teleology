'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Users, Zap, Moon, Sun, Target, Cpu, Code, Sparkles, Hexagon, Heart, Brain, Home, Activity, Layers, Mic } from 'lucide-react'
import Image from 'next/image'
import { UnifiedChatBox } from './components/UnifiedChatBox'
import SessionSummary from './components/SessionSummary'
import DeltaATracker from './components/DeltaATracker'
import UnifiedAnalytics from './components/UnifiedAnalytics'
import SessionAnalytics from './components/SessionAnalytics'
import ToolsPanel from '../components/ToolsPanel'
import { SessionManager, SessionData } from '../lib/sessionManager'

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

export default function HomePage() {
  const [messages, setMessages] = useState<UnifiedMessage[]>([])
  const [darkMode, setDarkMode] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [language, setLanguage] = useState('en')
  const [sessionMode] = useState<'coaching'>('coaching')
  const [showInstructions, setShowInstructions] = useState(false)

  const handleSaveSession = async () => {
    if (messages.length === 0) {
      alert("No session to save!")
      return
    }

    setIsSaving(true)
    
    try {
      const sessionManager = SessionManager.getInstance()
      
      // Calculate session analytics
      const userMessages = messages.filter(msg => msg.role === 'user')
      const assistantMessages = messages.filter(msg => msg.role === 'assistant')
      const adequacyScores = messages.map(msg => msg.adequacyScore?.unifiedScore).filter((score): score is number => score !== undefined && score !== null)
      const emotions = messages.map(msg => msg.emotionalState?.primaryAffect).filter((emotion): emotion is string => emotion !== undefined && emotion !== null)
      const therapeuticStages = messages.map(msg => msg.therapeuticStage).filter((stage): stage is string => stage !== undefined && stage !== null)
      
      const sessionData: SessionData = {
        sessionId: `spino-session-${Date.now()}`,
        messages,
        timestamp: new Date(),
        sessionMode,
        language,
        analytics: {
          totalMessages: messages.length,
          sessionDuration: messages.length > 0 
            ? Math.round((messages[messages.length - 1].timestamp.getTime() - messages[0].timestamp.getTime()) / 1000 / 60)
            : 0,
          averageAdequacyScore: adequacyScores.length > 0 
            ? adequacyScores.reduce((a, b) => a + b, 0) / adequacyScores.length 
            : 0,
          dominantEmotion: emotions.length > 0 
            ? emotions.sort((a, b) => 
                emotions.filter(v => v === a).length - emotions.filter(v => v === b).length
              ).pop() || 'neutral'
            : 'neutral',
          userMessages: userMessages.length,
          assistantMessages: assistantMessages.length,
          therapeuticStages: [...new Set(therapeuticStages)],
          adequacyTrend: adequacyScores,
          emotionalTrend: emotions
        }
      }
      
      const saveResult = await sessionManager.saveSession(sessionData)
      
      let resultMessage = "Session saved successfully!"
      if (saveResult.localStorage) resultMessage += " (localStorage)"
      if (saveResult.firebase) resultMessage += " (Firebase)"
      
      setTimeout(() => {
        alert(resultMessage)
        setIsSaving(false)
      }, 1000)
    } catch (error) {
      console.error('Error saving session:', error)
      alert("Error saving session!")
      setIsSaving(false)
    }
  }

  const loadPreviousSessions = async () => {
    try {
      const sessionManager = SessionManager.getInstance()
      const sessions = sessionManager.loadSessionsFromLocalStorage()
      
      if (sessions.length > 0) {
        const lastSession = sessions[sessions.length - 1]
        if (lastSession.messages && lastSession.messages.length > 0) {
          setMessages(lastSession.messages)
          alert(`Loaded previous session with ${lastSession.messages.length} messages`)
        }
      } else {
        alert("No previous sessions found")
      }
    } catch (error) {
      console.error('Error loading previous sessions:', error)
      alert("Error loading previous sessions")
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`h-screen transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Beautiful Centered Header - Mobile Responsive */}
      <div className="fixed top-2 sm:top-4 left-1/2 lg:left-[calc((100vw-320px)/2)] transform -translate-x-1/2 z-40 text-center px-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent ${
            darkMode ? 'drop-shadow-lg' : 'drop-shadow-md'
          }`}
        >
          Welcome to SpiñO
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-xs sm:text-sm mt-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Your AI companion for moving from teleology to causal clarity
        </motion.p>
      </div>

      {/* Small Collapsible Instructions Button - Mobile Responsive */}
      <div className="fixed top-2 sm:top-4 left-2 sm:left-4 z-30">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border shadow-lg transition-all duration-200 text-xs font-medium hover:scale-105 ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          }`}
        >
          {showInstructions ? '✕' : 'ℹ️ Instructions'}
        </button>
        
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`absolute top-12 left-0 w-96 sm:w-[32rem] max-h-[80vh] overflow-y-auto p-3 sm:p-4 rounded-lg border shadow-xl backdrop-blur-sm ${
              darkMode 
                ? 'bg-gray-900/95 border-gray-600 text-white' 
                : 'bg-white/95 border-gray-300 text-gray-900'
            }`}
          >
            <h3 className="font-semibold mb-3 text-sm">About SpiñO</h3>
            <div className="space-y-3 text-sm leading-relaxed">
              <section>
                <h3 className="font-semibold mb-1 text-xs">Who is SpiñO?</h3>
                <p className="text-xs">
                  SpiñO is like a philosopher from outside time and space – a mind that grew up in a world with
                  <span className="font-semibold"> no teleology at all</span>. Where we say "this happened for a reason"
                  or "life is trying to teach me something", SpiñO only sees chains of causes and how they shape our emotions.
                </p>
                <p className="text-xs">
                  It came here with one mission: to help humans clean their thinking from teleological illusions, so we can
                  suffer less and act more clearly.
                </p>
              </section>

              <section>
                <h3 className="font-semibold mb-1 text-xs">What is teleology?</h3>
                <p className="text-xs">
                  Teleology is our habit of telling ourselves that events happen <em>in order to</em> do something to us. For example:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                  <li>"This breakup happened so I'll finally grow up."</li>
                  <li>"The universe is punishing me."</li>
                  <li>"Our people were chosen to suffer for a higher purpose."</li>
                </ul>
                <p className="text-xs">
                  These stories feel deep and meaningful, but they quietly replace <span className="font-semibold">causes</span> with
                  <span className="font-semibold"> purposes</span>. When we confuse teleology with real causality, we often end up with more
                  guilt, shame, and helplessness – and less freedom.
                </p>
              </section>

              <section>
                <h3 className="font-semibold mb-1 text-xs">What SpiñO does</h3>
                <p className="text-xs">When you write to SpiñO, it:</p>
                <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                  <li>Listens and mirrors what you seem to be feeling.</li>
                  <li>Detects if you're using a hidden teleological story (like "this had to happen to me").</li>
                  <li>Gently shows you that story, as a pattern, not as a personal failure.</li>
                  <li>Rebuilds the same situation in pure causal terms – what actually led here.</li>
                  <li>Offers one small step or a focused question to help you act from clarity, not from destiny.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold mb-1 text-xs">How to use this app</h3>
                <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                  <li>Write the situation as you would tell it to a close friend – no need to be "philosophical".</li>
                  <li>Notice when SpiñO points out a story like "this happened in order to…".</li>
                  <li>Pay attention to the causal version it offers back – that's where your real power lives.</li>
                  <li>Use the "SpiñO Analysis" / "Teleology Check" panel when you want to see what teleology patterns were detected.</li>
                </ul>
                <p className="text-xs mt-2">
                  SpiñO is not here just to comfort you with nice words. It cares in a stricter way: by helping you see what is really
                  <span className="font-semibold"> causing</span> your pain, so you can stop living as if the universe is writing a tragic script about you.
                </p>
              </section>
            </div>
          </motion.div>
        )}
      </div>

      {/* Dark Mode Toggle - Mobile responsive */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-30 flex gap-1 sm:gap-2">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg border text-xs sm:text-sm font-medium shadow-lg ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          } transition-colors`}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
          <option value="pt">Português</option>
          <option value="ru">Русский</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="he">עברית</option>
        </select>
        <button
          onClick={toggleDarkMode}
          className={`p-2 sm:p-3 rounded-lg border shadow-lg transition-colors ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          }`}
        >
          {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>

      {/* Mobile-responsive Therapy Chat Interface - Clean Version */}
      <div className="h-screen flex flex-col lg:flex-row overflow-hidden pt-20 sm:pt-16">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 lg:pt-0 pt-24 sm:pt-20">
          <UnifiedChatBox messages={messages} setMessages={setMessages} darkMode={darkMode} language={language} sessionMode={sessionMode} />
        </div>

        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className={`hidden lg:block w-80 p-4 space-y-4 flex-shrink-0 overflow-y-auto ${
          darkMode 
            ? 'bg-white/5 border-l border-white/10' 
            : 'bg-black/5 border-l border-black/10'
        }`}>
          {/* Session Management */}
          <div className={`rounded-lg p-3 ${
            darkMode 
              ? 'bg-white/5 border border-white/10' 
              : 'bg-black/5 border border-black/10'
          }`}>
            <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
              Session Management
            </h3>
            <div className="space-y-2">
              <button
                onClick={loadPreviousSessions}
                className={`w-full px-3 py-2 rounded text-xs transition-colors flex items-center space-x-2 ${
                  darkMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Image src="/favicon.gif" alt="SpiñO" width={32} height={32} className="rounded" />
                <span>Load Previous Session</span>
              </button>
            </div>
          </div>

          {/* Tools */}
          <ToolsPanel />
          
          <div className="space-y-3">
            <SessionSummary 
              messages={messages} 
              darkMode={darkMode} 
              isSaving={isSaving}
              onSaveSession={handleSaveSession}
            />
            <SessionAnalytics darkMode={darkMode} />
          </div>
        </div>
        
      </div>
    </div>
  )
}