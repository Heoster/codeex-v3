'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { JarvisSettings } from '@/components/jarvis-settings';
import { AutoPageSEO } from '@/components/seo/page-seo';
import { AISearchOptimization, educationalContent } from '@/components/seo/ai-search-optimization';
import type { JarvisConfig } from '@/lib/jarvis-mode';

const defaultJarvisConfig: JarvisConfig = {
  wakeWord: 'hey jarvis',
  language: 'en-US',
  voiceStyle: 'friendly',
  enableWakeWord: false,
  enableTTS: true,
  voiceSpeed: 1.0,
  voicePitch: 1.0,
  continuousListening: false,
  emotionalTone: true,
  contextualAwareness: true
};

export default function JarvisModePage() {
  const [jarvisConfig, setJarvisConfig] = useState<JarvisConfig>(defaultJarvisConfig);

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('jarvis-config');
    if (savedConfig) {
      try {
        setJarvisConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Failed to load Jarvis config:', error);
      }
    }
  }, []);

  // Save config to localStorage when it changes
  const handleConfigChange = (newConfig: JarvisConfig) => {
    setJarvisConfig(newConfig);
    localStorage.setItem('jarvis-config', JSON.stringify(newConfig));
  };

  return (
    <>
      <AutoPageSEO />
      <AISearchOptimization
        title="Jarvis Mode Settings - Voice-Enabled AI Assistant | CODEEX AI"
        description="Configure your magical Jarvis Mode AI assistant with voice controls, wake words, and personalized settings for the ultimate hands-free programming experience."
        keywords={[
          'Jarvis Mode settings',
          'voice-enabled AI assistant',
          'voice-controlled programming',
          'AI voice configuration',
          'hands-free coding',
          'speech-to-text programming',
          'voice commands for coding',
          'AI assistant customization',
          'conversational AI settings',
          'voice-activated development'
        ]}
        conversationalQueries={[
          'How to configure Jarvis Mode?',
          'What is Jarvis Mode in CODEEX AI?',
          'How to set up voice commands for programming?',
          'Can I customize my AI voice assistant?',
          'How does voice-controlled coding work?',
          'What are the best Jarvis Mode settings?',
          'How to enable wake word for AI assistant?',
          'Can I change the AI voice speed and pitch?',
          'How to use hands-free programming?',
          'What languages does Jarvis Mode support?'
        ]}
        educationalContent={educationalContent.voiceCoding}
      />
      
      <div className="min-h-screen bg-background text-foreground">
        <PageHeader 
          backLink="/chat" 
          backText="Back to Chat" 
          title="Jarvis Mode Settings"
        />
        <main className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
          <JarvisSettings 
            config={jarvisConfig}
            onConfigChange={handleConfigChange}
          />
        </main>
      </div>
    </>
  );
}