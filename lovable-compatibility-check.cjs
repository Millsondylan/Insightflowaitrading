#!/usr/bin/env node
/**
 * Lovable.dev Compatibility Check
 * Verifies that the project is properly configured for lovable.dev
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Lovable.dev Compatibility...\n');

const checks = [];

// Check 1: Package.json configuration
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.lovable?.framework === 'react' && packageJson.lovable?.buildTool === 'vite') {
    checks.push({ name: 'Package.json Lovable Config', status: '✅', message: 'React + Vite configured' });
  } else {
    checks.push({ name: 'Package.json Lovable Config', status: '❌', message: 'Missing or incorrect lovable config' });
  }
  
  if (packageJson.dependencies?.react && packageJson.dependencies?.['react-dom'] && packageJson.devDependencies?.vite) {
    checks.push({ name: 'React + Vite Dependencies', status: '✅', message: 'All required dependencies present' });
  } else {
    checks.push({ name: 'React + Vite Dependencies', status: '❌', message: 'Missing React or Vite dependencies' });
  }
} catch (error) {
  checks.push({ name: 'Package.json', status: '❌', message: 'Cannot read package.json' });
}

// Check 2: Vite configuration
if (fs.existsSync('vite.config.ts')) {
  checks.push({ name: 'Vite Configuration', status: '✅', message: 'vite.config.ts exists' });
} else {
  checks.push({ name: 'Vite Configuration', status: '❌', message: 'vite.config.ts missing' });
}

// Check 3: TypeScript configuration
if (fs.existsSync('tsconfig.json')) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    if (tsconfig.compilerOptions?.jsx === 'react-jsx') {
      checks.push({ name: 'TypeScript Config', status: '✅', message: 'Configured for React' });
    } else {
      checks.push({ name: 'TypeScript Config', status: '⚠️', message: 'May need React JSX configuration' });
    }
  } catch (error) {
    checks.push({ name: 'TypeScript Config', status: '❌', message: 'Cannot read tsconfig.json' });
  }
} else {
  checks.push({ name: 'TypeScript Config', status: '❌', message: 'tsconfig.json missing' });
}

// Check 4: Vite environment types
if (fs.existsSync('vite-env.d.ts')) {
  checks.push({ name: 'Vite Environment Types', status: '✅', message: 'vite-env.d.ts exists' });
} else {
  checks.push({ name: 'Vite Environment Types', status: '❌', message: 'vite-env.d.ts missing' });
}

// Check 5: Entry point
if (fs.existsSync('index.html')) {
  const html = fs.readFileSync('index.html', 'utf8');
  if (html.includes('src="/src/main.tsx"')) {
    checks.push({ name: 'HTML Entry Point', status: '✅', message: 'Points to /src/main.tsx' });
  } else {
    checks.push({ name: 'HTML Entry Point', status: '❌', message: 'Incorrect entry point' });
  }
} else {
  checks.push({ name: 'HTML Entry Point', status: '❌', message: 'index.html missing' });
}

// Check 6: Main React files
const mainFiles = ['src/main.tsx', 'src/App.tsx'];
let reactFilesOk = true;
mainFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    checks.push({ name: `React Entry (${file})`, status: '❌', message: 'Missing React entry file' });
    reactFilesOk = false;
  }
});

if (reactFilesOk && mainFiles.every(file => fs.existsSync(file))) {
  checks.push({ name: 'React Entry Files', status: '✅', message: 'main.tsx and App.tsx exist' });
}

// Check 7: Supabase configuration
if (fs.existsSync('lib/supabase.ts')) {
  const supabaseFile = fs.readFileSync('lib/supabase.ts', 'utf8');
  if (supabaseFile.includes('VITE_SUPABASE_URL')) {
    checks.push({ name: 'Supabase Configuration', status: '✅', message: 'Uses VITE_ environment variables' });
  } else {
    checks.push({ name: 'Supabase Configuration', status: '❌', message: 'Missing VITE_ environment variables' });
  }
} else {
  checks.push({ name: 'Supabase Configuration', status: '⚠️', message: 'lib/supabase.ts not found' });
}

// Check 8: Environment variables example
if (fs.existsSync('.env.example')) {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  if (envExample.includes('VITE_SUPABASE_URL')) {
    checks.push({ name: 'Environment Example', status: '✅', message: 'Uses VITE_ prefix' });
  } else {
    checks.push({ name: 'Environment Example', status: '❌', message: 'Missing VITE_ prefix' });
  }
} else {
  checks.push({ name: 'Environment Example', status: '❌', message: '.env.example missing' });
}

// Check 9: Lovable configuration files
const lovableConfigs = ['lovable.config.json', 'lovable-setup.md'];
lovableConfigs.forEach(file => {
  if (fs.existsSync(file)) {
    checks.push({ name: `Lovable Config (${file})`, status: '✅', message: 'Configuration file exists' });
  } else {
    checks.push({ name: `Lovable Config (${file})`, status: '⚠️', message: 'Optional configuration file missing' });
  }
});

// Print results
console.log('📋 Compatibility Check Results:\n');
checks.forEach(check => {
  console.log(`${check.status} ${check.name}: ${check.message}`);
});

// Summary
const passed = checks.filter(c => c.status === '✅').length;
const warnings = checks.filter(c => c.status === '⚠️').length;
const failed = checks.filter(c => c.status === '❌').length;

console.log('\n📊 Summary:');
console.log(`✅ Passed: ${passed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 Your project is ready for Lovable.dev!');
  console.log('💡 Next steps:');
  console.log('   1. Connect your repository to lovable.dev');
  console.log('   2. Set environment variables in Lovable dashboard');
  console.log('   3. Deploy and enjoy!');
} else {
  console.log('\n🔧 Please fix the failed checks before deploying to Lovable.dev');
  console.log('📖 See lovable-setup.md for detailed instructions');
}

console.log('\n🔗 Useful links:');
console.log('   - Lovable.dev: https://lovable.dev');
console.log('   - Setup Guide: ./lovable-setup.md');
console.log('   - Environment Example: ./.env.example'); 