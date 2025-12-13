/**
 * PWA Detection and Utilities
 * Handles Progressive Web App detection and behavior
 */

/**
 * Check if the app is running as an installed PWA
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for display-mode: standalone
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // Check for iOS Safari PWA
  if ((window.navigator as any).standalone === true) {
    return true;
  }
  
  // Check for Android PWA indicators
  if (document.referrer.includes('android-app://')) {
    return true;
  }
  
  return false;
}

/**
 * Check if PWA installation is available
 */
export function isPWAInstallable(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if beforeinstallprompt event is supported
  return 'BeforeInstallPromptEvent' in window || 'onbeforeinstallprompt' in window;
}

/**
 * Get PWA installation status
 */
export function getPWAStatus() {
  return {
    isInstalled: isPWAInstalled(),
    isInstallable: isPWAInstallable(),
    isSupported: typeof window !== 'undefined' && 'serviceWorker' in navigator
  };
}

/**
 * Store PWA installation prompt for later use
 */
let deferredPrompt: any = null;

export function storePWAPrompt(event: any) {
  deferredPrompt = event;
}

/**
 * Show PWA installation prompt
 */
export async function showPWAInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) return false;
  
  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('PWA install prompt failed:', error);
    return false;
  }
}

/**
 * Check if user should see landing page
 * Skip landing page for PWA users
 */
export function shouldShowLandingPage(): boolean {
  if (typeof window === 'undefined') return true;
  
  // Skip landing page if installed as PWA
  if (isPWAInstalled()) {
    return false;
  }
  
  // Check if user has previously dismissed landing page
  const dismissed = localStorage.getItem('landing-page-dismissed');
  if (dismissed === 'true') {
    return false;
  }
  
  return true;
}

/**
 * Mark landing page as dismissed
 */
export function dismissLandingPage() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('landing-page-dismissed', 'true');
  }
}

/**
 * Reset landing page preference (for testing)
 */
export function resetLandingPagePreference() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('landing-page-dismissed');
  }
}

/**
 * Get PWA display mode
 */
export function getPWADisplayMode(): 'browser' | 'standalone' | 'minimal-ui' | 'fullscreen' {
  if (typeof window === 'undefined') return 'browser';
  
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'fullscreen';
  }
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'standalone';
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'minimal-ui';
  }
  
  return 'browser';
}

/**
 * PWA installation instructions for different platforms
 */
export function getPWAInstallInstructions(): { platform: string; instructions: string[] } {
  if (typeof window === 'undefined') {
    return { platform: 'unknown', instructions: [] };
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return {
      platform: 'iOS',
      instructions: [
        'Tap the Share button in Safari',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to install CODEEX AI'
      ]
    };
  }
  
  if (userAgent.includes('android')) {
    return {
      platform: 'Android',
      instructions: [
        'Tap the menu button (⋮) in your browser',
        'Select "Add to Home screen" or "Install app"',
        'Tap "Add" or "Install" to confirm'
      ]
    };
  }
  
  if (userAgent.includes('chrome')) {
    return {
      platform: 'Chrome',
      instructions: [
        'Click the install button (⊕) in the address bar',
        'Or click the menu (⋮) and select "Install CODEEX AI"',
        'Click "Install" to confirm'
      ]
    };
  }
  
  return {
    platform: 'Desktop',
    instructions: [
      'Look for an install button in your browser',
      'Or check your browser menu for install options',
      'Follow the prompts to install CODEEX AI'
    ]
  };
}