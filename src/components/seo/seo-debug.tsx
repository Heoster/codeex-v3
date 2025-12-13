/**
 * SEO Debug Component
 * Development tool for testing and validating SEO implementation
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface SEODebugProps {
  enabled?: boolean;
}

export function SEODebug({ enabled = process.env.NODE_ENV === 'development' }: SEODebugProps) {
  const [seoData, setSeoData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const analyzeSEO = () => {
      const data = {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content'),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
        ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
        ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
        twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
        twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
        twitterDescription: document.querySelector('meta[name="twitter:description"]')?.getAttribute('content'),
        twitterImage: document.querySelector('meta[name="twitter:image"]')?.getAttribute('content'),
        robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
        viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content'),
        themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
        structuredData: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(
          script => {
            try {
              return JSON.parse(script.textContent || '');
            } catch {
              return null;
            }
          }
        ).filter(Boolean),
        headings: {
          h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent),
          h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent),
          h3: Array.from(document.querySelectorAll('h3')).map(h => h.textContent),
        },
        images: Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt,
          hasAlt: !!img.alt,
        })),
        links: Array.from(document.querySelectorAll('a')).map(link => ({
          href: link.href,
          text: link.textContent,
          isExternal: link.href.startsWith('http') && !link.href.includes(window.location.hostname),
          hasTitle: !!link.title,
        })),
      };

      setSeoData(data);
    };

    // Analyze SEO after page load
    setTimeout(analyzeSEO, 1000);
  }, [enabled]);

  if (!enabled || !seoData) return null;

  const getStatus = (value: any) => {
    if (!value) return 'error';
    if (typeof value === 'string' && value.length < 10) return 'warning';
    return 'success';
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const testUrls = {
    googleRichResults: `https://search.google.com/test/rich-results?url=${encodeURIComponent(window.location.href)}`,
    facebookDebugger: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(window.location.href)}`,
    twitterValidator: `https://cards-dev.twitter.com/validator`,
    linkedinInspector: `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(window.location.href)}`,
    pagespeedInsights: `https://pagespeed.web.dev/report?url=${encodeURIComponent(window.location.href)}`,
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          SEO Debug
        </Button>
      </div>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed inset-4 z-50 overflow-auto bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">SEO Debug Panel</h2>
              <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm">
                ✕
              </Button>
            </div>

            <Tabs defaultValue="meta" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="meta">Meta Tags</TabsTrigger>
                <TabsTrigger value="og">Open Graph</TabsTrigger>
                <TabsTrigger value="twitter">Twitter</TabsTrigger>
                <TabsTrigger value="structured">Structured Data</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="meta" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Meta Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.title)} />
                      <span className="font-medium">Title:</span>
                      <span className="text-sm">{seoData.title || 'Missing'}</span>
                      <Badge variant="outline">{seoData.title?.length || 0} chars</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.description)} />
                      <span className="font-medium">Description:</span>
                      <span className="text-sm">{seoData.description || 'Missing'}</span>
                      <Badge variant="outline">{seoData.description?.length || 0} chars</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.keywords)} />
                      <span className="font-medium">Keywords:</span>
                      <span className="text-sm">{seoData.keywords || 'Missing'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.canonical)} />
                      <span className="font-medium">Canonical:</span>
                      <span className="text-sm">{seoData.canonical || 'Missing'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.robots)} />
                      <span className="font-medium">Robots:</span>
                      <span className="text-sm">{seoData.robots || 'Missing'}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="og" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Open Graph Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.ogTitle)} />
                      <span className="font-medium">OG Title:</span>
                      <span className="text-sm">{seoData.ogTitle || 'Missing'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.ogDescription)} />
                      <span className="font-medium">OG Description:</span>
                      <span className="text-sm">{seoData.ogDescription || 'Missing'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.ogImage)} />
                      <span className="font-medium">OG Image:</span>
                      <span className="text-sm">{seoData.ogImage || 'Missing'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.ogUrl)} />
                      <span className="font-medium">OG URL:</span>
                      <span className="text-sm">{seoData.ogUrl || 'Missing'}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="twitter" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Twitter Card Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.twitterCard)} />
                      <span className="font-medium">Card Type:</span>
                      <span className="text-sm">{seoData.twitterCard || 'Missing'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.twitterTitle)} />
                      <span className="font-medium">Twitter Title:</span>
                      <span className="text-sm">{seoData.twitterTitle || 'Missing'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.twitterDescription)} />
                      <span className="font-medium">Twitter Description:</span>
                      <span className="text-sm">{seoData.twitterDescription || 'Missing'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={getStatus(seoData.twitterImage)} />
                      <span className="font-medium">Twitter Image:</span>
                      <span className="text-sm">{seoData.twitterImage || 'Missing'}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="structured" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Structured Data</CardTitle>
                    <CardDescription>JSON-LD schemas found on this page</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {seoData.structuredData.length > 0 ? (
                      <div className="space-y-2">
                        {seoData.structuredData.map((schema: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <Badge variant="outline">{schema['@type']}</Badge>
                            <span className="text-sm">{schema.name || schema.headline || 'Unnamed'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">No structured data found</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Headings Structure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-medium">H1:</span> {seoData.headings.h1.length} found
                        {seoData.headings.h1.map((h: string, i: number) => (
                          <div key={i} className="text-sm text-muted-foreground ml-4">• {h}</div>
                        ))}
                      </div>
                      <div>
                        <span className="font-medium">H2:</span> {seoData.headings.h2.length} found
                      </div>
                      <div>
                        <span className="font-medium">H3:</span> {seoData.headings.h3.length} found
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>Total images: {seoData.images.length}</div>
                        <div>Images with alt text: {seoData.images.filter((img: any) => img.hasAlt).length}</div>
                        <div>Missing alt text: {seoData.images.filter((img: any) => !img.hasAlt).length}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Testing Tools</CardTitle>
                    <CardDescription>Test your page with external SEO tools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(testUrls).map(([name, url]) => (
                      <div key={name} className="flex items-center justify-between">
                        <span className="font-medium capitalize">{name.replace(/([A-Z])/g, ' $1')}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(url, '_blank')}
                        >
                          Test <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}