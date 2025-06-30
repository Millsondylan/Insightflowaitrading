#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Setting up environment configuration...\n');

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

if (isDev) {
  console.log('📝 Development mode detected');
  console.log('✅ Supabase client will use mock data automatically');
  console.log('✅ No real database connection required');
  console.log('✅ The "supabaseKey is required" error should be resolved\n');
  
  console.log('🎯 To use real Supabase:');
  console.log('1. Get your Supabase project URL and anon key from https://supabase.com/dashboard');
  console.log('2. Create a .env file in the root directory with:');
  console.log('');
  console.log('   VITE_SUPABASE_URL=your_supabase_url');
  console.log('   VITE_SUPABASE_ANON_KEY=your_anon_key');
  console.log('   VITE_DEMO_MODE=false');
  console.log('');
} else {
  console.log('🚀 Production mode detected');
  console.log('⚠️ Make sure to set proper Supabase credentials in your environment');
}

// Environment configuration setup
const setupEnvironment = () => {
  const rootEnvPath = path.join(__dirname, '..', '.env');
  const clientEnvPath = path.join(__dirname, '..', 'client', '.env');
  
  const envTemplate = `# Supabase Configuration
VITE_SUPABASE_URL=${process.env.VITE_SUPABASE_URL || 'https://ikreglaqlileqlmlgsao.supabase.co'}
VITE_SUPABASE_ANON_KEY=${process.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here'}

# Crypto Receive Wallets
VITE_RECEIVE_ETH_ADDRESS=${process.env.VITE_RECEIVE_ETH_ADDRESS || '0xb0b544e9c4f8b549df60cd752f47fe7d3564d080'}
VITE_RECEIVE_USDT_ADDRESS=${process.env.VITE_RECEIVE_USDT_ADDRESS || 'TLEgUbALuXwV49RbJFRhMpaX23AYjC9Dwc'}
VITE_RECEIVE_BTC_ADDRESS=${process.env.VITE_RECEIVE_BTC_ADDRESS || '1KcYGjJnNduK72rEt8LZyzZeZ3BGGwGYT'}

# AI Providers
OPENAI_API_KEY=${process.env.OPENAI_API_KEY || ''}
GROQ_API_KEY=${process.env.GROQ_API_KEY || ''}
GEMINI_API_KEY=${process.env.GEMINI_API_KEY || ''}

# Market Data
YFINANCE_API_KEY=${process.env.YFINANCE_API_KEY || ''}
COINGECKO_API_KEY=${process.env.COINGECKO_API_KEY || ''}
ALPHA_VANTAGE_API_KEY=${process.env.ALPHA_VANTAGE_API_KEY || ''}
POLYGON_API_KEY=${process.env.POLYGON_API_KEY || ''}
EXCHANGERATE_API_KEY=${process.env.EXCHANGERATE_API_KEY || ''}
FIXER_API_KEY=${process.env.FIXER_API_KEY || ''}
FMP_API_KEY=${process.env.FMP_API_KEY || ''}
ETHERSCAN_API_KEY=${process.env.ETHERSCAN_API_KEY || ''}
FINNHUB_API_KEY=${process.env.FINNHUB_API_KEY || ''}
NEWS_API_KEY=${process.env.NEWS_API_KEY || ''}

# Messaging / Bots
TELEGRAM_BOT_TOKEN=${process.env.TELEGRAM_BOT_TOKEN || ''}

# Email
SENDGRID_API_KEY=${process.env.SENDGRID_API_KEY || ''}
MAILGUN_API_KEY=${process.env.MAILGUN_API_KEY || ''}

# Demo Mode Settings
VITE_DEMO_MODE=false
VITE_USE_MOCK_DATA=false

# Feature Flags
VITE_ENABLE_CRYPTO_PAYMENTS=true
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_VOICE_CHAT=true
VITE_ENABLE_ADMIN_PANEL=true

NODE_ENV=development
VITE_IS_LOVABLE=false
`;

  // Create .env files if they don't exist
  if (!fs.existsSync(rootEnvPath)) {
    fs.writeFileSync(rootEnvPath, envTemplate);
    console.log('✅ Created root .env file');
  }
  
  if (!fs.existsSync(clientEnvPath)) {
    fs.writeFileSync(clientEnvPath, envTemplate);
    console.log('✅ Created client .env file');
  }
  
  // Validate existing .env files
  const envVars = dotenv.config({ path: rootEnvPath }).parsed || {};
  
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredVars.filter(v => !envVars[v]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.log('⚠️  Make sure to set proper Supabase credentials in your environment');
  }
  
  console.log('✅ Environment setup complete');
};

setupEnvironment();

export { setupEnvironment };

console.log('✨ Environment setup complete!');
console.log('🔄 Restart your development server if needed'); 