/**
 * Resend Email API Endpoint
 * Handles email sending using Resend service
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendTestEmail, sendContactEmail, isResendConfigured } from '@/lib/resend-email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...params } = body;

    // Check if Resend is configured
    if (!isResendConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Resend API key is not configured. Please add RESEND_API_KEY to environment variables.'
      }, { status: 500 });
    }

    let result;

    switch (type) {
      case 'test':
        result = await sendTestEmail(params.recipientEmail, params.recipientName);
        break;
      
      case 'contact':
        result = await sendContactEmail(params.name, params.email, params.message);
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
        return NextResponse.json({
          success: false,
          error: 'Invalid email type. Supported types: test, contact, custom'
        }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Resend API endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Resend Email API',
    status: isResendConfigured() ? 'configured' : 'not configured',
    endpoints: {
      POST: {
        description: 'Send emails using Resend service',
        types: ['test', 'contact', 'custom'],
        example: {
          type: 'test',
          recipientEmail: '90freeplay98@gmail.com',
          recipientName: 'Test User'
        }
      }
    }
  });
}