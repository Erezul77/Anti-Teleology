'use client'

import { useState, useEffect } from 'react'
import { Heart, Zap } from 'lucide-react'
import Image from 'next/image'

interface DeltaATrackerProps {
  sessionId: string
  darkMode?: boolean
}

export default function DeltaATracker({ sessionId, darkMode = true }: DeltaATrackerProps) {
  const [deltaA, setDeltaA] = useState(0.75)
  const [deltaP, setDeltaP] = useState('contemplative')
  const [isTracking, setIsTracking] = useState(true)

  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      // Simulate real-time tracking
      const newDeltaA = Math.max(0.1, Math.min(1, deltaA + (Math.random() - 0.5) * 0.1))
      setDeltaA(newDeltaA)
      
      const states = ['contemplative', 'curious', 'insightful', 'reflective']
      const randomState = states[Math.floor(Math.random() * states.length)]
      setDeltaP(randomState || 'contemplative')
    }, 5000)

    return () => clearInterval(interval)
  }, [isTracking, deltaA])

  const getDeltaAColor = (value: number) => {
    if (value >= 0.8) return 'text-green-400'
    if (value >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getDeltaPColor = (state: string) => {
    const colors: { [key: string]: string } = {
      'contemplative': 'text-blue-400',
      'curious': 'text-purple-400',
      'insightful': 'text-green-400',
      'reflective': 'text-indigo-400'
    }
    return colors[state] || 'text-white'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-light ${darkMode ? 'text-white' : 'text-black'}`}>ΔA Tracker</h3>
        <button
          onClick={() => setIsTracking(!isTracking)}
          className={`text-xs px-2 py-1 rounded ${
            isTracking 
              ? 'bg-green-500/20 text-green-600' 
              : 'bg-red-500/20 text-red-600'
          }`}
        >
          {isTracking ? 'Live' : 'Paused'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Delta A (Adequacy) */}
        <div className={`${darkMode ? 'bg-black border-white/10' : 'bg-black/5 border-black/10'} border rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Image 
                src="/favicon.PNG" 
                alt="Spino" 
                width={32} 
                height={32} 
                className="mr-2"
              />
              <span className={`text-sm ${darkMode ? 'text-white/60' : 'text-black/60'}`}>ΔA (Adequacy)</span>
            </div>
            <span className={`text-lg font-medium ${getDeltaAColor(deltaA)}`}>
              {(deltaA * 100).toFixed(0)}%
            </span>
          </div>
          <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-white/10' : 'bg-black/10'}`}>
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getDeltaAColor(deltaA).replace('text-', 'bg-')}`}
              style={{ width: `${deltaA * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Delta P (Emotional State) */}
        <div className={`${darkMode ? 'bg-black border-white/10' : 'bg-black/5 border-black/10'} border rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Heart className={`w-4 h-4 mr-2 ${darkMode ? 'text-white' : 'text-black'}`} />
              <span className={`text-sm ${darkMode ? 'text-white/60' : 'text-black/60'}`}>ΔP (Emotional)</span>
            </div>
            <span className={`text-sm font-medium ${getDeltaPColor(deltaP)}`}>
              {deltaP}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <div className="h-2 rounded-full bg-white/30" style={{ width: '60%' }}></div>
            </div>
            <Zap className="w-4 h-4 text-white/60" />
          </div>
        </div>

        {/* Insights */}
        <div className={`${darkMode ? 'bg-black border-white/10' : 'bg-black/5 border-black/10'} border rounded-lg p-4`}>
          <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Current Insights</h4>
          <div className={`space-y-2 text-xs ${darkMode ? 'text-white/70' : 'text-black/70'}`}>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Understanding deepening
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Causal clarity increasing
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              Emotional coherence stable
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 