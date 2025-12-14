'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, AlertTriangle, Scale, Users } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: December 13, 2025
        </p>
      </div>

      <div className="space-y-8">
        {/* Agreement */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Agreement to Terms</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using CODEEX AI, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle>Service Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              CODEEX AI is a multi-provider AI assistant service that provides:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>AI-powered chat and conversation capabilities</li>
              <li>Code assistance and debugging help</li>
              <li>Document analysis and summarization</li>
              <li>Image-based problem solving</li>
              <li>Web search and research assistance</li>
              <li>Educational support and learning resources</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>User Responsibilities</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">As a user of CODEEX AI, you agree to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Use the service for lawful purposes only</li>
              <li>Not attempt to harm, disable, or overburden our systems</li>
              <li>Not use the service to generate harmful, illegal, or inappropriate content</li>
              <li>Respect intellectual property rights</li>
              <li>Provide accurate information when creating an account</li>
              <li>Keep your account credentials secure</li>
              <li>Not share your account with others</li>
            </ul>
          </CardContent>
        </Card>

        {/* Prohibited Uses */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle>Prohibited Uses</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You may not use CODEEX AI to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Generate harmful, threatening, or abusive content</li>
              <li>Create spam, phishing, or fraudulent content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to reverse engineer or hack our systems</li>
              <li>Distribute malware or malicious code</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Collect personal information from other users</li>
            </ul>
          </CardContent>
        </Card>

        {/* AI Limitations */}
        <Card>
          <CardHeader>
            <CardTitle>AI Service Limitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Accuracy Disclaimer</h3>
                <p className="text-muted-foreground">
                  AI responses are generated based on training data and may not always be accurate, complete, or up-to-date. 
                  Always verify important information from authoritative sources.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Service Availability</h3>
                <p className="text-muted-foreground">
                  We strive for high availability but cannot guarantee uninterrupted service. 
                  AI providers may experience downtime or rate limiting.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Content Responsibility</h3>
                <p className="text-muted-foreground">
                  You are responsible for how you use AI-generated content. 
                  We are not liable for decisions made based on AI responses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Our Content</h3>
                <p className="text-muted-foreground">
                  The CODEEX AI service, including its design, features, and underlying technology, 
                  is owned by us and protected by intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Content</h3>
                <p className="text-muted-foreground">
                  You retain ownership of content you provide to the service. 
                  By using our service, you grant us a license to process your content to provide our services.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI-Generated Content</h3>
                <p className="text-muted-foreground">
                  AI-generated responses are not copyrightable and are provided as-is. 
                  You may use AI-generated content subject to these terms and applicable laws.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your privacy is important to us. Please review our{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>{' '}
              to understand how we collect, use, and protect your information.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              <CardTitle>Limitation of Liability</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              CODEEX AI is provided "as is" without warranties of any kind. To the fullest extent permitted by law:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>We disclaim all warranties, express or implied</li>
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability is limited to the amount you paid for the service</li>
              <li>We are not responsible for third-party AI provider limitations or failures</li>
            </ul>
          </CardContent>
        </Card>

        {/* Account Termination */}
        <Card>
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">By You</h3>
                <p className="text-muted-foreground">
                  You may delete your account at any time through your account settings. 
                  Upon deletion, your data will be removed according to our Privacy Policy.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">By Us</h3>
                <p className="text-muted-foreground">
                  We may suspend or terminate accounts that violate these terms, 
                  engage in abusive behavior, or pose security risks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update these Terms of Service from time to time. 
              We will notify users of significant changes by posting the updated terms on our website 
              and updating the "Last updated" date. Continued use of the service constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li><strong>Email:</strong> legal@codeex-ai.com</li>
              <li><strong>Support:</strong> <a href="/contact" className="text-primary hover:underline">Contact Form</a></li>
            </ul>
          </CardContent>
        </Card>

        <Separator />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            These Terms of Service constitute the entire agreement between you and CODEEX AI 
            regarding the use of our service.
          </p>
        </div>
      </div>
    </div>
  );
}