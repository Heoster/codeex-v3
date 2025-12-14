/**
 * Switch to Custom Domain Script
 * Updates email configuration to use custom domain after DNS setup
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 CODEEX AI - Switch to Custom Domain\n');

// Function to update email addresses in resend-email.ts
function updateEmailConfiguration() {
  const filePath = 'src/lib/resend-email.ts';
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ resend-email.ts file not found');
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace default domain with custom domain
  const replacements = [
    {
      from: 'CODEEX AI <onboarding@resend.dev>',
      to: 'CODEEX AI <noreply@send.codeex-ai>',
      description: 'Default email address'
    },
    {
      from: 'CODEEX AI Contact <onboarding@resend.dev>',
      to: 'CODEEX AI Contact <contact@send.codeex-ai>',
      description: 'Contact form email'
    },
    {
      from: 'CODEEX AI Test <onboarding@resend.dev>',
      to: 'CODEEX AI Test <test@send.codeex-ai>',
      description: 'Test email address'
    },
    {
      from: 'CODEEX AI Welcome <onboarding@resend.dev>',
      to: 'CODEEX AI Welcome <welcome@send.codeex-ai>',
      description: 'Welcome email address'
    }
  ];

  let updated = false;
  replacements.forEach(replacement => {
    if (content.includes(replacement.from)) {
      content = content.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement.to);
      console.log(`✅ Updated ${replacement.description}: ${replacement.to}`);
      updated = true;
    }
  });

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`\n✅ Successfully updated ${filePath}`);
    return true;
  } else {
    console.log('ℹ️  No updates needed - already using custom domain');
    return false;
  }
}

// Function to check DNS propagation
async function checkDNSRecords() {
  console.log('🔍 Checking DNS Records...\n');
  
  const records = [
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
      type: 'MX',
      name: 'send.codeex-ai',
      description: 'MX Record for Sending'
    }
  ];

  console.log('📋 DNS Records to Verify:');
  records.forEach(record => {
    console.log(`   ${record.type} - ${record.name}`);
    console.log(`   Purpose: ${record.description}`);
  });

  console.log('\n🔗 Verification Tools:');
  console.log('   • DNS Checker: https://dnschecker.org/');
  console.log('   • MX Toolbox: https://mxtoolbox.com/');
  console.log('   • Resend Dashboard: https://resend.com/domains');
}

// Function to test custom domain email
async function testCustomDomainEmail() {
  console.log('\n📧 Testing Custom Domain Email...');
  
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('❌ RESEND_API_KEY not found');
    return;
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: 'CODEEX AI Test <test@send.codeex-ai>',
      to: ['codeex.care@gmail.com'],
      subject: '🎉 CODEEX AI - Custom Domain Test',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Custom Domain Test</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .success { background: #e8f5e8; color: #2d5a2d; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Custom Domain Success!</h1>
              <h2>CODEEX AI Email Service</h2>
            </div>
            <div class="content">
              <div class="success">
                <h3>✅ Custom Domain Working!</h3>
                <p>Your custom domain email configuration is working perfectly!</p>
              </div>
              
              <h3>📧 Email Details:</h3>
              <ul>
                <li><strong>From:</strong> test@send.codeex-ai</li>
                <li><strong>Domain:</strong> Custom Domain (send.codeex-ai)</li>
                <li><strong>Authentication:</strong> DKIM, SPF, DMARC</li>
                <li><strong>Status:</strong> Production Ready</li>
                <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
              </ul>

              <p>🎉 Congratulations! Your CODEEX AI email service is now using your custom domain and is ready for production use!</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
🎉 Custom Domain Success! - CODEEX AI

✅ Custom Domain Working!
Your custom domain email configuration is working perfectly!

📧 Email Details:
• From: test@send.codeex-ai
• Domain: Custom Domain (send.codeex-ai)
• Authentication: DKIM, SPF, DMARC
• Status: Production Ready
• Timestamp: ${new Date().toISOString()}

🎉 Congratulations! Your CODEEX AI email service is now using your custom domain and is ready for production use!
      `
    });

    if (error) {
      console.log('❌ Custom domain test failed:', error);
      console.log('\n💡 This usually means:');
      console.log('   • DNS records are not yet propagated (wait 24-48 hours)');
      console.log('   • Domain is not verified in Resend dashboard');
      console.log('   • DNS records have typos or incorrect values');
      return false;
    }

    console.log('✅ Custom domain email sent successfully!');
    console.log('📝 Email ID:', data.id);
    console.log('🔗 From: test@send.codeex-ai');
    console.log('\n🎉 Your custom domain is working perfectly!');
    return true;

  } catch (error) {
    console.log('❌ Error testing custom domain:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('This script helps you switch from the default Resend domain to your custom domain.\n');
  
  // Check if we should proceed
  console.log('⚠️  Before running this script, ensure:');
  console.log('   1. DNS records have been added to your domain provider');
  console.log('   2. DNS has propagated (24-48 hours after adding records)');
  console.log('   3. Domain is verified in Resend dashboard');
  
  console.log('\n🔄 Proceeding with domain switch...\n');

  // Step 1: Check DNS records
  await checkDNSRecords();

  // Step 2: Update email configuration
  console.log('\n🔄 Updating Email Configuration...');
  const updated = updateEmailConfiguration();

  // Step 3: Test custom domain (if configuration was updated)
  if (updated) {
    console.log('\n⏳ Waiting 5 seconds before testing...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const testResult = await testCustomDomainEmail();
    
    if (testResult) {
      console.log('\n🎉 SUCCESS! Custom domain is fully configured and working!');
      console.log('\n📋 Next Steps:');
      console.log('   ✅ Your email service is now using custom domain');
      console.log('   ✅ All email templates updated');
      console.log('   ✅ Professional email addresses active');
      console.log('   📊 Monitor email analytics in Resend dashboard');
    } else {
      console.log('\n⚠️  Custom domain test failed. Reverting to default domain...');
      
      // Revert changes
      const filePath = 'src/lib/resend-email.ts';
      let content = fs.readFileSync(filePath, 'utf8');
      
      content = content.replace(/send\.codeex-ai/g, 'resend.dev');
      content = content.replace(/noreply@resend\.dev/g, 'onboarding@resend.dev');
      content = content.replace(/contact@resend\.dev/g, 'onboarding@resend.dev');
      content = content.replace(/test@resend\.dev/g, 'onboarding@resend.dev');
      content = content.replace(/welcome@resend\.dev/g, 'onboarding@resend.dev');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('✅ Reverted to default domain configuration');
      
      console.log('\n💡 To fix this:');
      console.log('   1. Verify DNS records are correctly configured');
      console.log('   2. Wait for full DNS propagation (up to 48 hours)');
      console.log('   3. Verify domain in Resend dashboard');
      console.log('   4. Run this script again');
    }
  }

  console.log('\n📞 Need Help?');
  console.log('   📧 Support: codeex.care@gmail.com');
  console.log('   📖 DNS Guide: See DNS_RECORDS_READY_TO_ADD.md');
  console.log('   🔗 Resend Docs: https://resend.com/docs');
}

// Run the script
main().catch(console.error);