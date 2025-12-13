/**
 * Input Validation and Sanitization
 * Comprehensive validation for API endpoints and user inputs
 */

import { z } from 'zod';

// Common validation schemas
export const schemas = {
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email too long')
    .toLowerCase()
    .trim(),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),

  displayName: z.string()
    .min(1, 'Display name is required')
    .max(50, 'Display name too long')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Display name contains invalid characters')
    .trim(),

  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message too long')
    .trim(),

  chatId: z.string()
    .uuid('Invalid chat ID format'),

  modelId: z.string()
    .min(1, 'Model ID is required')
    .max(100, 'Model ID too long')
    .regex(/^[a-zA-Z0-9\-_.]+$/, 'Invalid model ID format'),

  imageDataUri: z.string()
    .regex(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/, 'Invalid image format')
    .max(10 * 1024 * 1024, 'Image too large (max 10MB)'), // Base64 is ~33% larger

  pdfDataUri: z.string()
    .regex(/^data:application\/pdf;base64,/, 'Invalid PDF format')
    .max(50 * 1024 * 1024, 'PDF too large (max 50MB)'), // Base64 is ~33% larger

  searchQuery: z.string()
    .min(1, 'Search query cannot be empty')
    .max(500, 'Search query too long')
    .trim(),

  url: z.string()
    .url('Invalid URL format')
    .max(2048, 'URL too long'),

  tone: z.enum(['formal', 'casual', 'helpful'], {
    errorMap: () => ({ message: 'Invalid tone. Must be formal, casual, or helpful' })
  }),

  technicalLevel: z.enum(['beginner', 'intermediate', 'expert'], {
    errorMap: () => ({ message: 'Invalid technical level. Must be beginner, intermediate, or expert' })
  }),

  temperature: z.number()
    .min(0, 'Temperature must be at least 0')
    .max(2, 'Temperature must be at most 2'),

  maxTokens: z.number()
    .int('Max tokens must be an integer')
    .min(1, 'Max tokens must be at least 1')
    .max(8192, 'Max tokens must be at most 8192'),
};

// Composite schemas for API endpoints
export const apiSchemas = {
  generateResponse: z.object({
    message: schemas.message,
    history: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1).max(10000)
    })).max(50, 'Too many messages in history'),
    settings: z.object({
      model: z.string().optional(),
      tone: schemas.tone,
      technicalLevel: schemas.technicalLevel,
      enableSpeech: z.boolean().optional(),
      voice: z.string().optional()
    })
  }),

  solveImage: z.object({
    photoDataUri: schemas.imageDataUri,
    problemType: z.enum(['math', 'general']).optional()
  }),

  analyzePdf: z.object({
    pdfDataUri: schemas.pdfDataUri,
    question: schemas.message
  }),

  search: z.object({
    query: schemas.searchQuery,
    maxResults: z.number().int().min(1).max(20).optional()
  }),

  userRegistration: z.object({
    email: schemas.email,
    password: schemas.password,
    displayName: schemas.displayName
  }),

  userLogin: z.object({
    email: schemas.email,
    password: schemas.password
  }),

  passwordReset: z.object({
    email: schemas.email
  }),

  contactForm: z.object({
    name: schemas.displayName,
    email: schemas.email,
    subject: z.string().min(1).max(200).trim(),
    message: z.string().min(10).max(2000).trim()
  })
};

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize and validate user input
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  return input
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 10000); // Limit length
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: { size: number; type: string; name: string },
  allowedTypes: string[],
  maxSize: number
): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // Check file name
  if (!/^[a-zA-Z0-9\-_.() ]+$/.test(file.name)) {
    return {
      isValid: false,
      error: 'File name contains invalid characters'
    };
  }

  return { isValid: true };
}

/**
 * Rate limiting key generator
 */
export function generateRateLimitKey(
  identifier: string,
  endpoint: string,
  additionalContext?: string
): string {
  const parts = [identifier, endpoint];
  if (additionalContext) {
    parts.push(additionalContext);
  }
  return parts.join(':');
}

/**
 * Validate API key format
 */
export function validateApiKey(key: string, provider: 'groq' | 'huggingface' | 'google'): boolean {
  const patterns = {
    groq: /^gsk_[a-zA-Z0-9]{48}$/,
    huggingface: /^hf_[a-zA-Z0-9]{37}$/,
    google: /^AIza[0-9A-Za-z-_]{35}$/
  };

  return patterns[provider].test(key);
}

/**
 * Validate and parse JSON safely
 */
export function parseJsonSafely<T>(
  input: string,
  schema?: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = JSON.parse(input);
    
    if (schema) {
      const result = schema.safeParse(parsed);
      if (!result.success) {
        return {
          success: false,
          error: `Validation failed: ${result.error.errors.map(e => e.message).join(', ')}`
        };
      }
      return { success: true, data: result.data };
    }
    
    return { success: true, data: parsed };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON format'
    };
  }
}

/**
 * Validate request headers
 */
export function validateRequestHeaders(headers: Headers): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check Content-Type for POST requests
  const contentType = headers.get('content-type');
  if (contentType && !contentType.includes('application/json')) {
    errors.push('Invalid Content-Type. Expected application/json');
  }

  // Check for suspicious headers
  const suspiciousHeaders = ['x-forwarded-host', 'x-real-ip'];
  for (const header of suspiciousHeaders) {
    if (headers.get(header)) {
      // Log for monitoring but don't block
      console.warn(`Suspicious header detected: ${header}`);
    }
  }

  // Validate User-Agent
  const userAgent = headers.get('user-agent');
  if (userAgent && userAgent.length > 500) {
    errors.push('User-Agent header too long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Create validation middleware for API routes
 */
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
    const result = schema.safeParse(data);
    
    if (!result.success) {
      return {
        success: false,
        errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      };
    }
    
    return { success: true, data: result.data };
  };
}

/**
 * Common validation patterns
 */
export const patterns = {
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  base64: /^[A-Za-z0-9+/]*={0,2}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  ipv6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
};