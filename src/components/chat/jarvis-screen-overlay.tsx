'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Mic, Volume2, Brain, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JarvisAnimations, type JarvisAnimationState } from './jarvis-animations';

interface JarvisScreenOverlayProps {
  isActive: boolean;
  state: JarvisAnimationState;
  audioLevel?: number;
  onClose?: () => void;
  className?: string;
}

export function JarvisScreenOverlay({ 
  isActive, 
  state, 
  audioLevel = 0, 
  onClose, 
  className 
}: JarvisScreenOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    setMounted(true);
    
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted || !isActive) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-40 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20",
        "backdrop-blur-sm transition-all duration-500",
        className
      )}
      onClick={onClose}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Central Jarvis Animation */}
        <div className="mb-8">
          <JarvisAnimations 
            state={state} 
            audioLevel={audioLevel}
            className="scale-150"
          />
        </div>

        {/* Status Information */}
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-3xl font-bold text-white">
            {getStatusTitle(state)}
          </h1>
          <p className="text-lg text-purple-200">
            {getStatusDescription(state)}
          </p>
        </div>

        {/* Feature Icons */}
        <div className="mt-12 flex items-center gap-8">
          <FeatureIcon 
            icon={Mic} 
            label="Voice Input" 
            active={state === 'listening'} 
          />
          <FeatureIcon 
            icon={Brain} 
            label="AI Processing" 
            active={state === 'processing'} 
          />
          <FeatureIcon 
            icon={Volume2} 
            label="Voice Output" 
            active={state === 'speaking'} 
          />
          <FeatureIcon 
            icon={Zap} 
            label="Smart Memory" 
            active={state !== 'idle'} 
          />
        </div>

        {/* Audio Visualization */}
        {(state === 'listening' || state === 'speaking') && (
          <div className="mt-8">
            <AudioVisualization 
              audioLevel={audioLevel} 
              isListening={state === 'listening'}
              isSpeaking={state === 'speaking'}
            />
          </div>
        )}

        {/* Close Hint */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-sm text-purple-300/70">
            Tap anywhere to minimize
          </p>
        </div>
      </div>
    </div>
  );
}

interface FeatureIconProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}

function FeatureIcon({ icon: Icon, label, active }: FeatureIconProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
          "border-2 backdrop-blur-sm",
          active 
            ? "bg-purple-500/40 border-purple-400 text-purple-200 scale-110" 
            : "bg-purple-500/20 border-purple-500/30 text-purple-400"
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <span className={cn(
        "text-xs font-medium transition-colors duration-300",
        active ? "text-purple-200" : "text-purple-400"
      )}>
        {label}
      </span>
    </div>
  );
}

interface AudioVisualizationProps {
  audioLevel: number;
  isListening: boolean;
  isSpeaking: boolean;
}

function AudioVisualization({ audioLevel, isListening, isSpeaking }: AudioVisualizationProps) {
  const [bars, setBars] = useState<number[]>(Array(16).fill(0.1));

  useEffect(() => {
    if (!isListening && !isSpeaking) return;

    const interval = setInterval(() => {
      setBars(prev => prev.map((_, i) => {
        const baseLevel = audioLevel || 0.1;
        const randomVariation = Math.random() * 0.4;
        const wavePattern = Math.sin(Date.now() / 150 + i * 0.3) * 0.3;
        return Math.max(0.05, Math.min(1, baseLevel + randomVariation + wavePattern));
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [audioLevel, isListening, isSpeaking]);

  return (
    <div className="flex items-end justify-center gap-2 h-16">
      {bars.map((level, i) => (
        <div
          key={i}
          className={cn(
            "w-2 rounded-full transition-all duration-75",
            isListening && "bg-blue-400",
            isSpeaking && "bg-green-400"
          )}
          style={{
            height: `${Math.max(8, level * 64)}px`,
            opacity: 0.4 + level * 0.6
          }}
        />
      ))}
    </div>
  );
}

function getStatusTitle(state: JarvisAnimationState): string {
  switch (state) {
    case 'idle': return 'Jarvis Ready';
    case 'activating': return 'Activating Jarvis';
    case 'listening': return 'Listening...';
    case 'processing': return 'Processing...';
    case 'speaking': return 'Jarvis Speaking';
    case 'error': return 'Error Occurred';
    case 'success': return 'Task Complete';
    case 'deactivating': return 'Deactivating';
    default: return 'Jarvis Active';
  }
}

function getStatusDescription(state: JarvisAnimationState): string {
  switch (state) {
    case 'idle': return 'Your AI assistant is ready to help';
    case 'activating': return 'Starting up voice assistant...';
    case 'listening': return 'Speak now, I\'m listening to your request';
    case 'processing': return 'Analyzing your request and generating response';
    case 'speaking': return 'Providing your requested information';
    case 'error': return 'Something went wrong, please try again';
    case 'success': return 'Request completed successfully';
    case 'deactivating': return 'Shutting down voice assistant...';
    default: return 'Voice assistant is active';
  }
}