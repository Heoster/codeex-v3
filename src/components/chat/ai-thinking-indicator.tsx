'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Loader2, Sparkles } from 'lucide-react';

interface AIThinkingIndicatorProps {
  variant?: 'default' | 'compact' | 'minimal';
  showThinkingText?: boolean;
}

export function AIThinkingIndicator({
  variant = 'default',
  showThinkingText = true,
}: AIThinkingIndicatorProps) {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div className="flex gap-1.5">
          <div
            className="h-2 w-2 rounded-full bg-primary/60 animate-pulse"
            style={{ animationDelay: '0s' }}
          />
          <div
            className="h-2 w-2 rounded-full bg-primary/60 animate-pulse"
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className="h-2 w-2 rounded-full bg-primary/60 animate-pulse"
            style={{ animationDelay: '0.4s' }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-background bg-primary">
          <AvatarImage src="/favicon.ico" alt="CODEEX AI" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5 animate-spin" />
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">
            {showThinkingText ? 'Thinking' : 'Processing'}
          </span>
          <div className="flex gap-1">
            <div
              className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse"
              style={{ animationDelay: '0s' }}
            />
            <div
              className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default variant with full thinking animation
  return (
    <div className="flex items-start gap-3 md:gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <Avatar className="h-8 w-8 md:h-10 md:w-10 shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-background bg-primary">
        <AvatarImage src="/favicon.ico" alt="CODEEX AI" />
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-3 pt-1 max-w-[85%] md:max-w-[80%]">
        {/* Header with thinking indicator */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary/70 animate-pulse" />
          <span className="text-sm font-semibold text-muted-foreground">
            CODEEX AI is thinking
          </span>
        </div>

        {/* Animated skeleton lines */}
        <div className="rounded-2xl bg-muted/40 p-4 space-y-3">
          <div className="space-y-2">
            <div className="h-3 w-3/4 rounded bg-muted/60 animate-pulse" />
            <div className="h-3 w-full rounded bg-muted/60 animate-pulse [animation-delay:0.1s]" />
            <div className="h-3 w-5/6 rounded bg-muted/60 animate-pulse [animation-delay:0.2s]" />
          </div>

          {/* Advanced loading indicator */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full bg-primary/50 animate-bounce"
                style={{ animationDelay: '0s', animationDuration: '1.4s' }}
              />
              <div
                className="h-2.5 w-2.5 rounded-full bg-primary/50 animate-bounce"
                style={{ animationDelay: '0.2s', animationDuration: '1.4s' }}
              />
              <div
                className="h-2.5 w-2.5 rounded-full bg-primary/50 animate-bounce"
                style={{ animationDelay: '0.4s', animationDuration: '1.4s' }}
              />
            </div>
            <span className="text-xs text-muted-foreground/70">Processing your request...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
