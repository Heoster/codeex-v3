/**
 * Enhanced Text-to-Speech System
 * Provides realistic, smooth, and natural-sounding speech synthesis
 * with advanced voice selection, SSML support, and emotional expression
 */

export interface EnhancedTTSConfig {
  language: string;
  voiceStyle: 'professional' | 'friendly' | 'magical' | 'natural';
  speed: number; // 0.1 to 10
  pitch: number; // 0 to 2
  volume: number; // 0 to 1
  emotionalTone: boolean;
  useSSML: boolean;
  naturalPauses: boolean;
  voiceEnhancement: boolean;
}

export interface VoiceProfile {
  voice: SpeechSynthesisVoice;
  quality: number;
  naturalness: number;
  clarity: number;
  style: string;
}

export class EnhancedTTS {
  private synthesis: SpeechSynthesis | null = null;
  private config: EnhancedTTSConfig;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private voiceProfiles: VoiceProfile[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChange: (isSpeaking: boolean) => void;
  private audioContext: AudioContext | null = null;

  constructor(config: EnhancedTTSConfig, onStateChange: (isSpeaking: boolean) => void) {
    this.config = config;
    this.onStateChange = onStateChange;
    this.initializeTTS();
  }

  private async initializeTTS() {
    if (typeof window === 'undefined') return;

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      
      // Wait for voices to load
      await this.loadVoices();
      this.analyzeVoices();
    }

    // Initialize Audio Context for voice enhancement
    if (this.config.voiceEnhancement) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('AudioContext not available for voice enhancement:', error);
      }
    }
  }

  private async loadVoices(): Promise<void> {
    return new Promise((resolve) => {
      const loadVoicesWhenAvailable = () => {
        this.availableVoices = this.synthesis?.getVoices() || [];
        if (this.availableVoices.length > 0) {
          resolve();
        } else {
          // Voices might not be loaded yet, try again
          setTimeout(loadVoicesWhenAvailable, 100);
        }
      };

      if (this.synthesis) {
        this.synthesis.onvoiceschanged = loadVoicesWhenAvailable;
        loadVoicesWhenAvailable();
      } else {
        resolve();
      }
    });
  }

  private analyzeVoices() {
    this.voiceProfiles = this.availableVoices.map(voice => {
      const profile: VoiceProfile = {
        voice,
        quality: this.calculateVoiceQuality(voice),
        naturalness: this.calculateNaturalness(voice),
        clarity: this.calculateClarity(voice),
        style: this.determineVoiceStyle(voice)
      };
      return profile;
    });

    // Sort by overall quality
    this.voiceProfiles.sort((a, b) => 
      (b.quality + b.naturalness + b.clarity) - (a.quality + a.naturalness + a.clarity)
    );
  }

  private calculateVoiceQuality(voice: SpeechSynthesisVoice): number {
    let quality = 50; // Base quality

    // Prefer neural/premium voices
    if (voice.name.toLowerCase().includes('neural')) quality += 30;
    if (voice.name.toLowerCase().includes('premium')) quality += 25;
    if (voice.name.toLowerCase().includes('enhanced')) quality += 20;
    
    // Platform-specific high-quality voices
    if (voice.name.toLowerCase().includes('samantha')) quality += 25; // macOS
    if (voice.name.toLowerCase().includes('alex')) quality += 20; // macOS
    if (voice.name.toLowerCase().includes('zira')) quality += 15; // Windows
    if (voice.name.toLowerCase().includes('david')) quality += 15; // Windows
    
    // Prefer local voices over remote
    if (voice.localService) quality += 10;
    
    return Math.min(quality, 100);
  }

  private calculateNaturalness(voice: SpeechSynthesisVoice): number {
    let naturalness = 50;

    // Natural-sounding voice indicators
    const naturalKeywords = ['natural', 'human', 'realistic', 'expressive', 'conversational'];
    naturalKeywords.forEach(keyword => {
      if (voice.name.toLowerCase().includes(keyword)) naturalness += 15;
    });

    // Gender-specific adjustments for naturalness
    if (voice.name.toLowerCase().includes('female')) naturalness += 5;
    if (voice.name.toLowerCase().includes('male')) naturalness += 5;

    return Math.min(naturalness, 100);
  }

  private calculateClarity(voice: SpeechSynthesisVoice): number {
    let clarity = 50;

    // Clear voice indicators
    const clarityKeywords = ['clear', 'crisp', 'articulate', 'professional'];
    clarityKeywords.forEach(keyword => {
      if (voice.name.toLowerCase().includes(keyword)) clarity += 15;
    });

    return Math.min(clarity, 100);
  }

  private determineVoiceStyle(voice: SpeechSynthesisVoice): string {
    const name = voice.name.toLowerCase();
    
    if (name.includes('professional') || name.includes('business') || name.includes('corporate')) {
      return 'professional';
    }
    if (name.includes('friendly') || name.includes('warm') || name.includes('casual')) {
      return 'friendly';
    }
    if (name.includes('mystical') || name.includes('ethereal') || name.includes('magical')) {
      return 'magical';
    }
    
    return 'natural';
  }

  private selectOptimalVoice(): SpeechSynthesisVoice | null {
    if (this.voiceProfiles.length === 0) return null;

    // Filter by language
    const languageCode = this.config.language.split('-')[0];
    const languageVoices = this.voiceProfiles.filter(profile => 
      profile.voice.lang.startsWith(languageCode)
    );

    const voicesToSearch = languageVoices.length > 0 ? languageVoices : this.voiceProfiles;

    // Find best voice for the requested style
    const styleVoices = voicesToSearch.filter(profile => 
      profile.style === this.config.voiceStyle || profile.style === 'natural'
    );

    const finalVoices = styleVoices.length > 0 ? styleVoices : voicesToSearch;

    // Return the highest quality voice
    return finalVoices[0]?.voice || null;
  }

  private preprocessText(text: string): string {
    if (!this.config.naturalPauses && !this.config.useSSML) return text;

    let processedText = text;

    if (this.config.naturalPauses) {
      // Add natural pauses for better speech flow
      processedText = processedText
        .replace(/\. /g, '. <break time="500ms"/> ')
        .replace(/\? /g, '? <break time="600ms"/> ')
        .replace(/! /g, '! <break time="600ms"/> ')
        .replace(/; /g, '; <break time="300ms"/> ')
        .replace(/, /g, ', <break time="200ms"/> ')
        .replace(/: /g, ': <break time="300ms"/> ');
    }

    if (this.config.useSSML && this.config.emotionalTone) {
      // Add emotional expression through SSML-like markup
      processedText = this.addEmotionalExpression(processedText);
    }

    return processedText;
  }

  private addEmotionalExpression(text: string): string {
    // Add emphasis and emotional tone based on content
    let expressiveText = text;

    // Excitement and enthusiasm
    expressiveText = expressiveText.replace(
      /\b(amazing|awesome|fantastic|incredible|wonderful|excellent)\b/gi,
      '<emphasis level="strong">$1</emphasis>'
    );

    // Important information
    expressiveText = expressiveText.replace(
      /\b(important|critical|essential|key|vital)\b/gi,
      '<emphasis level="moderate">$1</emphasis>'
    );

    // Questions - add rising intonation
    expressiveText = expressiveText.replace(
      /([^.!?]*\?)/g,
      '<prosody pitch="+10%">$1</prosody>'
    );

    return expressiveText;
  }

  private createEnhancedUtterance(text: string): SpeechSynthesisUtterance {
    const processedText = this.preprocessText(text);
    const utterance = new SpeechSynthesisUtterance(processedText);

    // Apply configuration
    utterance.rate = this.config.speed;
    utterance.pitch = this.config.pitch;
    utterance.volume = this.config.volume;

    // Select optimal voice
    const selectedVoice = this.selectOptimalVoice();
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Add event handlers
    utterance.onstart = () => {
      this.onStateChange(true);
    };

    utterance.onend = () => {
      this.onStateChange(false);
      this.currentUtterance = null;
    };

    utterance.onerror = (event) => {
      console.warn('TTS Error:', event.error);
      this.onStateChange(false);
      this.currentUtterance = null;
    };

    utterance.onpause = () => {
      // Handle pause events
    };

    utterance.onresume = () => {
      // Handle resume events
    };

    return utterance;
  }

  public async speak(text: string): Promise<void> {
    if (!this.synthesis || !text.trim()) return;

    // Stop any current speech
    this.stop();

    // Create enhanced utterance
    this.currentUtterance = this.createEnhancedUtterance(text);

    // Speak with error handling
    try {
      this.synthesis.speak(this.currentUtterance);
    } catch (error) {
      console.error('TTS Speak Error:', error);
      this.onStateChange(false);
    }
  }

  public pause(): void {
    if (this.synthesis && this.currentUtterance) {
      this.synthesis.pause();
    }
  }

  public resume(): void {
    if (this.synthesis && this.currentUtterance) {
      this.synthesis.resume();
    }
  }

  public stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    if (this.currentUtterance) {
      this.currentUtterance = null;
    }
    this.onStateChange(false);
  }

  public updateConfig(newConfig: Partial<EnhancedTTSConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Re-analyze voices if style changed
    if (newConfig.voiceStyle) {
      this.analyzeVoices();
    }
  }

  public getAvailableVoices(): VoiceProfile[] {
    return [...this.voiceProfiles];
  }

  public getConfig(): EnhancedTTSConfig {
    return { ...this.config };
  }

  public isSpeaking(): boolean {
    return this.synthesis?.speaking || false;
  }

  public isPaused(): boolean {
    return this.synthesis?.pending || false;
  }

  public destroy(): void {
    this.stop();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

// Utility function to create enhanced TTS with optimal settings
export function createEnhancedTTS(
  language: string = 'en-US',
  voiceStyle: 'professional' | 'friendly' | 'magical' | 'natural' = 'natural',
  onStateChange: (isSpeaking: boolean) => void
): EnhancedTTS {
  const config: EnhancedTTSConfig = {
    language,
    voiceStyle,
    speed: 0.9, // Slightly slower for clarity
    pitch: 1.0,
    volume: 0.8,
    emotionalTone: true,
    useSSML: true,
    naturalPauses: true,
    voiceEnhancement: true
  };

  return new EnhancedTTS(config, onStateChange);
}