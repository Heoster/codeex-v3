'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'ai' | 'technical' | 'account' | 'privacy';
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'general',
    question: 'What is CODEEX AI?',
    answer: 'CODEEX AI is a multi-provider AI assistant that helps with coding, problem-solving, learning, and general questions. It uses advanced AI models from Groq, Google Gemini, and Hugging Face to provide intelligent responses with smart fallback capabilities.'
  },
  {
    id: '2',
    category: 'ai',
    question: 'Which AI models does CODEEX AI use?',
    answer: 'CODEEX AI uses multiple AI providers: Groq (Llama 3.1 8B Instruct), Google Gemini (2.5 Flash, Flash Latest, 2.5 Flash Lite), and Hugging Face (Llama 3.1 8B, DeepSeek V3.2, RNJ-1 Instruct, GPT-OSS 20B). The system automatically falls back between models for optimal performance.'
  },
  {
    id: '3',
    category: 'technical',
    question: 'How does the smart fallback system work?',
    answer: 'When one AI model fails or is unavailable, CODEEX AI automatically tries the next available model. This ensures you always get a response even if individual AI services are experiencing issues. The system prioritizes faster models first and falls back to alternatives as needed.'
  },
  {
    id: '4',
    category: 'account',
    question: 'Do I need to create an account to use CODEEX AI?',
    answer: 'No account is required for basic AI chat functionality. However, creating an account allows you to save your conversation history, customize settings, and access additional features like document analysis and image solving.'
  },
  {
    id: '5',
    category: 'technical',
    question: 'Can I use CODEEX AI offline?',
    answer: 'CODEEX AI is a Progressive Web App (PWA) that can be installed on your device. While the AI features require an internet connection, the app interface works offline and will sync when you reconnect.'
  },
  {
    id: '6',
    category: 'ai',
    question: 'What types of problems can CODEEX AI help solve?',
    answer: 'CODEEX AI can help with: coding and debugging, mathematical equations, document analysis, web search and research, image-based problem solving, learning new concepts, and general question answering. It adapts its responses based on your technical level and preferred communication tone.'
  },
  {
    id: '7',
    category: 'privacy',
    question: 'Is my data secure and private?',
    answer: 'Yes, we take privacy seriously. Conversations are processed securely, and we don\'t store your personal data unnecessarily. For registered users, data is encrypted and stored securely. See our Privacy Policy for complete details.'
  },
  {
    id: '8',
    category: 'technical',
    question: 'How do I install CODEEX AI as a PWA?',
    answer: 'On most browsers, you\'ll see an "Install" button in the address bar or browser menu. On mobile, use "Add to Home Screen" from your browser menu. Once installed, CODEEX AI will work like a native app with offline capabilities.'
  },
  {
    id: '9',
    category: 'ai',
    question: 'Can I choose which AI model to use?',
    answer: 'Yes! In the settings, you can select your preferred AI model or leave it on "Auto" for smart routing. Each model has different strengths - Groq is fastest, Google Gemini is most versatile, and Hugging Face models offer specialized capabilities.'
  },
  {
    id: '10',
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'On the login page, click "Forgot Password" and enter your email address. You\'ll receive a secure reset link. If you don\'t receive the email, check your spam folder or contact support.'
  },
  {
    id: '11',
    category: 'technical',
    question: 'Why is my AI request taking a long time?',
    answer: 'AI processing time varies based on request complexity and model availability. CODEEX AI has a 25-second timeout to prevent hanging requests. If a model is slow, the system will automatically try a faster alternative.'
  },
  {
    id: '12',
    category: 'general',
    question: 'Is CODEEX AI free to use?',
    answer: 'Yes, CODEEX AI is completely free to use. We use free tiers and open-source models from various AI providers to keep the service accessible to everyone.'
  }
];

const categories = {
  general: 'General',
  ai: 'AI & Models',
  technical: 'Technical',
  account: 'Account',
  privacy: 'Privacy & Security'
};

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions about CODEEX AI
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          size="sm"
        >
          All Questions
        </Button>
        {Object.entries(categories).map(([key, label]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(key)}
            size="sm"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <Card key={faq.id} className="w-full">
            <Collapsible
              open={openItems.includes(faq.id)}
              onOpenChange={() => toggleItem(faq.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                      <CardDescription className="capitalize">
                        {categories[faq.category]}
                      </CardDescription>
                    </div>
                    {openItems.includes(faq.id) ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Contact Support */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Still have questions?</CardTitle>
          <CardDescription>
            Can't find what you're looking for? We're here to help!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <a href="/contact">Contact Support</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/documentation">View Documentation</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}