/**
 * Safe Environment Variable Utilities
 * Provides safe access to environment variables with fallbacks
 */

/**
 * Safely get an environment variable with fallback
 */
export function getEnvVar(key: string, fallback: string = ''): string {
  try {
    // Server-side access
    if (typeof window === 'undefined') {
      return process.env[key] || fallback;
    }
    
    // Client-side access for NEXT_PUBLIC_ variables
    if (key.startsWith('NEXT_PUBLIC_')) {
      return (window as any).__NEXT_DATA__?.env?.[key] || 
             (process.env as any)?.[key] || 
             fallback;
    }
    
    return fallback;
  } catch (error) {
    console.warn(`Failed to access environment variable ${key}:`, error);
    return fallback;
  }
}

/**
 * Check if an environment variable exists and is not empty
 */
export function hasEnvVar(key: string): boolean {
  try {
    const value = getEnvVar(key);
    return value !== '' && value !== 'undefined' && value !== 'null';
  } catch (error) {
    console.warn(`Failed to check environment variable ${key}:`, error);
    return false;
  }
}

/**
 * Get required environment variable or throw error
 */
export function getRequiredEnvVar(key: string): string {
  const value = getEnvVar(key);
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Validate environment configuration
 */
export function validateEnvConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for at least one AI provider
  const hasGroq = hasEnvVar('GROQ_API_KEY');
  const hasGoogle = hasEnvVar('GOOGLE_API_KEY');
  const hasHF = hasEnvVar('HUGGINGFACE_API_KEY');

  if (!hasGroq && !hasGoogle && !hasHF) {
    errors.push('No AI provider API keys configured. Please set at least one: GROQ_API_KEY, GOOGLE_API_KEY, or HUGGINGFACE_API_KEY');
  }

  // Check Firebase configuration
  const firebaseVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];

  const missingFirebase = firebaseVars.filter(key => !hasEnvVar(key));
  if (missingFirebase.length > 0) {
    errors.push(`Missing Firebase configuration: ${missingFirebase.join(', ')}`);
  }

  // Warnings for optional services
  if (!hasGroq) {
    warnings.push('GROQ_API_KEY not set - Groq models will be unavailable');
  }
  if (!hasGoogle) {
    warnings.push('GOOGLE_API_KEY not set - Google Gemini models will be unavailable');
  }
  if (!hasHF) {
    warnings.push('HUGGINGFACE_API_KEY not set - Hugging Face models will be unavailable');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Log environment status (server-side only)
 */
export function logEnvStatus(): void {
  if (typeof window !== 'undefined') return;

  try {
    const config = validateEnvConfig();
    
    if (config.errors.length > 0) {
      console.error('❌ Environment Configuration Errors:');
      config.errors.forEach(error => console.error(`   - ${error}`));
    }
    
    if (config.warnings.length > 0) {
      console.warn('⚠️  Environment Configuration Warnings:');
      config.warnings.forEach(warning => console.warn(`   - ${warning}`));
    }
    
    if (config.isValid) {
      console.log('✅ Environment configuration is valid');
    }
  } catch (error) {
    console.error('Failed to validate environment configuration:', error);
  }
}