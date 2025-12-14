'use client';

import {initializeApp, getApps, getApp, type FirebaseApp} from 'firebase/app';
import {GoogleAuthProvider} from 'firebase/auth';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  AppCheck,
} from 'firebase/app-check';

// Safe environment variable access with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  if (typeof window !== 'undefined') {
    return (window as any).__NEXT_DATA__?.env?.[key] || fallback;
  }
  return process.env[key] || fallback;
};

const firebaseConfig = {
  apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

// Comprehensive validation to ensure Firebase config is loaded
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
const missingFields = requiredFields.filter(field => 
  !firebaseConfig[field] || 
  String(firebaseConfig[field]).startsWith('YOUR_') ||
  String(firebaseConfig[field]).length < 5
);

if (missingFields.length > 0) {
  console.error(
    `⚠️ Firebase configuration incomplete. Missing or invalid fields: ${missingFields.join(', ')}. ` +
    'Authentication features will not work. Please check your .env.local file.'
  );
}

// Initialize Firebase with error handling
let app: FirebaseApp;
try {
  app = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // Create a minimal app instance to prevent crashes
  try {
    app = initializeApp({
      apiKey: 'dummy',
      authDomain: 'dummy.firebaseapp.com',
      projectId: 'dummy-project',
      appId: '1:123456789:web:dummy'
    });
  } catch (fallbackError) {
    console.error('Firebase fallback initialization failed:', fallbackError);
    throw new Error('Firebase configuration is invalid. Please check your environment variables.');
  }
}

// Initialize App Check with enhanced error handling
let appCheckInstance: AppCheck | undefined;

if (typeof window !== 'undefined') {
  try {
    const recaptchaKey = getEnvVar('NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY');
    const isDev = getEnvVar('NODE_ENV') === 'development';
    
    // Only initialize App Check if a valid reCAPTCHA key is provided
    // In development, App Check is optional - skip if key causes errors
    if (recaptchaKey && recaptchaKey.length > 10 && !recaptchaKey.startsWith('your_') && !recaptchaKey.startsWith('6Lf')) {
      try {
        appCheckInstance = initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(recaptchaKey),
          isTokenAutoRefreshEnabled: !isDev, // Disable auto-refresh in dev to reduce errors
        });
      } catch (e) {
        if (!isDev) {
          console.warn('Failed to initialize App Check:', e);
        }
      }
    }
  } catch (error) {
    console.warn('App Check initialization skipped due to error:', error);
  }
}

// Initialize Google Auth Provider with error handling
let googleProvider: GoogleAuthProvider;
try {
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });
} catch (error) {
  console.error('Failed to initialize Google Auth Provider:', error);
  // Create a fallback provider
  googleProvider = new GoogleAuthProvider();
}

export {app, googleProvider, appCheckInstance};
