import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configuration for different endpoints
const RATE_LIMITS: Record<string, { limit: number; window: number }> = {
  '/api/auth/login': { limit: 5, window: 900000 }, // 5 per 15min
  '/api/auth/register': { limit: 3, window: 3600000 }, // 3 per hour
  '/api/ai': { limit: 20, window: 60000 }, // 20 per minute
  '/api/chat-direct': { limit: 30, window: 60000 }, // 30 per minute
  '/api/solve': { limit: 15, window: 60000 }, // 15 per minute
  '/api/summarize': { limit: 15, window: 60000 }, // 15 per minute
  '/api/search': { limit: 10, window: 60000 }, // 10 per minute
  '/api/image-solver': { limit: 10, window: 60000 }, // 10 per minute
  '/api/pdf-analyzer': { limit: 8, window: 60000 }, // 8 per minute
  '/api/health': { limit: 100, window: 60000 }, // 100 per minute
  '/api/debug-ai': { limit: 5, window: 300000 }, // 5 per 5min
};

// In-memory rate limiting store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// CORS configuration
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://codeex-ai.netlify.app',
  'https://main--codeex-ai.netlify.app'
];

function getRateLimitKey(ip: string, pathname: string): string {
  return `${ip}:${pathname}`;
}

function isRateLimited(key: string, limit: number, window: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, { count: 1, resetTime: now + window });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  // Increment count
  record.count++;
  rateLimitStore.set(key, record);
  return false;
}

function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up expired entries every 5 minutes
setInterval(cleanupRateLimitStore, 300000);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // Find matching rate limit configuration
    const rateLimitConfig = Object.entries(RATE_LIMITS).find(([path]) => 
      pathname.startsWith(path)
    );

    if (rateLimitConfig) {
      const [, { limit, window }] = rateLimitConfig;
      const key = getRateLimitKey(ip, pathname);

      if (isRateLimited(key, limit, window)) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: `Too many requests. Limit: ${limit} per ${window / 1000} seconds.`,
            retryAfter: Math.ceil(window / 1000)
          },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil(window / 1000).toString(),
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': Math.ceil((Date.now() + window) / 1000).toString()
            }
          }
        );
      }
    }

    // CORS handling for API routes
    const response = NextResponse.next();

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    // Add CORS headers to API responses
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    // Add security headers to API responses
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
  }

  // Security headers for all other routes (handled by next.config.js headers)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all routes except static files and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};