'use client';

import { useState } from 'react';
import { Send, Mail, CheckCircle, AlertCircle, Loader2, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ResendEmailTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; id?: string } | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('codeex.care@gmail.com');
  const [recipientName, setRecipientName] = useState('Test User');

  const sendTestEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('📧 Sending test email via Resend API...');
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          recipientEmail,
          recipientName,
        }),
      });

      const data = await response.json();
      
      console.log('📨 Response:', data);
      
      if (data.success) {
        setResult({
          success: true,
          message: `Email sent successfully to ${recipientEmail}!`,
          id: data.id
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to send email'
        });
      }
    } catch (error: any) {
      console.error('❌ Failed to send email:', error);
      setResult({
        success: false,
        message: `Network error: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Resend Email Test</h1>
        <p className="text-muted-foreground">
          Test the new Resend API email service (reliable & fast)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Test Email
          </CardTitle>
          <CardDescription>
            Test email delivery using the Resend API service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Recipient Email</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Test User"
            />
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <p><strong>Service:</strong> Resend API</p>
            <p><strong>Method:</strong> Server-side (reliable)</p>
            <p><strong>Features:</strong> HTML emails, delivery tracking</p>
            <p><strong>Status:</strong> Production ready</p>
          </div>

          {result && (
            <Alert variant={result.success ? 'default' : 'destructive'}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {result.message}
                {result.id && (
                  <div className="mt-1 text-xs opacity-75">
                    Email ID: {result.id}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={sendTestEmail}
            className="w-full"
            disabled={isLoading || !recipientEmail}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending via Resend...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Test Email
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>✅ Server-side email delivery</p>
            <p>⚡ Fast & reliable with Resend API</p>
            <p>📧 Professional HTML templates</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Button variant="outline" asChild>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </div>
  );
}