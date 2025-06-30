#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Common JSX syntax fixes
const fixes = [
  // Fix lowercase closing tags for Button components
  {
    pattern: /<\/button>/g,
    replacement: '</Button>'
  },
  // Fix lowercase closing tags for div components
  {
    pattern: /<\/div>/g,
    replacement: '</div>'
  },
  // Fix malformed JSX fragments
  {
    pattern: /<>\s*<\/[^>]+>/g,
    replacement: '<></>'
  },
  // Fix malformed closing tags with extra characters
  {
    pattern: /<\/[^>]+\s*\/\s*>/g,
    replacement: (match) => {
      const tagName = match.match(/<\/([^>\s]+)/)?.[1];
      return tagName ? `</${tagName}>` : match;
    }
  },
  // Fix malformed arrow functions in JSX
  {
    pattern: /\([^)]*\)\s*=\/>/g,
    replacement: (match) => {
      return match.replace('=/>', '=>');
    }
  },
  // Fix malformed JSX attributes
  {
    pattern: /\/\s*>/g,
    replacement: '/>'
  }
];

function fixJsxSyntax(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fixed = false;

    // Apply fixes
    fixes.forEach(fix => {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        fixed = true;
      }
    });

    // Write back if changes were made
    if (fixed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  const tsxFiles = glob.sync('src/**/*.tsx', { ignore: ['**/*.lovable.tsx', '**/node_modules/**'] });
  
  console.log(`Found ${tsxFiles.length} TSX files to process...`);
  
  let fixedCount = 0;
  
  tsxFiles.forEach(file => {
    if (fixJsxSyntax(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\nFixed ${fixedCount} files.`);
}

if (require.main === module) {
  main();
}

module.exports = { fixJsxSyntax }; 