// Insight session logging API endpoint
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate insight trial data
    if (!data.world || !data.trial || typeof data.t_rec_ms !== 'number') {
      return NextResponse.json({ 
        error: 'Invalid insight trial data' 
      }, { status: 400 })
    }

    // Log insight trial data
    console.log('Insight Trial:', JSON.stringify(data, null, 2))
    
    // In production, save to database or file system
    const logEntry = {
      timestamp: new Date().toISOString(),
      world: data.world,
      trial: data.trial,
      t_rec_ms: data.t_rec_ms,
      pred_err_ms: data.pred_err_ms || 0,
      adjust_value: data.adjust_value || 0,
      a_score: data.a_score,
      version: data.version
    }
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Insight trial logged successfully',
      log_entry: logEntry
    })
    
  } catch (error) {
    console.error('Error logging insight trial:', error)
    return NextResponse.json({ 
      error: 'Failed to process insight trial' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    message: 'Insight API is healthy',
    version: 'insight_v0.1',
    timestamp: new Date().toISOString()
  })
}
