'use client';

import { useState, useEffect } from 'react';
import { EnhancedTTS, createEnhancedTTS } from '@/lib/enhanced-tts';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Pause, Play, Square, Mic } from 'lucide-react';

export function TTSTest() {
  const [tts, setTTS] = useState<EnhancedTTS | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState('Hello! This is a test of the enhanced text-to-speech system. It features natural pauses, emotional expression, and high-quality voice selection for a more realistic and smooth speaking experience.');
  
  // TTS Configuration
  const [language, setLanguage] = useState('en-US');
  const [voiceStyle, setVoiceStyle] = useState<'professional' | 'friendly' | 'magical' | 'natural'>('natural');
  const [speed, setSpeed] = useState([0.9]);
  const [pitch, setPitch] = useState([1.0]);
  const [volume, setVolume] = useState([0.8]);
  const [emotionalTone, setEmotionalTone] = useState(true);
  const [naturalPauses, setNaturalPauses] = useState(true);
  const [voiceEnhancement, setVoiceEnhancement] = useState(true);

  // Available voices
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);

  useEffect(() => {
    // Initialize TTS
    const enhancedTTS = createEnhancedTTS(language, voiceStyle, setIsSpeaking);
    setTTS(enhancedTTS);

    // Get available voices
    setTimeout(() => {
      const voices = enhancedTTS.getAvailableVoices();
      setAvailableVoices(voices);
    }, 1000);

    return () => {
      enhancedTTS.destroy();
    };
  }, [language, voiceStyle]);

  useEffect(() => {
    if (tts) {
      tts.updateConfig({
        speed: speed[0],
        pitch: pitch[0],
        volume: volume[0],
        emotionalTone,
        naturalPauses,
        voiceEnhancement,
        useSSML: true
      });
    }
  }, [tts, speed, pitch, volume, emotionalTone, naturalPauses, voiceEnhancement]);

  const handleSpeak = async () => {
    if (tts && text.trim()) {
      await tts.speak(text);
    }
  };

  const handlePause = () => {
    if (tts) {
      tts.pause();
    }
  };

  const handleResume = () => {
    if (tts) {
      tts.resume();
    }
  };

  const handleStop = () => {
    if (tts) {
      tts.stop();
    }
  };

  const testSamples = [
    {
      name: 'Professional',
      text: 'Good morning. I am pleased to present the quarterly analysis report. The data indicates a significant improvement in performance metrics across all departments.'
    },
    {
      name: 'Friendly',
      text: 'Hey there! I\'m so excited to help you today! This is going to be awesome - we\'ll work together to solve any challenges you might have.'
    },
    {
      name: 'Magical',
      text: 'Greetings, dear seeker of knowledge! From the mystical realms of artificial intelligence, I conjure forth the wisdom you seek. Let the magic of technology illuminate your path!'
    },
    {
      name: 'Technical',
      text: 'The algorithm processes natural language input through multiple neural network layers, applying attention mechanisms and transformer architectures to generate contextually relevant responses.'
    },
    {
      name: 'Emotional',
      text: 'I\'m absolutely thrilled to announce this incredible breakthrough! This amazing discovery will revolutionize how we approach problem-solving. Isn\'t that just fantastic?'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-500" />
            Enhanced Text-to-Speech Test
          </CardTitle>
          <CardDescription>
            Test the realistic and smooth TTS system with advanced voice selection and natural speech patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="text-input">Text to Speak</Label>
            <Textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2">
            <EnhancedButton
              onClick={handleSpeak}
              disabled={isSpeaking || !text.trim()}
              variant="gradient"
              icon={<Play className="w-4 h-4" />}
              glow="medium"
            >
              Speak
            </EnhancedButton>
            
            <EnhancedButton
              onClick={handlePause}
              disabled={!isSpeaking}
              variant="outline"
              icon={<Pause className="w-4 h-4" />}
            >
              Pause
            </EnhancedButton>
            
            <EnhancedButton
              onClick={handleResume}
              disabled={!isSpeaking}
              variant="outline"
              icon={<Play className="w-4 h-4" />}
            >
              Resume
            </EnhancedButton>
            
            <EnhancedButton
              onClick={handleStop}
              disabled={!isSpeaking}
              variant="destructive"
              icon={<Square className="w-4 h-4" />}
            >
              Stop
            </EnhancedButton>

            {isSpeaking && (
              <Badge variant="default" className="animate-pulse">
                <Mic className="w-3 h-3 mr-1" />
                Speaking...
              </Badge>
            )}
          </div>

          {/* Sample Texts */}
          <div className="space-y-2">
            <Label>Sample Texts</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {testSamples.map((sample) => (
                <EnhancedButton
                  key={sample.name}
                  onClick={() => setText(sample.text)}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start h-auto p-3"
                >
                  <div>
                    <div className="font-medium">{sample.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {sample.text.substring(0, 50)}...
                    </div>
                  </div>
                </EnhancedButton>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Configuration</CardTitle>
          <CardDescription>
            Adjust voice settings for optimal speech quality and naturalness
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Voice Style */}
            <div className="space-y-2">
              <Label>Voice Style</Label>
              <Select value={voiceStyle} onValueChange={(value: any) => setVoiceStyle(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="magical">Magical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Speed: {speed[0].toFixed(1)}x</Label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={0.1}
                max={3.0}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Pitch: {pitch[0].toFixed(1)}</Label>
              <Slider
                value={pitch}
                onValueChange={setPitch}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Volume: {Math.round(volume[0] * 100)}%</Label>
              <Slider
                value={volume}
                onValueChange={setVolume}
                min={0.0}
                max={1.0}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Switches */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <Label>Emotional Tone</Label>
              <Switch checked={emotionalTone} onCheckedChange={setEmotionalTone} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Natural Pauses</Label>
              <Switch checked={naturalPauses} onCheckedChange={setNaturalPauses} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Voice Enhancement</Label>
              <Switch checked={voiceEnhancement} onCheckedChange={setVoiceEnhancement} />
            </div>
          </div>

          {/* Available Voices */}
          {availableVoices.length > 0 && (
            <div className="space-y-2">
              <Label>Available High-Quality Voices ({availableVoices.length})</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {availableVoices.slice(0, 9).map((voiceProfile, index) => (
                  <div key={index} className="text-xs p-2 border rounded">
                    <div className="font-medium truncate">{voiceProfile.voice.name}</div>
                    <div className="text-muted-foreground">
                      Quality: {voiceProfile.quality}/100
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}