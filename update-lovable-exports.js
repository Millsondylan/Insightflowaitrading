// update-lovable-exports.js
// Script to update all Lovable component files with the enhanced export format

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The enhanced Lovable export format
const enhancedExport = `
export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};`;

// Regular expression to match simple Lovable export
const simpleExportRegex = /export\s+const\s+lovable\s*=\s*{\s*component\s*:\s*true\s*}\s*;/;

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

// Function to update a single Lovable file
function updateLovableFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has the simple export format
    if (simpleExportRegex.test(content)) {
      // Replace the simple export with the enhanced export
      const updatedContent = content.replace(simpleExportRegex, enhancedExport);
      
      fs.writeFileSync(filePath, updatedContent);
      console.log(`✅ Updated: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  Skipped (already enhanced or different format): ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  // Starting directory (src folder in the current working directory)
  const startDir = path.join(process.cwd(), 'src');
  
  // Find all Lovable files
  console.log('🔍 Finding Lovable files...');
  const lovableFiles = findLovableFiles(startDir);
  console.log(`📑 Found ${lovableFiles.length} Lovable files.`);
  
  // Update each file
  console.log('🔄 Updating files...');
  let updatedCount = 0;
  
  for (const file of lovableFiles) {
    const updated = updateLovableFile(file);
    if (updated) updatedCount++;
  }
  
  console.log(`\n✨ Done! Updated ${updatedCount} out of ${lovableFiles.length} files.`);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 