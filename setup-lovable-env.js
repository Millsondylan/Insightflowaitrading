#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment variables for Lovable...');

// Read the lovable.env file
const lovableEnvPath = path.join(__dirname, 'lovable.env');
const envLocalPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(lovableEnvPath)) {
  console.error('❌ lovable.env file not found!');
  process.exit(1);
}

const lovableEnv = fs.readFileSync(lovableEnvPath, 'utf8');

// Convert Vite environment variables to Next.js format
let nextEnv = lovableEnv
  .replace(/VITE_/g, 'NEXT_PUBLIC_')
  .replace(/VITE_APP_URL=http:\/\/localhost:5173/g, 'NEXT_PUBLIC_APP_URL=http://localhost:3000')
  .replace(/VITE_API_URL=http:\/\/localhost:5050\/api/g, 'NEXT_PUBLIC_API_URL=http://localhost:3000/api')
  .replace(/VITE_IS_LOVABLE=false/g, 'NEXT_PUBLIC_IS_LOVABLE=true')
  .replace(/PORT=5050/g, 'PORT=3000');

// Add additional Next.js specific variables
nextEnv += `

# Next.js specific variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_IS_LOVABLE=true

# Ensure proper port configuration
PORT=3000
`;

// Write the .env.local file
fs.writeFileSync(envLocalPath, nextEnv);

console.log('✅ Environment variables set up successfully!');
console.log('📁 Created .env.local with Next.js compatible variables');
console.log('🔧 Make sure to update the Supabase keys in .env.local with your actual values');

// Check if Supabase keys need to be updated
const envContent = fs.readFileSync(envLocalPath, 'utf8');
if (envContent.includes('your_supabase_anon_key_here')) {
  console.log('⚠️  WARNING: Please update the Supabase keys in .env.local with your actual values');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
} 