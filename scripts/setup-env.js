#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Insight Flow AI Trading Platform environment...\n');

const envPath = path.join(process.cwd(), '.env.local');
const envBackupPath = path.join(process.cwd(), '.env.local.backup');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('📁 .env.local already exists. Creating backup...');
  fs.copyFileSync(envPath, envBackupPath);
  console.log('✅ Backup created as .env.local.backup');
}

// Environment variables template
const envContent = `# Insight Flow AI Trading Platform - Environment Variables
# Copy this file to .env.local and fill in your actual values

# Supabase Configuration (Required)
# Get these from https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration (Required for AI features)
# Get this from https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Stripe Configuration (Optional - for payments)
# Get these from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration (Optional - for notifications)
# Example for Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here

# Market Data APIs (Optional)
# Alpha Vantage for market data
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here

# Trading APIs (Optional)
# Alpaca for paper trading
ALPACA_API_KEY=your_alpaca_key_here
ALPACA_SECRET_KEY=your_alpaca_secret_here
ALPACA_BASE_URL=https://paper-api.alpaca.markets

# Interactive Brokers (Optional)
IB_GATEWAY_HOST=localhost
IB_GATEWAY_PORT=4001

# MT5 Integration (Optional)
MT5_SERVER=your_mt5_server_here
MT5_LOGIN=your_mt5_login_here
MT5_PASSWORD=your_mt5_password_here

# Twilio for SMS (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Analytics (Optional)
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry for error tracking (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn_here

# Custom Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Insight Flow
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_COMMUNITY_FEATURES=true
NEXT_PUBLIC_ENABLE_ACADEMY_FEATURES=true
NEXT_PUBLIC_ENABLE_COPILOT_FEATURES=true

# Development Settings
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Edit .env.local and replace placeholder values with your actual API keys');
  console.log('2. Run "npm run dev" to start the development server');
  console.log('3. Visit http://localhost:3000 to see your application');
  console.log('\n🔗 Required services to set up:');
  console.log('- Supabase: https://supabase.com (Database & Auth)');
  console.log('- OpenAI: https://platform.openai.com (AI Features)');
  console.log('- Stripe: https://stripe.com (Payments - Optional)');
  console.log('\n📚 Documentation:');
  console.log('- Supabase Setup: https://supabase.com/docs/guides/getting-started');
  console.log('- OpenAI Setup: https://platform.openai.com/docs/quickstart');
  console.log('- Stripe Setup: https://stripe.com/docs/development');
  
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  process.exit(1);
} 