import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Netlify deployment verification
 * Returns system status and available AI models
 */
export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      groq: !!process.env.GROQ_API_KEY,
      huggingface: !!process.env.HUGGINGFACE_API_KEY,
      google: !!process.env.GOOGLE_API_KEY,
      firebase: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    };

    // Basic system info
    const systemInfo = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      platform: process.platform,
    };

    return NextResponse.json({
      status: 'healthy',
      message: 'CODEEX AI is running successfully',
      version: '2.0.0',
      system: systemInfo,
      providers: envCheck,
      features: {
        multiProvider: true,
        smartFallback: true,
        pwa: true,
        mobileOptimized: true,
        voiceSupport: true,
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Support HEAD requests for simple health checks
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}