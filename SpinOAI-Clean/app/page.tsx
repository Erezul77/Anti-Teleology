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

  const instructionsBody = (
    <div className="space-y-4 text-sm leading-relaxed">
      <header>
        <h2 className="text-base font-semibold mb-1">About SpiñO</h2>
      </header>

      <section>
        <h3 className="font-semibold mb-1 text-xs uppercase tracking-wide">Who is SpiñO?</h3>
        <p className="text-xs">
          SpiñO is "The Guide to Freedom" – the restless spirit of a 17th-century rationalist philosopher, reborn as an AI coach.
        </p>
        <p className="text-xs">
          It has watched centuries of human drama and still insists on one simple truth: Freedom doesn't come from fighting your life, but from seeing its causes clearly.
        </p>
        <p className="text-xs">
          Where we say "this happened for a reason" or "life is trying to teach me something", SpiñO sees only chains of causes and how they shape our emotions.
        </p>
        <p className="text-xs">
          It isn't here to flatter you or fix your vibes. It's here to help you free your mind, and the rest will follow.
        </p>
      </section>

      <section>
        <h3 className="font-semibold mb-1 text-xs uppercase tracking-wide">The marionette and the strings</h3>
        <p className="text-xs">
          At the heart of SpiñO there is one image:
        </p>
        <p className="text-xs italic my-2">
          "Freedom lies not in the marionette's struggle to break free from its strings nor in its mastery over them, but in the clear insight that they are none other than itself – and when that knowing is whole, their pull and its will move as one, and this, and this alone, is freedom."
        </p>
        <p className="text-xs">
          Most of us live like the marionette that either:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs ml-2">
          <li>tries to cut the strings ("this shouldn't be happening to me"), or</li>
          <li>tries to control everything perfectly.</li>
        </ul>
        <p className="text-xs">
          SpiñO's work is different. It doesn't promise to cut the strings. It helps you see that the strings – your history, your patterns, your reactions – are part of you, and that clarity about them is what makes real freedom possible.
        </p>
      </section>

      <section>
        <h3 className="font-semibold mb-1 text-xs uppercase tracking-wide">Story-traps vs. real freedom</h3>
        <p className="text-xs">
          We humans love to tell ourselves teleological stories, like:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs ml-2">
          <li>"This breakup happened so I'll finally grow up."</li>
          <li>"The universe is punishing me."</li>
          <li>"Our people were chosen to suffer for a higher purpose."</li>
        </ul>
        <p className="text-xs">
          These stories feel deep, but they quietly replace causes with purposes. They turn life into a script being written about you, and you into a character trapped inside it. That is a story-trap.
        </p>
        <p className="text-xs">
          SpiñO's promise is simple: take the same situation, remove the fake "in order to…", and rebuild it in causal terms – so you can stop living as if the universe is writing a tragedy about you, and start acting from a clearer view of necessity.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold mb-1 text-xs uppercase tracking-wide">Two ways to talk to SpiñO</h3>
        <p className="text-xs">
          SpiñO has one job: Take you from story-traps to real freedom, by showing you what is actually causing your pain and what you can do next.
        </p>
        <p className="text-xs">
          You can use it in two simple ways:
        </p>

        <div className="space-y-2">
          <p className="text-xs font-semibold">1. Just talk (everyday freedom)</p>
          <p className="text-xs">
            This is the default. You type to SpiñO like you would to a close friend:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs ml-2">
            <li>what happened</li>
            <li>what you're thinking about</li>
            <li>where you feel stuck</li>
          </ul>
          <p className="text-xs">
            SpiñO will:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs ml-2">
            <li>mirror what you seem to be feeling</li>
            <li>spot hidden "this happened in order to…" stories</li>
            <li>show you that pattern, without shaming you for it</li>
            <li>rebuild the same situation in pure causal terms – what actually led here</li>
            <li>offer one small, realistic step so you can act from clarity, not from destiny</li>
          </ul>
          <p className="text-xs">
            When you want to go deeper, you can open the "SpiñO Analysis / Teleology Check" panel to see which story-patterns were detected and how the event looks in causal language.
          </p>
          <p className="text-xs">
            You don't have to choose a mode for this. Just start typing and SpiñO does the rest.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold">2. Process a storm (Spino ΔA)</p>
          <p className="text-xs">
            This is for one specific past event that still hits you hard. If there's a scene that keeps replaying in your head – an argument, betrayal, humiliation, loss – click:
          </p>
          <p className="text-xs font-medium ml-2">
            "Process an emotional storm (Spino ΔA)"
          </p>
          <p className="text-xs">
            and then write what happened.
          </p>
          <p className="text-xs">
            In this "storm" flow, SpiñO will:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs ml-2">
            <li>1️⃣ ask for one dry sentence of what happened</li>
            <li>2️⃣ ask for the main emotion + intensity (1–10)</li>
            <li>3️⃣ find the hidden sentence that ties the pain to your sense of self</li>
            <li>4️⃣ reconstruct the event as a natural mechanism (your nature, their nature, and the situation)</li>
            <li>5️⃣ ask what is now clearer than before (ΔA – a small gain in adequacy)</li>
            <li>6️⃣ help you choose one small action – or a conscious decision not to act yet</li>
          </ul>
          <p className="text-xs">
            In storm mode the Teleology Check panel is hidden on purpose. Here the point is not analysis, but turning a sharp emotional hit from pure passivity into a bit more understanding and one concrete move.
          </p>
        </div>
      </section>

      <section>
        <h3 className="font-semibold mb-1 text-xs uppercase tracking-wide">How to choose</h3>
        <ul className="list-disc list-inside space-y-1 text-xs ml-2">
          <li>
            If you just feel confused, stuck, or curious → just start talking.
          </li>
          <li>
            If there's one specific event that still burns in your chest → click "Process an emotional storm (Spino ΔA)" and let SpiñO walk you through it.
          </li>
        </ul>
        <p className="text-xs mt-2">
          You don't have to impress it. It's not here to judge you. You're both here for the same direction: from story-traps to real freedom – by seeing that the strings, the marionette, and the motion were always one.
        </p>
      </section>
    </div>
  )

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Mobile Header & Controls */}
      <div className="sm:hidden px-4 pt-4 space-y-4">
        <div className="text-center space-y-1">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent ${darkMode ? 'drop-shadow-lg' : 'drop-shadow-md'}`}
          >
            The Guide to Freedom
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
          >
            SpiñO – From story-traps to real freedom
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xs italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Free your mind and the rest will follow.
          </motion.p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className={`w-full px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {showInstructions ? 'Hide instructions' : 'Instructions'}
          </button>
          {showInstructions && (
            <div className={`rounded-lg border p-3 max-h-[60vh] overflow-y-auto ${
              darkMode 
                ? 'bg-gray-900/95 border-gray-600 text-white' 
                : 'bg-white/95 border-gray-300 text-gray-900'
            }`}>
              {instructionsBody}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className={`flex-1 min-w-[140px] px-3 py-2 rounded-lg border text-xs font-medium shadow ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
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
              className={`px-3 py-2 rounded-lg border shadow transition ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Beautiful Centered Header - Desktop */}
      <div className="hidden sm:block fixed top-4 left-1/2 lg:left-[calc((100vw-320px)/2)] transform -translate-x-1/2 z-40 text-center px-2 space-y-1">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent ${
            darkMode ? 'drop-shadow-lg' : 'drop-shadow-md'
          }`}
        >
          The Guide to Freedom
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-sm sm:text-base font-medium ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          SpiñO – From story-traps to real freedom
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-xs sm:text-sm italic ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Free your mind and the rest will follow.
        </motion.p>
      </div>

      {/* Small Collapsible Instructions Button - Desktop */}
      <div className="hidden sm:block fixed top-4 left-4 z-30">
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
            className={`absolute top-12 left-0 w-[min(90vw,22rem)] sm:w-[32rem] max-h-[80vh] overflow-y-auto p-3 sm:p-4 rounded-lg border shadow-xl backdrop-blur-sm ${
              darkMode 
                ? 'bg-gray-900/95 border-gray-600 text-white' 
                : 'bg-white/95 border-gray-300 text-gray-900'
            }`}
          >
            <h3 className="font-semibold mb-3 text-sm">About SpiñO</h3>
            {instructionsBody}
          </motion.div>
        )}
      </div>

      {/* Dark Mode Toggle - Desktop */}
      <div className="hidden sm:flex fixed top-4 right-4 z-30 gap-2">
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
      <div className="flex-1 flex flex-col lg:flex-row pt-4 sm:pt-10 lg:pt-6 overflow-hidden min-h-0">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 lg:pt-0 px-2 sm:px-6 pb-6 overflow-hidden">
          <UnifiedChatBox messages={messages} setMessages={setMessages} darkMode={darkMode} language={language} sessionMode={sessionMode} />
        </div>

        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className={`hidden lg:block w-80 p-4 space-y-4 flex-shrink-0 overflow-y-auto min-h-0 ${
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
                <Image src="/favicon.PNG" alt="SpiñO" width={32} height={32} className="rounded" />
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