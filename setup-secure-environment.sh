#!/bin/bash

echo "🔒 Setting up secure environment for lovable.dev..."
echo ""

# Create .env for lovable.dev (client-side safe variables only)
cat > .env << 'ENV_EOF'
# InsightFlow AI - Lovable.dev Safe Environment Variables

# Supabase (Public configuration)
VITE_SUPABASE_URL=https://ikreglaqlileqlmlgsao.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcmVnbGFxbGlsZXFsbWxnc2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDA4MTUsImV4cCI6MjA2NjA3NjgxNX0.j9-is9odQop9HCjIKa_UqyWFGWl8fSOmWObh0WZV3s0

# Crypto Wallet Addresses (Public)
VITE_RECEIVE_ETH_ADDRESS=0xb0b544e9c4f8b549df60cd752f47fe7d3564d080
VITE_RECEIVE_USDT_ADDRESS=TLEgUbALuXwV49RbJFRhMpaX23AYjC9Dwc
VITE_RECEIVE_BTC_ADDRESS=1KcYGjJnNduK72rEt8LZyzZeZ3BGGwGYT

# App Configuration
VITE_APP_URL=http://localhost:3000
VITE_APP_NAME=InsightFlow AI
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_COMMUNITY_FEATURES=true
VITE_ENABLE_ACADEMY_FEATURES=true
VITE_ENABLE_COPILOT_FEATURES=true
VITE_ENABLE_CRYPTO_PAYMENTS=true

# Development Settings
VITE_DEBUG_MODE=true
VITE_DEMO_MODE=false
ENV_EOF

echo "✅ Created .env with client-side safe variables"
echo ""
echo "📋 Lovable.dev Environment Variables (copy these to Lovable dashboard):"
echo "VITE_SUPABASE_URL=https://ikreglaqlileqlmlgsao.supabase.co"
echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcmVnbGFxbGlsZXFsbWxnc2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDA4MTUsImV4cCI6MjA2NjA3NjgxNX0.j9-is9odQop9HCjIKa_UqyWFGWl8fSOmWObh0WZV3s0"
echo "VITE_RECEIVE_ETH_ADDRESS=0xb0b544e9c4f8b549df60cd752f47fe7d3564d080"
echo "VITE_RECEIVE_USDT_ADDRESS=TLEgUbALuXwV49RbJFRhMpaX23AYjC9Dwc"
echo "VITE_RECEIVE_BTC_ADDRESS=1KcYGjJnNduK72rEt8LZyzZeZ3BGGwGYT"
echo "VITE_ENABLE_AI_FEATURES=true"
echo "VITE_ENABLE_CRYPTO_PAYMENTS=true"
echo ""
echo "⚠️  IMPORTANT: Sensitive API keys are stored in .env.secure"
echo "    Set up Supabase Edge Functions to use these securely!"
echo ""
echo "📖 Next steps:"
echo "1. Run 'node lovable-compatibility-check.cjs' to verify setup"
echo "2. Deploy to lovable.dev with the environment variables above"
echo "3. Set up Supabase Edge Functions for API keys (see SECURITY-NOTICE.md)"

