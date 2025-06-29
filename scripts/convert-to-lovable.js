#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon replacements
const iconReplacements = {
  'Search': '🔍',
  'ArrowUp': '⬆️',
  'ArrowDown': '⬇️',
  'ArrowUpRight': '📈',
  'ArrowDownRight': '📉',
  'Target': '🎯',
  'Brain': '🧠',
  'Chart': '📊',
  'TrendingUp': '📈',
  'TrendingDown': '📉',
  'DollarSign': '💰',
  'Calendar': '📅',
  'Clock': '⏰',
  'User': '👤',
  'Users': '👥',
  'Settings': '⚙️',
  'Menu': '☰',
  'X': '❌',
  'Check': '✅',
  'Plus': '➕',
  'Minus': '➖',
  'Edit': '✏️',
  'Trash': '🗑️',
  'Eye': '👁️',
  'EyeOff': '🙈',
  'Home': '🏠',
  'Mail': '📧',
  'Phone': '📞',
  'Globe': '🌐',
  'Star': '⭐',
  'Heart': '❤️',
  'Bookmark': '🔖',
  'Share': '🔗',
  'Download': '⬇️',
  'Upload': '⬆️',
  'File': '📄',
  'Folder': '📁',
  'Image': '🖼️',
  'Video': '📹',
  'Music': '🎵',
  'Lock': '🔒',
  'Unlock': '🔓',
  'Key': '🔑',
  'Shield': '🛡️',
  'AlertTriangle': '⚠️',
  'Info': 'ℹ️',
  'HelpCircle': '❓',
  'CheckCircle': '✅',
  'XCircle': '❌',
  'Zap': '⚡',
  'Flame': '🔥',
  'Lightbulb': '💡'
};

// Component replacements
const componentReplacements = {
  'Button': 'button',
  'Input': 'input',
  'Select': 'select',
  'Card': 'div',
  'Dialog': 'div',
  'Sheet': 'div',
  'Accordion': 'div',
  'Tabs': 'div',
  'Progress': 'div',
  'Slider': 'input',
  'Switch': 'input',
  'Checkbox': 'input',
  'RadioGroup': 'div',
  'Textarea': 'textarea',
  'Label': 'label'
};

function convertIcons(content) {
  let converted = content;
  
  // Remove lucide-react imports
  converted = converted.replace(/import\s+{[^}]*}\s+from\s+["']lucide-react["'];?\n?/g, '');
  
  // Replace icon components with emojis
  Object.entries(iconReplacements).forEach(([iconName, emoji]) => {
    const regex = new RegExp(`<${iconName}[^>]*\\/>`, 'g');
    converted = converted.replace(regex, `<span style={{fontSize: '16px'}}>${emoji}</span>`);
    
    const selfClosingRegex = new RegExp(`<${iconName}[^>]*>`, 'g');
    converted = converted.replace(selfClosingRegex, `<span style={{fontSize: '16px'}}>${emoji}</span>`);
  });
  
  return converted;
}

function convertShadcnImports(content) {
  let converted = content;
  
  // Remove shadcn/ui imports
  converted = converted.replace(/import\s+{[^}]*}\s+from\s+["']@\/components\/ui\/[^"']+["'];?\n?/g, '');
  
  return converted;
}

function convertTailwindToInlineStyles(content) {
  // This function converts Tailwind classes to inline styles
  return content.replace(/className="([^"]*)"/g, (match, classes) => {
    const styles = classes.split(' ').map(cls => {
      // Mapping from Tailwind to CSS
      const mappings = {
        'flex': 'display: "flex"',
        'flex-col': 'flexDirection: "column"',
        'items-center': 'alignItems: "center"',
        'justify-center': 'justifyContent: "center"',
        'p-4': 'padding: "16px"',
        'p-6': 'padding: "24px"',
        'p-8': 'padding: "32px"',
        'py-8': 'paddingTop: "32px", paddingBottom: "32px"',
        'px-4': 'paddingLeft: "16px", paddingRight: "16px"',
        'mb-4': 'marginBottom: "16px"',
        'mb-8': 'marginBottom: "32px"',
        'text-white': 'color: "white"',
        'text-gray-400': 'color: "#9CA3AF"',
        'text-3xl': 'fontSize: "1.875rem"',
        'font-bold': 'fontWeight: "700"',
        'container': 'width: "100%"',
        'mx-auto': 'marginLeft: "auto", marginRight: "auto"',
        'min-h-screen': 'minHeight: "100vh"',
        'space-y-8': 'marginTop: "32px"',
        'rounded-xl': 'borderRadius: "0.75rem"',
        'bg-black': 'backgroundColor: "black"',
        'border': 'border: "1px solid #374151"',
        'w-full': 'width: "100%"'
        // Add more mappings as needed
      };
      return mappings[cls] || '';
    }).filter(Boolean).join(', ');

    return styles ? `style={{ ${styles} }}` : '';
  });
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file doesn't contain React components
    if (!content.includes('import React') && !content.includes('export')) {
      return;
    }
    
    console.log(`Processing: ${filePath}`);
    
    let converted = content;
    converted = convertIcons(converted);
    converted = convertShadcnImports(converted);
    converted = convertTailwindToInlineStyles(converted);
    
    // Create a .lovable.tsx version
    const lovableFilePath = filePath.replace('.tsx', '.lovable.tsx');
    fs.writeFileSync(lovableFilePath, converted);
    
    console.log(`Created: ${lovableFilePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (['node_modules', '.git', 'dist', 'build'].includes(file)) {
        return;
      }
      walkDirectory(filePath);
    } else if (file.endsWith('.tsx') && !file.includes('.lovable.')) {
      processFile(filePath);
    }
  });
}

function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  
  console.log('🔄 Converting components to Lovable-compatible format...');
  console.log('📁 Processing directory:', srcDir);
  
  walkDirectory(srcDir);
  
  console.log('\n✅ Conversion complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Review the generated .lovable.tsx files');
  console.log('2. Replace Tailwind classes with inline styles manually');
  console.log('3. Test components in Lovable environment');
  console.log('4. Replace original files when ready');
  console.log('\n💡 Tip: Start with utility functions in /lib - they are already Lovable-ready!');
}

main(); 