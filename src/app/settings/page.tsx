'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { JarvisSettings } from '@/components/jarvis-settings';
import { AutoPageSEO } from '@/components/seo/page-seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Settings as SettingsIcon, Palette, Volume2, Shield, Bell } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { JarvisConfig } from '@/lib/jarvis-mode';
import type { Settings } from '@/lib/types';

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

const defaultSettings: Settings = {
  model: 'auto',
  tone: 'helpful',
  technicalLevel: 'intermediate',
  enableSpeech: true,
  voice: 'Algenib',
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [jarvisConfig, setJarvisConfig] = useState<JarvisConfig>(defaultJarvisConfig);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: false,
    soundEffects: true,
    vibration: true
  });

  // Load configs from localStorage on mount
  useEffect(() => {
    const savedJarvisConfig = localStorage.getItem('jarvis-config');
    if (savedJarvisConfig) {
      try {
        setJarvisConfig(JSON.parse(savedJarvisConfig));
      } catch (error) {
        console.error('Failed to load Jarvis config:', error);
      }
    }

    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load app settings:', error);
      }
    }

    const savedNotifications = localStorage.getItem('notification-settings');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    }
  }, []);

  // Save configs to localStorage when they change
  const handleJarvisConfigChange = (newConfig: JarvisConfig) => {
    setJarvisConfig(newConfig);
    localStorage.setItem('jarvis-config', JSON.stringify(newConfig));
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('app-settings', JSON.stringify(newSettings));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);
    localStorage.setItem('notification-settings', JSON.stringify(newNotifications));
  };

  return (
    <>
      <AutoPageSEO />
      
      <div className="min-h-screen bg-background text-foreground">
        <PageHeader 
          backLink="/chat" 
          backText="Back to Chat" 
          title="Settings & Configuration"
        />
        <main className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
          <Tabs defaultValue="jarvis" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="jarvis" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Jarvis Mode
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <SettingsIcon className="h-4 w-4" />
                AI Settings
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jarvis" className="mt-6">
              <JarvisSettings 
                config={jarvisConfig}
                onConfigChange={handleJarvisConfigChange}
              />
            </TabsContent>

            <TabsContent value="ai" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Model Configuration</CardTitle>
                  <CardDescription>
                    Choose which AI model to use and configure response behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">AI Model</Label>
                    <Select
                      value={settings.model}
                      onValueChange={(value) => handleSettingsChange({...settings, model: value as any})}
                    >
                      <SelectTrigger id="model">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto (Smart Routing)</SelectItem>
                        <SelectItem value="llama-3.1-70b-versatile">Llama 3.1 70B</SelectItem>
                        <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B</SelectItem>
                        <SelectItem value="gemini-2.0-flash-exp">Gemini 2.0 Flash</SelectItem>
                        <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tone">Response Tone</Label>
                      <Select
                        value={settings.tone}
                        onValueChange={(value) => handleSettingsChange({...settings, tone: value as any})}
                      >
                        <SelectTrigger id="tone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="helpful">Helpful</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technical">Technical Level</Label>
                      <Select
                        value={settings.technicalLevel}
                        onValueChange={(value) => handleSettingsChange({...settings, technicalLevel: value as any})}
                      >
                        <SelectTrigger id="technical">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Speech & Audio
                  </CardTitle>
                  <CardDescription>
                    Configure text-to-speech and audio settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Speech Output</Label>
                      <p className="text-sm text-muted-foreground">
                        Hear AI responses read aloud
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSpeech}
                      onCheckedChange={(checked) => handleSettingsChange({...settings, enableSpeech: checked})}
                    />
                  </div>

                  {settings.enableSpeech && (
                    <div className="space-y-2">
                      <Label htmlFor="voice">Voice Selection</Label>
                      <Select
                        value={settings.voice}
                        onValueChange={(value) => handleSettingsChange({...settings, voice: value as any})}
                      >
                        <SelectTrigger id="voice">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Algenib">Algenib (Female)</SelectItem>
                          <SelectItem value="Achernar">Achernar (Female)</SelectItem>
                          <SelectItem value="Enceladus">Enceladus (Male)</SelectItem>
                          <SelectItem value="Heka">Heka (Male)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Theme & Display</CardTitle>
                  <CardDescription>
                    Customize the visual appearance of CODEEX AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Color Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and improvements
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('emailUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about important events
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for interactions and notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.soundEffects}
                      onCheckedChange={(checked) => handleNotificationChange('soundEffects', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Vibration</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable haptic feedback on mobile devices
                      </p>
                    </div>
                    <Switch
                      checked={notifications.vibration}
                      onCheckedChange={(checked) => handleNotificationChange('vibration', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Reset to Defaults */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Reset Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Restore all settings to their default values
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to reset all settings to defaults?')) {
                    setJarvisConfig(defaultJarvisConfig);
                    setSettings(defaultSettings);
                    setNotifications({
                      emailUpdates: true,
                      pushNotifications: false,
                      soundEffects: true,
                      vibration: true
                    });
                    localStorage.removeItem('jarvis-config');
                    localStorage.removeItem('app-settings');
                    localStorage.removeItem('notification-settings');
                  }
                }}
              >
                Reset to Defaults
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}