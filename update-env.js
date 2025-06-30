#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Updating .env file with correct port...\n');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Replace port 5000 with 5050
const updatedContent = envContent
  .replace(/PORT=5000/g, 'PORT=5050')
  .replace(/VITE_API_URL=http:\/\/localhost:5000\/api/g, 'VITE_API_URL=http://localhost:5050/api');

fs.writeFileSync(envPath, updatedContent);

console.log('✅ .env file updated successfully!');
console.log('   - PORT changed from 5000 to 5050');
console.log('   - VITE_API_URL updated to use port 5050');
console.log('');
console.log('📋 Updated .env contents:');
console.log('========================');
console.log(updatedContent); 