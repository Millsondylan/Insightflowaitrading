#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The required lovable export
const LOVABLE_EXPORT = `
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 
`;

// Directories to scan
const DIRECTORIES = [
  'src/components',
  'src/pages',
  'src/contexts',
  'src/hooks',
  'src/modules',
];

// File extensions to process
const FILE_EXTENSIONS = ['.tsx', '.ts'];

// Check if a file already has the lovable export
function hasLovableExport(content) {
  return /export const lovable\s*=/.test(content);
}

// Add lovable export to a file
function addLovableExport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (hasLovableExport(content)) {
      console.log(`✅ Already has lovable export: ${filePath}`);
      return false;
    }
    
    // Check if file has React components
    if (
      (/import React|from ['"]react['"]/.test(content) || /React\.FC/.test(content)) &&
      (/<[A-Z][^>]*>/.test(content) || /function\s+[A-Z][A-Za-z]*\s*\(/.test(content) || /const\s+[A-Z][A-Za-z]*\s*=/.test(content))
    ) {
      fs.writeFileSync(filePath, content + LOVABLE_EXPORT);
      console.log(`✅ Added lovable export to: ${filePath}`);
      return true;
    }
    
    console.log(`⏩ Skipping (not a React component): ${filePath}`);
    return false;
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
        if (addLovableExport(filePath)) {
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
  console.log('🔍 Adding lovable exports to component files...');
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
  
  console.log(`\n✨ Done! Added lovable export to ${totalCount} files.`);
}

main(); 