'use client';

import {type Chat, type Settings, type Message} from '@/lib/types';
import {ChatInput} from './chat-input';
import {ChatMessages} from './chat-messages';
import {ExamplePrompts} from './example-prompts';
import {MemoryManager} from '@/components/memory-manager';
import {useState, useRef, useEffect, useCallback} from 'react';
import {generateResponse} from '@/app/actions';
import {useAuth} from '@/hooks/use-auth';
import {EnhancedTTS, createEnhancedTTS} from '@/lib/enhanced-tts';

interface ChatPanelProps {
  chat: Chat;
  settings: Settings;
  messages: Message[];
  addMessage: (
    chatId: string,
    message: Omit<Message, 'id' | 'createdAt'>,
    newTitle?: string
  ) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
}

export function ChatPanel({
  chat,
  settings,
  messages,
  addMessage,
  deleteMessage,
}: ChatPanelProps) {
  const [isLoadingFromAI, setIsLoadingFromAI] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [showMemoryManager, setShowMemoryManager] = useState(false);
  const [enhancedTTS, setEnhancedTTS] = useState<EnhancedTTS | null>(null);
  const {user} = useAuth();

  // Initialize Enhanced TTS
  useEffect(() => {
    if (settings.enableSpeech) {
      const tts = createEnhancedTTS('en-US', 'friendly', setIsSpeaking);
      setEnhancedTTS(tts);
      
      return () => {
        tts.destroy();
      };
    }
  }, [settings.enableSpeech]);

  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const isLoading = isLoadingFromAI || isSpeaking;
  
  // Rate limiting: minimum 2 seconds between requests
  const MIN_REQUEST_INTERVAL = 2000;

  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      deleteMessage(chat.id, messageId);
    },
    [deleteMessage, chat.id]
  );

  const handleSendMessage = useCallback(
    async (messageContent: string) => {
      if (isLoading) return;
      
      // Rate limiting check
      const now = Date.now();
      if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
        console.warn('Rate limit: Please wait before sending another message');
        return;
      }
      setLastRequestTime(now);
      
      setIsLoadingFromAI(true);

      const isNewChat = messages.length <= 1;
      const newTitle = isNewChat
        ? messageContent.substring(0, 30) +
          (messageContent.length > 30 ? '...' : '')
        : undefined;

      addMessage(
        chat.id,
        {role: 'user', content: messageContent},
        newTitle
      );

      // We map the full message history to the simplified format expected by the AI flow.
      // This ensures we only send the `role` and `content`, preventing validation errors.
      // Filter out any leading assistant messages (like the welcome greeting) since
      // Google's API requires the conversation to start with a user message.
      const historyMessages = messages.map(({role, content}) => ({role, content}));
      const firstUserIndex = historyMessages.findIndex(m => m.role === 'user');
      const filteredHistory = firstUserIndex >= 0 
        ? historyMessages.slice(firstUserIndex) 
        : [];
      
      const updatedHistory = [
        ...filteredHistory,
        {role: 'user' as const, content: messageContent},
      ];

      const response = await generateResponse({
        message: messageContent,
        history: updatedHistory,
        settings: settingsRef.current,
      });

      let assistantContent = '';
      if (!response) {
        assistantContent = 'Sorry, I encountered an error processing your request. Please try again.';
        addMessage(chat.id, {role: 'assistant', content: assistantContent});
      } else if ('error' in response) {
        assistantContent = response.error;
        addMessage(chat.id, {role: 'assistant', content: assistantContent});
      } else {
        assistantContent = response.content;
        addMessage(chat.id, {
          role: 'assistant', 
          content: assistantContent,
          modelUsed: response.modelUsed,
          autoRouted: response.autoRouted,
        });
      }
      setIsLoadingFromAI(false);

      // Enhanced TTS for AI responses
      if (settingsRef.current.enableSpeech && assistantContent && enhancedTTS) {
        try {
          // Clean the text for better speech
          const cleanText = assistantContent
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
            .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
            .replace(/`(.*?)`/g, '$1') // Remove code backticks
            .replace(/#{1,6}\s/g, '') // Remove markdown headers
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
            .replace(/\n+/g, '. ') // Convert newlines to pauses
            .trim();

          await enhancedTTS.speak(cleanText);
        } catch (error) {
          console.error('Enhanced TTS error:', error);
          setIsSpeaking(false);
        }
      }
    },
    [isLoading, messages, addMessage, chat.id, lastRequestTime, enhancedTTS]
  );

  useEffect(() => {
    // Load voices when they're available
    if (typeof window !== 'undefined') {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Wait for voices to load
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  const greetingHeader =
    messages.length <= 1 ? (
      <div className="mb-8 flex flex-col items-center justify-center gap-4 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <h1 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Hello{user ? `, ${user.displayName?.split(' ')[0]}` : ''}!
          </h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base max-w-md">
          How can I assist you today? Ask me anything or try one of the examples below.
        </p>
      </div>
    ) : null;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <ChatMessages
        messages={messages}
        isLoading={isLoadingFromAI}
        className="flex-1"
        header={greetingHeader}
        onDeleteMessage={handleDeleteMessage}
      />

      {messages.length <= 1 && (
        <div className="px-4 pb-4">
          <ExamplePrompts onSendMessage={handleSendMessage} />
        </div>
      )}

      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            onOpenMemoryManager={() => setShowMemoryManager(true)}
          />
          
          {/* TTS Controls */}
          {isSpeaking && enhancedTTS && (
            <div className="flex items-center justify-center gap-2 p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                AI is speaking...
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => enhancedTTS.pause()}
                  className="px-2 py-1 text-xs bg-background rounded hover:bg-muted transition-colors"
                >
                  Pause
                </button>
                <button
                  onClick={() => enhancedTTS.resume()}
                  className="px-2 py-1 text-xs bg-background rounded hover:bg-muted transition-colors"
                >
                  Resume
                </button>
                <button
                  onClick={() => enhancedTTS.stop()}
                  className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
                >
                  Stop
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <p className="hidden sm:block">
              Try commands like{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
                /solve
              </code>{' '}
              or{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
                /summarize
              </code>
            </p>
            <span className="hidden sm:block">•</span>
            <p>CodeEx powered by Heoster</p>
          </div>
        </div>
      </div>

      {/* Memory Manager Modal */}
      {showMemoryManager && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-4 z-50 overflow-auto rounded-lg border bg-background shadow-lg">
            <MemoryManager onClose={() => setShowMemoryManager(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
