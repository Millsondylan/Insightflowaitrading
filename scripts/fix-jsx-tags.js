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
const FILE_EXTENSIONS = ['.tsx', '.ts'];

// List of component tags that should be self-closing
const SELF_CLOSING_TAGS = [
  'img', 'input', 'hr', 'br', 'meta', 'link', 'source', 'Icon', 'Loader', 'Avatar'
];

// React components that should start with a capital letter
const COMPONENTS_TO_CAPITALIZE = [
  'div', 'span', 'button', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'form', 'label',
  'select', 'option', 'textarea', 'input', 'img', 'nav', 'header', 'footer', 'main',
  'section', 'article', 'aside', 'details', 'figcaption', 'figure', 'pre', 'code',
  'badge', 'card', 'cardheader', 'cardtitle', 'cardcontent', 'tabstrigger', 'tabslist', 'avatarfallback'
];

// JSX fixes to apply
const jsxFixes = [
  // Fix unclosed JSX tags (missing closing tag)
  {
    regex: /<([A-Z][a-zA-Z0-9]*)\b([^>]*)>(?![\s\S]*?<\/\1>)(?![\s\S]*?\/\s*>)/g,
    test: (match, tag) => !SELF_CLOSING_TAGS.includes(tag),
    replacement: (match, tag, attrs) => {
      if (SELF_CLOSING_TAGS.includes(tag)) {
        return `<${tag}${attrs} />`;
      } else {
        // If it should have a closing tag, but doesn't, we add both tags
        return `<${tag}${attrs}></${tag}>`;
      }
    },
    description: 'Add closing tag for non-self-closing components'
  },
  // Fix self-closing tags that are missing the '/'
  {
    regex: /<([A-Z][a-zA-Z0-9]*)\b([^>]*[^\/\s])>/g,
    test: (match, tag) => SELF_CLOSING_TAGS.includes(tag),
    replacement: (match, tag, attrs) => `<${tag}${attrs} />`,
    description: 'Add missing slash to self-closing tags'
  },
  // Fix lowercase component names that should be capitalized
  {
    regex: new RegExp(`<(${COMPONENTS_TO_CAPITALIZE.join('|')})\\b([^>]*)>`, 'gi'),
    test: (match, tag) => tag.toLowerCase() === tag && COMPONENTS_TO_CAPITALIZE.includes(tag.toLowerCase()),
    replacement: (match, tag, attrs) => `<${tag.charAt(0).toUpperCase() + tag.slice(1)}${attrs}>`,
    description: 'Capitalize component names'
  },
  // Fix closing tags for capitalized components
  {
    regex: new RegExp(`</(${COMPONENTS_TO_CAPITALIZE.join('|')})>`, 'gi'),
    test: (match, tag) => tag.toLowerCase() === tag && COMPONENTS_TO_CAPITALIZE.includes(tag.toLowerCase()),
    replacement: (match, tag) => `</${tag.charAt(0).toUpperCase() + tag.slice(1)}>`,
    description: 'Capitalize closing component tags'
  },
  // Fix extra spaces before closing bracket
  { 
    regex: /<([A-Za-z][a-zA-Z0-9]*)\s+([^>]*)(\s+)>/g, 
    replacement: '<$1 $2>',
    description: 'Fixing extra spaces before closing bracket'
  },
  // Fix tag mismatch (opening with one name, closing with another)
  {
    regex: /<([A-Z][a-zA-Z0-9]*)([^>]*)>[\s\S]*?<\/([A-Z][a-zA-Z0-9]*)>/g,
    test: (match, openTag, attrs, closeTag) => openTag !== closeTag,
    replacement: (match, openTag, attrs, closeTag) => {
      // Use the opening tag name for both
      return match.replace(`</${closeTag}>`, `</${openTag}>`);
    },
    description: 'Fix tag name mismatches'
  }
];

// Process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = 0;
    
    jsxFixes.forEach(pattern => {
      if (pattern.regex.test(content)) {
        // Reset regex lastIndex if needed
        if (pattern.regex.global) {
          pattern.regex.lastIndex = 0;
        }
        
        const matches = content.match(pattern.regex);
        if (matches && (!pattern.test || matches.some(m => {
          // Extract capturing groups and call test with them
          const capturingGroups = [];
          const match = pattern.regex.exec(m);
          if (match) {
            for (let i = 1; i < match.length; i++) {
              capturingGroups.push(match[i]);
            }
          }
          pattern.regex.lastIndex = 0;
          return pattern.test(m, ...capturingGroups);
        }))) {
          let newContent;
          if (typeof pattern.replacement === 'function') {
            newContent = content.replace(pattern.regex, (...args) => pattern.replacement(...args));
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
  console.log('🔍 Fixing JSX tag issues in component files...');
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
  
  console.log(`\n✨ Done! Fixed JSX tag issues in ${totalCount} files.`);
}

main(); 