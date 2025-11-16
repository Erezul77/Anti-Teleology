import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Minimal API works!',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ 
      message: 'Minimal POST works!',
      received: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid JSON',
      timestamp: new Date().toISOString()
    }, { status: 400 })
  }
}
