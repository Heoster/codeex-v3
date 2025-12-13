import { NextResponse } from 'next/server';

/**
 * AI Debug endpoint for production diagnostics
 * Tests environment variables and API connectivity
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

    // Test basic Groq API connectivity
    let groqTest: { working: boolean; error: string | null } = { working: false, error: null };
    if (process.env.GROQ_API_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: 'Test' }],
            max_tokens: 10,
            temperature: 0.1
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          groqTest.working = true;
        } else {
          const errorText = await response.text();
          groqTest.error = `HTTP ${response.status}: ${errorText}`;
        }
      } catch (error) {
        groqTest.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    return NextResponse.json({
      status: 'debug-ready',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      platform: process.platform,
      nodeVersion: process.version,
      envVariables: envCheck,
      groqApiTest: groqTest,
      message: 'AI Debug endpoint working - all systems checked'
    });

  } catch (error) {
    console.error('Debug AI endpoint error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}