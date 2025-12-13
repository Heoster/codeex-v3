'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  duration?: number;
}

/**
 * Typing indicator that mimics AI response streaming
 * Shows animated dots to indicate ongoing response generation
 */
export function TypingIndicator({ duration = 600 }: TypingIndicatorProps) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const sequence = ['▌', '▌▌', '▌▌▌', '▌▌', '▌', ''];
    let index = 0;

    const interval = setInterval(() => {
      setDisplayText(sequence[index]);
      index = (index + 1) % sequence.length;
    }, duration / sequence.length);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <span className="inline-block font-semibold text-primary/80 w-6 animate-pulse">
      {displayText}
    </span>
  );
}

/**
 * Streaming response indicator
 * Shows that response is being streamed
 */
export function StreamingIndicator() {
  return (
    <div className="flex items-center gap-1.5 animate-pulse">
      <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0s' }} />
      <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }} />
      <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.4s' }} />
    </div>
  );
}

/**
 * Thinking dots with wave effect
 */
export function ThinkingWave() {
  return (
    <div className="flex items-center gap-1">
      <div
        className="h-2 w-2 rounded-full bg-primary/70"
        style={{
          animation: 'think-blink 1.5s ease-in-out infinite',
          animationDelay: '0s',
        }}
      />
      <div
        className="h-2 w-2 rounded-full bg-primary/70"
        style={{
          animation: 'think-blink 1.5s ease-in-out infinite',
          animationDelay: '0.2s',
        }}
      />
      <div
        className="h-2 w-2 rounded-full bg-primary/70"
        style={{
          animation: 'think-blink 1.5s ease-in-out infinite',
          animationDelay: '0.4s',
        }}
      />
    </div>
  );
}
