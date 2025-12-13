'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Mic, Square, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type JarvisAnimationState = 
  | 'idle' 
  | 'activating' 
  | 'listening' 
  | 'processing' 
  | 'speaking' 
  | 'error' 
  | 'success' 
  | 'deactivating';

interface JarvisAnimationsProps {
  state: JarvisAnimationState;
  audioLevel?: number; // 0-1 for voice visualization
  className?: string;
}

export function JarvisAnimations({ state, audioLevel = 0, className }: JarvisAnimationsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Main Orb Container */}
      <div className="relative">
        {/* Background Glow */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-500",
            state === 'idle' && "bg-purple-500/10 scale-100",
            state === 'activating' && "bg-purple-500/30 scale-110 animate-pulse",
            state === 'listening' && "bg-blue-500/30 scale-110",
            state === 'processing' && "bg-yellow-500/30 scale-105",
            state === 'speaking' && "bg-green-500/30 scale-110",
            state === 'error' && "bg-red-500/30 scale-105",
            state === 'success' && "bg-green-500/30 scale-105",
            state === 'deactivating' && "bg-purple-500/20 scale-95"
          )}
        />

        {/* Pulsing Rings */}
        {(state === 'listening' || state === 'speaking') && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-current opacity-30 animate-ping" />
            <div className="absolute inset-0 rounded-full border border-current opacity-20 animate-ping animation-delay-200" />
            <div className="absolute inset-0 rounded-full border border-current opacity-10 animate-ping animation-delay-400" />
          </>
        )}

        {/* Main Orb */}
        <div 
          className={cn(
            "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
            "border-2 backdrop-blur-sm",
            state === 'idle' && "bg-purple-500/20 border-purple-500/30 text-purple-400",
            state === 'activating' && "bg-purple-500/40 border-purple-500/60 text-purple-300 scale-110",
            state === 'listening' && "bg-blue-500/40 border-blue-500/60 text-blue-300 scale-110",
            state === 'processing' && "bg-yellow-500/40 border-yellow-500/60 text-yellow-300",
            state === 'speaking' && "bg-green-500/40 border-green-500/60 text-green-300 scale-110",
            state === 'error' && "bg-red-500/40 border-red-500/60 text-red-300",
            state === 'success' && "bg-green-500/40 border-green-500/60 text-green-300",
            state === 'deactivating' && "bg-purple-500/20 border-purple-500/30 text-purple-400 scale-95"
          )}
        >
          {/* Icon based on state */}
          {state === 'idle' && <Sparkles className="h-6 w-6" />}
          {state === 'activating' && <Sparkles className="h-6 w-6 animate-spin" />}
          {state === 'listening' && <Mic className="h-6 w-6" />}
          {state === 'processing' && <Loader2 className="h-6 w-6 animate-spin" />}
          {state === 'speaking' && <Sparkles className="h-6 w-6" />}
          {state === 'error' && <AlertCircle className="h-6 w-6" />}
          {state === 'success' && <CheckCircle className="h-6 w-6" />}
          {state === 'deactivating' && <Square className="h-6 w-6" />}
        </div>

        {/* Sound Wave Visualization */}
        {(state === 'listening' || state === 'speaking') && (
          <SoundWaveVisualization 
            audioLevel={audioLevel} 
            isListening={state === 'listening'}
            isSpeaking={state === 'speaking'}
          />
        )}

        {/* Processing Spinner */}
        {state === 'processing' && (
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin" />
        )}
      </div>

      {/* State Label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium transition-all duration-300",
          "bg-background/80 backdrop-blur-sm border",
          state === 'idle' && "text-purple-400 border-purple-500/30",
          state === 'activating' && "text-purple-300 border-purple-500/60",
          state === 'listening' && "text-blue-300 border-blue-500/60",
          state === 'processing' && "text-yellow-300 border-yellow-500/60",
          state === 'speaking' && "text-green-300 border-green-500/60",
          state === 'error' && "text-red-300 border-red-500/60",
          state === 'success' && "text-green-300 border-green-500/60",
          state === 'deactivating' && "text-purple-400 border-purple-500/30"
        )}>
          {getStateLabel(state)}
        </div>
      </div>
    </div>
  );
}

interface SoundWaveVisualizationProps {
  audioLevel: number;
  isListening: boolean;
  isSpeaking: boolean;
}

function SoundWaveVisualization({ audioLevel, isListening, isSpeaking }: SoundWaveVisualizationProps) {
  const [waveData, setWaveData] = useState<number[]>(Array(8).fill(0.1));

  useEffect(() => {
    if (!isListening && !isSpeaking) return;

    const interval = setInterval(() => {
      setWaveData(prev => prev.map((_, i) => {
        // Simulate audio wave data
        const baseLevel = audioLevel || 0.1;
        const randomVariation = Math.random() * 0.3;
        const wavePattern = Math.sin(Date.now() / 200 + i * 0.5) * 0.2;
        return Math.max(0.05, Math.min(1, baseLevel + randomVariation + wavePattern));
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [audioLevel, isListening, isSpeaking]);

  return (
    <div className="absolute -left-20 -right-20 top-1/2 transform -translate-y-1/2 flex items-end justify-center gap-1 h-8">
      {waveData.map((level, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full transition-all duration-75",
            isListening && "bg-blue-400",
            isSpeaking && "bg-green-400"
          )}
          style={{
            height: `${Math.max(4, level * 32)}px`,
            opacity: 0.3 + level * 0.7
          }}
        />
      ))}
    </div>
  );
}

function getStateLabel(state: JarvisAnimationState): string {
  switch (state) {
    case 'idle': return 'Ready';
    case 'activating': return 'Activating...';
    case 'listening': return 'Listening...';
    case 'processing': return 'Thinking...';
    case 'speaking': return 'Speaking...';
    case 'error': return 'Error';
    case 'success': return 'Complete';
    case 'deactivating': return 'Deactivating...';
    default: return 'Ready';
  }
}

// Compact version for button integration
interface JarvisButtonAnimationProps {
  state: JarvisAnimationState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function JarvisButtonAnimation({ state, size = 'md', className }: JarvisButtonAnimationProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Glow effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-300",
          state === 'listening' && "bg-blue-500/30 scale-150 animate-pulse",
          state === 'processing' && "bg-yellow-500/30 scale-125 animate-pulse",
          state === 'speaking' && "bg-green-500/30 scale-150 animate-pulse",
          state === 'error' && "bg-red-500/30 scale-125",
          state === 'activating' && "bg-purple-500/30 scale-150 animate-pulse"
        )}
      />

      {/* Icon */}
      <div className={cn(sizeClasses[size], "relative z-10")}>
        {state === 'idle' && <Sparkles className="w-full h-full" />}
        {state === 'activating' && <Sparkles className="w-full h-full animate-spin" />}
        {state === 'listening' && <Mic className="w-full h-full" />}
        {state === 'processing' && <Loader2 className="w-full h-full animate-spin" />}
        {state === 'speaking' && <Sparkles className="w-full h-full animate-pulse" />}
        {state === 'error' && <AlertCircle className="w-full h-full" />}
        {state === 'success' && <CheckCircle className="w-full h-full" />}
        {state === 'deactivating' && <Square className="w-full h-full" />}
      </div>

      {/* Pulsing ring for active states */}
      {(state === 'listening' || state === 'speaking') && (
        <div className="absolute inset-0 rounded-full border border-current opacity-30 animate-ping" />
      )}
    </div>
  );
}

// Full-screen overlay animation for activation/deactivation
interface JarvisOverlayAnimationProps {
  isVisible: boolean;
  state: 'activating' | 'deactivating';
  onComplete?: () => void;
}

export function JarvisOverlayAnimation({ isVisible, state, onComplete }: JarvisOverlayAnimationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center space-y-6">
        {/* Large animated orb */}
        <div className="relative mx-auto">
          <div className="w-32 h-32 rounded-full bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-purple-400 animate-spin" />
          </div>
          
          {/* Expanding rings */}
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
          <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-ping animation-delay-300" />
          <div className="absolute inset-0 rounded-full border border-purple-500/10 animate-ping animation-delay-600" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-purple-400">
            {state === 'activating' ? 'Jarvis Activating' : 'Jarvis Deactivating'}
          </h2>
          <p className="text-muted-foreground">
            {state === 'activating' 
              ? 'Voice assistant is starting up...' 
              : 'Voice assistant is shutting down...'
            }
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mx-auto">
          <div 
            className={cn(
              "h-full bg-purple-500 transition-all duration-2000 ease-out",
              isVisible ? "w-full" : "w-0"
            )}
          />
        </div>
      </div>
    </div>
  );
}