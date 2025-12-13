/**
 * AI Search Analytics Configuration
 * Track performance in AI-driven search engines and conversational queries
 */

// AI Search Engine Performance Tracking
export interface AISearchMetrics {
  source: 'chatgpt' | 'google-ai' | 'bing-ai' | 'claude' | 'perplexity' | 'you-com' | 'organic';
  query: string;
  queryType: 'conversational' | 'voice' | 'traditional';
  userIntent: 'learning' | 'problem-solving' | 'information' | 'comparison';
  studentFocused: boolean;
  voiceEnabled: boolean;
  timestamp: string;
}

// Track AI search performance
export function trackAISearchPerformance(metrics: AISearchMetrics) {
  if (typeof window === 'undefined') return;
  
  // Google Analytics 4 event
  if (window.gtag) {
    window.gtag('event', 'ai_search_interaction', {
      ai_source: metrics.source,
      query_type: metrics.queryType,
      user_intent: metrics.userIntent,
      student_focused: metrics.studentFocused,
      voice_enabled: metrics.voiceEnabled,
      custom_parameter_1: metrics.query.substring(0, 100) // Truncate for privacy
    });
  }
  
  // Custom AI search analytics
  const aiSearchData = {
    event: 'ai_search_performance',
    ...metrics,
    page_url: window.location.href,
    page_title: document.title,
    user_agent: navigator.userAgent,
    referrer: document.referrer
  };
  
  // Store locally for analysis
  const existingData = JSON.parse(localStorage.getItem('ai_search_analytics') || '[]');
  existingData.push(aiSearchData);
  
  // Keep only last 100 entries
  if (existingData.length > 100) {
    existingData.splice(0, existingData.length - 100);
  }
  
  localStorage.setItem('ai_search_analytics', JSON.stringify(existingData));
}

// Detect AI search engine referrers
export function detectAISearchSource(): AISearchMetrics['source'] {
  if (typeof window === 'undefined') return 'organic';
  
  const referrer = document.referrer.toLowerCase();
  const userAgent = navigator.userAgent.toLowerCase();
  
  // AI search engine detection patterns
  if (referrer.includes('chat.openai.com') || userAgent.includes('chatgpt')) {
    return 'chatgpt';
  }
  
  if (referrer.includes('bard.google.com') || referrer.includes('ai.google.com')) {
    return 'google-ai';
  }
  
  if (referrer.includes('bing.com/chat') || referrer.includes('copilot.microsoft.com')) {
    return 'bing-ai';
  }
  
  if (referrer.includes('claude.ai') || referrer.includes('anthropic.com')) {
    return 'claude';
  }
  
  if (referrer.includes('perplexity.ai')) {
    return 'perplexity';
  }
  
  if (referrer.includes('you.com')) {
    return 'you-com';
  }
  
  return 'organic';
}

// Analyze query patterns for AI optimization
export function analyzeQueryPattern(query: string): {
  type: AISearchMetrics['queryType'];
  intent: AISearchMetrics['userIntent'];
  studentFocused: boolean;
  voiceEnabled: boolean;
} {
  const lowerQuery = query.toLowerCase();
  
  // Voice query patterns
  const voicePatterns = [
    'hey', 'ok google', 'alexa', 'siri', 'how do i', 'what is', 'can you', 'help me'
  ];
  const isVoiceQuery = voicePatterns.some(pattern => lowerQuery.includes(pattern));
  
  // Conversational patterns
  const conversationalPatterns = [
    'how can', 'what should', 'can you help', 'i need', 'i want to learn', 'explain'
  ];
  const isConversational = conversationalPatterns.some(pattern => lowerQuery.includes(pattern));
  
  // Student-focused patterns
  const studentPatterns = [
    'student', 'learn', 'beginner', 'homework', 'assignment', 'study', 'course', 'tutorial'
  ];
  const isStudentFocused = studentPatterns.some(pattern => lowerQuery.includes(pattern));
  
  // Intent detection
  let intent: AISearchMetrics['userIntent'] = 'information';
  
  if (lowerQuery.includes('vs') || lowerQuery.includes('compare') || lowerQuery.includes('better')) {
    intent = 'comparison';
  } else if (lowerQuery.includes('learn') || lowerQuery.includes('how to') || lowerQuery.includes('tutorial')) {
    intent = 'learning';
  } else if (lowerQuery.includes('solve') || lowerQuery.includes('fix') || lowerQuery.includes('debug')) {
    intent = 'problem-solving';
  }
  
  return {
    type: isVoiceQuery ? 'voice' : isConversational ? 'conversational' : 'traditional',
    intent,
    studentFocused: isStudentFocused,
    voiceEnabled: isVoiceQuery
  };
}

