'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Mail, Send, Loader2, AlertCircle, Globe, Shield } from 'lucide-react';

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export default function ResendEmailTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailResult | null>(null);
  const [testEmail, setTestEmail] = useState('codeex.care@gmail.com');
  const [testName, setTestName] = useState('Test User');
  
  // Contact form state
  const [contactName, setContactName] = useState('John Doe');
  const [contactEmail, setContactEmail] = useState('john@example.com');
  const [contactMessage, setContactMessage] = useState('This is a test message from the Resend email service integration.');
  
  // Custom email state
  const [customTo, setCustomTo] = useState('codeex.care@gmail.com');
  const [customSubject, setCustomSubject] = useState('Custom Test Email from CODEEX AI');
  const [customHtml, setCustomHtml] = useState(`
    <h1>🚀 Custom Email Test</h1>
    <p>This is a custom email sent using the Resend API integration.</p>
    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
  `);
  const [customText, setCustomText] = useState('Custom Email Test\n\nThis is a custom email sent using the Resend API integration.\n\nTimestamp: ' + new Date().toISOString());

  const sendTestEmail = async (type: string, params: any) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, ...params }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = () => {
    sendTestEmail('test', {
      recipientEmail: testEmail,
      recipientName: testName
    });
  };

  const handleContactEmail = () => {
    sendTestEmail('contact', {
      name: contactName,
      email: contactEmail,
      message: contactMessage
    });
  };

  const handleCustomEmail = () => {
    sendTestEmail('custom', {
      to: customTo,
      subject: customSubject,
      html: customHtml,
      text: customText
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Mail className="h-8 w-8 text-blue-600" />
          Resend Email Service Test
        </h1>
        <p className="text-muted-foreground">
          Test the Resend email integration with different email types
        </p>
      </div>

      {/* Status Alert */}
      {result && (
        <Alert className={result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
            {result.success ? (
              <>
                ✅ Email sent successfully! 
                {result.id && <span className="ml-2 font-mono text-sm">ID: {result.id}</span>}
              </>
            ) : (
              <>❌ Failed to send email: {result.error}</>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="test" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="test">Test Email</TabsTrigger>
          <TabsTrigger value="contact">Contact Form</TabsTrigger>
          <TabsTrigger value="custom">Custom Email</TabsTrigger>
        </TabsList>

        {/* Test Email Tab */}
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Test Email
              </CardTitle>
              <CardDescription>
                Send a comprehensive test email with CODEEX AI features overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-email">Recipient Email</Label>
                  <Input
                    id="test-email"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="recipient@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-name">Recipient Name</Label>
                  <Input
                    id="test-name"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="Test User"
                  />
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Email Preview:</h4>
                <p className="text-sm text-muted-foreground">
                  Subject: CODEEX AI - Email Service Test (Resend API)<br/>
                  Content: Comprehensive platform overview with features, models, and links
                </p>
              </div>

              <Button 
                onClick={handleTestEmail} 
                disabled={loading || !testEmail}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Test Email...
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
        </TabsContent>

        {/* Contact Form Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Form Email
              </CardTitle>
              <CardDescription>
                Test the contact form email functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input
                    id="contact-name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Your message..."
                  rows={4}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Email Preview:</h4>
                <p className="text-sm text-muted-foreground">
                  To: codeex.care@gmail.com<br/>
                  Subject: Contact Form - {contactName} | CODEEX AI<br/>
                  Content: Formatted contact form submission with user details
                </p>
              </div>

              <Button 
                onClick={handleContactEmail} 
                disabled={loading || !contactName || !contactEmail || !contactMessage}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Contact Email...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Contact Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Email Tab */}
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Custom Email
              </CardTitle>
              <CardDescription>
                Send a custom email with your own content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-to">To Email</Label>
                  <Input
                    id="custom-to"
                    type="email"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    placeholder="recipient@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-subject">Subject</Label>
                  <Input
                    id="custom-subject"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Email subject"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-html">HTML Content</Label>
                <Textarea
                  id="custom-html"
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  placeholder="HTML email content..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-text">Text Content (Fallback)</Label>
                <Textarea
                  id="custom-text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Plain text email content..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleCustomEmail} 
                disabled={loading || !customTo || !customSubject || (!customHtml && !customText)}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Custom Email...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Custom Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📧 Resend Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Domain:</strong> send.codeex-ai</p>
              <p><strong>From Address:</strong> CODEEX AI &lt;noreply@send.codeex-ai&gt;</p>
              <p><strong>DNS Records:</strong> Configured as provided</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary">DKIM</Badge>
                <Badge variant="secondary">SPF</Badge>
                <Badge variant="secondary">DMARC</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔧 Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>API Key:</strong> RESEND_API_KEY</p>
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
              <p><strong>Endpoint:</strong> /api/send-email</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline">Test</Badge>
                <Badge variant="outline">Contact</Badge>
                <Badge variant="outline">Custom</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}