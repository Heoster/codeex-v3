/**
 * Dynamic Sitemap Generation
 * Automatically generates sitemap.xml for search engines
 */

import { generateSitemap } from '@/lib/seo-config';

export async function GET() {
  const sitemap = generateSitemap();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  });
}