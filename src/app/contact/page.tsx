
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
// Using Resend API for reliable email delivery

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

    try {
        // Send contact email using Resend API
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'contact',
            name: formData.user_name,
            email: formData.user_email,
            message: formData.message,
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast({
            title: 'Message Sent Successfully! 📧',
            description: 'We\'ve received your message. We\'ll get back to you soon!',
          });
          
          setFormData({ user_name: '', user_email: '', message: '' });
        } else {
          throw new Error(data.error || 'Failed to send message');
        }

    } catch (error: any) {
        console.error('Failed to send email:', error);
        const errorMessage = error.message || 'Failed to send message. Please try again later.';
        
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
