'use client';

import {useState, useEffect} from 'react';
import {User, Copy, Check, Volume2, VolumeX, Trash2, MoreHorizontal} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {type Message} from '@/lib/types';
import {useAuth} from '@/hooks/use-auth';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {formatDistanceToNow} from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {MessageAttribution} from './message-attribution';
import {Button} from '@/components/ui/button';
import {createEnhancedTTS} from '@/lib/enhanced-tts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatMessageProps {
  message: Message;
  onDelete?: (messageId: string) => void;
}

export function ChatMessage({message, onDelete}: ChatMessageProps) {
  const {user} = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tts, setTTS] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Initialize TTS for this message
    if (message.role === 'assistant') {
      const enhancedTTS = createEnhancedTTS('en-US', 'friendly', setIsSpeaking);
      setTTS(enhancedTTS);
      
      return () => {
        enhancedTTS.destroy();
      };
    }
  }, [message.role]);

  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = async () => {
    if (!tts) return;
    
    if (isSpeaking) {
      tts.stop();
      return;
    }

    // Clean the text for better speech
    const cleanText = message.content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
      .replace(/`(.*?)`/g, '$1') // Remove code backticks
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .replace(/\n+/g, '. ') // Convert newlines to pauses
      .trim();

    try {
      await tts.speak(cleanText);
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && message.id) {
      onDelete(message.id);
    }
  };

  if (!isMounted) {
    return null;
  }
  
  const displayTimestamp = message.createdAt
  ? formatDistanceToNow(new Date(message.createdAt), {addSuffix: true})
  : '';

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn(
          'group flex items-start gap-3 md:gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out',
          !isAssistant && 'flex-row-reverse'
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar
              className={cn(
                'h-8 w-8 md:h-10 md:w-10 shrink-0 ring-2 ring-offset-2 ring-offset-background transition-all',
                isAssistant ? 'bg-primary ring-primary/20' : 'bg-accent ring-accent/20'
              )}
            >
              {isAssistant ? (
                <>
                  <AvatarImage src="/favicon.ico" alt="CODEEX AI" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    C
                  </AvatarFallback>
                </>
              ) : (
                <>
                  <AvatarImage
                    src={user?.photoURL ?? ''}
                    alt={user?.displayName ?? 'User'}
                  />
                  <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                    {user?.displayName ? (
                      user.displayName.charAt(0).toUpperCase()
                    ) : (
                      <User size={20} />
                    )}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side={isAssistant ? 'right' : 'left'}>
            <p>{isAssistant ? 'CODEEX AI' : user?.displayName ?? 'You'}</p>
          </TooltipContent>
        </Tooltip>

        <div className={cn('flex flex-col gap-2 max-w-[85%] md:max-w-[80%]', !isAssistant && 'items-end')}>
          <div
            className={cn(
              'relative rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md',
              isAssistant
                ? 'bg-muted text-foreground rounded-tl-sm'
                : 'bg-primary text-primary-foreground rounded-tr-sm'
            )}
          >
            <div className={cn(
              'prose prose-sm dark:prose-invert max-w-none',
              'prose-p:my-1 prose-p:leading-relaxed',
              'prose-pre:my-2 prose-pre:bg-background/50 prose-pre:border',
              'prose-code:text-sm prose-code:bg-background/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
              'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
              'prose-headings:mt-3 prose-headings:mb-2',
              'prose-ul:my-2 prose-ol:my-2',
              !isAssistant && 'prose-invert'
            )}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                components={{
                  a: ({node, ...props}) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {isAssistant && (
              <div className="mt-2">
                <MessageAttribution
                  modelUsed={message.modelUsed}
                  modelCategory={message.modelCategory}
                  autoRouted={message.autoRouted}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={cn(
            'flex items-center gap-1 mt-2',
            !isAssistant && 'justify-end'
          )}>
            {displayTimestamp && (
              <span className="text-xs text-muted-foreground px-2 mr-auto">
                {displayTimestamp}
              </span>
            )}
            
            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
              {/* Copy Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs hover:bg-muted/80"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 mr-1 text-green-500" />
                        <span className="text-green-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy message to clipboard</p>
                </TooltipContent>
              </Tooltip>

              {/* Text-to-Speech Button (AI messages only) */}
              {isAssistant && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-7 px-2 text-xs hover:bg-muted/80",
                        isSpeaking && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      )}
                      onClick={handleSpeak}
                      disabled={!tts}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="h-3 w-3 mr-1" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3 w-3 mr-1" />
                          <span>Hear</span>
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isSpeaking ? 'Stop speaking' : 'Read message aloud'}</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* More Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs hover:bg-muted/80"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={handleCopy}
                    className="text-xs"
                  >
                    <Copy className="h-3 w-3 mr-2" />
                    Copy text
                  </DropdownMenuItem>
                  
                  {isAssistant && (
                    <DropdownMenuItem
                      onClick={handleSpeak}
                      className="text-xs"
                      disabled={!tts}
                    >
                      <Volume2 className="h-3 w-3 mr-2" />
                      {isSpeaking ? 'Stop speaking' : 'Read aloud'}
                    </DropdownMenuItem>
                  )}
                  
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-xs text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete message
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

