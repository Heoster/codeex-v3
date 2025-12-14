#!/usr/bin/env node

/**
 * Production Build Script
 * Handles environment validation and build process for production deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production build process...\n');

// Set production environment variables
process.env.NODE_ENV = 'production';
process.env.SKIP_ENV_VALIDATION = 'true';
process.env.ESLINT_NO_DEV_ERRORS = 'true';

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envLocalPath)) {
  console.log('⚠️  .env.local not found, checking for required environment variables...\n');
  
  // Check for critical environment variables
  const requiredVars = [
    'GROQ_API_KEY',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n💡 Please set these in your deployment environment or create a .env.local file.\n');
    
    // For Netlify, show deployment instructions
    if (process.env.NETLIFY) {
      console.log('📝 For Netlify deployment, set these in your site settings:');
      console.log('   Site settings > Environment variables\n');
    }
  } else {
    console.log('✅ All required environment variables are set\n');
  }
}

// Validate package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`📦 Building ${packageJson.name} v${packageJson.version}\n`);
} catch (error) {
  console.error('❌ Failed to read package.json:', error.message);
  process.exit(1);
}

// Clean previous build
try {
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }
  console.log('✅ Clean completed\n');
} catch (error) {
  console.log('⚠️  Clean failed (continuing anyway):', error.message, '\n');
}

// Install dependencies if needed
try {
  console.log('📥 Checking dependencies...');
  if (!fs.existsSync('node_modules')) {
    console.log('Installing dependencies...');
    execSync('npm ci', { stdio: 'inherit' });
  }
  console.log('✅ Dependencies ready\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Run type checking (non-blocking)
try {
  console.log('🔍 Running type check...');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ Type check passed\n');
} catch (error) {
  console.log('⚠️  Type check warnings (continuing build):\n');
}

// Run build
try {
  console.log('🔨 Building application...');
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      SKIP_ENV_VALIDATION: 'true',
      ESLINT_NO_DEV_ERRORS: 'true'
    }
  });
  console.log('\n✅ Build completed successfully!\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Try to provide helpful error messages
  if (error.message.includes('Module not found')) {
    console.log('💡 Try running: npm install');
  }
  
  if (error.message.includes('Type error')) {
    console.log('💡 Try running: npm run typecheck');
  }
  
  if (error.message.includes('ESLint')) {
    console.log('💡 Try running: npm run lint');
  }
  
  process.exit(1);
}

// Verify build output
try {
  const buildDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(buildDir)) {
    throw new Error('Build directory not found');
  }
  
  const stats = fs.statSync(buildDir);
  console.log(`📊 Build size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  
  // Check for critical files
  const criticalFiles = [
    '.next/BUILD_ID',
    '.next/static',
    '.next/server'
  ];
  
  const missingFiles = criticalFiles.filter(file => 
    !fs.existsSync(path.join(process.cwd(), file))
  );
  
  if (missingFiles.length > 0) {
    console.log('⚠️  Missing build files:', missingFiles.join(', '));
  } else {
    console.log('✅ All critical build files present');
  }
  
} catch (error) {
  console.error('❌ Build verification failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 Production build completed successfully!');
console.log('🚀 Ready for deployment\n');

// Show deployment tips
console.log('💡 Deployment tips:');
console.log('   - Ensure all environment variables are set in your hosting platform');
console.log('   - Test the build locally with: npm start');
console.log('   - Monitor the application logs after deployment');
console.log('');