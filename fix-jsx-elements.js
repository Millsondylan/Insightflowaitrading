#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Regex patterns for finding and fixing JSX issues
const JSX_PATTERNS = [
  // Match lowercase component tags that should be capitalized
  { 
    regex: /<(link|button|icon|authform|lessonview|themeprovider|queryclientprovider|router|arrowleft|rss|eye)\b/g, 
    replacement: (match, component) => `<${component.charAt(0).toUpperCase() + component.slice(1)}`
  },
  
  // Match self-closing tags that are missing the /
  { 
    regex: /(<[A-Z][a-zA-Z]*\s+[^>]*)\s>/g, 
    replacement: '$1 />'
  },
  
  // Match lowercase HTML element types in TypeScript
  { 
    regex: /html([a-z][a-zA-Z]+)element/g, 
    replacement: (match, element) => `HTML${element.charAt(0).toUpperCase() + element.slice(1)}Element`
  }
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

// Function to fix JSX elements in a file
function fixJsxElements(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    JSX_PATTERNS.forEach(pattern => {
      const originalContent = content;
      content = content.replace(pattern.regex, pattern.replacement);
      if (content !== originalContent) {
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed JSX elements in ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  // Starting directory (src folder in the current working directory)
  const startDir = path.join(process.cwd(), 'src');
  
  // Find all .tsx files
  console.log('🔍 Finding TypeScript files...');
  const tsxFiles = findTsxFiles(startDir);
  console.log(`📑 Found ${tsxFiles.length} TypeScript files.`);
  
  // Fix each file
  console.log('🔄 Fixing JSX elements...');
  let fixedCount = 0;
  
  for (const file of tsxFiles) {
    const fixed = fixJsxElements(file);
    if (fixed) fixedCount++;
  }
  
  console.log(`\n✨ Done! Fixed JSX elements in ${fixedCount} out of ${tsxFiles.length} files.`);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 