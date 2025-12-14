import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendContactEmail, sendTestEmail, sendWelcomeEmail } from '@/lib/resend-email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...params } = body;

    let result;

    switch (type) {
      case 'test':
        result = await sendTestEmail(params.recipientEmail, params.recipientName);
        break;
      
      case 'contact':
        result = await sendContactEmail(params.name, params.email, params.message);
        break;
      
      case 'welcome':
        result = await sendWelcomeEmail(params.userEmail, params.userName);
        break;
      
      case 'custom':
        result = await sendEmail({
          to: params.to,
          subject: params.subject,
          html: params.html,
          text: params.text,
          from: params.from
        });
        break;
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}