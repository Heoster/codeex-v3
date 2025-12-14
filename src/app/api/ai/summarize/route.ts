import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required for summarization' },
        { status: 400 }
      );
    }

    // Simple summarization logic - in a real app, you'd use an AI service
    const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
    const summary = sentences.slice(0, Math.min(3, Math.ceil(sentences.length / 3))).join('. ') + '.';

    return NextResponse.json({
      summary,
      originalLength: text.length,
      summaryLength: summary.length,
      compressionRatio: Math.round((1 - summary.length / text.length) * 100)
    });
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { error: 'Failed to summarize text' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Summarization API',
    methods: ['POST'],
    description: 'Send text in POST body to get a summary'
  });
}