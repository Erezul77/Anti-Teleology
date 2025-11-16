import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🔍 TEST ENV: Checking environment variables...')
  
  const envCheck = {
    OPENAI_API_KEY: {
      exists: !!process.env.OPENAI_API_KEY,
      length: process.env.OPENAI_API_KEY?.length || 0,
      startsWithSk: process.env.OPENAI_API_KEY?.startsWith('sk-') || false,
      value: process.env.OPENAI_API_KEY ? 'SET' : 'MISSING'
    },
    NEXT_PUBLIC_OPENAI_API_KEY: {
      exists: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      length: process.env.NEXT_PUBLIC_OPENAI_API_KEY?.length || 0,
      startsWithSk: process.env.NEXT_PUBLIC_OPENAI_API_KEY?.startsWith('sk-') || false,
      value: process.env.NEXT_PUBLIC_OPENAI_API_KEY ? 'SET' : 'MISSING'
    },
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    allOpenAIKeys: Object.keys(process.env).filter(key => key.includes('OPENAI'))
  }
  
  console.log('🔍 TEST ENV: Environment check result:', envCheck)
  
  return NextResponse.json({
    message: 'Environment variables test - FORCE DEPLOY',
    timestamp: new Date().toISOString(),
    environment: envCheck
  })
} 