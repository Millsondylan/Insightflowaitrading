#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tailwindToCssMap = {
  // Add an extensive list of Tailwind to CSS conversions here
  'text-xs': 'fontSize: "0.75rem"',
  'text-sm': 'fontSize: "0.875rem"',
  'text-base': 'fontSize: "1rem"',
  'text-lg': 'fontSize: "1.125rem"',
  'text-xl': 'fontSize: "1.25rem"',
  'font-bold': 'fontWeight: "700"',
  'font-normal': 'fontWeight: "400"',
  'text-white': 'color: "white"',
  'text-black': 'color: "black"',
  'bg-white': 'backgroundColor: "white"',
  'bg-black': 'backgroundColor: "black"',
  'p-4': 'padding: "1rem"',
  'm-4': 'margin: "1rem"',
  'flex': 'display: "flex"',
  'grid': 'display: "grid"',
  'hidden': 'display: "none"',
  'block': 'display: "block"',
  'inline-block': 'display: "inline-block"',
  'justify-center': 'justifyContent: "center"',
  'items-center': 'alignItems: "center"',
  'w-full': 'width: "100%"',
  'h-full': 'height: "100%"',
  'rounded-md': 'borderRadius: "0.375rem"',
  'rounded-lg': 'borderRadius: "0.5rem"',
  'border': 'border: "1px solid #E5E7EB"',
};

function convertClassNameToStyle(className) {
  if (!className) return '';
  const styles = className.split(' ').map(cls => tailwindToCssMap[cls]).filter(Boolean).join(', ');
  return styles ? `style={{ ${styles} }}` : '';
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace JSX components and convert classNames
  content = content.replace(/<([A-Z][a-zA-Z0-9]*)\s*([^>]*)>/g, (match, componentName, attrs) => {
    const props = attrs.match(/([a-zA-Z]+)="([^"]*)"/g) || [];
    let className = '';
    const otherProps = [];

    props.forEach(prop => {
      const [key, value] = prop.split('=');
      if (key === 'className') {
        className = value.replace(/"/g, '');
      } else {
        otherProps.push(prop);
      }
    });

    const style = convertClassNameToStyle(className);
    const newTag = componentName.toLowerCase(); // Simple conversion
    return `<${newTag} ${otherProps.join(' ')} ${style}>`;
  });

  // Add lovable export if not present
  if (!content.includes('export const lovable')) {
    content += `\nexport const lovable = { component: true };\n`;
  }

  const lovablePath = filePath.replace('.tsx', '.lovable.tsx');
  fs.writeFileSync(lovablePath, content);
  console.log(`Successfully converted ${filePath} to ${lovablePath}`);
}

function traverseDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.endsWith('.lovable.tsx')) {
      processFile(fullPath);
    }
  });
}

const srcPath = path.join(__dirname, '..', 'src');
traverseDir(srcPath);

console.log('Advanced conversion to Lovable components is complete.'); 