const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Fixing all JSX issues comprehensively...\n');

// Find all .tsx and .lovable.tsx files
const files = glob.sync('src/**/*.{tsx,lovable.tsx}', { 
  ignore: ['node_modules/**', 'dist/**', 'build/**'] 
});

let totalFixed = 0;

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    let fixCount = 0;

    // Fix common patterns
    const patterns = [
      // Fix Walletconnect to WalletConnect
      { from: /<Walletconnect\s/g, to: '<WalletConnect ' },
      { from: /<\/Walletconnect>/g, to: '</WalletConnect>' },
      
      // Fix mismatched closing tags
      { from: /<\/button>\s*<\/div>\s*<button/g, to: '</button>\n      <button' },
      
      // Fix self-closing components that should have closing tags
      { from: /<WalletConnect([^>]*)><\/WalletConnect>/g, to: '<WalletConnect$1 />' },
      
      // Fix components with improper closing
      { from: />\s*<\/([A-Z][a-zA-Z]*)\s*>/g, to: ' />' },
      
      // Fix Button vs button inconsistencies
      { from: /<Button\s/g, to: '<button ' },
      { from: /<\/Button>/g, to: '</button>' },
      
      // Fix Icon usage
      { from: /<Icon\s([^>]+)><\/Icon>/g, to: '<Icon $1 />' },
      
      // Fix Link vs link
      { from: /<link\s/g, to: '<Link ' },
      { from: /<\/link>/g, to: '</Link>' },
      
      // Remove extra closing tags
      { from: /<\/P><\/P><\/P>/g, to: '' },
      { from: /<\/div><\/div><\/div><\/div>/g, to: '' },
      
      // Fix malformed spans
      { from: /<Span\s/g, to: '<span ' },
      { from: /<\/Span>/g, to: '</span>' },
    ];

    patterns.forEach(pattern => {
      const matches = newContent.match(pattern.from);
      if (matches) {
        fixCount += matches.length;
        newContent = newContent.replace(pattern.from, pattern.to);
      }
    });

    // Fix misplaced exports
    const exportPattern = /}\s*export\s+const\s+lovable\s*=\s*{[^}]+};\s*}/;
    if (exportPattern.test(newContent)) {
      newContent = newContent.replace(exportPattern, '}\n\nexport const lovable = {\n  component: true,\n  supportsTailwind: true,\n  editableComponents: true,\n  visualEditing: true\n};');
      fixCount++;
    }

    if (fixCount > 0) {
      fs.writeFileSync(file, newContent);
      console.log(`✅ Fixed ${fixCount} issues in ${file}`);
      totalFixed += fixCount;
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n✨ Done! Fixed ${totalFixed} issues in total.`); 