/**
 * Analytics Provider Component
 * Provides analytics context and automatic tracking throughout the app
 */

'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  initGA, 
  trackPageView, 
  trackEngagement, 
  trackPerformance,
  trackError,
  isAnalyticsEnabled,
  debugAnalytics
} from '@/lib/analytics';
import { 
  initializeAISearchTracking, 
  trackAISearchPerformance, 
  detectAISearchSource,
  analyzeQueryPattern 
} from '@/lib/ai-search-analytics';

interface AnalyticsContextType {
  trackEvent: (action: string, category: string, label?: string, value?: number) => void;
  trackAIEvent: any;
  trackEngagement: any;
  trackConversion: any;
  trackPerformance: any;
  trackError: any;
  isEnabled: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize Google Analytics
    initGA();
    debugAnalytics();

    // Initialize AI Search Tracking
    initializeAISearchTracking();

    // Track initial page view with null check
    if (pathname) {
      trackPageView(pathname);
    }

    // Track session start
    trackEngagement.sessionStart();

    // Track AI search source detection
    const aiSource = detectAISearchSource();
    if (aiSource !== 'organic') {
      trackAISearchPerformance({
        source: aiSource,
        query: 'initial_visit',
        queryType: 'traditional',
        userIntent: 'information',
        studentFocused: pathname?.includes('student') || pathname?.includes('learn') || false,
        voiceEnabled: false,
        timestamp: new Date().toISOString()
      });
    }

    // Track page load performance
    if (typeof window !== 'undefined') {
      const startTime = performance.now();
      window.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        if (pathname) {
          trackPerformance.pageLoad(pathname, loadTime);
        }
      });
    }

    // Track session end on page unload
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - performance.timeOrigin;
      trackEngagement.sessionEnd(sessionDuration);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Global error tracking
    const handleError = (event: ErrorEvent) => {
      if (pathname) {
        trackError.jsError(new Error(event.message), pathname);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (pathname) {
        trackError.jsError(new Error(String(event.reason)), pathname);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [pathname]);

  // Track page changes
  useEffect(() => {
    if (pathname) {
      const searchString = searchParams?.toString() || '';
      const fullPath = pathname + (searchString ? `?${searchString}` : '');
      trackPageView(fullPath);
      
      // Track AI search queries from URL parameters
      const query = searchParams?.get('q') || searchParams?.get('query') || searchParams?.get('search') || '';
      if (query) {
        const analysis = analyzeQueryPattern(query);
        const aiSource = detectAISearchSource();
        
        trackAISearchPerformance({
          source: aiSource,
          query: query.substring(0, 100), // Truncate for privacy
          queryType: analysis.type,
          userIntent: analysis.intent,
          studentFocused: analysis.studentFocused,
          voiceEnabled: analysis.voiceEnabled,
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [pathname, searchParams]);

  // Track Core Web Vitals
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('web-vitals').then((webVitals) => {
        // Use the correct function names from web-vitals v5+
        if (webVitals.onCLS) {
          webVitals.onCLS((metric: any) => trackPerformance.webVitals('CLS', metric.value));
        }
        if (webVitals.onINP) {
          // INP replaced FID in web-vitals v3+
          webVitals.onINP((metric: any) => trackPerformance.webVitals('INP', metric.value));
        }
        if (webVitals.onFCP) {
          webVitals.onFCP((metric: any) => trackPerformance.webVitals('FCP', metric.value));
        }
        if (webVitals.onLCP) {
          webVitals.onLCP((metric: any) => trackPerformance.webVitals('LCP', metric.value));
        }
        if (webVitals.onTTFB) {
          webVitals.onTTFB((metric: any) => trackPerformance.webVitals('TTFB', metric.value));
        }
      }).catch(() => {
        // web-vitals not available, skip tracking
        console.log('Web Vitals tracking not available');
      });
    }
  }, []);

  const contextValue: AnalyticsContextType = {
    trackEvent: (action: string, category: string, label?: string, value?: number) => {
      // Implementation moved to analytics.ts
    },
    trackAIEvent: {}, // Will be populated with actual tracking functions
    trackEngagement,
    trackConversion: {}, // Will be populated
    trackPerformance,
    trackError,
    isEnabled: isAnalyticsEnabled(),
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// HOC for automatic component tracking
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function AnalyticsWrappedComponent(props: P) {
    const { trackEngagement } = useAnalytics();

    useEffect(() => {
      const startTime = Date.now();
      
      return () => {
        const timeSpent = Date.now() - startTime;
        trackEngagement.timeOnPage(componentName, timeSpent);
      };
    }, [trackEngagement]);

    return <Component {...props} />;
  };
}