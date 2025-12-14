'use client';

import { PageHeader } from '@/components/page-header';
import { UserManagement } from '@/components/user-management';
import { AutoPageSEO } from '@/components/seo/page-seo';

export default function UserManagementPage() {
  return (
    <>
      <AutoPageSEO />
      <div className="min-h-screen bg-background text-foreground">
        <PageHeader 
          backLink="/chat" 
          backText="Back to Chat" 
          title="Account & Settings"
        />
        <main className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
          <UserManagement />
        </main>
      </div>
    </>
  );
}
