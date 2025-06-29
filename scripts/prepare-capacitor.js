// Script to prepare the Vite build for Capacitor by copying the dist directory to out
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const outDir = path.resolve(__dirname, '../out');

console.log('📦 Preparing build for Capacitor...');

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory not found. Please run npm run build first.');
  process.exit(1);
}

// Create out directory if it doesn't exist
if (!fs.existsSync(outDir)) {
  console.log('📁 Creating out directory...');
  fs.mkdirSync(outDir, { recursive: true });
} else {
  // Clean out directory
  console.log('🧹 Cleaning out directory...');
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
}

// Copy dist contents to out
console.log('📋 Copying dist contents to out directory...');
try {
  // For cross-platform compatibility, use different copy commands
  if (process.platform === 'win32') {
    // Windows
    execSync(`xcopy "${distDir}\\*" "${outDir}\\" /E /I /H /Y`);
  } else {
    // macOS, Linux
    execSync(`cp -r "${distDir}/"* "${outDir}/"`);
  }
  console.log('✅ Successfully copied build files to out directory');
} catch (error) {
  console.error('❌ Error copying files:', error.message);
  process.exit(1);
}

// Copy capacitor.config.ts to the root
console.log('📋 Ensuring capacitor.config.ts is accessible...');
const capacitorConfigSource = path.resolve(__dirname, '../capacitor.config.ts');
const capacitorConfigDest = path.resolve(__dirname, '../capacitor.config.js');

// Create a JS version for Capacitor CLI
try {
  const config = fs.readFileSync(capacitorConfigSource, 'utf8');
  // Convert TypeScript to JavaScript by simply removing TS type annotations
  const jsConfig = config
    .replace(': CapacitorConfig', '')
    .replace(/import.*?;/g, '') // Remove import statements
    .replace('export default config;', 'export default config;');
  
  fs.writeFileSync(capacitorConfigDest, jsConfig);
  console.log('✅ Created Capacitor JS config file');
} catch (error) {
  console.error('❌ Error creating Capacitor JS config:', error.message);
}

console.log('✅ Build is ready for Capacitor!');
console.log('🚀 Run npx cap sync to update your native projects'); 