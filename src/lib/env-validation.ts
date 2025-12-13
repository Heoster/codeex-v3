/**
 * Environment Variable Validation
 * Ensures required environment variables are present and provides helpful error messages
 */

interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
  warnings: string[];
}

/**
 * Validate required environment variables for AI providers
 */
export function validateAIProviderEnv(): EnvValidationResult {
  const result: EnvValidationResult = {
    isValid: true,
    missingVars: [],
    warnings: []
  };

  // Check for at least one AI provider API key
  const groqKey = process.env.GROQ_API_KEY;
  const googleKey = process.env.GOOGLE_API_KEY;
  const hfKey = process.env.HUGGINGFACE_API_KEY;

  if (!groqKey && !googleKey && !hfKey) {
    result.isValid = false;
    result.missingVars.push('At least one AI provider API key (GROQ_API_KEY, GOOGLE_API_KEY, or HUGGINGFACE_API_KEY)');
  }

  // Individual provider warnings
  if (!groqKey) {
    result.warnings.push('GROQ_API_KEY not set - Groq models will be unavailable');
  }
  if (!googleKey) {
    result.warnings.push('GOOGLE_API_KEY not set - Google Gemini models will be unavailable');
  }
  if (!hfKey) {
    result.warnings.push('HUGGINGFACE_API_KEY not set - Hugging Face models will be unavailable');
  }

  return result;
}

/**
 * Validate Firebase configuration
 */
export function validateFirebaseEnv(): EnvValidationResult {
  const result: EnvValidationResult = {
    isValid: true,
    missingVars: [],
    warnings: []
  };

  const requiredFirebaseVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];

  for (const varName of requiredFirebaseVars) {
    if (!process.env[varName]) {
      result.isValid = false;
      result.missingVars.push(varName);
    }
  }

  return result;
}

/**
 * Get user-friendly setup instructions
 */
export function getSetupInstructions(): string {
  return `
🔧 Setup Instructions:

1. Copy .env.example to .env.local:
   cp .env.example .env.local

2. Get FREE API keys:
   • Groq: https://console.groq.com/keys
   • Google AI: https://aistudio.google.com/app/apikey
   • Hugging Face: https://huggingface.co/settings/tokens

3. Set up Firebase:
   • Create project: https://console.firebase.google.com
   • Enable Authentication and Firestore
   • Add config to .env.local

4. Restart your development server:
   npm run dev
  `.trim();
}

/**
 * Log environment validation results (server-side only)
 */
export function logEnvValidation(): void {
  if (typeof window !== 'undefined') return;

  const aiValidation = validateAIProviderEnv();
  const firebaseValidation = validateFirebaseEnv();

  if (!aiValidation.isValid) {
    console.error('❌ Missing required AI provider configuration:');
    aiValidation.missingVars.forEach(v => console.error(`   - ${v}`));
    console.log('\n' + getSetupInstructions());
  }

  if (!firebaseValidation.isValid) {
    console.error('❌ Missing required Firebase configuration:');
    firebaseValidation.missingVars.forEach(v => console.error(`   - ${v}`));
  }

  // Log warnings
  if (aiValidation.warnings.length > 0) {
    console.warn('⚠️  AI Provider warnings:');
    aiValidation.warnings.forEach(w => console.warn(`   - ${w}`));
  }

  if (aiValidation.isValid && firebaseValidation.isValid) {
    console.log('✅ Environment configuration looks good!');
  }
}