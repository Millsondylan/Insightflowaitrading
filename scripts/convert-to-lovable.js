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
  let converted = content;
  
  // Basic Tailwind to inline style conversions
  const tailwindMappings = {
    'className="': 'style={{',
    'flex': 'display: "flex"',
    'flex-col': 'flexDirection: "column"',
    'flex-row': 'flexDirection: "row"',
    'items-center': 'alignItems: "center"',
    'justify-center': 'justifyContent: "center"',
    'justify-between': 'justifyContent: "space-between"',
    'gap-2': 'gap: "8px"',
    'gap-4': 'gap: "16px"',
    'gap-6': 'gap: "24px"',
    'p-2': 'padding: "8px"',
    'p-4': 'padding: "16px"',
    'p-6': 'padding: "24px"',
    'bg-black': 'backgroundColor: "black"',
    'bg-white': 'backgroundColor: "white"',
    'text-white': 'color: "white"',
    'text-black': 'color: "black"',
    'rounded': 'borderRadius: "8px"',
    'rounded-lg': 'borderRadius: "12px"',
    'rounded-full': 'borderRadius: "50%"',
    'border': 'border: "1px solid"',
    'w-full': 'width: "100%"',
    'h-full': 'height: "100%"',
    'cursor-pointer': 'cursor: "pointer"',
    'hover:bg-gray-100': 'transition: "background-color 0.2s"'
  };
  
  // This is a simplified conversion - a full converter would be much more complex
  console.log('Note: Tailwind conversion is simplified. Manual review required.');
  
  return converted;
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
    // converted = convertTailwindToInlineStyles(converted); // Commented out as it's complex
    
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