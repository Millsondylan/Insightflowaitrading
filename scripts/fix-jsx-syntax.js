#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to scan
const DIRECTORIES = [
  'src/components',
  'src/pages',
  'src/modules',
];

// File extensions to process
const FILE_EXTENSIONS = ['.tsx'];

// Patterns to fix
const patterns = [
  // Fix malformed JSX syntax with spaces before closing bracket
  { 
    regex: /<([A-Z][a-zA-Z0-9]*)\s+([^>]*)(\s+)>/g, 
    replacement: '<$1 $2>',
    description: 'Fixing extra spaces before closing bracket'
  },
  // Fix self-closing tags missing the slash
  { 
    regex: /<([A-Z][a-zA-Z0-9]*)\s+([^>]*[^/\s])>/g,
    test: (match) => !match.includes('</') && !match.includes('/>') && !match.includes('{') && match.includes('className'),
    replacement: '<$1 $2 />',
    description: 'Adding missing slash to self-closing tags'
  },
  // Fix lowercase component names
  { 
    regex: /<(link|button|icon)(\s+[^>]*>)/g,
    replacement: (match, tag, attrs) => `<${tag.charAt(0).toUpperCase() + tag.slice(1)}${attrs}`,
    description: 'Capitalizing component names'
  },
  // Fix HTML attributes with incorrect capitalization
  {
    regex: /className\s*=\s*["']([^"']*)["']/g,
    test: (match) => match,
    replacement: (match) => match,
    description: 'Checking for correct className usage'
  }
];

// Process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;
    
    patterns.forEach(pattern => {
      if (pattern.regex.test(content)) {
        if (!pattern.test || content.match(pattern.regex).some(pattern.test)) {
          let newContent;
          if (typeof pattern.replacement === 'function') {
            newContent = content.replace(pattern.regex, pattern.replacement);
          } else {
            newContent = content.replace(pattern.regex, pattern.replacement);
          }
          
          if (newContent !== content) {
            console.log(`✅ ${pattern.description} in ${filePath}`);
            content = newContent;
            changes++;
          }
        }
      }
    });
    
    if (changes > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`📝 Fixed ${changes} issues in ${filePath}`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Walk through directories and process files
function processDirectory(dir) {
  let count = 0;
  
  function walk(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walk(filePath); // Recursive call for directories
      } else if (FILE_EXTENSIONS.includes(path.extname(file))) {
        if (processFile(filePath)) {
          count++;
        }
      }
    }
  }
  
  walk(dir);
  return count;
}

// Main function
function main() {
  console.log('🔍 Fixing JSX syntax issues in component files...');
  let totalCount = 0;
  
  for (const dir of DIRECTORIES) {
    if (fs.existsSync(dir)) {
      console.log(`\nProcessing directory: ${dir}`);
      const count = processDirectory(dir);
      totalCount += count;
    } else {
      console.log(`⚠️ Directory not found: ${dir}`);
    }
  }
  
  console.log(`\n✨ Done! Fixed JSX issues in ${totalCount} files.`);
}

main(); 