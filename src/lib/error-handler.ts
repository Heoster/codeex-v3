/**
 * Secure Error Handling for API Routes
 * Prevents information leakage while providing useful error messages
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

export class SecureApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'SecureApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SecureApiError);
    }
  }
}

/**
 * Predefined error types for common scenarios
 */
export const ErrorTypes = {
  // Authentication & Authorization
  UNAUTHORIZED: (message = 'Authentication required') => 
    new SecureApiError(message, 'UNAUTHORIZED', 401),
  
  FORBIDDEN: (message = 'Access denied') => 
    new SecureApiError(message, 'FORBIDDEN', 403),
  
  EMAIL_NOT_VERIFIED: (message = 'Email verification required') => 
    new SecureApiError(message, 'EMAIL_NOT_VERIFIED', 403),

  // Validation
  VALIDATION_ERROR: (message: string, details?: any) => 
    new SecureApiError(message, 'VALIDATION_ERROR', 400, details),
  
  INVALID_INPUT: (message = 'Invalid input provided') => 
    new SecureApiError(message, 'INVALID_INPUT', 400),
  
  MISSING_REQUIRED_FIELD: (field: string) => 
    new SecureApiError(`Missing required field: ${field}`, 'MISSING_FIELD', 400),

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: (message = 'Rate limit exceeded') => 
    new SecureApiError(message, 'RATE_LIMIT_EXCEEDED', 429),

  // Resource Management
  NOT_FOUND: (resource = 'Resource') => 
    new SecureApiError(`${resource} not found`, 'NOT_FOUND', 404),
  
  RESOURCE_EXISTS: (resource = 'Resource') => 
    new SecureApiError(`${resource} already exists`, 'RESOURCE_EXISTS', 409),
  
  RESOURCE_LIMIT_EXCEEDED: (message = 'Resource limit exceeded') => 
    new SecureApiError(message, 'RESOURCE_LIMIT_EXCEEDED', 413),

  // External Services
  EXTERNAL_SERVICE_ERROR: (service: string) => 
    new SecureApiError(`${service} service temporarily unavailable`, 'EXTERNAL_SERVICE_ERROR', 503),
  
  AI_SERVICE_ERROR: (message = 'AI service temporarily unavailable') => 
    new SecureApiError(message, 'AI_SERVICE_ERROR', 503),
  
  API_KEY_INVALID: (service: string) => 
    new SecureApiError(`Invalid API key for ${service}`, 'API_KEY_INVALID', 500),

  // File Operations
  FILE_TOO_LARGE: (maxSize: string) => 
    new SecureApiError(`File too large. Maximum size: ${maxSize}`, 'FILE_TOO_LARGE', 413),
  
  INVALID_FILE_TYPE: (allowedTypes: string[]) => 
    new SecureApiError(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`, 'INVALID_FILE_TYPE', 400),
  
  FILE_PROCESSING_ERROR: (message = 'File processing failed') => 
    new SecureApiError(message, 'FILE_PROCESSING_ERROR', 422),

  // Generic
  INTERNAL_ERROR: (message = 'Internal server error') => 
    new SecureApiError(message, 'INTERNAL_ERROR', 500),
  
  SERVICE_UNAVAILABLE: (message = 'Service temporarily unavailable') => 
    new SecureApiError(message, 'SERVICE_UNAVAILABLE', 503),
  
  TIMEOUT: (message = 'Request timeout') => 
    new SecureApiError(message, 'TIMEOUT', 408),
};

/**
 * Safe error response that doesn't leak sensitive information
 */
export function createErrorResponse(error: unknown): NextResponse {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Handle known SecureApiError
  if (error instanceof SecureApiError) {
    const response = {
      error: {
        code: error.code,
        message: error.message,
        ...(error.details && !isProduction && { details: error.details })
      }
    };

    // Log error for monitoring
    if (error.statusCode >= 500) {
      console.error('API Error:', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
        details: error.details
      });
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationErrors = error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));

    return NextResponse.json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Input validation failed',
        ...((!isProduction) && { details: validationErrors })
      }
    }, { status: 400 });
  }

  // Handle Firebase Auth errors
  if (error && typeof error === 'object' && 'code' in error) {
    const firebaseError = error as { code: string; message: string };
    
    const firebaseErrorMap: Record<string, { message: string; status: number }> = {
      'auth/user-not-found': { message: 'Invalid credentials', status: 401 },
      'auth/wrong-password': { message: 'Invalid credentials', status: 401 },
      'auth/email-already-in-use': { message: 'Email already registered', status: 409 },
      'auth/weak-password': { message: 'Password too weak', status: 400 },
      'auth/invalid-email': { message: 'Invalid email format', status: 400 },
      'auth/user-disabled': { message: 'Account disabled', status: 403 },
      'auth/too-many-requests': { message: 'Too many attempts. Try again later', status: 429 },
    };

    const mappedError = firebaseErrorMap[firebaseError.code];
    if (mappedError) {
      return NextResponse.json({
        error: {
          code: firebaseError.code.replace('auth/', '').toUpperCase(),
          message: mappedError.message
        }
      }, { status: mappedError.status });
    }
  }

  // Handle generic errors
  console.error('Unhandled API Error:', error);

  const genericResponse = {
    error: {
      code: 'INTERNAL_ERROR',
      message: isProduction 
        ? 'An unexpected error occurred. Please try again later.'
        : error instanceof Error ? error.message : 'Unknown error'
    }
  };

  return NextResponse.json(genericResponse, { status: 500 });
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}

/**
 * Validate and throw appropriate errors for common scenarios
 */
export const validators = {
  requireAuth: (user: any) => {
    if (!user) {
      throw ErrorTypes.UNAUTHORIZED();
    }
  },

  requireEmailVerification: (user: any) => {
    if (!user?.emailVerified) {
      throw ErrorTypes.EMAIL_NOT_VERIFIED();
    }
  },

  requireField: (value: any, fieldName: string) => {
    if (value === undefined || value === null || value === '') {
      throw ErrorTypes.MISSING_REQUIRED_FIELD(fieldName);
    }
  },

  requireValidInput: (isValid: boolean, message: string) => {
    if (!isValid) {
      throw ErrorTypes.INVALID_INPUT(message);
    }
  },

  requireResource: (resource: any, resourceName: string = 'Resource') => {
    if (!resource) {
      throw ErrorTypes.NOT_FOUND(resourceName);
    }
  },

  requireApiKey: (apiKey: string | undefined, serviceName: string) => {
    if (!apiKey) {
      throw ErrorTypes.API_KEY_INVALID(serviceName);
    }
  }
};

/**
 * Log security events for monitoring
 */
export function logSecurityEvent(
  event: 'UNAUTHORIZED_ACCESS' | 'RATE_LIMIT_EXCEEDED' | 'INVALID_INPUT' | 'SUSPICIOUS_ACTIVITY',
  details: {
    ip?: string;
    userAgent?: string;
    endpoint?: string;
    userId?: string;
    additionalInfo?: any;
  }
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...details
  };

  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to monitoring service (e.g., Sentry, DataDog, etc.)
    console.warn('SECURITY_EVENT:', logEntry);
  } else {
    console.warn('SECURITY_EVENT:', logEntry);
  }
}

/**
 * Sanitize error messages for logging
 */
export function sanitizeErrorForLogging(error: unknown): {
  message: string;
  stack?: string;
  code?: string;
  statusCode?: number;
} {
  if (error instanceof SecureApiError) {
    return {
      message: error.message,
      stack: error.stack,
      code: error.code,
      statusCode: error.statusCode
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack
    };
  }

  return {
    message: String(error)
  };
}