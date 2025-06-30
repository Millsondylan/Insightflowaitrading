#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The enhanced Lovable export format
const LOVABLE_EXPORT = `
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};`;

// Regular expression patterns
const SIMPLE_EXPORT_REGEX = /export\s+const\s+lovable\s*=\s*{\s*component\s*:\s*true\s*}\s*;/;
const ANY_LOVABLE_EXPORT_REGEX = /export\s+const\s+lovable\s*=/;

// JSX fixes
const JSX_FIXES = [
  // Match lowercase component opening tag with attributes and no closing >
  { regex: /<([a-z][a-zA-Z]+)\s+([^>]*)\s>/, replacement: (match, p1, p2) => `<${p1.charAt(0).toUpperCase() + p1.slice(1)} ${p2}>` },
  
  // Match lowercase component opening tag with no attributes and no closing >
  { regex: /<([a-z][a-zA-Z]+)\s>/, replacement: (match, p1) => `<${p1.charAt(0).toUpperCase() + p1.slice(1)}>` },
  
  // Match lowercase component self-closing tag with attributes but missing /
  { regex: /<([a-z][a-zA-Z]+)\s+([^>]*)\s>/, replacement: (match, p1, p2) => `<${p1.charAt(0).toUpperCase() + p1.slice(1)} ${p2} />` },
  
  // Match lowercase component self-closing tag without attributes
  { regex: /<([a-z][a-zA-Z]+)\s>/, replacement: (match, p1) => `<${p1.charAt(0).toUpperCase() + p1.slice(1)} />` }
];

// HTML element fixes
const HTML_ELEMENT_FIXES = [
  { regex: /html([a-z][a-zA-Z]+)element/g, replacement: (match, p1) => `HTML${p1.charAt(0).toUpperCase() + p1.slice(1)}Element` }
];

// Function to recursively find all .tsx files
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.lovable.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix an individual file
function fixFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix TypeScript HTML element types
    for (const fix of HTML_ELEMENT_FIXES) {
      if (fix.regex.test(content)) {
        content = content.replace(fix.regex, fix.replacement);
        modified = true;
        console.log(`  ✅ Fixed HTML element types`);
      }
    }
    
    // Fix JSX elements
    for (const fix of JSX_FIXES) {
      if (fix.regex.test(content)) {
        content = content.replace(fix.regex, fix.replacement);
        modified = true;
        console.log(`  ✅ Fixed JSX element capitalization`);
      }
    }
    
    // Handle Lovable exports
    if (filePath.endsWith('.lovable.tsx')) {
      if (!ANY_LOVABLE_EXPORT_REGEX.test(content)) {
        // Add Lovable export if missing
        content = content.replace(/(\s*)$/, `${LOVABLE_EXPORT}\n`);
        modified = true;
        console.log(`  ✅ Added missing Lovable export`);
      } else if (SIMPLE_EXPORT_REGEX.test(content)) {
        // Replace simple export with enhanced one
        content = content.replace(SIMPLE_EXPORT_REGEX, LOVABLE_EXPORT);
        modified = true;
        console.log(`  ✅ Enhanced existing Lovable export`);
      }
    }
    
    // Write changes back to file
    if (modified) {
      fs.writeFileSync(filePath, content);
      return true;
    } else {
      console.log(`  ℹ️ No issues found`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  // Starting directory (src folder in the current working directory)
  const startDir = path.join(process.cwd(), 'src');
  
  // Find all .tsx and .lovable.tsx files
  console.log('🔍 Finding TypeScript files...');
  const tsxFiles = findTsxFiles(startDir);
  console.log(`📑 Found ${tsxFiles.length} TypeScript files.`);
  
  // Fix each file
  console.log('🔄 Processing files...');
  let fixCount = 0;
  
  for (const file of tsxFiles) {
    const fixed = fixFile(file);
    if (fixed) fixCount++;
  }
  
  console.log(`\n✨ Done! Fixed issues in ${fixCount} out of ${tsxFiles.length} files.`);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 