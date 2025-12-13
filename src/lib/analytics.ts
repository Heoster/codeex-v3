/**
 * Advanced Analytics Tracking for CODEEX AI
 * Comprehensive event tracking and user behavior analysis
 */

// Google Analytics 4 Event Tracking
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: any
    ) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
};

// Page view tracking
export const trackPageView = (url: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Custom event tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  customParameters?: Record<string, any>
) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...customParameters,
  });
};

// AI-specific event tracking
export const trackAIEvent = {
  // Chat interactions
  chatMessage: (modelUsed: string, messageLength: number, responseTime?: number) => {
    trackEvent('chat_message_sent', 'ai_interaction', modelUsed, messageLength, {
      model_used: modelUsed,
      message_length: messageLength,
      response_time: responseTime,
    });
  },

  // Model selection
  modelSwitch: (fromModel: string, toModel: string) => {
    trackEvent('model_switched', 'ai_interaction', `${fromModel}_to_${toModel}`, undefined, {
      from_model: fromModel,
      to_model: toModel,
    });
  },

  // Feature usage
  featureUsed: (feature: string, success: boolean = true) => {
    trackEvent('feature_used', 'ai_features', feature, success ? 1 : 0, {
      feature_name: feature,
      success: success,
    });
  },

  // Command usage
  commandUsed: (command: string, success: boolean = true) => {
    trackEvent('command_used', 'ai_commands', command, success ? 1 : 0, {
      command_name: command,
      success: success,
    });
  },

  // Document analysis
  documentAnalyzed: (type: 'pdf' | 'image', size: number, success: boolean = true) => {
    trackEvent('document_analyzed', 'ai_features', type, size, {
      document_type: type,
      file_size: size,
      success: success,
    });
  },

  // Search usage
  searchPerformed: (query: string, resultsCount: number) => {
    trackEvent('search_performed', 'ai_features', 'web_search', resultsCount, {
      query_length: query.length,
      results_count: resultsCount,
    });
  },

  // Voice features
  voiceUsed: (feature: 'input' | 'output', duration?: number) => {
    trackEvent('voice_used', 'ai_features', feature, duration, {
      voice_feature: feature,
      duration: duration,
    });
  },

  // Error tracking
  aiError: (errorType: string, modelUsed?: string, errorMessage?: string) => {
    trackEvent('ai_error', 'errors', errorType, undefined, {
      error_type: errorType,
      model_used: modelUsed,
      error_message: errorMessage?.substring(0, 100), // Limit error message length
    });
  },
};

// User engagement tracking
export const trackEngagement = {
  // Session duration
  sessionStart: () => {
    trackEvent('session_start', 'engagement', 'user_session');
  },

  sessionEnd: (duration: number) => {
    trackEvent('session_end', 'engagement', 'user_session', duration, {
      session_duration: duration,
    });
  },

  // Page engagement
  timeOnPage: (page: string, timeSpent: number) => {
    trackEvent('time_on_page', 'engagement', page, timeSpent, {
      page_name: page,
      time_spent: timeSpent,
    });
  },

  // User actions
  buttonClick: (buttonName: string, location: string) => {
    trackEvent('button_click', 'user_interaction', buttonName, undefined, {
      button_name: buttonName,
      button_location: location,
    });
  },

  // Social sharing
  socialShare: (platform: string, content: string) => {
    trackEvent('social_share', 'engagement', platform, undefined, {
      platform: platform,
      content_type: content,
    });
  },

  // PWA events
  pwaInstall: () => {
    trackEvent('pwa_install', 'engagement', 'progressive_web_app');
  },

  pwaLaunch: () => {
    trackEvent('pwa_launch', 'engagement', 'progressive_web_app');
  },
};

// Conversion tracking
export const trackConversion = {
  // User registration
  userSignup: (method: string) => {
    trackEvent('sign_up', 'conversion', method, undefined, {
      method: method,
    });
  },

  // User login
  userLogin: (method: string) => {
    trackEvent('login', 'conversion', method, undefined, {
      method: method,
    });
  },

  // Feature adoption
  firstTimeFeatureUse: (feature: string) => {
    trackEvent('first_time_feature_use', 'conversion', feature, undefined, {
      feature_name: feature,
    });
  },

  // Goal completions
  goalCompleted: (goalName: string, value?: number) => {
    trackEvent('goal_completed', 'conversion', goalName, value, {
      goal_name: goalName,
    });
  },
};

// Performance tracking
export const trackPerformance = {
  // Page load times
  pageLoad: (page: string, loadTime: number) => {
    trackEvent('page_load_time', 'performance', page, loadTime, {
      page_name: page,
      load_time: loadTime,
    });
  },

  // API response times
  apiResponse: (endpoint: string, responseTime: number, success: boolean) => {
    trackEvent('api_response_time', 'performance', endpoint, responseTime, {
      endpoint: endpoint,
      response_time: responseTime,
      success: success,
    });
  },

  // Core Web Vitals
  webVitals: (metric: string, value: number) => {
    trackEvent('web_vitals', 'performance', metric, value, {
      metric_name: metric,
      metric_value: value,
    });
  },
};

// Error tracking
export const trackError = {
  // JavaScript errors
  jsError: (error: Error, page: string) => {
    trackEvent('javascript_error', 'errors', error.name, undefined, {
      error_message: error.message.substring(0, 100),
      error_stack: error.stack?.substring(0, 200),
      page_name: page,
    });
  },

  // Network errors
  networkError: (url: string, status: number) => {
    trackEvent('network_error', 'errors', 'api_call', status, {
      url: url,
      status_code: status,
    });
  },

  // User-reported errors
  userReportedError: (errorType: string, description: string) => {
    trackEvent('user_reported_error', 'errors', errorType, undefined, {
      error_type: errorType,
      description: description.substring(0, 100),
    });
  },
};

// Utility functions
export const isAnalyticsEnabled = (): boolean => {
  return !!(GA_MEASUREMENT_ID && typeof window !== 'undefined');
};

export const setUserProperties = (properties: Record<string, any>) => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('set', 'user_properties', properties);
};

export const setUserId = (userId: string) => {
  if (!isAnalyticsEnabled()) return;

  window.gtag('config', GA_MEASUREMENT_ID!, {
    user_id: userId,
  });
};

// Enhanced ecommerce tracking (for future premium features)
export const trackEcommerce = {
  purchase: (transactionId: string, value: number, currency: string = 'USD') => {
    trackEvent('purchase', 'ecommerce', transactionId, value, {
      transaction_id: transactionId,
      value: value,
      currency: currency,
    });
  },

  addToCart: (itemId: string, itemName: string, value: number) => {
    trackEvent('add_to_cart', 'ecommerce', itemName, value, {
      item_id: itemId,
      item_name: itemName,
      value: value,
    });
  },
};

// Debug mode for development
export const debugAnalytics = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Debug Mode Enabled');
    console.log('GA Measurement ID:', GA_MEASUREMENT_ID);
    console.log('Analytics Enabled:', isAnalyticsEnabled());
  }
};