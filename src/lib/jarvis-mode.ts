/**
 * Jarvis Mode - Advanced Voice AI Companion
 * Transforms AI from a tool into a voice-driven companion with contextual awareness,
 * emotional tone, and adaptive responses for fluid, human-like conversations.
 */

export interface JarvisConfig {
  wakeWord: string;
  language: string;
  voiceStyle: 'professional' | 'friendly' | 'magical';
  enableWakeWord: boolean;
  enableTTS: boolean;
  voiceSpeed: number;
  voicePitch: number;
  continuousListening: boolean;
  emotionalTone: boolean;
  contextualAwareness: boolean;
}

export interface JarvisState {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  lastInteraction: Date | null;
  conversationContext: string[];
  emotionalState: 'neutral' | 'excited' | 'focused' | 'helpful' | 'magical';
}

export class JarvisMode {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private audioContext: AudioContext | null = null;
  private config: JarvisConfig;
  private state: JarvisState;
  private onTranscript: (text: string) => void;
  private onStateChange: (state: JarvisState) => void;
  private wakeWordDetector: any = null;

  constructor(
    config: JarvisConfig,
    onTranscript: (text: string) => void,
    onStateChange: (state: JarvisState) => void
  ) {
    this.config = config;
    this.onTranscript = onTranscript;
    this.onStateChange = onStateChange;
    this.state = {
      isActive: false,
      isListening: false,
      isSpeaking: false,
      isProcessing: false,
      lastInteraction: null,
      conversationContext: [],
      emotionalState: 'neutral'
    };

    this.initializeJarvis();
  }

  private async initializeJarvis() {
    if (typeof window === 'undefined') return;

    // Initialize Speech Recognition
    const SpeechRecognition = window.webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.setupSpeechRecognition();
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }

