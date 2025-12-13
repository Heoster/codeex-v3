/**
 * Environment Variable Security Validation
 * Ensures API keys are not accidentally exposed to the frontend
 */

interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Critical API keys that should NEVER be exposed to frontend
const CRITICAL_ENV_VARS = [
  'GROQ_API_KEY',
  'HUGGINGFACE_API_KEY', 
  'GOOGLE_API_KEY',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'DATABASE_URL',
  'JWT_SECRET',
  'NEXTAUTH_SECRET',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PROJECT_ID_PRIVATE'
];

// Environment variables that should exist in production
const REQUIRED_ENV_VARS = [
  'GROQ_API_KEY',
  'HUGGINGFACE_API_KEY',
  'GOOGLE_API_KEY'
];

// Environment variables that are safe to expose (NEXT_PUBLIC_)
const SAFE_PUBLIC_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_EMAILJS_SERVICE_ID',
  'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID',
  'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY'
];

export function validateEnvironmentVariables(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for accidentally exposed critical variables
  for (const envVar of CRITICAL_ENV_VARS) {
    const publicVersion = `NEXT_PUBLIC_${envVar}`;
    if (process.env[publicVersion]) {
      errors.push(
        `CRITICAL: ${publicVersion} found! This exposes sensitive data to the frontend. ` +
        `Use ${envVar} instead (without NEXT_PUBLIC_ prefix).`
      );
    }
  }

  // Check for missing required variables in production
  if (process.env.NODE_ENV === 'production') {
    for (const envVar of REQUIRED_ENV_VARS) {
      if (!process.env[envVar]) {
        errors.push(`Missing required environment variable: ${envVar}`);
      }
    }
  }

  // Check for potentially unsafe public variables
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      if (!SAFE_PUBLIC_VARS.includes(key)) {
        warnings.push(
          `Unknown public environment variable: ${key}. ` +
          `Verify this should be exposed to the frontend.`
        );
      }
      
      // Check for suspicious patterns in public vars
      const value = process.env[key] || '';
      if (value.includes('secret') || value.includes('private') || value.includes('key')) {
        warnings.push(
          `Public variable ${key} contains suspicious keywords. ` +
          `Ensure this doesn't contain sensitive data.`
        );
      }
    }
  });

  // Validate API key formats
  const apiKeys = {
    GROQ_API_KEY: /^gsk_[a-zA-Z0-9]{48}$/,
    GOOGLE_API_KEY: /^AIza[0-9A-Za-z-_]{35}$/,
    HUGGINGFACE_API_KEY: /^hf_[a-zA-Z0-9]{37}$/
  };

  Object.entries(apiKeys).forEach(([envVar, pattern]) => {
    const value = process.env[envVar];
    if (value && !pattern.test(value)) {
      warnings.push(
        `${envVar} format appears invalid. Expected pattern: ${pattern.source}`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function logEnvironmentValidation(): void {
  const result = validateEnvironmentVariables();
  
  if (!result.isValid) {
    console.error('🚨 ENVIRONMENT VALIDATION FAILED:');
    result.errors.forEach(error => console.error(`  ❌ ${error}`));
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Environment validation failed. Check your environment variables.');
    }
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️  ENVIRONMENT WARNINGS:');
    result.warnings.forEach(warning => console.warn(`  ⚠️  ${warning}`));
  }
  
  if (result.isValid && result.warnings.length === 0) {
    console.log('✅ Environment validation passed');
  }
}

// Auto-validate on import in development
if (process.env.NODE_ENV === 'development') {
  logEnvironmentValidation();
}