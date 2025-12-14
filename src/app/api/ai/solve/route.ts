import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { problem, tone, technicalLevel, preferredModel } = body;

    if (!problem || typeof problem !== 'string') {
      return NextResponse.json(
        { error: 'Problem is required and must be a string' },
        { status: 400 }
      );
    }

    // Dynamic import to handle missing dependencies
    let enhancedSolve;
    try {
      const module = await import('@/ai/flows/enhanced-solve');
      enhancedSolve = module.enhancedSolve;
    } catch (importError) {
      console.error('Failed to import enhanced-solve:', importError);
      return NextResponse.json(
        { error: 'AI service is temporarily unavailable. Please check your API key configuration.' },
        { status: 503 }
      );
    }

    const result = await enhancedSolve({
      problem,
      tone,
      technicalLevel,
      preferredModel,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Solve API error:', error);
    
    // Handle specific error types
    const errorMessage = error instanceof Error ? error.message : 'Failed to solve problem';
    
    if (errorMessage.includes('API key') || errorMessage.includes('not configured')) {
      return NextResponse.json(
        { error: 'AI service configuration error. Please check your API keys.' },
        { status: 503 }
      );
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
      return NextResponse.json(
        { error: 'Service temporarily busy. Please try again in a moment.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}