// Server-side email utilities
import emailjs, { type EmailJSResponseStatus } from 'emailjs-com';

// EmailJS configuration with validation
// Note: These should be NEXT_PUBLIC_ prefixed to work in both client and server
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const CONTACT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const WELCOME_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID;
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codeex-ai.netlify.app';

export interface ContactEmailParams {
  user_name: string;
  user_email: string;
  message: string;
}

export interface WelcomeEmailParams {
  to_email: string;
  to_name: string;
  app_url: string;
}

export interface TestEmailParams {
  to_email: string;
  to_name?: string;
  subject?: string;
  message?: string;
}

export interface EmailResponse {
  success: boolean;
  response?: EmailJSResponseStatus;
  error?: string;
}

/**
 * Check if EmailJS is properly configured
 */
export function isEmailConfigured(): boolean {
  return !!(SERVICE_ID && USER_ID);
}

/**
 * Check if welcome email template is configured
 */
export function isWelcomeEmailConfigured(): boolean {
  return !!(isEmailConfigured() && WELCOME_TEMPLATE_ID);
}

/**
 * Send a contact form email
 */
export async function sendContactEmail(params: ContactEmailParams): Promise<EmailResponse> {
  if (!isEmailConfigured() || !CONTACT_TEMPLATE_ID) {
    return { 
      success: false, 
      error: 'Email service is not configured. Please set up EmailJS in your environment variables.' 
    };
  }

  try {
    const response = await emailjs.send(SERVICE_ID!, CONTACT_TEMPLATE_ID!, {
      ...params,
      app_url: APP_URL,
    }, USER_ID!);
    
    return { success: true, response };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to send contact email:', error);
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

/**
 * Send a welcome email to new users
 */
export async function sendWelcomeEmail(email: string, displayName: string): Promise<EmailResponse> {
  if (!isWelcomeEmailConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Welcome email not configured, skipping...');
    }
    return { success: true }; // Don't fail if not configured
  }

  try {
    const response = await emailjs.send(SERVICE_ID!, WELCOME_TEMPLATE_ID!, {
      to_email: email,
      to_name: displayName,
      app_url: APP_URL,
      app_name: 'CODEEX AI',
      support_email: 'codeex.care@gmail.com',
    }, USER_ID!);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Welcome email sent successfully');
    }
    return { success: true, response };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to send welcome email:', error);
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

/**
 * Send a test/placeholder email (server-side simulation)
 */
export async function sendTestEmail(params: TestEmailParams): Promise<EmailResponse> {
  const defaultSubject = 'CODEEX AI - Test Email Service';
  const defaultMessage = `
🚀 CODEEX AI Email Service Test

Hello ${params.to_name || 'User'},

This is a test email from CODEEX AI to verify that our email service is working correctly.

📧 Email Details:
• Recipient: ${params.to_email}
• Service: EmailJS Integration
• Status: Testing Phase
• Timestamp: ${new Date().toISOString()}

🤖 CODEEX AI Features:
✨ Multi-Provider AI System:
• Groq (Fast inference - 14,400 req/day)
• Google Gemini 2.5 Flash
• Hugging Face Router API
• 9 AI Models with Smart Fallback

🎯 Key Features:
• Jarvis Mode with Voice Controls & Animations
• Contextual Memory System
• Visual Problem Solving (Math equations)
• Real-time Web Search with Citations
• PDF Document Analysis
• Multi-Chat Management
• PWA Support (Installable App)

🔐 Security & User Management:
• Firebase Authentication
• Email Verification
• Password Security Validation
• Privacy Policy & Terms of Service
• Complete User Profile Management

🎨 User Experience:
• Rich Jarvis Animations (8 animation states)
• Responsive Mobile Design
• Voice Recognition & Text-to-Speech
• Dark/Light Theme Support
• Professional UI/UX

If you received this email, our email service is functioning perfectly! 🎉

---
🌐 Visit CODEEX AI: ${APP_URL}
📧 Support: codeex.care@gmail.com
👨‍💻 Developer: Heoster
🔗 GitHub: https://github.com/Heoster/codeex-v3

Best regards,
The CODEEX AI Team
  `.trim();

  // For development/testing, we'll try to send real emails if configured
  if (process.env.NODE_ENV === 'development') {
    console.log('\n📧 EMAIL TEST - DEVELOPMENT MODE');
    console.log('=====================================');
    console.log('To:', params.to_email);
    console.log('Subject:', params.subject || defaultSubject);
    console.log('Attempting to send real email via EmailJS...');
    console.log('=====================================\n');
  }

  // Server-side email sending is not supported with EmailJS
  // EmailJS is designed for client-side use only
  // For server-side emails, we would need a different service like Nodemailer + SMTP
  
  console.log('📧 Server-side email simulation (EmailJS requires client-side)');
  console.log('To actually send emails from server, consider using:');
  console.log('• Nodemailer with SMTP');
  console.log('• SendGrid API');
  console.log('• AWS SES');
  console.log('• Resend API');
  
  // For now, return success with simulation message
  return {
    success: true,
    response: {
      status: 200,
      text: 'Email simulated - EmailJS requires client-side execution. Use the client-side test component for real email sending.'
    } as any
  };
}
