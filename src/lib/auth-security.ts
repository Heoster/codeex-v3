/**
 * Enhanced Authentication Security
 * Implements email verification, secure registration, and authentication best practices
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  User,
  Auth,
  updateProfile,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';
import { z } from 'zod';

// Input validation schemas
const emailSchema = z.string()
  .email('Invalid email format')
  .max(255, 'Email too long')
  .toLowerCase();

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const displayNameSchema = z.string()
  .min(1, 'Display name is required')
  .max(50, 'Display name too long')
  .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Display name contains invalid characters');

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  requiresEmailVerification?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate email format and security
 */
export function validateEmail(email: unknown): ValidationResult {
  const result = emailSchema.safeParse(email);
  return {
    isValid: result.success,
    errors: result.success ? [] : result.error.errors.map(e => e.message)
  };
}

/**
 * Validate password strength
 */
export function validatePassword(password: unknown): ValidationResult {
  const result = passwordSchema.safeParse(password);
  return {
    isValid: result.success,
    errors: result.success ? [] : result.error.errors.map(e => e.message)
  };
}

/**
 * Validate display name
 */
export function validateDisplayName(displayName: unknown): ValidationResult {
  const result = displayNameSchema.safeParse(displayName);
  return {
    isValid: result.success,
    errors: result.success ? [] : result.error.errors.map(e => e.message)
  };
}

/**
 * Secure user registration with email verification
 */
export async function registerUserSecurely(
  auth: Auth,
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> {
  try {
    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const nameValidation = validateDisplayName(displayName);

    const errors = [
      ...emailValidation.errors,
      ...passwordValidation.errors,
      ...nameValidation.errors
    ];

    if (errors.length > 0) {
      return {
        success: false,
        message: `Validation failed: ${errors.join(', ')}`
      };
    }

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Send email verification
    await sendEmailVerification(user, {
      url: `${window.location.origin}/login?verified=true`,
      handleCodeInApp: false
    });

    // Sign out user until email is verified
    await signOut(auth);

    return {
      success: true,
      message: 'Account created successfully! Please check your email and verify your account before signing in.',
      requiresEmailVerification: true
    };

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle specific Firebase errors
    switch (error.code) {
      case 'auth/email-already-in-use':
        return {
          success: false,
          message: 'An account with this email already exists. Please sign in instead.'
        };
      case 'auth/weak-password':
        return {
          success: false,
          message: 'Password is too weak. Please choose a stronger password.'
        };
      case 'auth/invalid-email':
        return {
          success: false,
          message: 'Invalid email address format.'
        };
      case 'auth/operation-not-allowed':
        return {
          success: false,
          message: 'Email/password accounts are not enabled. Please contact support.'
        };
      default:
        return {
          success: false,
          message: 'Registration failed. Please try again later.'
        };
    }
  }
}

/**
 * Secure user sign in with email verification check
 */
export async function signInUserSecurely(
  auth: Auth,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return {
        success: false,
        message: `Invalid email: ${emailValidation.errors.join(', ')}`
      };
    }

    // Sign in user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if email is verified
    if (!user.emailVerified) {
      // Send new verification email
      await sendEmailVerification(user, {
        url: `${window.location.origin}/login?verified=true`,
        handleCodeInApp: false
      });

      // Sign out unverified user
      await signOut(auth);

      return {
        success: false,
        message: 'Please verify your email address. A new verification email has been sent.',
        requiresEmailVerification: true
      };
    }

    return {
      success: true,
      message: 'Successfully signed in!',
      user
    };

  } catch (error: any) {
    console.error('Sign in error:', error);
    
    // Handle specific Firebase errors
    switch (error.code) {
      case 'auth/user-not-found':
        return {
          success: false,
          message: 'No account found with this email address.'
        };
      case 'auth/wrong-password':
        return {
          success: false,
          message: 'Incorrect password. Please try again.'
        };
      case 'auth/invalid-email':
        return {
          success: false,
          message: 'Invalid email address format.'
        };
      case 'auth/user-disabled':
        return {
          success: false,
          message: 'This account has been disabled. Please contact support.'
        };
      case 'auth/too-many-requests':
        return {
          success: false,
          message: 'Too many failed attempts. Please try again later.'
        };
      default:
        return {
          success: false,
          message: 'Sign in failed. Please check your credentials and try again.'
        };
    }
  }
}

/**
 * Send secure password reset email
 */
export async function sendPasswordResetSecurely(
  auth: Auth,
  email: string
): Promise<AuthResult> {
  try {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return {
        success: false,
        message: `Invalid email: ${emailValidation.errors.join(', ')}`
      };
    }

    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login?reset=true`,
      handleCodeInApp: false
    });

    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.'
    };

  } catch (error: any) {
    console.error('Password reset error:', error);
    
    switch (error.code) {
      case 'auth/user-not-found':
        // Don't reveal if user exists for security
        return {
          success: true,
          message: 'If an account with this email exists, a password reset email has been sent.'
        };
      case 'auth/invalid-email':
        return {
          success: false,
          message: 'Invalid email address format.'
        };
      default:
        return {
          success: false,
          message: 'Failed to send password reset email. Please try again later.'
        };
    }
  }
}

/**
 * Change user password securely (requires current password)
 */
export async function changePasswordSecurely(
  auth: Auth,
  currentPassword: string,
  newPassword: string
): Promise<AuthResult> {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      return {
        success: false,
        message: 'No authenticated user found.'
      };
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: `Invalid password: ${passwordValidation.errors.join(', ')}`
      };
    }

    // Re-authenticate user with current password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    return {
      success: true,
      message: 'Password updated successfully.'
    };

  } catch (error: any) {
    console.error('Password change error:', error);
    
    switch (error.code) {
      case 'auth/wrong-password':
        return {
          success: false,
          message: 'Current password is incorrect.'
        };
      case 'auth/requires-recent-login':
        return {
          success: false,
          message: 'Please sign in again before changing your password.'
        };
      default:
        return {
          success: false,
          message: 'Failed to update password. Please try again.'
        };
    }
  }
}

/**
 * Check if user session is secure and valid
 */
export function isUserSessionSecure(user: User | null): boolean {
  if (!user) return false;
  
  // Check if email is verified
  if (!user.emailVerified) return false;
  
  // Check if user was created recently (within last 24 hours)
  const creationTime = user.metadata.creationTime;
  if (creationTime) {
    const createdAt = new Date(creationTime);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    
    // If account is very new, require additional verification
    if (hoursSinceCreation < 1) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get password strength score (0-4)
 */
export function getPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Use at least 8 characters');

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');

  // Bonus points for length
  if (password.length >= 12) score = Math.min(score + 1, 5);
  if (password.length >= 16) score = Math.min(score + 1, 5);

  return { score: Math.min(score, 4), feedback };
}