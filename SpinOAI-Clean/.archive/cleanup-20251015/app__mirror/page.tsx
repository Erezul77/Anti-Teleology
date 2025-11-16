// Reflective Mirror - Non-linguistic mandala shaping interface
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Vector, SeedData } from '../../lib/marker/types'
import MirrorCanvas from '../../lib/mirror/MirrorCanvas'
import HUD from '../../lib/mirror/HUD'
import SessionBar from '../../lib/mirror/SessionBar'
import { MirrorParams, MirrorState } from '../../lib/mirror/state'
import { computeAScore, updateSignals, shouldSaveRidge, ridgeSuggest } from '../../lib/mirror/adequacy'
import { applyGesture, applyScroll, setSliderII, setSliderHD, resetParams, randomizeParams } from '../../lib/mirror/controls'

export default function MirrorPage() {
  const router = useRouter()
  const [seed, setSeed] = useState<Vector | null>(null)
  const [params, setParams] = useState<MirrorParams>({
    dOC: 0, dII: 0, dEC: 0, dHD: 0, dSM: 0,
    symmetry: 6, turbulence: 0.5, radiusScale: 0.28, hueSpread: 20, tempoSec: 6
  })
  const [aScore, setAScore] = useState(0)
  const [ridge, setRidge] = useState<Array<{dOC: number, dII: number, dEC: number, dHD: number, dSM: number, A: number, ts: string, tag?: string}>>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [isLoading, setIsLoading] = useState(true)
  const [signals, setSignals] = useState({
    dwellTime: 0,
    pointerEntropy: 0,
    paramStd: 0,
    breathLock: 0
  })

  // Load seed vector on mount
  useEffect(() => {
    const loadSeed = () => {
      try {
        const stored = localStorage.getItem('spino_seed_vector')
        if (!stored) {
          router.push('/marker')
          return
        }
        
        const seedData: SeedData = JSON.parse(stored)
        setSeed(seedData.v)
        setIsLoading(false)
        setStartTime(Date.now())
      } catch (error) {
        console.error('Error loading seed vector:', error)
        router.push('/marker')
      }
    }

    loadSeed()
  }, [router])

  // Update derived rendering params when deltas change
  useEffect(() => {
    if (!seed) return

    const newParams: MirrorParams = {
      ...params,
      symmetry: Math.round(8 - (seed.IntegrationIsolation + params.dII) * 5), // 3..8
      turbulence: Math.max(0, Math.min(1, seed.OrderChaos + params.dOC)),
      radiusScale: 0.22 + (1 - (seed.ExpansionContraction + params.dEC)) * 0.12, // 0.22..0.34
      hueSpread: 6 + (seed.HarmonyDissonance + params.dHD) * 34, // 6..40
      tempoSec: 10 - (seed.StillnessMovement + params.dSM) * 7.5 // 2.5..10
    }
    
    setParams(newParams)
  }, [seed, params.dOC, params.dII, params.dEC, params.dHD, params.dSM])

  // A-score computation loop
  useEffect(() => {
    if (!seed) return

    const interval = setInterval(() => {
      const newAScore = computeAScore(signals)
      setAScore(newAScore)

      // Check if we should save a ridge point
      if (shouldSaveRidge(newAScore, signals.dwellTime)) {
        const ridgePoint = {
          dOC: params.dOC,
          dII: params.dII,
          dEC: params.dEC,
          dHD: params.dHD,
          dSM: params.dSM,
          A: newAScore,
          ts: new Date().toISOString(),
          tag: 'auto'
        }
        setRidge(prev => [...prev.slice(-63), ridgePoint]) // Keep last 64
      }
    }, 200)

    return () => clearInterval(interval)
  }, [signals, params])

  // Gesture handlers
  const handleDrag = useCallback((deltaX: number, deltaY: number, speed: number) => {
    const newParams = applyGesture(params, deltaX, deltaY, speed)
    setParams(newParams)
    setSignals(prev => updateSignals(prev, 'gesture'))
  }, [params])

  const handleScroll = useCallback((delta: number) => {
    const newParams = applyScroll(params, delta)
    setParams(newParams)
    setSignals(prev => updateSignals(prev, 'scroll'))
  }, [params])

  const handleSliderII = useCallback((value: number) => {
    const newParams = setSliderII(params, value)
    setParams(newParams)
    setSignals(prev => updateSignals(prev, 'slider'))
  }, [params])

  const handleSliderHD = useCallback((value: number) => {
    const newParams = setSliderHD(params, value)
    setParams(newParams)
    setSignals(prev => updateSignals(prev, 'slider'))
  }, [params])

  const handleReset = useCallback(() => {
    const newParams = resetParams()
    setParams(newParams)
    setSignals(prev => updateSignals(prev, 'reset'))
  }, [])

  const handleRandomize = useCallback(() => {
    const newParams = randomizeParams(params)
    setParams(newParams)
    setSignals(prev => updateSignals(prev, 'random'))
  }, [params])

  const handleGlideToSweet = useCallback(() => {
    if (ridge.length === 0) return
    
    const suggestedDeltas = ridgeSuggest(ridge)
    if (suggestedDeltas) {
      // Animate to suggested deltas over 3 seconds
      const startParams = { ...params }
      const targetParams = {
        ...params,
        dOC: suggestedDeltas.dOC,
        dII: suggestedDeltas.dII,
        dEC: suggestedDeltas.dEC,
        dHD: suggestedDeltas.dHD,
        dSM: suggestedDeltas.dSM
      }
      
      // Simple animation (in production, use a proper animation library)
      const duration = 3000
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2 // ease in/out
        
        const currentParams = {
          ...params,
          dOC: startParams.dOC + (targetParams.dOC - startParams.dOC) * easeProgress,
          dII: startParams.dII + (targetParams.dII - startParams.dII) * easeProgress,
          dEC: startParams.dEC + (targetParams.dEC - startParams.dEC) * easeProgress,
          dHD: startParams.dHD + (targetParams.dHD - startParams.dHD) * easeProgress,
          dSM: startParams.dSM + (targetParams.dSM - startParams.dSM) * easeProgress
        }
        
        setParams(currentParams)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      animate()
    }
  }, [ridge, params])

  const handleSave = useCallback(async () => {
    const sessionData = {
      participant_id: 'user_' + Date.now(),
      seed_vector: seed,
      session: {
        duration_s: (Date.now() - startTime) / 1000,
        samples: ridge.length,
        ridge: ridge,
        a_mean: ridge.reduce((sum, r) => sum + r.A, 0) / Math.max(1, ridge.length),
        a_peak: Math.max(...ridge.map(r => r.A), 0)
      }
    }

    try {
      await fetch('/api/mirror', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      })
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }, [seed, startTime, ridge])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Reflective Mirror...</p>
        </div>
      </div>
    )
  }

  if (!seed) {
    return null // Will redirect to /marker
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Onboarding text */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <p className="text-sm text-gray-300 text-center">
          Shape the form until it feels right.
        </p>
      </div>

      {/* Status dots */}
      <div className="absolute top-8 right-8 z-10 flex gap-2">
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          aScore >= 70 ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
        }`} title="Calm" />
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          aScore >= 55 ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'
        }`} title="Flow" />
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          aScore >= 40 ? 'bg-purple-400 animate-pulse' : 'bg-gray-600'
        }`} title="Focus" />
      </div>

      {/* Main mandala canvas */}
      <div className="flex items-center justify-center min-h-screen">
        <MirrorCanvas
          seed={seed}
          params={params}
          aScore={aScore}
          onDrag={handleDrag}
          onScroll={handleScroll}
        />
      </div>

      {/* HUD controls */}
      <HUD
        params={params}
        onSliderII={handleSliderII}
        onSliderHD={handleSliderHD}
        onReset={handleReset}
        onRandomize={handleRandomize}
        onGlideToSweet={handleGlideToSweet}
        onSave={handleSave}
        hasRidge={ridge.length > 0}
      />

      {/* Session bar */}
      <SessionBar
        startTime={startTime}
        onSave={handleSave}
        onReset={handleReset}
        onRandomize={handleRandomize}
      />
    </div>
  )
}
