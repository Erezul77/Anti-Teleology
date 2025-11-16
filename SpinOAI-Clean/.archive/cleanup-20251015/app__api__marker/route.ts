import { NextRequest, NextResponse } from 'next/server'
import { TrialRecord, MarkerTestSession, Vector, Variance, AXES } from '../../../lib/marker/types'

// Mock file system for logging (in production, use a real database)
const LOG_DIR = './logs/marker'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Handle different endpoint types based on request body
    if (data.trials && Array.isArray(data.trials)) {
      // This is a marker test session
      return handleMarkerLog(data as MarkerTestSession)
    } else if (data.trials && data.trials.length > 0) {
      // This is a scoring request
      return handleMarkerScore(data.trials as TrialRecord[])
    } else {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error processing marker request:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

async function handleMarkerLog(session: MarkerTestSession) {
  try {
    // In a real application, you would save this to a database
    // For now, we'll just log it
    console.log('Marker Test Session:', JSON.stringify(session, null, 2))
    
    // Create log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      participant_id: session.participant_id,
      trial_count: session.trials.length,
      session_duration: new Date(session.session_end).getTime() - new Date(session.session_start).getTime(),
      user_agent: session.user_agent
    }
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Marker test session logged successfully',
      log_entry: logEntry
    })
  } catch (error) {
    console.error('Error logging marker session:', error)
    return NextResponse.json({ error: 'Failed to log session' }, { status: 500 })
  }
}

async function handleMarkerScore(trials: TrialRecord[]) {
  try {
    // Group trials by axis
    const byAxis = Object.fromEntries(
      AXES.map(ax => [ax, trials.filter(t => t.axis === ax)])
    )
    
    // Calculate vector and variance
    const vector = {} as Vector
    const variance = {} as Variance
    
    for (const ax of AXES) {
      const vals = byAxis[ax].map(t => {
        if (t.choice === "B") return 1
        if (t.choice === "A") return 0
        if (t.choice === "EQUAL") return 0.5
        return 0.5 // Default fallback
      })
      const mean = vals.reduce((a: number, b: number) => a + b, 0) / Math.max(1, vals.length)
      const vari = vals.reduce((s: number, v: number) => s + (v - mean) * (v - mean), 0) / Math.max(1, vals.length)
      
      vector[ax as keyof Vector] = mean
      variance[ax as keyof Variance] = vari
    }
    
    return NextResponse.json({
      vector,
      variance,
      version: "mt_v0.3",
      trial_count: trials.length,
      axes_covered: AXES.filter(ax => byAxis[ax].length > 0)
    })
  } catch (error) {
    console.error('Error scoring marker test:', error)
    return NextResponse.json({ error: 'Failed to score test' }, { status: 500 })
  }
}

// Health check and aggregate endpoint
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const aggregateParam = searchParams.get('aggregate')
  const daysParam = searchParams.get('days')
  
  // Handle aggregate endpoint
  if (aggregateParam === '1' || aggregateParam === 'true') {
    try {
      const days = parseInt(daysParam || '7')
      
      // For now, return mock data since we don't have persistent backend logging
      // In production, this would read from backend/logs/marker/*.jsonl files
      const mockStats = [
        {
          id: "O1",
          axis: "OrderChaos",
          n: 15,
          meanLatency: 1850,
          equalRate: 0.12,
          sideBias: 0.48,
          meanDelta: 0.75,
          visibleDiffRate: 0.92
        },
        {
          id: "I1", 
          axis: "IntegrationIsolation",
          n: 12,
          meanLatency: 2100,
          equalRate: 0.08,
          sideBias: 0.52,
          meanDelta: 0.68,
          visibleDiffRate: 0.88
        },
        {
          id: "E1",
          axis: "ExpansionContraction", 
          n: 18,
          meanLatency: 1650,
          equalRate: 0.15,
          sideBias: 0.45,
          meanDelta: 0.82,
          visibleDiffRate: 0.95
        }
      ]
      
      const mockGlobal = {
        n: 45,
        mean_latency: 1867,
        equal_rate: 0.117,
        visible_diff_rate: 0.917,
        mean_delta: 0.75
      }
      
      return NextResponse.json({
        stats: mockStats,
        global: mockGlobal,
        version: "mt_v0.3"
      })
      
    } catch (error) {
      console.error('Error aggregating marker test data:', error)
      return NextResponse.json(
        { error: 'Failed to aggregate marker test data.' },
        { status: 500 }
      )
    }
  }
  
  // Default health check
  return NextResponse.json({ 
    ok: true, 
    message: 'Marker API is healthy',
    version: 'mt_v0.3',
    timestamp: new Date().toISOString()
  })
}

// Mirror session logging endpoint
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Handle mirror session logging
    if (data.session && data.seed_vector) {
      return handleMirrorLog(data)
    }
    
    return NextResponse.json({ error: 'Invalid mirror session data' }, { status: 400 })
  } catch (error) {
    console.error('Error processing mirror session:', error)
    return NextResponse.json({ error: 'Failed to process mirror session' }, { status: 500 })
  }
}

async function handleMirrorLog(data: any) {
  try {
    // Log mirror session data
    console.log('Mirror Session:', JSON.stringify(data, null, 2))
    
    // In production, save to database or file system
    const logEntry = {
      timestamp: new Date().toISOString(),
      participant_id: data.participant_id,
      session_duration: data.session.duration_s,
      samples: data.session.samples,
      a_mean: data.session.a_mean,
      a_peak: data.session.a_peak,
      ridge_points: data.session.ridge.length
    }
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Mirror session logged successfully',
      log_entry: logEntry
    })
  } catch (error) {
    console.error('Error logging mirror session:', error)
    return NextResponse.json({ error: 'Failed to log mirror session' }, { status: 500 })
  }
}