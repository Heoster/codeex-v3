'use client';

import { useState } from 'react';
import { Sparkles, Mic, Volume2, Brain, Zap, Globe, Wand2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { JarvisConfig } from '@/lib/jarvis-mode';

interface JarvisSettingsProps {
  config: JarvisConfig;
  onConfigChange: (config: JarvisConfig) => void;
  onClose?: () => void;
}

export function JarvisSettings({ config, onConfigChange, onClose }: JarvisSettingsProps) {
  const [localConfig, setLocalConfig] = useState<JarvisConfig>(config);

  const updateConfig = (updates: Partial<JarvisConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  const voiceStyles = [
    { value: 'professional', label: 'Professional', description: 'Business-like and formal' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and conversational' },
    { value: 'magical', label: 'Magical', description: 'Mystical and enchanting' }
  ] as const;

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'pt-BR', label: 'Portuguese' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold">Jarvis Mode Settings</h2>
        </div>
        <p className="text-muted-foreground">
          Configure your AI companion for the perfect voice interaction experience
        </p>
      </div>

      {/* Voice Style */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            <CardTitle>Personality & Style</CardTitle>
          </div>
          <CardDescription>
            Choose how Jarvis communicates and responds to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="voiceStyle">Voice Style</Label>
            <Select
              value={localConfig.voiceStyle}
              onValueChange={(value: 'professional' | 'friendly' | 'magical') => 
                updateConfig({ voiceStyle: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voiceStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    <div>
                      <div className="font-medium">{style.label}</div>
                      <div className="text-sm text-muted-foreground">{style.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Emotional Tone</Label>
                <p className="text-sm text-muted-foreground">Adaptive emotional responses</p>
              </div>
              <Switch
                checked={localConfig.emotionalTone}
                onCheckedChange={(checked) => updateConfig({ emotionalTone: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Contextual Awareness</Label>
                <p className="text-sm text-muted-foreground">Remember conversation context</p>
              </div>
              <Switch
                checked={localConfig.contextualAwareness}
                onCheckedChange={(checked) => updateConfig({ contextualAwareness: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            <CardTitle>Voice Recognition</CardTitle>
          </div>
          <CardDescription>
            Configure speech recognition and wake word settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <Select
              value={localConfig.language}
              onValueChange={(value) => updateConfig({ language: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Wake Word Activation</Label>
                <p className="text-sm text-muted-foreground">Activate with "Hey Jarvis"</p>
              </div>
              <Switch
                checked={localConfig.enableWakeWord}
                onCheckedChange={(checked) => updateConfig({ enableWakeWord: checked })}
              />
            </div>

            {localConfig.enableWakeWord && (
              <div>
                <Label htmlFor="wakeWord">Custom Wake Word</Label>
                <Input
                  id="wakeWord"
                  value={localConfig.wakeWord}
                  onChange={(e) => updateConfig({ wakeWord: e.target.value })}
                  placeholder="hey jarvis"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use simple phrases like "hey jarvis" or "computer"
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label>Continuous Listening</Label>
                <p className="text-sm text-muted-foreground">Keep listening after responses</p>
              </div>
              <Switch
                checked={localConfig.continuousListening}
                onCheckedChange={(checked) => updateConfig({ continuousListening: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text-to-Speech */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            <CardTitle>Text-to-Speech</CardTitle>
          </div>
          <CardDescription>
            Configure how Jarvis speaks back to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Speech Output</Label>
              <p className="text-sm text-muted-foreground">Jarvis will speak responses aloud</p>
            </div>
            <Switch
              checked={localConfig.enableTTS}
              onCheckedChange={(checked) => updateConfig({ enableTTS: checked })}
            />
          </div>

          {localConfig.enableTTS && (
            <div className="space-y-4">
              <div>
                <Label>Voice Speed</Label>
                <div className="mt-2">
                  <Slider
                    value={[localConfig.voiceSpeed]}
                    onValueChange={([value]) => updateConfig({ voiceSpeed: value })}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Slow (0.5x)</span>
                    <span>Normal (1.0x)</span>
                    <span>Fast (2.0x)</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Voice Pitch</Label>
                <div className="mt-2">
                  <Slider
                    value={[localConfig.voicePitch]}
                    onValueChange={([value]) => updateConfig({ voicePitch: value })}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low (0.5x)</span>
                    <span>Normal (1.0x)</span>
                    <span>High (2.0x)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <CardTitle>Advanced Features</CardTitle>
          </div>
          <CardDescription>
            Experimental and advanced Jarvis capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <Label>Smart Context Memory</Label>
                  <Badge variant="secondary" className="text-xs">Beta</Badge>
                </div>
                <Switch
                  checked={localConfig.contextualAwareness}
                  onCheckedChange={(checked) => updateConfig({ contextualAwareness: checked })}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Jarvis remembers conversation context and adapts responses accordingly
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <Label>Multilingual Support</Label>
                  <Badge variant="secondary" className="text-xs">Experimental</Badge>
                </div>
                <Badge variant="outline" className="text-xs">
                  {languages.find(l => l.value === localConfig.language)?.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Jarvis can understand and respond in multiple languages
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={() => {
            // Reset to defaults
            const defaultConfig: JarvisConfig = {
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
            setLocalConfig(defaultConfig);
            onConfigChange(defaultConfig);
          }}
        >
          Reset to Defaults
        </Button>
        
        {onClose && (
          <Button onClick={onClose}>
            Done
          </Button>
        )}
      </div>

      {/* Info */}
      <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                About Jarvis Mode
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Jarvis Mode transforms your AI from a simple tool into a voice-driven companion. 
                It combines speech-to-text listening, advanced AI reasoning, and text-to-speech responses 
                in a seamless loop, creating a natural conversation experience with contextual awareness 
                and emotional intelligence.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}