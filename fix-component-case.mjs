import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Standard HTML elements that should always be lowercase
const HTML_ELEMENTS = [
  'div', 'span', 'p', 'button', 'a', 'input', 'textarea', 'select', 'option', 
  'form', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 
  'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'img', 'video', 'audio', 'canvas', 'svg', 
  'header', 'footer', 'main', 'section', 'article', 'aside', 'nav', 'figure', 'figcaption',
  'br', 'hr', 'pre', 'code', 'em', 'strong', 'i', 'b', 'small', 'sub', 'sup', 'mark',
  'del', 'ins', 'progress', 'time', 'address', 'abbr', 'cite', 'blockquote', 'fieldset',
  'legend', 'iframe', 'details', 'summary', 'dialog', 'menu', 'menuitem', 'source', 'track',
  'embed', 'object', 'param'
];

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

// Fix a single file
async function processFile(filePath) {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    let newContent = content;
    let changed = false;

    // 1. Create a set of imported components to preserve their casing
    const importedComponentsSet = new Set();
    
    // Match imported components 
    const importRegex = /import\s+{([^}]+)}\s+from/g;
    let importMatch;
    while((importMatch = importRegex.exec(content)) !== null) {
      const imports = importMatch[1].split(',');
      imports.forEach(imp => {
        // Handle renamed imports like "Button as MyButton"
        const parts = imp.trim().split(' as ');
        if (parts.length > 1) {
          importedComponentsSet.add(parts[1].trim());
        } else {
          importedComponentsSet.add(parts[0].trim());
        }
      });
    }
    
    // Match default imports
    const defaultImportRegex = /import\s+([A-Za-z0-9_]+)\s+from/g;
    let defaultImportMatch;
    while((defaultImportMatch = defaultImportRegex.exec(content)) !== null) {
      importedComponentsSet.add(defaultImportMatch[1].trim());
    }

    // 2. Create a regex pattern to match HTML elements while preserving component casing
    const htmlElementsPattern = HTML_ELEMENTS.join('|');
    
    // Match opening tags with attributes
    const openingTagRegex = new RegExp(`<(${htmlElementsPattern})([^>]*)>`, 'gi');
    newContent = newContent.replace(openingTagRegex, (match, tagName, attrs) => {
      if (tagName.toLowerCase() !== tagName) {
        changed = true;
        return `<${tagName.toLowerCase()}${attrs}>`;
      }
      return match;
    });
    
    // Match closing tags
    const closingTagRegex = new RegExp(`</(${htmlElementsPattern})>`, 'gi');
    newContent = newContent.replace(closingTagRegex, (match, tagName) => {
      if (tagName.toLowerCase() !== tagName) {
        changed = true;
        return `</${tagName.toLowerCase()}>`;
      }
      return match;
    });
    
    // 3. Fix cases where opening tag has different case than closing tag
    const openTagsRegex = /<([A-Za-z][A-Za-z0-9_]*)/g;
    const allTags = [];
    let tagMatch;
    
    while((tagMatch = openTagsRegex.exec(newContent)) !== null) {
      const tagName = tagMatch[1];
      // Skip self-closing tags and HTML tags
      if (!HTML_ELEMENTS.includes(tagName.toLowerCase())) {
        allTags.push(tagName);
      }
    }
    
    // Track what case should be used for each component
    const componentCase = {};
    allTags.forEach(tag => {
      const lowerTag = tag.toLowerCase();
      
      // Skip HTML elements
      if (HTML_ELEMENTS.includes(lowerTag)) {
        return;
      }
      
      // If it's an imported component, always use PascalCase
      if (importedComponentsSet.has(tag)) {
        componentCase[lowerTag] = tag;
        return;
      }
      
      // For other tags not explicitly imported, use PascalCase if first letter is uppercase
      if (tag[0] === tag[0].toUpperCase() && !componentCase[lowerTag]) {
        componentCase[lowerTag] = tag;
      }
    });
    
    // Fix case consistency for all component tags
    Object.entries(componentCase).forEach(([lowerTag, correctCase]) => {
      // Fix opening tags
      const openFixRegex = new RegExp(`<(${lowerTag})([^>]*)>`, 'gi');
      newContent = newContent.replace(openFixRegex, (match, tagName, attrs) => {
        if (tagName !== correctCase) {
          changed = true;
          return `<${correctCase}${attrs}>`;
        }
        return match;
      });
      
      // Fix closing tags
      const closeFixRegex = new RegExp(`</(${lowerTag})>`, 'gi');
      newContent = newContent.replace(closeFixRegex, (match, tagName) => {
        if (tagName !== correctCase) {
          changed = true;
          return `</${correctCase}>`;
        }
        return match;
      });
    });

    if (changed) {
      await fs.promises.writeFile(filePath, newContent, 'utf8');
      console.log(`✅ Fixed component casing in: ${filePath}`);
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
    console.log('🔍 Analyzing and fixing component case issues...');
    const files = await getFiles('src');
    
    console.log(`📁 Found ${files.length} files to analyze`);
    let fixedFiles = 0;
    
    // Process files sequentially to avoid overwhelming the system
    for (const file of files) {
      fixedFiles += await processFile(file);
    }
    
    console.log(`\n✨ All done! Fixed component casing in ${fixedFiles} files`);
    
    if (fixedFiles > 0) {
      console.log("\n🔹 The script preserved case for React components while ensuring HTML elements use lowercase.");
      console.log("🔹 If you still see TypeScript errors, you may need to manually check specific components.");
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 