import { Metadata } from 'next';
import ResendEmailTest from '@/components/resend-email-test';

export const metadata: Metadata = {
  title: 'Resend Email Test | CODEEX AI',
  description: 'Test the Resend email service integration for CODEEX AI platform',
};

export default function TestResendPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <ResendEmailTest />
    </div>
  );
}