    // Initialize Audio Context for sound effects
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext not available:', error);
    }
  }

  private setupSpeechRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = this.config.continuousListening;
    this.recognition.interimResults = true;
    this.recognition.lang = this.config.language;

    this.recognition.onstart = () => {
      this.state.isListening = true;
      this.playJarvisSound('activate');
      this.onStateChange(this.state);
    };

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.processTranscript(finalTranscript);
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Jarvis speech recognition error:', event.error);
        this.playJarvisSound('error');
      }
      this.state.isListening = false;
      this.onStateChange(this.state);
    };

    this.recognition.onend = () => {
      this.state.isListening = false;
      this.onStateChange(this.state);
      
      // Auto-restart if continuous listening is enabled and Jarvis is active
      if (this.state.isActive && this.config.continuousListening && !this.state.isSpeaking) {
        setTimeout(() => this.startListening(), 500);
      }
    };
  }

  private processTranscript(transcript: string) {
    const cleanTranscript = transcript.trim().toLowerCase();
    
    // Check for wake word if enabled
    if (this.config.enableWakeWord && !this.state.isActive) {
      if (cleanTranscript.includes(this.config.wakeWord.toLowerCase())) {
        this.activate();
        // Remove wake word from transcript
        const processedTranscript = cleanTranscript.replace(this.config.wakeWord.toLowerCase(), '').trim();
        if (processedTranscript) {
          this.handleCommand(processedTranscript);
        }
        return;
      }
      return; // Don't process if wake word not detected and Jarvis not active
    }

    // Check for deactivation commands
    if (this.isDeactivationCommand(cleanTranscript)) {
      this.deactivate();
      return;
    }

    this.handleCommand(transcript);
  }

  private async handleCommand(transcript: string) {
    // Update conversation context
    this.state.conversationContext.push(transcript);
    if (this.state.conversationContext.length > 10) {
      this.state.conversationContext.shift();
    }

    // Update emotional state based on transcript
    this.updateEmotionalState(transcript);

    // Update last interaction
    this.state.lastInteraction = new Date();

    // Process with contextual memory if available
    let enhancedTranscript = transcript;
    try {
      const { getMemoryAwareProcessor } = await import('./memory-aware-processor');
      const processor = getMemoryAwareProcessor();
      
      const result = await processor.processMessage({
        message: transcript,
        timestamp: new Date(),
        intent: this.inferIntentFromEmotion(this.state.emotionalState)
      });
      
      // Use enhanced prompt if memory context is available
      if (result.memoryContext) {
        enhancedTranscript = `[Memory Context Available] ${transcript}`;
        // Store the memory context for the AI to use
        (window as any).jarvisMemoryContext = result.memoryContext;
      }
    } catch (error) {
      console.warn('Memory processing failed, using basic transcript:', error);
    }

    // Process the command
    this.onTranscript(this.enhanceTranscriptWithContext(enhancedTranscript));
  }

  private inferIntentFromEmotion(emotion: string): 'planning' | 'troubleshooting' | 'learning' | 'creating' | 'reviewing' | 'general' {
    switch (emotion) {
      case 'focused': return 'planning';
      case 'helpful': return 'troubleshooting';
      case 'excited': return 'creating';
      default: return 'general';
    }
  }

  private enhanceTranscriptWithContext(transcript: string): string {
    if (!this.config.contextualAwareness) return transcript;

    // Add contextual information based on conversation history
    const context = this.state.conversationContext.slice(-3).join(' ');
    const emotionalContext = this.config.emotionalTone ? ` [Emotional tone: ${this.state.emotionalState}]` : '';
    
    return `${transcript}${emotionalContext}`;
  }

  private updateEmotionalState(transcript: string) {
    if (!this.config.emotionalTone) return;

    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes('excited') || lowerTranscript.includes('amazing') || lowerTranscript.includes('wow')) {
      this.state.emotionalState = 'excited';
    } else if (lowerTranscript.includes('help') || lowerTranscript.includes('problem') || lowerTranscript.includes('issue')) {
      this.state.emotionalState = 'helpful';
    } else if (lowerTranscript.includes('focus') || lowerTranscript.includes('concentrate') || lowerTranscript.includes('work')) {
      this.state.emotionalState = 'focused';
    } else if (this.config.voiceStyle === 'magical') {
      this.state.emotionalState = 'magical';
    } else {
      this.state.emotionalState = 'neutral';
    }
  }

  private isDeactivationCommand(transcript: string): boolean {
    const deactivationPhrases = [
      'stop listening',
      'deactivate jarvis',
      'jarvis stop',
      'turn off',
      'goodbye jarvis',
      'sleep mode'
    ];
    
    return deactivationPhrases.some(phrase => transcript.includes(phrase));
  }

  public activate() {
    this.state.isActive = true;
    this.playJarvisSound('activate');
    this.speak(this.getActivationMessage());
    this.onStateChange(this.state);
    
    if (this.config.continuousListening) {
      setTimeout(() => this.startListening(), 1000);
    }
  }

  public deactivate() {
    this.state.isActive = false;
    this.stopListening();
    this.speak(this.getDeactivationMessage());
    this.playJarvisSound('deactivate');
    this.onStateChange(this.state);
  }

  public startListening() {
    if (!this.recognition || this.state.isListening || this.state.isSpeaking) return;
    
    try {
      this.recognition.start();
    } catch (error) {
      console.warn('Could not start speech recognition:', error);
    }
  }

  public stopListening() {
    if (!this.recognition || !this.state.isListening) return;
    
    try {
      this.recognition.stop();
    } catch (error) {
      console.warn('Could not stop speech recognition:', error);
    }
  }

  public speak(text: string) {
    if (!this.synthesis || !this.config.enableTTS) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.config.voiceSpeed;
    utterance.pitch = this.config.voicePitch;
    
    // Select voice based on style
    const voices = this.synthesis.getVoices();
    const preferredVoice = this.selectVoiceByStyle(voices);
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      this.state.isSpeaking = true;
      this.onStateChange(this.state);
    };

    utterance.onend = () => {
      this.state.isSpeaking = false;
      this.onStateChange(this.state);
      
      // Resume listening if continuous mode is enabled
      if (this.state.isActive && this.config.continuousListening) {
        setTimeout(() => this.startListening(), 500);
      }
    };

    utterance.onerror = () => {
      this.state.isSpeaking = false;
      this.onStateChange(this.state);
    };

    this.synthesis.speak(utterance);
  }

  private selectVoiceByStyle(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null;

    // Filter by language first
    const languageVoices = voices.filter(voice => 
      voice.lang.startsWith(this.config.language.split('-')[0])
    );

    const voicesToSearch = languageVoices.length > 0 ? languageVoices : voices;

    switch (this.config.voiceStyle) {
      case 'professional':
        return voicesToSearch.find(voice => 
          voice.name.toLowerCase().includes('professional') ||
          voice.name.toLowerCase().includes('business') ||
          voice.name.toLowerCase().includes('daniel') ||
          voice.name.toLowerCase().includes('alex')
        ) || voicesToSearch[0];
        
      case 'friendly':
        return voicesToSearch.find(voice => 
          voice.name.toLowerCase().includes('friendly') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('susan')
        ) || voicesToSearch[0];
        
      case 'magical':
        return voicesToSearch.find(voice => 
          voice.name.toLowerCase().includes('novelty') ||
          voice.name.toLowerCase().includes('whisper') ||
          voice.name.toLowerCase().includes('ethereal')
        ) || voicesToSearch[0];
        
      default:
        return voicesToSearch[0];
    }
  }

  private getActivationMessage(): string {
    const messages = {
      professional: "Jarvis activated. How may I assist you today?",
      friendly: "Hey there! Jarvis is ready to help. What can I do for you?",
      magical: "✨ Jarvis awakens from the digital realm. Your wish is my command! ✨"
    };
    
    return messages[this.config.voiceStyle];
  }

  private getDeactivationMessage(): string {
    const messages = {
      professional: "Jarvis deactivated. Have a productive day.",
      friendly: "Jarvis going to sleep. Talk to you later!",
      magical: "✨ Jarvis returns to the digital realm. Until we meet again! ✨"
    };
    
    return messages[this.config.voiceStyle];
  }

  private playJarvisSound(type: 'activate' | 'deactivate' | 'error' | 'processing') {
    if (!this.audioContext) return;

    const audioContext = this.audioContext;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'activate':
        // Rising tone sequence
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
        
      case 'deactivate':
        // Falling tone sequence
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
        
      case 'error':
        // Double beep
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
        
      case 'processing':
        // Gentle pulse
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
    }
  }

  public updateConfig(newConfig: Partial<JarvisConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Update speech recognition settings
    if (this.recognition) {
      this.recognition.continuous = this.config.continuousListening;
      this.recognition.lang = this.config.language;
    }
  }

  public getState(): JarvisState {
    return { ...this.state };
  }

  public getConfig(): JarvisConfig {
    return { ...this.config };
  }

  public destroy() {
    this.stopListening();
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}