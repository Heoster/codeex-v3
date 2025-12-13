'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Lock, Database, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: December 13, 2024
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Our Commitment to Privacy</CardTitle>
            </div>
            <CardDescription>
              CODEEX AI is committed to protecting your privacy and ensuring the security of your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI assistant service. 
              We believe in transparency and want you to understand exactly how your data is handled.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>Information We Collect</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Information You Provide</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Account information (email, display name) when you register</li>
                <li>Chat messages and conversations with the AI</li>
                <li>Files you upload for analysis (PDFs, images)</li>
                <li>Feedback and support communications</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Information Automatically Collected</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Device information (browser type, operating system)</li>
                <li>Usage analytics (pages visited, features used)</li>
                <li>Performance metrics (response times, error rates)</li>
                <li>IP address and general location data</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              <CardTitle>How We Use Your Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Provide and improve our AI assistant services</li>
              <li>Personalize your experience and remember your preferences</li>
              <li>Maintain conversation history for registered users</li>
              <li>Analyze usage patterns to enhance performance</li>
              <li>Send important service updates and notifications</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Ensure security and prevent abuse of our services</li>
            </ul>
          </CardContent>
        </Card>

        {/* AI Processing */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <CardTitle>AI Processing & Third-Party Services</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              CODEEX AI uses multiple AI providers to process your requests:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Groq:</strong> For fast AI inference and chat responses</li>
              <li><strong>Google Gemini:</strong> For advanced reasoning and analysis</li>
              <li><strong>Hugging Face:</strong> For specialized AI model capabilities</li>
            </ul>
            <p className="text-muted-foreground">
              Your messages are sent to these services for processing but are not stored by them for training purposes. 
              Each provider has their own privacy policies which we encourage you to review.
            </p>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Data Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>All data transmission is encrypted using HTTPS/TLS</li>
              <li>User accounts are protected with Firebase Authentication</li>
              <li>Conversation data is encrypted at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls limit who can view your data</li>
              <li>Automatic logout after periods of inactivity</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Conversation History:</strong> Stored for registered users until account deletion</li>
              <li><strong>Anonymous Usage:</strong> No conversation data is stored for non-registered users</li>
              <li><strong>Analytics Data:</strong> Aggregated and anonymized, retained for 24 months</li>
              <li><strong>Account Data:</strong> Retained until you delete your account</li>
              <li><strong>Support Communications:</strong> Retained for 3 years for quality assurance</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Access your personal data and conversation history</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your account and associated data</li>
              <li>Export your conversation history</li>
              <li>Opt out of non-essential communications</li>
              <li>Request information about data processing</li>
            </ul>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies and Local Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We use cookies and local storage to enhance your experience:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Essential Cookies:</strong> Required for authentication and core functionality</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
              <li><strong>Local Storage:</strong> Cache conversations and settings for better performance</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Contact Us</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy or your data, please contact us:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li><strong>Email:</strong> privacy@codeex-ai.com</li>
              <li><strong>Support:</strong> <a href="/contact" className="text-primary hover:underline">Contact Form</a></li>
              <li><strong>Address:</strong> codeex@email.com</li>
            </ul>
          </CardContent>
        </Card>

        <Separator />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            This Privacy Policy may be updated from time to time. We will notify you of any significant changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </div>
      </div>
    </div>
  );
}