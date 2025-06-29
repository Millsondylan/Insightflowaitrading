#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Path to ESLint config file
const eslintConfigPath = path.join(rootDir, 'eslint.config.js');

try {
  // Read the existing ESLint config
  let content = fs.readFileSync(eslintConfigPath, 'utf8');
  
  // Check if the file already has our custom rules
  if (!content.includes('@typescript-eslint/no-explicit-any')) {
    // Update the rules section to be more lenient for lovable exports
    const updatedRules = `
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-explicit-any": "warn", // Downgrade from error to warning
      "@typescript-eslint/no-unused-vars": "warn", // Downgrade from error to warning
      "@typescript-eslint/no-unsafe-function-type": "warn", // Downgrade from error to warning
      "@typescript-eslint/no-require-imports": "warn", // Downgrade from error to warning
      "no-case-declarations": "warn", // Downgrade from error to warning
    },`;
    
    // Replace the existing rules section
    content = content.replace(/rules:\s*{[^}]+}/s, updatedRules);
    
    // Write the updated config back to the file
    fs.writeFileSync(eslintConfigPath, content);
    
    console.log('✅ ESLint config updated successfully to be more lenient with Lovable exports');
  } else {
    console.log('⚠️ ESLint config already has our custom rules');
  }
} catch (error) {
  console.error('❌ Error updating ESLint config:', error);
} 