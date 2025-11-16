// Mirror session logging API endpoint
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate mirror session data
    if (!data.session || !data.seed_vector) {
      return NextResponse.json({ 
        error: 'Invalid mirror session data' 
      }, { status: 400 })
    }

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
      ridge_points: data.session.ridge.length,
      seed_vector: data.seed_vector
    }
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Mirror session logged successfully',
      log_entry: logEntry
    })
    
  } catch (error) {
    console.error('Error logging mirror session:', error)
    return NextResponse.json({ 
      error: 'Failed to process mirror session' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    message: 'Mirror API is healthy',
    version: 'mirror_v0.1',
    timestamp: new Date().toISOString()
  })
}
