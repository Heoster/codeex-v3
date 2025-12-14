'use client';

import { useState } from 'react';
import { Send, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EmailTestClient from '@/components/email-test-client';
import ResendEmailTest from '@/components/resend-email-test';

export default function TestEmailPage() {
  const [formData, setFormData] = useState({
    to_email: '90freeplay98@gmail.com',
    to_name: 'Test User',
    subject: 'CODEEX AI - Email Service Test',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult({
        success: data.success,
        message: data.success ? data.message : data.error
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error: Failed to send email'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const defaultMessage = `
🚀 CODEEX AI Email Service Test

Hello! This is a test email from CODEEX AI to verify our email service is working correctly.

📧 Email Details:
• Sent to: ${formData.to_email}
• Service: EmailJS Integration
• Status: Testing Phase
• Timestamp: ${new Date().toISOString()}

🤖 About CODEEX AI:
CODEEX AI is a comprehensive AI assistant platform featuring:

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
  `.trim();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Email Service Test</h1>
        <p className="text-muted-foreground">
          Test the CODEEX AI email service by sending a placeholder email
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Test Email
          </CardTitle>
          <CardDescription>
            Configure and send a test email to verify the email service is working
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Recipient Email */}
            <div className="space-y-2">
              <Label htmlFor="to_email">Recipient Email *</Label>
              <Input
                id="to_email"
                type="email"
                value={formData.to_email}
                onChange={(e) => handleInputChange('to_email', e.target.value)}
                placeholder="recipient@example.com"
                required
              />
            </div>

            {/* Recipient Name */}
            <div className="space-y-2">
              <Label htmlFor="to_name">Recipient Name</Label>
              <Input
                id="to_name"
                type="text"
                value={formData.to_name}
                onChange={(e) => handleInputChange('to_name', e.target.value)}
                placeholder="Test User"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="CODEEX AI - Email Service Test"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Custom Message (optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder={`Leave empty to use default message...\n\nDefault message includes:\n• CODEEX AI features overview\n• Service status information\n• Contact details\n• Professional formatting`}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use the default comprehensive test message
              </p>
            </div>

            {/* Result Alert */}
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formData.to_email}
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
          </form>
        </CardContent>
      </Card>

      {/* Resend Email Test (Recommended) */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Resend Email Test (Recommended)</h2>
        <ResendEmailTest />
      </div>

      {/* Client-Side Email Test */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Client-Side Email Test (EmailJS)</h2>
        <EmailTestClient />
      </div>

      {/* Email Service Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Email Service Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Service Provider:</span>
              <span className="text-muted-foreground">EmailJS</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Default Recipient:</span>
              <span className="text-muted-foreground">90freeplay98@gmail.com</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Template Type:</span>
              <span className="text-muted-foreground">Contact Form Template</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Features:</span>
              <span className="text-muted-foreground">HTML formatting, attachments</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Message Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Default Message Preview</CardTitle>
          <CardDescription>
            This is the message that will be sent if no custom message is provided
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">
              {defaultMessage}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Back to Home */}
      <div className="mt-6 text-center">
        <Button variant="outline" asChild>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </div>
  );
}