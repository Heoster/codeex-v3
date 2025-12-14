
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import emailjs from 'emailjs-com';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    // EmailJS configuration
    const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

    if (!SERVICE_ID || !TEMPLATE_ID || !USER_ID) {
      toast({
        title: 'Configuration Error',
        description: 'Email service is not properly configured. Please contact support.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
        // Send contact email using EmailJS client-side
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
          user_name: formData.user_name,
          user_email: formData.user_email,
          message: formData.message,
          subject: `Contact Form - ${formData.user_name}`,
          app_url: process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
          app_name: 'CODEEX AI',
          timestamp: new Date().toISOString()
        }, USER_ID);

        console.log('Email sent successfully:', response);
        
        toast({
          title: 'Message Sent Successfully! 📧',
          description: 'We\'ve received your message. We\'ll get back to you soon!',
        });
        
        setFormData({ user_name: '', user_email: '', message: '' });

    } catch (error: any) {
        console.error('Failed to send email:', error);
        const errorMessage = error.text || error.message || 'Failed to send message. Please try again later.';
        
        toast({
          title: 'Error Sending Message',
          description: errorMessage,
          variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/" 
        backText="Back to Home" 
        title="Contact Us"
      />
      <main className="container mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Review</CardTitle>
            <CardDescription>
              We&#39;d love to hear your feedback. Fill out the form below to get in touch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_name">Your Name</Label>
                <Input
                  id="user_name"
                  name="user_name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_email">Your Email</Label>
                <Input
                  id="user_email"
                  name="user_email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Your Review</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your Review"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
