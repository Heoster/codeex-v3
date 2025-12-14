'use client';

/**
 * Runtime Error Handler
 * Handles unhandled errors and promise rejections in the browser
 */

interface ErrorReport {
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  timestamp: number;
  userAgent: string;
}

class RuntimeErrorHandler {
  private errors: ErrorReport[] = [];
  private maxErrors = 10;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupErrorHandlers();
    }
  }

  private setupErrorHandlers() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });
    });

    // Handle React errors (if not caught by error boundaries)
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('React') || message.includes('Warning')) {
        this.handleError({
          message: `React Error: ${message}`,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
        });
      }
      originalConsoleError.apply(console, args);
    };
  }

  private handleError(error: ErrorReport) {
    // Add to error collection
    this.errors.push(error);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log error for debugging
    console.error('Runtime Error:', error);

    // In production, you might want to send errors to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error);
    }
  }

  private reportError(error: ErrorReport) {
    // Example: Send to error monitoring service
    // This is where you'd integrate with services like Sentry, LogRocket, etc.
    
    try {
      // Simple error reporting (you can replace with your preferred service)
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      }).catch(() => {
        // Silently fail if error reporting fails
      });
    } catch (e) {
      // Silently fail if error reporting fails
    }
  }

  public getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public getErrorSummary(): string {
    if (this.errors.length === 0) {
      return 'No errors recorded';
    }

    const errorCounts = this.errors.reduce((acc, error) => {
      const key = error.message.split(':')[0];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(errorCounts)
      .map(([error, count]) => `${error}: ${count}`)
      .join(', ');
  }
}

// Create singleton instance
let errorHandler: RuntimeErrorHandler | null = null;

export function getErrorHandler(): RuntimeErrorHandler {
  if (!errorHandler) {
    errorHandler = new RuntimeErrorHandler();
  }
  return errorHandler;
}

// Initialize error handler on module load (client-side only)
if (typeof window !== 'undefined') {
  getErrorHandler();
}

export default RuntimeErrorHandler;