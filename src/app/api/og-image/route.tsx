/**
 * Dynamic Open Graph Image Generation
 * Generates custom OG images for different pages
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'CODEEX AI';
    const description = searchParams.get('description') || 'Advanced Multi-Provider AI Assistant';
    const theme = searchParams.get('theme') || 'dark';
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme === 'dark' ? '#020817' : '#ffffff',
            backgroundImage: theme === 'dark' 
              ? 'radial-gradient(circle at 25px 25px, #1e293b 2px, transparent 0), radial-gradient(circle at 75px 75px, #334155 2px, transparent 0)'
              : 'radial-gradient(circle at 25px 25px, #e2e8f0 2px, transparent 0), radial-gradient(circle at 75px 75px, #cbd5e1 2px, transparent 0)',
            backgroundSize: '100px 100px',
            position: 'relative',
          }}
        >
          {/* Background Gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme === 'dark'
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
            }}
          />
          
          {/* Logo/Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
              marginBottom: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              🤖
            </div>
          </div>
          
          {/* Title */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#ffffff' : '#020817',
              textAlign: 'center',
              marginBottom: '16px',
              maxWidth: '900px',
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          
          {/* Description */}
          <div
            style={{
              fontSize: '32px',
              color: theme === 'dark' ? '#94a3b8' : '#64748b',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.3,
              marginBottom: '32px',
            }}
          >
            {description}
          </div>
          
          {/* Features */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '20px',
              color: theme === 'dark' ? '#cbd5e1' : '#475569',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              Free AI Models
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
              Multi-Provider
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              Smart Fallback
            </div>
          </div>
          
          {/* URL */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              fontSize: '24px',
              color: theme === 'dark' ? '#64748b' : '#94a3b8',
            }}
          >
            codeex-ai.netlify.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}