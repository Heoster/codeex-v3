import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/email';
import { z } from 'zod';

// Input validation schema
const testEmailSchema = z.object({
  to_email: z.string().email('Invalid email address'),
  to_name: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = testEmailSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input data',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { to_email, to_name, subject, message } = validationResult.data;

    // Send test email
    const result = await sendTestEmail({
      to_email,
      to_name,
      subject,
      message,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${to_email}`,
        response: result.response,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to send test email',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Test Email API is running',
    endpoint: '/api/send-test-email',
    method: 'POST',
    required_fields: ['to_email'],
    optional_fields: ['to_name', 'subject', 'message'],
    example: {
      to_email: 'user@example.com',
      to_name: 'Test User',
      subject: 'Custom Subject',
      message: 'Custom message content'
    }
  });
}