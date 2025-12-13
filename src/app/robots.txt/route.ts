/**
 * Dynamic Robots.txt Generation
 * Provides crawling instructions for search engines
 */

import { generateRobotsTxt } from '@/lib/seo-config';

export async function GET() {
  const robotsTxt = generateRobotsTxt();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}