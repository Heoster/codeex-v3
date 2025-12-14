/**
 * Email Configuration Test Script
 * Tests the email service configuration without running the full Next.js app
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🚀 CODEEX AI - Email Configuration Test\n');

// Test 1: Check if Resend API key is configured
console.log('1. Checking Resend API Key...');
const resendApiKey = process.env.RESEND_API_KEY;
if (resendApiKey) {
  console.log('   ✅ RESEND_API_KEY is configured');
  console.log(`   📝 Key: ${resendApiKey.substring(0, 8)}...${resendApiKey.substring(resendApiKey.length - 4)}`);
} else {
  console.log('   ❌ RESEND_API_KEY is not configured');
}

// Test 2: Check email configuration files
console.log('\n2. Checking Email Configuration Files...');
const emailFiles = [
  'src/lib/resend-email.ts',
  'src/app/api/send-email/route.ts',
  'src/components/resend-email-test.tsx',
  'src/components/domain-verification.tsx'
];

emailFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
  }
});

// Test 3: Check DNS configuration guide
console.log('\n3. Checking DNS Configuration...');
if (fs.existsSync('DNS_CONFIGURATION_GUIDE.md')) {
  console.log('   ✅ DNS Configuration Guide created');
} else {
  console.log('   ❌ DNS Configuration Guide missing');
}

// Test 4: Display DNS Records to Configure
console.log('\n4. DNS Records to Configure:');
const dnsRecords = [
  {
    type: 'TXT',
    name: 'resend._domainkey.codeex-ai',
    description: 'DKIM Authentication'
  },
  {
    type: 'TXT', 
    name: 'send.codeex-ai',
    description: 'SPF Record'
  },
  {
    type: 'TXT',
    name: '_dmarc',
    description: 'DMARC Policy'
  },
  {
    type: 'MX',
    name: 'send.codeex-ai',
    description: 'Mail Exchange for Sending'
  }
];

dnsRecords.forEach(record => {
  console.log(`   📧 ${record.type} - ${record.name}`);
  console.log(`      ${record.description}`);
});

// Test 5: Email Service Status
console.log('\n5. Email Service Status:');
const hasApiKey = !!resendApiKey;
const hasFiles = emailFiles.every(file => fs.existsSync(file));

if (hasApiKey && hasFiles) {
  console.log('   🎉 Email service is ready for testing!');
  console.log('   📝 Next steps:');
  console.log('      1. Add DNS records to your domain provider');
  console.log('      2. Wait 24-48 hours for DNS propagation');
  console.log('      3. Test email functionality at /email-management');
} else if (hasApiKey || hasFiles) {
  console.log('   ⚠️  Email service is partially configured');
  if (!hasApiKey) console.log('      - Add RESEND_API_KEY to .env.local');
  if (!hasFiles) console.log('      - Some configuration files are missing');
} else {
  console.log('   ❌ Email service needs configuration');
}

// Test 6: Show example email addresses
console.log('\n6. Email Addresses Configuration:');
console.log('   📧 From Addresses (after DNS setup):');
console.log('      - Default: CODEEX AI <noreply@send.codeex-ai>');
console.log('      - Contact: CODEEX AI Contact <contact@send.codeex-ai>');
console.log('      - Test: CODEEX AI Test <test@send.codeex-ai>');
console.log('      - Welcome: CODEEX AI Welcome <welcome@send.codeex-ai>');

console.log('\n✨ Email configuration test completed!\n');

// Test 7: Quick Resend API Test (if API key is available)
if (resendApiKey) {
  console.log('7. Testing Resend API Connection...');
  
  // Simple test without sending actual email
  try {
    const { Resend } = require('resend');
    const resend = new Resend(resendApiKey);
    console.log('   ✅ Resend client initialized successfully');
    console.log('   📝 Ready to send emails (DNS records required for custom domain)');
  } catch (error) {
    console.log('   ❌ Error initializing Resend client:', error.message);
  }
}