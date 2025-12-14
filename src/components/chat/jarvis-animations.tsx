'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Mic, Volume2, Brain, Zap, Circle } from 'lucide-react';
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
  audioLevel?: number;
  className?: string;
}

export function JarvisAnimations({ state, audioLevel = 0, className }: JarvisAnimationsProps) {
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    if (state === 'listening' || state === 'speaking') {
      const interval = setInterval(() => {
        setPulseIntensity(Math.random() * 0.8 + 0.2);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setPulseIntensity(0);
    }
  }, [state]);

  const getStateColor = () => {
    switch (state) {
      case 'idle': return 'text-gray-400';
      case 'activating': return 'text-purple-500';
      case 'listening': return 'text-blue-500';
      case 'processing': return 'text-yellow-500';
      case 'speaking': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'success': return 'text-emerald-500';
      case 'deactivating': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  const getStateIcon = () => {
    switch (state) {
      case 'listening': return Mic;
      case 'processing': return Brain;
      case 'speaking': return Volume2;
      case 'success': return Zap;
      case 'error': return Circle;
      default: return Sparkles;
    }
  };

  const StateIcon = getStateIcon();

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Outer Ring */}
      <div 
        className={cn(
          'absolute inset-0 rounded-full border-2 transition-all duration-300',
          getStateColor(),
          state === 'activating' && 'animate-spin',
          state === 'processing' && 'animate-pulse',
          (state === 'listening' || state === 'speaking') && 'animate-pulse'
        )}
        style={{
          transform: `scale(${1 + pulseIntensity * 0.3})`,
          opacity: 0.6 + pulseIntensity * 0.4
        }}
      />
      
      {/* Middle Ring */}
      <div 
        className={cn(
          'absolute inset-2 rounded-full border transition-all duration-200',
          getStateColor(),
          state === 'listening' && 'animate-ping',
          state === 'speaking' && 'animate-pulse'
        )}
        style={{
          opacity: 0.4 + pulseIntensity * 0.3
        }}
      />
      
      {/* Inner Core */}
      <div 
        className={cn(
          'relative z-10 w-12 h-12 rounded-full flex items-center justify-center',
          'bg-gradient-to-br from-purple-500/20 to-blue-500/20',
          'backdrop-blur-sm border transition-all duration-300',
          getStateColor(),
          state === 'activating' && 'animate-bounce',
          state === 'error' && 'animate-shake'
        )}
        style={{
          transform: `scale(${1 + pulseIntensity * 0.2})`,
          boxShadow: `0 0 ${20 + pulseIntensity * 30}px rgba(168, 85, 247, ${0.3 + pulseIntensity * 0.4})`
        }}
      >
        <StateIcon 
          className={cn('w-6 h-6 transition-all duration-200', getStateColor())}
          style={{
            transform: `scale(${1 + pulseIntensity * 0.1})`
          }}
        />
      </div>

      {/* Audio Level Bars (for listening/speaking states) */}
      {(state === 'listening' || state === 'speaking') && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <AudioBars audioLevel={audioLevel} isActive={true} />
        </div>
      )}
    </div>
  );
}

interface JarvisButtonAnimationProps {
  state: JarvisAnimationState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function JarvisButtonAnimation({ state, size = 'md', className }: JarvisButtonAnimationProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getStateColor = () => {
    switch (state) {
      case 'idle': return 'text-gray-400';
      case 'activating': return 'text-purple-500';
      case 'listening': return 'text-blue-500';
      case 'processing': return 'text-yellow-500';
      case 'speaking': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'success': return 'text-emerald-500';
      case 'deactivating': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Sparkles 
        className={cn(
          sizeClasses[size],
          getStateColor(),
          'transition-all duration-200',
          state === 'activating' && 'animate-spin',
          state === 'listening' && 'animate-pulse',
          state === 'processing' && 'animate-bounce',
          state === 'speaking' && 'animate-pulse'
        )}
      />
    </div>
  );
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="text-center space-y-4">
        <div className="relative">
          <JarvisAnimations 
            state={state === 'activating' ? 'activating' : 'deactivating'} 
            className="scale-150"
          />
        </div>
        <div className="text-white">
          <h2 className="text-2xl font-bold">
            {state === 'activating' ? 'Activating Jarvis Mode' : 'Deactivating Jarvis Mode'}
          </h2>
          <p className="text-purple-200 mt-2">
            {state === 'activating' 
              ? 'Voice assistant is starting up...' 
              : 'Voice assistant is shutting down...'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

interface AudioBarsProps {
  audioLevel: number;
  isActive: boolean;
}

function AudioBars({ audioLevel, isActive }: AudioBarsProps) {
  const [bars, setBars] = useState<number[]>(Array(8).fill(0.1));

  useEffect(() => {
    if (!isActive) {
      setBars(Array(8).fill(0.1));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map((_, i) => {
        const baseLevel = audioLevel || 0.1;
        const randomVariation = Math.random() * 0.4;
        const wavePattern = Math.sin(Date.now() / 100 + i * 0.5) * 0.3;
        return Math.max(0.1, Math.min(1, baseLevel + randomVariation + wavePattern));
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [audioLevel, isActive]);

  return (
    <div className="flex items-end justify-center gap-1 h-6">
      {bars.map((level, i) => (
        <div
          key={i}
          className="w-1 bg-purple-500 rounded-full transition-all duration-75"
          style={{
            height: `${Math.max(4, level * 24)}px`,
            opacity: 0.4 + level * 0.6
          }}
        />
      ))}
    </div>
  );
}