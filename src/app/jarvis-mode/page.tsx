'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { JarvisSettings } from '@/components/jarvis-settings';
import { AutoPageSEO } from '@/components/seo/page-seo';
import { AISearchOptimization, educationalContent } from '@/components/seo/ai-search-optimization';
import { JarvisMode, type JarvisConfig, type JarvisState } from '@/lib/jarvis-mode';
import { JarvisAnimations } from '@/components/chat/jarvis-animations';
import { JarvisScreenOverlay } from '@/components/chat/jarvis-screen-overlay';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Mic, Volume2, Settings, Play, Square, Zap } from 'lucide-react';

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
  const [jarvisMode, setJarvisMode] = useState<JarvisMode | null>(null);
  const [jarvisState, setJarvisState] = useState<JarvisState>({
    isActive: false,
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
    lastInteraction: null,
    conversationContext: [],
    emotionalState: 'neutral'
  });
  const [showSettings, setShowSettings] = useState(false);
  const [testTranscript, setTestTranscript] = useState('');

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

  // Initialize Jarvis Mode
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const jarvis = new JarvisMode(
      jarvisConfig,
      (transcript: string) => {
        setTestTranscript(transcript);
        // In a real app, this would send to the AI
        console.log('Jarvis transcript:', transcript);
      },
      (state: JarvisState) => {
        setJarvisState(state);
      }
    );

    setJarvisMode(jarvis);

    return () => {
      jarvis.destroy();
    };
  }, [jarvisConfig]);

  // Save config to localStorage when it changes
  const handleConfigChange = (newConfig: JarvisConfig) => {
    setJarvisConfig(newConfig);
    localStorage.setItem('jarvis-config', JSON.stringify(newConfig));
  };

  // Jarvis controls
  const toggleJarvis = () => {
    if (!jarvisMode) return;
    
    if (jarvisState.isActive) {
      jarvisMode.deactivate();
    } else {
      jarvisMode.activate();
    }
  };

  const startListening = () => {
    if (!jarvisMode || jarvisState.isListening) return;
    jarvisMode.startListening();
  };

  const stopListening = () => {
    if (!jarvisMode || !jarvisState.isListening) return;
    jarvisMode.stopListening();
  };

  const testTTS = () => {
    if (!jarvisMode) return;
    jarvisMode.speak('Hello! This is a test of the Jarvis text-to-speech system. How does it sound?');
  };

  const getAnimationState = () => {
    if (!jarvisState.isActive) return 'idle';
    if (jarvisState.isListening) return 'listening';
    if (jarvisState.isSpeaking) return 'speaking';
    if (jarvisState.isProcessing) return 'processing';
    return 'idle';
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
          title="Jarvis Mode"
        />
        
        <main className="container mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <JarvisAnimations 
                  state={getAnimationState()} 
                  className="scale-150"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Jarvis Mode
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Transform your AI experience with voice-controlled interactions, 
              contextual awareness, and magical conversational intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="secondary" className="animate-fade-in">
                <Sparkles className="w-3 h-3 mr-1" />
                Voice Activated
              </Badge>
              <Badge variant="secondary" className="animate-fade-in animation-delay-200">
                <Mic className="w-3 h-3 mr-1" />
                Speech Recognition
              </Badge>
              <Badge variant="secondary" className="animate-fade-in animation-delay-300">
                <Volume2 className="w-3 h-3 mr-1" />
                Text-to-Speech
              </Badge>
              <Badge variant="secondary" className="animate-fade-in animation-delay-400">
                <Zap className="w-3 h-3 mr-1" />
                Contextual Memory
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Control Panel */}
            <Card className="glass animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Jarvis Control Panel
                </CardTitle>
                <CardDescription>
                  Test and control your Jarvis AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Display */}
                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                  <div className="flex justify-center mb-4">
                    <JarvisAnimations 
                      state={getAnimationState()} 
                      className="scale-125"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Status: {jarvisState.isActive ? 'Active' : 'Inactive'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {jarvisState.isActive 
                      ? jarvisState.isListening 
                        ? 'Listening for your voice...'
                        : jarvisState.isSpeaking
                        ? 'Speaking response...'
                        : 'Ready for commands'
                      : 'Click activate to start Jarvis'
                    }
                  </p>
                  {jarvisState.emotionalState !== 'neutral' && (
                    <Badge variant="outline" className="mb-4">
                      Mood: {jarvisState.emotionalState}
                    </Badge>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <EnhancedButton
                    variant={jarvisState.isActive ? 'destructive' : 'jarvis'}
                    size="lg"
                    onClick={toggleJarvis}
                    icon={jarvisState.isActive ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    className="w-full"
                    glow={jarvisState.isActive ? 'medium' : 'subtle'}
                  >
                    {jarvisState.isActive ? 'Deactivate' : 'Activate'} Jarvis
                  </EnhancedButton>

                  <EnhancedButton
                    variant={jarvisState.isListening ? 'destructive' : 'outline'}
                    size="lg"
                    onClick={jarvisState.isListening ? stopListening : startListening}
                    disabled={!jarvisState.isActive || jarvisState.isSpeaking}
                    icon={<Mic className="w-5 h-5" />}
                    className="w-full"
                  >
                    {jarvisState.isListening ? 'Stop' : 'Listen'}
                  </EnhancedButton>
                </div>

                {/* Test TTS */}
                <EnhancedButton
                  variant="outline"
                  size="lg"
                  onClick={testTTS}
                  disabled={!jarvisConfig.enableTTS}
                  icon={<Volume2 className="w-5 h-5" />}
                  className="w-full"
                >
                  Test Voice Output
                </EnhancedButton>

                {/* Last Transcript */}
                {testTranscript && (
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium mb-2">Last Transcript:</h4>
                    <p className="text-sm text-muted-foreground">"{testTranscript}"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Settings */}
            <Card className="glass animate-slide-up animation-delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Quick Settings
                </CardTitle>
                <CardDescription>
                  Essential Jarvis configuration options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg border">
                    <Volume2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium">Voice Style</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {jarvisConfig.voiceStyle}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <Mic className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-medium">Language</h4>
                    <p className="text-sm text-muted-foreground">
                      {jarvisConfig.language}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Wake Word</span>
                    <Badge variant={jarvisConfig.enableWakeWord ? 'default' : 'secondary'}>
                      {jarvisConfig.enableWakeWord ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Continuous Listening</span>
                    <Badge variant={jarvisConfig.continuousListening ? 'default' : 'secondary'}>
                      {jarvisConfig.continuousListening ? 'On' : 'Off'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Emotional Tone</span>
                    <Badge variant={jarvisConfig.emotionalTone ? 'default' : 'secondary'}>
                      {jarvisConfig.emotionalTone ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <EnhancedButton
                  variant="outline"
                  size="lg"
                  onClick={() => setShowSettings(true)}
                  icon={<Settings className="w-5 h-5" />}
                  className="w-full mt-6"
                >
                  Advanced Settings
                </EnhancedButton>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center animate-slide-up animation-delay-300">
              <CardContent className="pt-6">
                <Mic className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-lg font-semibold mb-2">Voice Recognition</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced speech-to-text with wake word detection and continuous listening modes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center animate-slide-up animation-delay-400">
              <CardContent className="pt-6">
                <Volume2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">Natural Speech</h3>
                <p className="text-sm text-muted-foreground">
                  Customizable text-to-speech with multiple voice styles and emotional tones.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center animate-slide-up animation-delay-600">
              <CardContent className="pt-6">
                <Zap className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <h3 className="text-lg font-semibold mb-2">Smart Memory</h3>
                <p className="text-sm text-muted-foreground">
                  Contextual awareness that remembers conversation history and adapts responses.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <JarvisSettings 
                  config={jarvisConfig}
                  onConfigChange={handleConfigChange}
                  onClose={() => setShowSettings(false)}
                />
              </div>
            </div>
          )}
        </main>

        {/* Full Screen Overlay */}
        <JarvisScreenOverlay
          isActive={jarvisState.isActive}
          state={getAnimationState()}
          onClose={() => jarvisMode?.deactivate()}
        />
      </div>
    </>
  );
}