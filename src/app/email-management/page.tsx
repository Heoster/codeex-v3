import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResendEmailTest from '@/components/resend-email-test';
import DomainVerification from '@/components/domain-verification';

export const metadata: Metadata = {
  title: 'Email Management | CODEEX AI',
  description: 'Manage email configuration, DNS records, and test email functionality for CODEEX AI platform',
};

export default function EmailManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Email Management Center</h1>
          <p className="text-lg text-muted-foreground">
            Configure DNS records, verify domain setup, and test email functionality
          </p>
        </div>

        <Tabs defaultValue="verification" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="verification">Domain & DNS Setup</TabsTrigger>
            <TabsTrigger value="testing">Email Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="verification">
            <DomainVerification />
          </TabsContent>

          <TabsContent value="testing">
            <ResendEmailTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}