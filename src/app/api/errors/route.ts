import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const error = await request.json();
    
    // Log error server-side
    console.error('Client Error Report:', {
      message: error.message,
      stack: error.stack,
      url: error.url,
      timestamp: new Date(error.timestamp).toISOString(),
      userAgent: error.userAgent,
    });
    
    // In production, you might want to:
    // 1. Store errors in a database
    // 2. Send to error monitoring service (Sentry, LogRocket, etc.)
    // 3. Send alerts for critical errors
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Error reporting endpoint failed:', e);
    return NextResponse.json(
      { error: 'Failed to report error' },
      { status: 500 }
    );
  }
}