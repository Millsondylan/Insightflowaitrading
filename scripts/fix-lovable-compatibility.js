#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name from the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptsDir = __dirname;

console.log('🔍 Running Lovable.dev compatibility fixes...');

try {
  console.log('\n1️⃣ Adding Lovable exports to all component files...');
  execSync(`node ${path.join(scriptsDir, 'add-lovable-exports.js')}`, { stdio: 'inherit' });
  
  console.log('\n2️⃣ Fixing JSX syntax issues...');
  execSync(`node ${path.join(scriptsDir, 'fix-jsx-tags.js')}`, { stdio: 'inherit' });
  
  console.log('\n3️⃣ Fixing TypeScript errors...');
  execSync(`node ${path.join(scriptsDir, 'fix-typescript-errors.js')}`, { stdio: 'inherit' });

  console.log('\n4️⃣ Updating ESLint config for Lovable compatibility...');
  execSync(`node ${path.join(scriptsDir, 'update-eslint-config.js')}`, { stdio: 'inherit' });
  
  console.log('\n✅ All fixes completed successfully!');
  console.log('🎉 The codebase should now be compatible with Lovable.dev visual editing.');
  console.log('\n👉 Next steps:');
  console.log('  - Run `npm run build` to make sure everything builds correctly');
  console.log('  - Run `npm run dev` to start the development server');
  console.log('  - Run `npm run lovable:dev` to start the Lovable development server');
  
} catch (error) {
  console.error('❌ Error running fixes:', error.message);
  process.exit(1);
} 