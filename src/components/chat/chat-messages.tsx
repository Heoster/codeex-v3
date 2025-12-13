'use client';

import {useEffect, useRef} from 'react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {cn} from '@/lib/utils';
import {type Message} from '@/lib/types';
import {ChatMessage} from './chat-message';
import {AIThinkingIndicator} from './ai-thinking-indicator';

interface ChatMessagesProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: Message[];
  isLoading?: boolean;
  header?: React.ReactNode;
}

export function ChatMessages({
  messages,
  isLoading,
  className,
  header,
}: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className={cn('w-full', className)} ref={scrollAreaRef}>
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8" ref={viewportRef}>
        {header}
        <div className="space-y-6 md:space-y-8">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <AIThinkingIndicator variant="default" showThinkingText={true} />
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
