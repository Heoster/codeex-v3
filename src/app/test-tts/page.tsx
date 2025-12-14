'use client';

import { TTSTest } from '@/components/tts-test';
import { PageHeader } from '@/components/page-header';

export default function TestTTSPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        backLink="/chat" 
        backText="Back to Chat" 
        title="Enhanced TTS Test"
      />
      <main className="container mx-auto px-4 py-8">
        <TTSTest />
      </main>
    </div>
  );
}