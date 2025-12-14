'use client';

import { useState } from 'react';
import { Send, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import emailjs from 'emailjs-com';

export default function EmailTestClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const sendTestEmail = async () => {
    setIsLoading(true);
    setResult(null);

    const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

    if (!SERVICE_ID || !TEMPLATE_ID || !USER_ID) {
      setResult({
        success: false,
        message: 'EmailJS configuration is missing. Please check environment variables.'
      });
      setIsLoading(false);
      return;
    }

    const emailData = {
      user_name: 'Test User',
      user_email: '90freeplay98@gmail.com',
      message: `
🚀 CODEEX AI Email Service Test - Client-Side

Hello Test User,

This is a test email sent directly from the browser using EmailJS to verify that our email service is working correctly.

📧 Email Details:
• Recipient: 90freeplay98@gmail.com
• Service: EmailJS (Client-Side)
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
🌐 Visit CODEEX AI: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
📧 Support: codeex.care@gmail.com
👨‍💻 Developer: Heoster
🔗 GitHub: https://github.com/Heoster/codeex-v3

Best regards,
The CODEEX AI Team
      `.trim(),
      subject: 'CODEEX AI - Email Service Test (Client-Side)',
      app_url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      app_name: 'CODEEX AI'
    };

    try {
      console.log('📧 Sending email with EmailJS...');
      console.log('Service ID:', SERVICE_ID);
      console.log('Template ID:', TEMPLATE_ID);
      console.log('User ID:', USER_ID);

      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailData, USER_ID);
      
      console.log('✅ Email sent successfully:', response);
      setResult({
        success: true,
        message: `Email sent successfully to 90freeplay98@gmail.com! Status: ${response.status}`
      });
    } catch (error: any) {
      console.error('❌ Failed to send email:', error);
      setResult({
        success: false,
        message: `Failed to send email: ${error.text || error.message || 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Client-Side Email Test
        </CardTitle>
        <CardDescription>
          Test EmailJS directly from the browser
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p><strong>Recipient:</strong> 90freeplay98@gmail.com</p>
          <p><strong>Method:</strong> EmailJS Client-Side</p>
          <p><strong>Template:</strong> Contact Form</p>
        </div>

        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={sendTestEmail}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Email...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Test Email
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}