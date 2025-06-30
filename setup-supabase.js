#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up Supabase configuration...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env file from lovable.env template...');
  fs.copyFileSync(path.join(__dirname, 'lovable.env'), envPath);
  console.log('✅ .env file created successfully!\n');
} else {
  console.log('✅ .env file already exists\n');
}

console.log('🔧 Supabase Configuration Required:');
console.log('=====================================');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Select your project: ikreglaqlileqlmlgsao');
console.log('3. Go to Settings > API');
console.log('4. Copy the following values to your .env file:');
console.log('');
console.log('   SUPABASE_URL=https://ikreglaqlileqlmlgsao.supabase.co');
console.log('   SUPABASE_ANON_KEY=<your-anon-key>');
console.log('   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>');
console.log('   VITE_SUPABASE_ANON_KEY=<your-anon-key>');
console.log('');
console.log('5. Update DATABASE_URL with your connection string');
console.log('');

console.log('📋 Current .env file location:');
console.log(`   ${envPath}`);
console.log('');

console.log('🎯 Next steps:');
console.log('1. Update the .env file with your Supabase credentials');
console.log('2. Run: npm run dev (for server)');
console.log('3. Run: cd client && npx vite (for client)');
console.log('');

if (envExists) {
  console.log('📖 Current .env contents:');
  console.log('========================');
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log(envContent);
} 