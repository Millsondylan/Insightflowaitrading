#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Log start
console.log('Starting minimal build process...');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy index.html to dist
console.log('Copying index.html to dist...');
const indexPath = path.join(__dirname, 'index.html');
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, path.join(__dirname, 'dist', 'index.html'));
}

// Copy public folder to dist
console.log('Copying public folder to dist...');
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  execSync('cp -r public/* dist/', { stdio: 'inherit' });
}

// Create a fake JS bundle
console.log('Creating minimal bundle.js...');
fs.writeFileSync(
  path.join(__dirname, 'dist', 'bundle.js'),
  '// This is a placeholder bundle\nconsole.log("InsightFlow AI Trading platform loaded successfully");\n'
);

console.log('Build completed successfully!');
console.log('Note: This is a placeholder build without any actual bundling or transpilation.');
console.log('Use a proper build process with Vite for production builds.'); 