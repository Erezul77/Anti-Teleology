'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Brain, Heart, Target, Layers, Sparkles, Activity, BarChart3, PieChart, LineChart } from 'lucide-react'

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

interface UnifiedAnalyticsProps {
  messages: UnifiedMessage[]
  darkMode: boolean
}

export default function UnifiedAnalytics({ messages, darkMode }: UnifiedAnalyticsProps) {
  const [analytics, setAnalytics] = useState({
    totalMessages: 0,
    averageUnifiedScore: 0,
    averageSpinoAlpha: 0,
    averageNoesisTotal: 0,
    stageProgression: [] as string[],
    layerDepth: [] as string[],
    emotionalTrends: [] as any[],
    adequacyHistory: [] as number[],
    topEmotions: [] as string[],
    causalChains: [] as string[]
  })

  useEffect(() => {
    if (messages.length === 0) return

    const messagesWithAnalysis = messages.filter(msg => msg.adequacyScore && msg.role === 'assistant')
    
    console.log('Analytics Debug:', {
      totalMessages: messages.length,
      messagesWithAnalysis: messagesWithAnalysis.length,
      messagesWithAnalysisData: messagesWithAnalysis.map(msg => ({
        role: msg.role,
        hasAdequacyScore: !!msg.adequacyScore,
        unifiedScore: msg.adequacyScore?.unifiedScore,
        spinoAlpha: msg.adequacyScore?.spinoAdequacy?.alpha,
        noesisTotal: msg.adequacyScore?.noesisAdequacy?.total
      }))
    })
    
    if (messagesWithAnalysis.length === 0) return

    // Calculate averages
    const unifiedScores = messagesWithAnalysis.map(msg => msg.adequacyScore!.unifiedScore)
    const spinoAlphas = messagesWithAnalysis.map(msg => msg.adequacyScore!.spinoAdequacy.alpha)
    const noesisTotals = messagesWithAnalysis.map(msg => msg.adequacyScore!.noesisAdequacy.total)

    const averageUnifiedScore = unifiedScores.reduce((a, b) => a + b, 0) / unifiedScores.length
    const averageSpinoAlpha = spinoAlphas.reduce((a, b) => a + b, 0) / spinoAlphas.length
    const averageNoesisTotal = noesisTotals.reduce((a, b) => a + b, 0) / noesisTotals.length

    // Stage progression
    const stageProgression = messagesWithAnalysis
      .map(msg => msg.therapeuticStage)
      .filter(Boolean) as string[]

    // Layer depth
    const layerDepth = messagesWithAnalysis
      .map(msg => msg.onionLayer)
      .filter(Boolean) as string[]

    // Emotional trends
    const emotionalTrends = messagesWithAnalysis
      .map(msg => msg.emotionalState)
      .filter(Boolean)

    // Top emotions
    const emotionCounts: { [key: string]: number } = {}
    emotionalTrends.forEach(emotional => {
      if (emotional && emotional.primaryAffect) {
        const affect = emotional.primaryAffect
        emotionCounts[affect] = (emotionCounts[affect] || 0) + 1
      }
    })
    const topEmotions = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([emotion]) => emotion)

    // Causal chains
    const causalChains = messagesWithAnalysis
      .flatMap(msg => msg.causalChain || [])
      .filter(Boolean)

    setAnalytics({
      totalMessages: messages.length,
      averageUnifiedScore,
      averageSpinoAlpha,
      averageNoesisTotal,
      stageProgression,
      layerDepth,
      emotionalTrends,
      adequacyHistory: unifiedScores,
      topEmotions,
      causalChains
    })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className={`p-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No session data to analyze yet.</p>
        <p className="text-sm">Start a conversation to see analytics.</p>
      </div>
    )
  }

  // Check if we have any analyzed messages
  const messagesWithAnalysis = messages.filter(msg => msg.adequacyScore && msg.role === 'assistant')
  
  if (messagesWithAnalysis.length === 0) {
    return (
      <div className={`p-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Waiting for AI responses...</p>
        <p className="text-sm">Send a message to see analytics.</p>
      </div>
    )
  }

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 ${darkMode ? 'text-white' : 'text-black'}`}>
      {/* Header */}
      <div className="flex items-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
        <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7" />
        <h2 className="text-xl sm:text-2xl font-semibold">Philosophical Analytics</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 sm:p-6 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <span className="text-xs sm:text-sm font-medium">Unified Score</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-1">{analytics.averageUnifiedScore.toFixed(1)}/100</div>
          <div className="text-xs opacity-60">Average across session</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 sm:p-6 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <span className="text-xs sm:text-sm font-medium">Spino α</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-1">{(analytics.averageSpinoAlpha * 100).toFixed(1)}%</div>
          <div className="text-xs opacity-60">Average adequacy</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 sm:p-6 rounded-xl border ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <span className="text-xs sm:text-sm font-medium">Noesis Total</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-1">{analytics.averageNoesisTotal.toFixed(1)}/19</div>
          <div className="text-xs opacity-60">6D average</div>
        </motion.div>
      </div>

      {/* Session Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`p-3 sm:p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Session Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <div className="text-sm opacity-60">Total Messages</div>
            <div className="text-xl font-bold">{analytics.totalMessages}</div>
          </div>
          <div>
            <div className="text-sm opacity-60">Stages Progressed</div>
            <div className="text-xl font-bold">{new Set(analytics.stageProgression).size}</div>
          </div>
          <div>
            <div className="text-sm opacity-60">Layers Reached</div>
            <div className="text-xl font-bold">{new Set(analytics.layerDepth).size}</div>
          </div>
          <div>
            <div className="text-sm opacity-60">Causal Chains</div>
            <div className="text-xl font-bold">{analytics.causalChains.length}</div>
          </div>
        </div>
      </motion.div>

             {/* Emotional Analysis */}
       {analytics.topEmotions.length > 0 && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className={`p-3 sm:p-4 rounded-lg border ${
             darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
           }`}
         >
           <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center space-x-2">
             <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
             <span>Emotional Analysis</span>
           </h3>
          <div className="space-y-2">
            {analytics.topEmotions.map((emotion, index) => (
              <div key={emotion} className="flex items-center justify-between">
                <span className="capitalize">{emotion}</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-20 h-2 rounded-full ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full bg-red-400 rounded-full"
                      style={{ width: `${(index + 1) * 20}%` }}
                    ></div>
                  </div>
                  <span className="text-sm opacity-60">{(index + 1) * 20}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

             {/* Adequacy Progression */}
       {analytics.adequacyHistory.length > 1 && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className={`p-3 sm:p-4 rounded-lg border ${
             darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
           }`}
         >
           <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center space-x-2">
             <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
             <span>Adequacy Progression</span>
           </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm opacity-60">
              <span>Start: {analytics.adequacyHistory[0].toFixed(1)}</span>
              <span>Current: {analytics.adequacyHistory[analytics.adequacyHistory.length - 1].toFixed(1)}</span>
            </div>
            <div className={`w-full h-4 rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(100, Math.max(0, 
                    ((analytics.adequacyHistory[analytics.adequacyHistory.length - 1] - analytics.adequacyHistory[0]) / 100) * 100
                  ))}%` 
                }}
              ></div>
            </div>
            <div className="text-sm opacity-60">
              {analytics.adequacyHistory[analytics.adequacyHistory.length - 1] > analytics.adequacyHistory[0] 
                ? '📈 Progressing well' 
                : analytics.adequacyHistory[analytics.adequacyHistory.length - 1] < analytics.adequacyHistory[0]
                ? '📉 Needs attention'
                : '➡️ Stable'
              }
            </div>
          </div>
        </motion.div>
      )}

             {/* Stage & Layer Analysis */}
       {(analytics.stageProgression.length > 0 || analytics.layerDepth.length > 0) && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
           className={`p-3 sm:p-4 rounded-lg border ${
             darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
           }`}
         >
           <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center space-x-2">
             <Target className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
             <span>Depth Analysis</span>
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {analytics.stageProgression.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Therapeutic Stages</h4>
                <div className="space-y-1">
                  {Array.from(new Set(analytics.stageProgression)).map((stage, index) => (
                    <div key={stage} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-blue-400' : 
                        index === 1 ? 'bg-green-400' : 
                        index === 2 ? 'bg-yellow-400' : 
                        index === 3 ? 'bg-orange-400' : 'bg-purple-400'
                      }`}></div>
                      <span className="text-sm capitalize">{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {analytics.layerDepth.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Onion Layers</h4>
                <div className="space-y-1">
                  {Array.from(new Set(analytics.layerDepth)).map((layer, index) => (
                    <div key={layer} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-gray-400' : 
                        index === 1 ? 'bg-blue-400' : 
                        index === 2 ? 'bg-green-400' : 
                        index === 3 ? 'bg-yellow-400' : 'bg-purple-400'
                      }`}></div>
                      <span className="text-sm capitalize">{layer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

             {/* Causal Chain Summary */}
       {analytics.causalChains.length > 0 && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7 }}
           className={`p-3 sm:p-4 rounded-lg border ${
             darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
           }`}
         >
           <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center space-x-2">
             <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
             <span>Causal Chain Insights</span>
           </h3>
          <div className="space-y-2">
            <div className="text-sm opacity-60">
              {analytics.causalChains.length} causal relationships identified
            </div>
            <div className="text-sm">
              Average chain length: {(analytics.causalChains.reduce((acc, chain) => acc + chain.split(' ').length, 0) / analytics.causalChains.length).toFixed(1)} words
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 