// Initialize AI search tracking
export function initializeAISearchTracking() {
  if (typeof window === 'undefined') return;
  
  // Track initial page load from AI search
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q') || urlParams.get('query') || '';
  
  if (query) {
    const source = detectAISearchSource();
    const analysis = analyzeQueryPattern(query);
    
    trackAISearchPerformance({
      source,
      query,
      queryType: analysis.type,
      userIntent: analysis.intent,
      studentFocused: analysis.studentFocused,
      voiceEnabled: analysis.voiceEnabled,
      timestamp: new Date().toISOString()
    });
  }
  
  // Track AI search referrers
  const source = detectAISearchSource();
  if (source !== 'organic') {
    trackAISearchPerformance({
      source,
      query: 'referrer_visit',
      queryType: 'traditional',
      userIntent: 'information',
      studentFocused: false,
      voiceEnabled: false,
      timestamp: new Date().toISOString()
    });
  }
}

// AI Search Optimization Recommendations
export const aiSearchOptimizationTips = {
  content: [
    'Use clear, conversational headings that answer direct questions',
    'Include FAQ sections with natural language questions',
    'Optimize for voice search with "how to" and "what is" queries',
    'Structure content with step-by-step instructions',
    'Use schema markup for better AI understanding',
    'Include conversational query patterns in meta descriptions',
    'Create content that directly answers student questions',
    'Optimize for educational and learning-focused queries'
  ],
  
  technical: [
    'Implement structured data for educational content',
    'Use semantic HTML for better content understanding',
    'Optimize page speed for better AI crawler experience',
    'Include alt text and descriptions for accessibility',
    'Use proper heading hierarchy (H1, H2, H3)',
    'Implement breadcrumb navigation',
    'Add internal linking with descriptive anchor text',
    'Ensure mobile-first responsive design'
  ],
  
  voice: [
    'Optimize for natural language queries',
    'Include long-tail conversational keywords',
    'Structure content to answer "who, what, when, where, why, how"',
    'Use local language and colloquialisms appropriately',
    'Create content for different skill levels',
    'Include pronunciation guides for technical terms',
    'Optimize for featured snippets and quick answers',
    'Use bullet points and numbered lists for clarity'
  ]
};

// Export analytics data for review
export function exportAISearchAnalytics() {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem('ai_search_analytics');
  if (!data) return null;
  
  const analytics = JSON.parse(data);
  
  // Generate summary report
  const summary = {
    totalInteractions: analytics.length,
    aiSources: analytics.reduce((acc: any, item: any) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {}),
    queryTypes: analytics.reduce((acc: any, item: any) => {
      acc[item.queryType] = (acc[item.queryType] || 0) + 1;
      return acc;
    }, {}),
    userIntents: analytics.reduce((acc: any, item: any) => {
      acc[item.userIntent] = (acc[item.userIntent] || 0) + 1;
      return acc;
    }, {}),
    studentFocusedQueries: analytics.filter((item: any) => item.studentFocused).length,
    voiceEnabledQueries: analytics.filter((item: any) => item.voiceEnabled).length,
    dateRange: {
      from: analytics[0]?.timestamp,
      to: analytics[analytics.length - 1]?.timestamp
    }
  };
  
  return {
    summary,
    rawData: analytics
  };
}

// Note: gtag types are already declared in the main analytics module