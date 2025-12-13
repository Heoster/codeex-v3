# Netlify Secrets Scanning Configuration

## Issue
Netlify's secrets scanning feature flags `NEXT_PUBLIC_*` environment variables as potential secrets, causing build failures.

## Why This Happens
- Netlify scans build output for potential secrets
- Next.js `NEXT_PUBLIC_*` variables are intentionally embedded in client-side code
- These variables appear in webpack bundles, triggering the scanner

## Solution
Configure `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml` to exclude these public variables:

```toml
[build.environment]
  SECRETS_SCAN_OMIT_KEYS = "NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,..."
```

## Safe to Expose
These variables are **intentionally public** and safe to expose:

### Firebase Configuration (Public)
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase Web API key (public)
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain (public)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID (public)
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket (public)
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging ID (public)
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID (public)
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - Google Analytics ID (public)

### EmailJS Configuration (Public)
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` - EmailJS service ID (public)
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` - EmailJS template ID (public)
- `NEXT_PUBLIC_EMAILJS_USER_ID` - EmailJS user ID (public)
- `NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID` - EmailJS template ID (public)

## Security Note
- These are **client-side** configuration values
- They are **meant to be public** and visible in browser dev tools
- Firebase security is handled by Firestore rules, not API key secrecy
- EmailJS security is handled by domain restrictions and rate limiting

## Alternative Solutions
If you prefer not to modify the config, you can also:

1. **Disable secrets scanning entirely:**
   ```toml
   [build.environment]
     SECRETS_SCAN_ENABLED = "false"
   ```

2. **Use path exclusions:**
   ```toml
   [build.environment]
     SECRETS_SCAN_OMIT_PATHS = ".next/cache/**,.next/static/**"
   ```

## References
- [Netlify Secrets Scanning Docs](https://docs.netlify.com/security/secrets-scanning/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase Web API Keys](https://firebase.google.com/docs/projects/api-keys)