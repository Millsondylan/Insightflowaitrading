import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// HTML elements that should be lowercase
const HTML_ELEMENTS = [
  'div', 'span', 'p', 'button', 'a', 'input', 'textarea', 'select', 'option', 
  'form', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 
  'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'img', 'video', 'audio', 'canvas', 'svg', 
  'header', 'footer', 'main', 'section', 'article', 'aside', 'nav', 'figure', 'figcaption'
];

// Regular expressions to find capitalized HTML elements
// This handles both opening and closing tags
const createRegexes = () => {
  const regexes = [];
  for (const element of HTML_ELEMENTS) {
    // Match opening tags with potential attributes - case insensitive for element name only
    regexes.push({
      search: new RegExp(`<(${element})([^>]*)>`, "gi"),
      replace: (match, p1, p2) => {
        // Only fix if the tag is capitalized (not all lowercase)
        if (p1 !== p1.toLowerCase()) {
          return `<${p1.toLowerCase()}${p2}>`;
        }
        return match;
      }
    });
    
    // Match closing tags - case insensitive for element name only
    regexes.push({
      search: new RegExp(`</(${element})>`, "gi"),
      replace: (match, p1) => {
        // Only fix if the tag is capitalized (not all lowercase)
        if (p1 !== p1.toLowerCase()) {
          return `</${p1.toLowerCase()}>`;
        }
        return match;
      }
    });
  }
  return regexes;
};

// Get all .tsx and .ts files recursively
async function getFiles(dir) {
  const subdirs = await fs.promises.readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      return (await fs.promises.stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files
    .flat()
    .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
    .filter(file => !file.includes('node_modules'));
}

async function processFile(filePath, regexes) {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    let newContent = content;
    let changes = false;

    for (const { search, replace } of regexes) {
      const result = newContent.replace(search, replace);
      if (result !== newContent) {
        changes = true;
        newContent = result;
      }
    }

    if (changes) {
      await fs.promises.writeFile(filePath, newContent, 'utf8');
      console.log(`✅ Fixed HTML elements in: ${filePath}`);
      return 1;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error);
    return 0;
  }
}

async function main() {
  try {
    console.log('🔍 Searching for files with capitalized HTML elements...');
    const files = await getFiles('src');
    const regexes = createRegexes();
    
    console.log(`📁 Found ${files.length} files to process`);
    let fixedFiles = 0;
    
    for (const file of files) {
      fixedFiles += await processFile(file, regexes);
    }
    
    console.log(`\n✨ All done! Fixed HTML elements in ${fixedFiles} files`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 