
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui/toaster';
import {AuthProvider} from '@/hooks/use-auth';
import LoadingManager from '@/components/loading-manager';
import PageTransition from '@/components/page-transition';
import { PWAPrompt } from '@/components/pwa-prompt';
import SwRegister from '@/components/sw-register';
import { validateStartup } from '@/lib/startup-validation';
import { StructuredData } from '@/components/seo/structured-data';
import { defaultSEO } from '@/lib/seo-config';
import { AnalyticsProvider } from '@/components/analytics/analytics-provider';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

// Run startup validation on server-side only
if (typeof window === 'undefined') {
  validateStartup();
}

export const metadata: Metadata = {
  title: {
    default: defaultSEO.title,
    template: '%s | CODEEX AI - Advanced Multi-Provider AI Assistant'
  },
  description: defaultSEO.description,
  keywords: defaultSEO.keywords,
  authors: [{ name: defaultSEO.author }],
  creator: defaultSEO.author,
  publisher: 'CODEEX AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CODEEX AI',
    startupImage: '/icons/icon-192x192.png',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://codeex-ai.netlify.app',
    siteName: 'CODEEX AI',
    title: defaultSEO.title,
    description: defaultSEO.description,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CODEEX AI - Advanced Multi-Provider AI Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@codeexai',
    creator: '@codeexai',
    title: defaultSEO.title,
    description: defaultSEO.description,
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'saWItY6SEfJPgzO6kxBCU4q3OtA9YJ8w9Nf0YE24HA0',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://codeex-ai.netlify.app',
    languages: {
      'en-US': 'https://codeex-ai.netlify.app',
      'es-ES': 'https://codeex-ai.netlify.app/es',
      'fr-FR': 'https://codeex-ai.netlify.app/fr',
      'de-DE': 'https://codeex-ai.netlify.app/de',
    },
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#020817',
    'msapplication-config': '/browserconfig.xml',
    'application-name': 'CODEEX AI',
    'apple-mobile-web-app-title': 'CODEEX AI',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#020817',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <StructuredData type="organization" />
        <StructuredData type="website" />
        <StructuredData type="softwareApplication" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.groq.com" />
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://api.groq.com" />
        <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com" />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="saWItY6SEfJPgzO6kxBCU4q3OtA9YJ8w9Nf0YE24HA0" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#020817" />
        <meta name="color-scheme" content="dark light" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    anonymize_ip: true,
                    allow_google_signals: false,
                    allow_ad_personalization_signals: false
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${manrope.variable} font-body antialiased`}>
        <AnalyticsProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <LoadingManager />
              <PageTransition>
                {children}
              </PageTransition>
              <PWAPrompt />
              <SwRegister />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
