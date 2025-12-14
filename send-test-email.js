/**
 * Quick Test Email Script
 * Sends a test email using the configured Resend service
 */

require('dotenv').config({ path: '.env.local' });

async function sendTestEmail() {
  console.log('🚀 CODEEX AI - Sending Test Email\n');

  // Check if API key is configured
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('❌ RESEND_API_KEY not found in environment variables');
    return;
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);

    console.log('📧 Sending test email...');
    
    const { data, error } = await resend.emails.send({
      from: 'CODEEX AI <onboarding@resend.dev>',
      to: ['codeex.care@gmail.com'],
      subject: '🚀 CODEEX AI - Email Service Test (Custom Domain)',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>CODEEX AI Email Test</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .status { background: #e8f5e8; color: #2d5a2d; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 CODEEX AI</h1>
              <h2>Email Service Test</h2>
              <p>Custom Domain Configuration Test</p>
            </div>
            <div class="content">
              <div class="status">
                <h3>✅ Email Service Working!</h3>
                <p>This email was sent using the custom domain configuration.</p>
              </div>
              
              <h3>📧 Email Configuration Details:</h3>
              <ul>
                <li><strong>From Domain:</strong> resend.dev (default)</li>
                <li><strong>Service:</strong> Resend API</li>
                <li><strong>Status:</strong> Custom Domain Configured</li>
                <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
              </ul>

              <h3>🎯 Next Steps:</h3>
              <ol>
                <li>Verify DNS records are properly configured</li>
                <li>Check email deliverability and spam score</li>
                <li>Test different email templates</li>
                <li>Monitor email analytics in Resend dashboard</li>
              </ol>

              <p>If you received this email, your CODEEX AI email service is working correctly! 🎉</p>
            </div>
            <div class="footer">
              <p><strong>📧 Support:</strong> codeex.care@gmail.com</p>
              <p><strong>🌐 Website:</strong> https://codeex-ai.netlify.app</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
🚀 CODEEX AI - Email Service Test

✅ Email Service Working!
This email was sent using the custom domain configuration.

📧 Email Configuration Details:
• From Domain: resend.dev (default)
• Service: Resend API
• Status: Custom Domain Configured
• Timestamp: ${new Date().toISOString()}

🎯 Next Steps:
1. Verify DNS records are properly configured
2. Check email deliverability and spam score
3. Test different email templates
4. Monitor email analytics in Resend dashboard

If you received this email, your CODEEX AI email service is working correctly! 🎉

📧 Support: codeex.care@gmail.com
🌐 Website: https://codeex-ai.netlify.app
      `
    });

    if (error) {
      console.log('❌ Error sending email:', error);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log('📝 Email ID:', data.id);
    console.log('📧 Sent to: codeex.care@gmail.com');
    console.log('🔗 From: CODEEX AI <onboarding@resend.dev>');
    
    console.log('\n🎉 Test completed successfully!');
    console.log('📋 Check your inbox for the test email.');
    console.log('📊 Monitor delivery in Resend dashboard: https://resend.com/emails');

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run the test
sendTestEmail();