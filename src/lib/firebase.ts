'use client';

import {initializeApp, getApps, getApp, type FirebaseApp} from 'firebase/app';
import {GoogleAuthProvider} from 'firebase/auth';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  AppCheck,
} from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY;
    const isDev = process.env.NODE_ENV === 'development';
    
    // Temporarily disable App Check to fix authentication issues
    // App Check can cause authentication failures if not properly configured
    // TODO: Re-enable after proper Firebase App Check setup
    console.log('App Check temporarily disabled for authentication stability');
    
    /*
    // Only initialize App Check if a valid reCAPTCHA key is provided
    if (recaptchaKey && recaptchaKey.length > 10 && !recaptchaKey.startsWith('your_')) {
      try {
        appCheckInstance = initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(recaptchaKey),
          isTokenAutoRefreshEnabled: !isDev,
        });
      } catch (e) {
        if (!isDev) {
          console.warn('Failed to initialize App Check:', e);
        }
      }
    }
    */
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
