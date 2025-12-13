/**
 * Test Email Service Script
 * Sends a test email to verify the email service is working
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function sendTestEmail() {
  const testEmailData = {
    to_email: '90freeplay98@gmail.com',
    to_name: 'Test User',
    subject: 'CODEEX AI - Email Service Test',
    message: `
🚀 CODEEX AI Email Service Test

Hello! This is a test email from CODEEX AI to verify our email service is working correctly.

📧 Email Details:
• Sent to: 90freeplay98@gmail.com
• Service: EmailJS Integration
• Status: Testing Phase
• Timestamp: ${new Date().toISOString()}

🤖 About CODEEX AI:
CODEEX AI is a comprehensive AI assistant platform featuring:

✨ Multi-Provider AI System:
• Groq (Fast inference - 14,400 req/day)
• Google Gemini 2.5 Flash
• Hugging Face Router API
• 9 AI Models with Smart Fallback

🎯 Key Features:
• Jarvis Mode with Voice Controls & Animations
• Contextual Memory System
• Visual Problem Solving (Math equations)
• Real-time Web Search with Citations
• PDF Document Analysis
• Multi-Chat Management
• PWA Support (Installable App)

🔐 Security & User Management:
• Firebase Authentication
• Email Verification
• Password Security Validation
• Privacy Policy & Terms of Service
• Complete User Profile Management

🎨 User Experience:
• Rich Jarvis Animations (8 animation states)
• Responsive Mobile Design
• Voice Recognition & Text-to-Speech
• Dark/Light Theme Support
• Professional UI/UX

If you received this email, our email service is functioning perfectly! 🎉

---
🌐 Visit CODEEX AI: ${API_BASE_URL}
📧 Support: codeex.care@gmail.com
👨‍💻 Developer: Heoster
🔗 GitHub: https://github.com/Heoster/codeex-v3

Best regards,
The CODEEX AI Team
    `.trim()
  };

  try {
    console.log('🚀 Sending test email to:', testEmailData.to_email);
    console.log('📧 Subject:', testEmailData.subject);
    
    const response = await fetch(`${API_BASE_URL}/api/send-test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmailData),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('📬 Response:', result.message);
      console.log('📊 EmailJS Response:', result.response);
    } else {
      console.error('❌ Failed to send email');
      console.error('🔍 Error:', result.error);
      if (result.details) {
        console.error('📋 Details:', result.details);
      }
    }

    return result;
  } catch (error) {
    console.error('💥 Network error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test the email service
async function testEmailService() {
  console.log('🧪 Testing CODEEX AI Email Service...\n');
  
  // First, check if the API is running
  try {
    const healthCheck = await fetch(`${API_BASE_URL}/api/send-test-email`);
    const healthResult = await healthCheck.json();
    console.log('🏥 API Health Check:', healthResult.message);
  } catch (error) {
    console.error('⚠️  API Health Check Failed:', error.message);
    console.log('💡 Make sure the development server is running: npm run dev');
    return;
  }

  // Send the test email
  const result = await sendTestEmail();
  
  console.log('\n📊 Test Results:');
  console.log('================');
  console.log('Success:', result.success ? '✅' : '❌');
  console.log('Target Email: 90freeplay98@gmail.com');
  console.log('Service: EmailJS Integration');
  console.log('Timestamp:', new Date().toLocaleString());
  
  if (result.success) {
    console.log('\n🎉 Email service is working correctly!');
    console.log('📧 Check the inbox at 90freeplay98@gmail.com');
  } else {
    console.log('\n🔧 Email service needs configuration:');
    console.log('1. Set up EmailJS account at https://www.emailjs.com/');
    console.log('2. Add EmailJS credentials to .env.local:');
    console.log('   - NEXT_PUBLIC_EMAILJS_SERVICE_ID');
    console.log('   - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID');
    console.log('   - NEXT_PUBLIC_EMAILJS_USER_ID');
    console.log('   - NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');
  }
}

// Run the test
if (require.main === module) {
  testEmailService().catch(console.error);
}

module.exports = { sendTestEmail, testEmailService };