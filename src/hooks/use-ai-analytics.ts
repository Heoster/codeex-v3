/**
 * AI Analytics Hook
 * Specialized hook for tracking AI-related events and user interactions
 */

'use client';

import { useCallback } from 'react';
import { trackAIEvent, trackEngagement, trackConversion, trackError } from '@/lib/analytics';

export function useAIAnalytics() {
  // Chat interaction tracking
  const trackChatMessage = useCallback((
    modelUsed: string,
    messageLength: number,
    responseTime?: number,
    success: boolean = true
  ) => {
    trackAIEvent.chatMessage(modelUsed, messageLength, responseTime);
    
    if (!success) {
      trackAIEvent.aiError('chat_response_failed', modelUsed);
    }
  }, []);

  // Model switching tracking
  const trackModelSwitch = useCallback((fromModel: string, toModel: string) => {
    trackAIEvent.modelSwitch(fromModel, toModel);
    trackEngagement.buttonClick('model_selector', 'chat_interface');
  }, []);

  // Feature usage tracking
  const trackFeatureUsage = useCallback((
    feature: string,
    success: boolean = true,
    additionalData?: Record<string, any>
  ) => {
    trackAIEvent.featureUsed(feature, success);
    
    // Track first-time feature usage
    const featureKey = `first_use_${feature}`;
    if (!localStorage.getItem(featureKey)) {
      localStorage.setItem(featureKey, 'true');
      trackConversion.firstTimeFeatureUse(feature);
    }
  }, []);

  // Command usage tracking
  const trackCommandUsage = useCallback((
    command: string,
    success: boolean = true,
    executionTime?: number
  ) => {
    trackAIEvent.commandUsed(command, success);
    
    if (executionTime) {
      // Track command performance
      trackAIEvent.commandUsed(`${command}_performance`, true);
    }
  }, []);

  // Document analysis tracking
  const trackDocumentAnalysis = useCallback((
    type: 'pdf' | 'image',
    fileSize: number,
    processingTime: number,
    success: boolean = true,
    errorMessage?: string
  ) => {
    trackAIEvent.documentAnalyzed(type, fileSize, success);
    
    if (!success && errorMessage) {
      trackAIEvent.aiError('document_analysis_failed', undefined, errorMessage);
    }
    
    // Track processing performance
    if (success && processingTime) {
      trackAIEvent.featureUsed(`${type}_analysis_performance`, true);
    }
  }, []);

  // Search tracking
  const trackSearch = useCallback((
    query: string,
    resultsCount: number,
    searchTime: number,
    success: boolean = true
  ) => {
    trackAIEvent.searchPerformed(query, resultsCount);
    
    if (!success) {
      trackAIEvent.aiError('search_failed', undefined, 'Web search failed');
    }
    
    // Track search performance
    if (success && searchTime) {
      trackAIEvent.featureUsed('search_performance', true);
    }
  }, []);

  // Voice feature tracking
  const trackVoiceUsage = useCallback((
    feature: 'input' | 'output',
    duration?: number,
    success: boolean = true
  ) => {
    trackAIEvent.voiceUsed(feature, duration);
    
    if (!success) {
      trackAIEvent.aiError('voice_feature_failed', undefined, `Voice ${feature} failed`);
    }
  }, []);

  // Error tracking with context
  const trackAIError = useCallback((
    errorType: string,
    context: {
      modelUsed?: string;
      feature?: string;
      userAction?: string;
      errorMessage?: string;
      stackTrace?: string;
    }
  ) => {
    trackAIEvent.aiError(errorType, context.modelUsed, context.errorMessage);
    
    // Additional error context
    trackError.jsError(
      new Error(`AI Error: ${errorType} - ${context.errorMessage || 'Unknown error'}`),
      window.location.pathname
    );
  }, []);

  // User satisfaction tracking
  const trackUserSatisfaction = useCallback((
    feature: string,
    rating: number, // 1-5 scale
    feedback?: string
  ) => {
    trackEngagement.buttonClick('satisfaction_rating', feature);
    
    // Track as conversion if high rating
    if (rating >= 4) {
      trackConversion.goalCompleted('user_satisfaction', rating);
    }
  }, []);

  // Conversation quality tracking
  const trackConversationQuality = useCallback((
    conversationLength: number,
    averageResponseTime: number,
    userEngagement: 'high' | 'medium' | 'low',
    completedSuccessfully: boolean
  ) => {
    trackEngagement.timeOnPage('chat_conversation', conversationLength);
    
    if (completedSuccessfully) {
      trackConversion.goalCompleted('conversation_completed');
    }
    
    // Track conversation metrics
    trackAIEvent.featureUsed('conversation_quality', true);
  }, []);

  // Model performance tracking
  const trackModelPerformance = useCallback((
    modelId: string,
    responseTime: number,
    tokenCount: number,
    success: boolean,
    errorType?: string
  ) => {
    if (success) {
      trackAIEvent.featureUsed(`${modelId}_performance`, true);
    } else {
      trackAIEvent.aiError('model_performance_issue', modelId, errorType);
    }
  }, []);

  // Advanced feature adoption tracking
  const trackFeatureAdoption = useCallback((
    feature: string,
    adoptionStage: 'discovered' | 'tried' | 'adopted' | 'mastered'
  ) => {
    const eventName = `feature_${adoptionStage}`;
    trackEngagement.buttonClick(eventName, feature);
    
    // Track progression through adoption stages
    if (adoptionStage === 'mastered') {
      trackConversion.goalCompleted('feature_mastery', 1);
    }
  }, []);

  // Batch tracking for multiple events
  const trackBatchEvents = useCallback((
    events: Array<{
      type: 'chat' | 'feature' | 'command' | 'error';
      data: any;
    }>
  ) => {
    events.forEach(event => {
      switch (event.type) {
        case 'chat':
          trackChatMessage(event.data.model, event.data.length, event.data.time);
          break;
        case 'feature':
          trackFeatureUsage(event.data.name, event.data.success);
          break;
        case 'command':
          trackCommandUsage(event.data.command, event.data.success);
          break;
        case 'error':
          trackAIError(event.data.type, event.data.context);
          break;
      }
    });
  }, [trackChatMessage, trackFeatureUsage, trackCommandUsage, trackAIError]);

  return {
    // Core AI tracking
    trackChatMessage,
    trackModelSwitch,
    trackFeatureUsage,
    trackCommandUsage,
    trackDocumentAnalysis,
    trackSearch,
    trackVoiceUsage,
    
    // Error and performance tracking
    trackAIError,
    trackModelPerformance,
    
    // User experience tracking
    trackUserSatisfaction,
    trackConversationQuality,
    trackFeatureAdoption,
    
    // Utility functions
    trackBatchEvents,
  };
}