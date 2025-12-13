'use client';

import { Github, Instagram, Mail, Heart, Code, Sparkles, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default function AboutPage() {
  const technologies = [
    'Next.js 14', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Groq API',
    'Google Gemini', 'Hugging Face', 'PWA', 'Vercel', 'Netlify'
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Multi-Provider AI',
      description: 'Smart fallback system across Groq, Google Gemini, and Hugging Face models'
    },
    {
      icon: Zap,
      title: 'Contextual Memory',
      description: 'Adaptive recall system that remembers and learns from conversations'
    },
    {
      icon: Users,
      title: 'Jarvis Mode',
      description: 'Advanced voice assistant with emotional intelligence and wake word activation'
    },
    {
      icon: Code,
      title: 'Developer Tools',
      description: 'Code assistance, debugging, document analysis, and visual problem solving'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">About CODEEX AI</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          An intelligent AI assistant designed to help developers, students, and professionals 
          with coding, problem-solving, and learning through advanced multi-provider AI technology.
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            CODEEX AI was created to democratize access to advanced AI assistance. We believe that 
            everyone should have access to intelligent, contextual help for coding, learning, and 
            problem-solving. Our platform combines multiple AI providers to ensure reliability, 
            performance, and comprehensive coverage of user needs.
          </p>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Technology Stack
          </CardTitle>
          <CardDescription>
            Built with modern web technologies and AI services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Developer Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Meet the Developer</CardTitle>
          <CardDescription>
            Created with passion by Heoster
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Heoster</h3>
              <p className="text-muted-foreground mb-4">
                Full-stack developer passionate about AI, user experience, and creating tools 
                that empower people to learn and create. CODEEX AI represents a vision of 
                accessible, intelligent assistance for everyone.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://github.com/Heoster" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://www.instagram.com/codeex._.heoster/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="mailto:the.heoster@mail.com"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">9</div>
            <div className="text-sm text-muted-foreground">AI Models</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">3</div>
            <div className="text-sm text-muted-foreground">AI Providers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Free to Use</div>
          </CardContent>
        </Card>
      </div>

      {/* Open Source */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Open Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            CODEEX AI is built with transparency and community in mind. The source code is 
            available on GitHub, and we welcome contributions, feedback, and suggestions 
            from the developer community.
          </p>
          <Button asChild>
            <a 
              href="https://github.com/Heoster/codeex-v3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Version Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Version Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Version:</span>
              <span className="ml-2 text-muted-foreground">3.0.0</span>
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>
              <span className="ml-2 text-muted-foreground">December 2024</span>
            </div>
            <div>
              <span className="font-medium">License:</span>
              <span className="ml-2 text-muted-foreground">MIT</span>
            </div>
            <div>
              <span className="font-medium">Platform:</span>
              <span className="ml-2 text-muted-foreground">Web (PWA)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card>
        <CardHeader>
          <CardTitle>Contact & Support</CardTitle>
          <CardDescription>
            Get help or share feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <a href="/contact">Contact Support</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/faq">View FAQ</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/documentation">Documentation</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/features">Features Overview</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Made with <Heart className="inline h-4 w-4 text-red-500" /> by Heoster
        </p>
        <p className="mt-2">
          &copy; 2024 CODEEX AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}