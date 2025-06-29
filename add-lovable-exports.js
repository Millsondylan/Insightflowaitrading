#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The required Lovable export format
const LOVABLE_EXPORT = `
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};`;

// Regular expression patterns
const EXISTING_LOVABLE_EXPORT = /export\s+const\s+lovable\s*=/;

// Function to recursively find all .lovable.tsx files
function findLovableFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findLovableFiles(filePath, fileList);
    } else if (file.endsWith('.lovable.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to extract component name from file path
function getComponentName(filePath) {
  const basename = path.basename(filePath);
  // Remove .lovable.tsx extension
  return basename.replace(/\.lovable\.tsx$/, '');
}

// Function to add Lovable export to a file
function addLovableExport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has a Lovable export
    if (EXISTING_LOVABLE_EXPORT.test(content)) {
      console.log(`ℹ️ ${filePath} already has a Lovable export`);
      return false;
    }
    
    // Add the Lovable export at the end of the file
    const updatedContent = content + LOVABLE_EXPORT + '\n';
    
    // Write back to file
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ Added Lovable export to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  // Starting directory (src folder in the current working directory)
  const startDir = path.join(process.cwd(), 'src');
  
  // Find all .lovable.tsx files
  console.log('🔍 Finding Lovable files...');
  const lovableFiles = findLovableFiles(startDir);
  console.log(`📑 Found ${lovableFiles.length} Lovable files.`);
  
  // Add Lovable export to each file
  console.log('🔄 Adding Lovable exports...');
  let addedCount = 0;
  
  for (const file of lovableFiles) {
    const added = addLovableExport(file);
    if (added) addedCount++;
  }
  
  console.log(`\n✨ Done! Added Lovable exports to ${addedCount} files (${lovableFiles.length - addedCount} already had exports).`);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 