import { NextRequest, NextResponse } from 'next/server'
import { EmotionalWizardSystem } from '../../../lib/emotionalWizardSystem'
import { analyzeTeleology } from '@/lib/teleologyEngine'

// Initialize the Emotional Wizard System
const emotionalWizard = new EmotionalWizardSystem({
  enableMemory: true,
  enableEmotionalAnalysis: true,
  enableAdequacyEngine: true,
  enableContextBuilding: true,
  enableAdvancedGeneration: true,
  enableQualityControl: true,
  openaiApiKey: process.env.OPENAI_API_KEY,
  claudeApiKey: process.env.CLAUDE_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId, userId, isEmotionalStorm: clientStormFlag } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    console.log('🚀 Processing request with Emotional Wizard System...')
    console.log('📊 Request Debug:', { message, sessionId, userId })

    const stormTag = '[[EMOTIONAL_STORM_MODE]]'
    const stormTagDetected = typeof message === 'string' && message.includes(stormTag)
    const isEmotionalStorm = Boolean(clientStormFlag) || stormTagDetected

    // Analyze teleology in user message
    let teleologyAnalysis;
    if (isEmotionalStorm) {
      console.log('⚡ Emotional Storm detected – skipping teleology analysis for this turn.')
      teleologyAnalysis = undefined
    } else {
      console.log('🔍 Analyzing teleology in user message...')
      try {
        teleologyAnalysis = await analyzeTeleology(message)
        console.log('📊 Teleology Analysis:', {
          teleologyScore: teleologyAnalysis.teleologyScore,
          teleologyType: teleologyAnalysis.teleologyType,
          manipulationRisk: teleologyAnalysis.manipulationRisk,
          detectedPhrases: teleologyAnalysis.detectedPhrases.length
        })
      } catch (teleologyError) {
        console.error('❌ Teleology analysis failed:', teleologyError)
        // Fallback to empty teleology analysis
        teleologyAnalysis = {
          teleologyScore: 0,
          teleologyType: null,
          manipulationRisk: 'low' as const,
          detectedPhrases: [],
          purposeClaim: null,
          neutralCausalParaphrase: null
        }
      }
    }

    // Process through the Emotional Wizard System
    const wizardResponse = await emotionalWizard.processRequest({
      userMessage: message,
      sessionId: sessionId || 'default-session',
      userId: userId || 'default-user',
      teleologyAnalysis,
      skipTeleology: isEmotionalStorm
    })
    
    console.log('📊 Wizard Response Debug:', {
      responseLength: wizardResponse.response?.length,
      responsePreview: wizardResponse.response?.substring(0, 100),
      confidence: wizardResponse.confidence,
      hasEmotionalAnalysis: !!wizardResponse.emotionalAnalysis,
      hasAdequacyAnalysis: !!wizardResponse.adequacyAnalysis,
      systemSummary: wizardResponse.systemSummary
    })

    // Transform AdequacyAnalysis to expected format for client
    const transformAdequacyScore = (adequacyAnalysis: any) => {
      if (!adequacyAnalysis) return null
      
      return {
        spinoAdequacy: {
          alpha: Math.round((adequacyAnalysis.adequacyScore || 0) * 100) / 100,
          deltaAlpha: Math.round((adequacyAnalysis.powerChange || 0) * 100) / 100,
          chi: Math.round((adequacyAnalysis.freedomRatio || 0) * 100) / 100
        },
        noesisAdequacy: {
          substance: Math.round((adequacyAnalysis.adequacyScore || 0) * 100) / 100,
          imagination: Math.round((adequacyAnalysis.powerChange || 0) * 100) / 100,
          reason: Math.round((adequacyAnalysis.freedomRatio || 0) * 100) / 100,
          intuition: Math.round((adequacyAnalysis.blessednessLevel || 0) * 100) / 100,
          freedom: Math.round((adequacyAnalysis.freedomRatio || 0) * 100) / 100,
          blessedness: Math.round((adequacyAnalysis.blessednessLevel || 0) * 100) / 100,
          total: Math.round(((adequacyAnalysis.adequacyScore || 0) + (adequacyAnalysis.freedomRatio || 0) + (adequacyAnalysis.blessednessLevel || 0)) * 100) / 100
        },
        unifiedScore: Math.round((adequacyAnalysis.adequacyScore || 0) * 100) / 100,
        confidence: Math.round((wizardResponse.confidence || 0) * 100) / 100
      }
    }

    // Transform EmotionalAnalysis to expected format for client
    const transformEmotionalState = (emotionalAnalysis: any, adequacyAnalysis: any) => {
      if (!emotionalAnalysis) return null
      
      return {
        primaryAffect: emotionalAnalysis.primaryEmotion || 'neutral',
        intensity: Math.round((emotionalAnalysis.intensity || 0) * 100) / 100,
        powerChange: Math.round((adequacyAnalysis?.powerChange || 0) * 100) / 100,
        adequacyScore: Math.round((adequacyAnalysis?.adequacyScore || 0) * 100) / 100,
        bondageLevel: adequacyAnalysis?.bondageLevel || 'medium',
        freedomRatio: Math.round((adequacyAnalysis?.freedomRatio || 0) * 100) / 100,
        transformationPotential: Math.round((adequacyAnalysis?.blessednessLevel || 0) * 100) / 100,
        blessednessLevel: Math.round((adequacyAnalysis?.blessednessLevel || 0) * 100) / 100
      }
    }

    // Build response with all the rich data
    const response = {
      response: wizardResponse.response,
      confidence: wizardResponse.confidence,
      sources: wizardResponse.sources,
      emotionalState: transformEmotionalState(wizardResponse.emotionalAnalysis, wizardResponse.adequacyAnalysis), // Transform to expected format
      adequacyScore: transformAdequacyScore(wizardResponse.adequacyAnalysis), // Transform to expected format
      therapeuticStage: 'identification', // Default stage
      onionLayer: 'surface', // Default layer
      causalChain: wizardResponse.adequacyAnalysis?.causalChain || [],
      detailedAnalysis: wizardResponse.systemSummary,
      realTimeAnalysis: {
        timestamp: new Date(),
        adequacyScore: wizardResponse.adequacyAnalysis?.adequacyScore || 0,
        emotionalState: wizardResponse.emotionalAnalysis?.primaryEmotion || 'neutral',
        therapeuticStage: 'identification',
        onionLayer: 'surface',
        processingTime: Date.now(),
        confidence: wizardResponse.confidence
      },
      manipulationEffect: wizardResponse.manipulationEffect,
      memoryUpdate: wizardResponse.memoryUpdate,
      systemSummary: wizardResponse.systemSummary,
      teleology: isEmotionalStorm ? null : wizardResponse.teleology ?? null // Include teleology analysis when available
    }

    console.log('✅ Emotional Wizard System response generated successfully')
    console.log('📊 System Summary:', wizardResponse.systemSummary)

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ API Error:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('❌ Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    return NextResponse.json(
      { 
        error: 'Emotional Wizard System processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    const systemStatus = emotionalWizard.getSystemStatus()
    return NextResponse.json({
      status: 'healthy',
      system: 'Emotional Wizard System',
      capabilities: systemStatus
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'System health check failed' },
      { status: 500 }
    )
  }
} 