'use client';

import {useForm, type SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Send, Mic, Square, Sparkles, Brain} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {useEffect, useRef, useState} from 'react';
import {cn} from '@/lib/utils';
import {JarvisMode, type JarvisConfig, type JarvisState} from '@/lib/jarvis-mode';
import {Badge} from '@/components/ui/badge';
import {JarvisButtonAnimation, JarvisOverlayAnimation, type JarvisAnimationState} from './jarvis-animations';

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type ChatFormValues = z.infer<typeof chatSchema>;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onAIResponse?: (response: string) => void;
  onOpenMemoryManager?: () => void;
}

export function ChatInput({onSendMessage, isLoading, onAIResponse, onOpenMemoryManager}: ChatInputProps) {
  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: '',
    },
  });

  // Jarvis Mode state
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
  const [jarvisConfig] = useState<JarvisConfig>({
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
  });

  // Animation states
  const [showActivationOverlay, setShowActivationOverlay] = useState(false);
  const [overlayState, setOverlayState] = useState<'activating' | 'deactivating'>('activating');

  // Legacy voice chat state (for backward compatibility)
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = () => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.2
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  // Initialize Jarvis Mode
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const jarvis = new JarvisMode(
      jarvisConfig,
      (transcript: string) => {
        // Handle transcript from Jarvis
        onSendMessage(transcript);
        form.setValue('message', transcript);
      },
      (state: JarvisState) => {
        // Update Jarvis state
        setJarvisState(state);
        setIsListening(state.isListening);
      }
    );

    setJarvisMode(jarvis);

    return () => {
      jarvis.destroy();
    };
  }, [jarvisConfig, onSendMessage, form]);

  // Handle AI responses for TTS
  useEffect(() => {
    if (jarvisMode && jarvisState.isActive && jarvisConfig.enableTTS && onAIResponse) {
      // This would be called when AI responds - you'll need to wire this up
      // For now, we'll just set up the infrastructure
    }
  }, [jarvisMode, jarvisState.isActive, jarvisConfig.enableTTS, onAIResponse]);

  // Legacy speech recognition setup (for backward compatibility)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const SpeechRecognition =
      window.webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported by this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      playSound();
      setIsListening(true);
    };

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        onSendMessage(transcript);
      }
    };

    recognition.onerror = event => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognitionRef.current?.abort();
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, [onSendMessage]);

  useEffect(() => {
    if (isVoiceChatActive && !isLoading && !isListening) {
      // Only start if recognition exists and is not already running
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Only log if it's not the expected "already started" error
          if (e instanceof Error && !e.message.includes('already')) {
            console.error('Speech recognition error:', e);
          }
        }
      }
    } else if (!isVoiceChatActive || isLoading) {
      // Safely abort if recognition is active
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore abort errors
        }
      }
    }
  }, [isVoiceChatActive, isLoading, isListening]);

  // Get current animation state
  const getJarvisAnimationState = (): JarvisAnimationState => {
    if (!jarvisState.isActive) return 'idle';
    if (jarvisState.isListening) return 'listening';
    if (jarvisState.isSpeaking) return 'speaking';
    if (jarvisState.isProcessing) return 'processing';
    return 'idle';
  };

  // Jarvis Mode controls
  const toggleJarvisMode = () => {
    if (!jarvisMode) return;
    
    if (jarvisState.isActive) {
      setOverlayState('deactivating');
      setShowActivationOverlay(true);
      setTimeout(() => {
        jarvisMode.deactivate();
      }, 500);
    } else {
      setOverlayState('activating');
      setShowActivationOverlay(true);
      setTimeout(() => {
        jarvisMode.activate();
      }, 500);
    }
  };

  const startJarvisListening = () => {
    if (!jarvisMode || jarvisState.isListening) return;
    jarvisMode.startListening();
  };

  const stopJarvisListening = () => {
    if (!jarvisMode || !jarvisState.isListening) return;
    jarvisMode.stopListening();
  };

  // Legacy voice controls
  const handleVoiceButtonClick = () => {
    setIsVoiceChatActive(prev => !prev);
  };

  const onSubmit: SubmitHandler<ChatFormValues> = data => {
    onSendMessage(data.message);
    form.reset();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex w-full items-start gap-2"
      >
        <FormField
          control={form.control}
          name="message"
          render={({field}) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder={
                      jarvisState.isActive
                        ? jarvisState.isListening
                          ? 'Jarvis is listening...'
                          : jarvisState.isSpeaking
                          ? 'Jarvis is speaking...'
                          : 'Jarvis Mode active - Say something or type...'
                        : isVoiceChatActive
                        ? 'Voice chat is active...'
                        : 'Ask me anything...'
                    }
                    rows={1}
                    className={cn(
                      'max-h-36 resize-none pr-32 text-sm md:text-base py-3 md:py-4 pl-4 rounded-2xl',
                      'border-2 focus-visible:ring-2 focus-visible:ring-primary/20',
                      'transition-all duration-200',
                      jarvisState.isActive && 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20',
                      isVoiceChatActive && !jarvisState.isActive && 'border-destructive',
                      jarvisState.isListening && 'animate-pulse'
                    )}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || isVoiceChatActive || (jarvisState.isActive && jarvisState.isListening)}
                    {...field}
                  />
                  
                  {/* Jarvis Status Badge */}
                  {jarvisState.isActive && (
                    <div className="absolute left-3 top-1 flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Jarvis {jarvisState.emotionalState}
                      </Badge>
                    </div>
                  )}

                  <div className="absolute right-2 top-2 flex gap-1">
                    {/* Memory Manager Button */}
                    {onOpenMemoryManager && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-xl transition-all"
                        onClick={onOpenMemoryManager}
                        title="Open Memory Manager"
                      >
                        <Brain className="h-4 w-4" />
                        <span className="sr-only">Memory Manager</span>
                      </Button>
                    )}

                    {/* Jarvis Mode Controls */}
                    {jarvisMode && (
                      <>
                        <Button
                          type="button"
                          size="icon"
                          variant={jarvisState.isActive ? 'default' : 'ghost'}
                          className={cn(
                            'h-9 w-9 rounded-xl transition-all relative overflow-hidden',
                            jarvisState.isActive && 'bg-purple-600 hover:bg-purple-700 text-white'
                          )}
                          onClick={toggleJarvisMode}
                          title={jarvisState.isActive ? 'Deactivate Jarvis Mode' : 'Activate Jarvis Mode'}
                        >
                          <JarvisButtonAnimation 
                            state={getJarvisAnimationState()} 
                            size="md"
                            className="absolute inset-0"
                          />
                          <span className="sr-only">
                            {jarvisState.isActive ? 'Deactivate Jarvis' : 'Activate Jarvis'}
                          </span>
                        </Button>

                        {/* Manual Listen/Stop Controls for Jarvis */}
                        {jarvisState.isActive && (
                          <Button
                            type="button"
                            size="icon"
                            variant={jarvisState.isListening ? 'destructive' : 'ghost'}
                            className={cn(
                              'h-9 w-9 rounded-xl transition-all relative overflow-hidden',
                              jarvisState.isListening && 'bg-red-600 hover:bg-red-700 text-white'
                            )}
                            onClick={jarvisState.isListening ? stopJarvisListening : startJarvisListening}
                            disabled={jarvisState.isSpeaking}
                            title={jarvisState.isListening ? 'Stop Listening' : 'Start Listening'}
                          >
                            {jarvisState.isListening ? (
                              <Square className="h-4 w-4" />
                            ) : (
                              <Mic className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {jarvisState.isListening ? 'Stop listening' : 'Start listening'}
                            </span>
                          </Button>
                        )}
                      </>
                    )}

                    {/* Legacy Voice Chat Button (when Jarvis is not active) */}
                    {!jarvisState.isActive && (
                      <Button
                        type="button"
                        size="icon"
                        variant={isVoiceChatActive ? 'destructive' : 'ghost'}
                        className={cn(
                          'h-9 w-9 rounded-xl transition-all',
                          isListening && 'animate-pulse scale-110'
                        )}
                        disabled={!recognitionRef.current}
                        onClick={handleVoiceButtonClick}
                        aria-pressed={isVoiceChatActive}
                        title="Simple Voice Chat"
                      >
                        <Mic className="h-4 w-4" />
                        <span className="sr-only">
                          {isVoiceChatActive ? 'Stop voice chat' : 'Start voice chat'}
                        </span>
                      </Button>
                    )}

                    <Button
                      type="submit"
                      size="icon"
                      className="h-9 w-9 rounded-xl shadow-sm"
                      disabled={isLoading || !form.formState.isValid || isVoiceChatActive || jarvisState.isListening}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>

      {/* Jarvis Activation/Deactivation Overlay */}
      <JarvisOverlayAnimation
        isVisible={showActivationOverlay}
        state={overlayState}
        onComplete={() => setShowActivationOverlay(false)}
      />
    </Form>
  );
}