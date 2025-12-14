/**
 * Resend Email Service
 * Modern, reliable email service for CODEEX AI
 */

import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export interface EmailResponse {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Check if Resend is properly configured
 */
export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Send email using Resend API
 */
export async function sendEmail(params: EmailParams): Promise<EmailResponse> {
  if (!isResendConfigured()) {
    return {
      success: false,
      error: 'Resend API key is not configured'
    };
  }

  try {
    // Ensure we have either HTML or text content
    const emailContent: any = {
      from: params.from || 'CODEEX AI <onboarding@resend.dev>',
      to: Array.isArray(params.to) ? params.to : [params.to],
      subject: params.subject,
    };

    // Add HTML content if provided
    if (params.html) {
      emailContent.html = params.html;
    }

    // Add text content if provided, or generate from HTML
    if (params.text) {
      emailContent.text = params.text;
    } else if (params.html) {
      // Generate basic text version from HTML if no text provided
      emailContent.text = params.html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }

    // Ensure we have at least text content
    if (!emailContent.html && !emailContent.text) {
      return {
        success: false,
        error: 'Email must have either HTML or text content'
      };
    }

    const { data, error } = await resend.emails.send(emailContent);

    if (error) {
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email'
      };
    }

    console.log('Email sent successfully:', data?.id);
    return {
      success: true,
      id: data?.id
    };
  } catch (error) {
    console.error('Resend service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send contact form email
 */
export async function sendContactEmail(
  name: string,
  email: string,
  message: string
): Promise<EmailResponse> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission - CODEEX AI</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 New Contact Form Submission</h1>
          <p>CODEEX AI - Multi-Provider AI Assistant</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Name:</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value">${email}</div>
          </div>
          <div class="field">
            <div class="label">💬 Message:</div>
            <div class="value">${message}</div>
          </div>
          <div class="field">
            <div class="label">🕒 Timestamp:</div>
            <div class="value">${new Date().toISOString()}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the CODEEX AI contact form</p>
          <p>🌐 <a href="https://codeex-ai.netlify.app">Visit CODEEX AI</a> | 📧 Support: codeex.care@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Contact Form Submission - CODEEX AI

Name: ${name}
Email: ${email}
Message: ${message}
Timestamp: ${new Date().toISOString()}

This email was sent from the CODEEX AI contact form.
Visit: https://codeex-ai.netlify.app
  `;

  return sendEmail({
    to: 'codeex.care@gmail.com',
    subject: `Contact Form - ${name} | CODEEX AI`,
    from: 'CODEEX AI Contact <onboarding@resend.dev>',
    html,
    text
  });
}

/**
 * Send test email
 */
export async function sendTestEmail(
  recipientEmail: string = 'codeex.care@gmail.com',
  recipientName: string = 'Test User'
): Promise<EmailResponse> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>CODEEX AI - Email Service Test</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .feature { background: white; margin: 15px 0; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; }
        .feature-title { font-weight: bold; color: #667eea; margin-bottom: 8px; }
        .status { background: #e8f5e8; color: #2d5a2d; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 CODEEX AI</h1>
          <h2>Email Service Test</h2>
          <p>Multi-Provider AI Assistant Platform</p>
        </div>
        <div class="content">
          <div class="status">
            <h3>✅ Email Service Working Perfectly!</h3>
            <p>If you're reading this, our email system is functioning correctly.</p>
          </div>
          
          <p>Hello <strong>${recipientName}</strong>,</p>
          
          <p>This is a test email from <strong>CODEEX AI</strong> to verify that our new email service is working correctly using <strong>Resend API</strong>.</p>
          
          <div class="feature">
            <div class="feature-title">📧 Email Details</div>
            <p><strong>Recipient:</strong> ${recipientEmail}<br>
            <strong>Service:</strong> Resend API<br>
            <strong>Status:</strong> Live Testing<br>
            <strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>

          <div class="feature">
            <div class="feature-title">🤖 CODEEX AI Features</div>
            <p><strong>Multi-Provider AI System:</strong></p>
            <ul>
              <li>Groq (Fast inference - 14,400 req/day)</li>
              <li>Google Gemini 2.5 Flash</li>
              <li>Hugging Face Router API</li>
              <li>9 AI Models with Smart Fallback</li>
            </ul>
          </div>

          <div class="feature">
            <div class="feature-title">🎯 Key Features</div>
            <ul>
              <li>Jarvis Mode with Voice Controls & Animations</li>
              <li>Contextual Memory System</li>
              <li>Visual Problem Solving (Math equations)</li>
              <li>Real-time Web Search with Citations</li>
              <li>PDF Document Analysis</li>
              <li>Multi-Chat Management</li>
              <li>PWA Support (Installable App)</li>
            </ul>
          </div>

          <div class="feature">
            <div class="feature-title">🔐 Security & User Management</div>
            <ul>
              <li>Firebase Authentication</li>
              <li>Email Verification</li>
              <li>Password Security Validation</li>
              <li>Privacy Policy & Terms of Service</li>
              <li>Complete User Profile Management</li>
            </ul>
          </div>

          <div class="feature">
            <div class="feature-title">🎨 User Experience</div>
            <ul>
              <li>Rich Jarvis Animations (8 animation states)</li>
              <li>Responsive Mobile Design</li>
              <li>Voice Recognition & Text-to-Speech</li>
              <li>Dark/Light Theme Support</li>
              <li>Professional UI/UX</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://codeex-ai.netlify.app" class="button">🌐 Visit CODEEX AI</a>
            <a href="https://github.com/Heoster/codeex-v3" class="button">🔗 View on GitHub</a>
          </div>
        </div>
        <div class="footer">
          <p><strong>📧 Support:</strong> codeex.care@gmail.com</p>
          <p><strong>👨‍💻 Developer:</strong> Heoster</p>
          <p><strong>🔗 GitHub:</strong> <a href="https://github.com/Heoster/codeex-v3">https://github.com/Heoster/codeex-v3</a></p>
          <p style="margin-top: 20px; font-size: 11px; color: #999;">
            This email was sent by CODEEX AI email service test.<br>
            Powered by Resend API - Modern, reliable email delivery.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
🚀 CODEEX AI - Email Service Test

Hello ${recipientName},

This is a test email from CODEEX AI to verify that our email service is working correctly using Resend API.

📧 Email Details:
• Recipient: ${recipientEmail}
• Service: Resend API
• Status: Live Testing
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
🌐 Visit CODEEX AI: https://codeex-ai.netlify.app
📧 Support: codeex.care@gmail.com
👨‍💻 Developer: Heoster
🔗 GitHub: https://github.com/Heoster/codeex-v3

Best regards,
The CODEEX AI Team

---
This email was sent by CODEEX AI email service test.
Powered by Resend API - Modern, reliable email delivery.
  `;

  return sendEmail({
    to: recipientEmail,
    subject: 'CODEEX AI - Email Service Test (Resend API)',
    from: 'CODEEX AI Test <onboarding@resend.dev>',
    html,
    text
  });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
): Promise<EmailResponse> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to CODEEX AI!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .welcome { background: #e8f5e8; color: #2d5a2d; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0; }
        .feature { background: white; margin: 15px 0; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Welcome to CODEEX AI!</h1>
          <p>Your AI-Powered Learning Journey Starts Here</p>
        </div>
        <div class="content">
          <div class="welcome">
            <h2>🎉 Welcome ${userName}!</h2>
            <p>Thank you for joining CODEEX AI. Your account has been successfully created.</p>
          </div>
          
          <p>Hello <strong>${userName}</strong>,</p>
          
          <p>Welcome to <strong>CODEEX AI</strong> - the magical AI learning platform designed to democratize tech education for students like you!</p>
          
          <div class="feature">
            <h3>🤖 What You Can Do Now:</h3>
            <ul>
              <li><strong>Chat with 9 AI Models:</strong> Groq, Google Gemini, Hugging Face models</li>
              <li><strong>Jarvis Mode:</strong> Voice-controlled AI assistant with animations</li>
              <li><strong>Solve Math Problems:</strong> Upload images of equations for instant solutions</li>
              <li><strong>Analyze PDFs:</strong> Get summaries and insights from documents</li>
              <li><strong>Web Search:</strong> Real-time search with AI-powered citations</li>
            </ul>
          </div>

          <div class="feature">
            <h3>🎯 Getting Started:</h3>
            <ol>
              <li>Visit your dashboard and explore the chat interface</li>
              <li>Try Jarvis Mode for voice interactions</li>
              <li>Upload a math problem image to test visual solving</li>
              <li>Experiment with different AI models</li>
              <li>Check out the contextual memory system</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://codeex-ai.netlify.app/chat" class="button">🚀 Start Chatting</a>
            <a href="https://codeex-ai.netlify.app/features" class="button">📋 View Features</a>
          </div>

          <p>If you have any questions or need help, don't hesitate to reach out to our support team.</p>
          
          <p>Happy learning!<br>
          <strong>The CODEEX AI Team</strong></p>
        </div>
        <div class="footer">
          <p><strong>📧 Support:</strong> codeex.care@gmail.com</p>
          <p><strong>🌐 Website:</strong> <a href="https://codeex-ai.netlify.app">https://codeex-ai.netlify.app</a></p>
          <p><strong>🔗 GitHub:</strong> <a href="https://github.com/Heoster/codeex-v3">https://github.com/Heoster/codeex-v3</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
🚀 Welcome to CODEEX AI!

Hello ${userName},

Welcome to CODEEX AI - the magical AI learning platform designed to democratize tech education for students like you!

🤖 What You Can Do Now:
• Chat with 9 AI Models: Groq, Google Gemini, Hugging Face models
• Jarvis Mode: Voice-controlled AI assistant with animations
• Solve Math Problems: Upload images of equations for instant solutions
• Analyze PDFs: Get summaries and insights from documents
• Web Search: Real-time search with AI-powered citations

🎯 Getting Started:
1. Visit your dashboard and explore the chat interface
2. Try Jarvis Mode for voice interactions
3. Upload a math problem image to test visual solving
4. Experiment with different AI models
5. Check out the contextual memory system

Visit: https://codeex-ai.netlify.app/chat

If you have any questions or need help, don't hesitate to reach out to our support team.

Happy learning!
The CODEEX AI Team

📧 Support: codeex.care@gmail.com
🌐 Website: https://codeex-ai.netlify.app
🔗 GitHub: https://github.com/Heoster/codeex-v3
  `;

  return sendEmail({
    to: userEmail,
    subject: '🚀 Welcome to CODEEX AI - Your AI Learning Journey Starts Now!',
    from: 'CODEEX AI Welcome <onboarding@resend.dev>',
    html,
    text
  });
}