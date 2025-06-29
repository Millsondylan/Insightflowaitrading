const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Fixing custom Div tags to standard div tags...\n');

// Find all .tsx and .lovable.tsx files
const files = glob.sync('src/**/*.{tsx,lovable.tsx}', { 
  ignore: ['node_modules/**', 'dist/**', 'build/**'] 
});

let totalFixed = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  let fixCount = 0;

  // Replace Div tags with div
  const divPatterns = [
    { from: /<Div\s/g, to: '<div ' },
    { from: /<\/Div>/g, to: '</div>' },
    { from: /<H1\s/g, to: '<h1 ' },
    { from: /<\/H1>/g, to: '</h1>' },
    { from: /<H2\s/g, to: '<h2 ' },
    { from: /<\/H2>/g, to: '</h2>' },
    { from: /<H3\s/g, to: '<h3 ' },
    { from: /<\/H3>/g, to: '</h3>' },
    { from: /<P\s/g, to: '<p ' },
    { from: /<P>/g, to: '<p>' },
    { from: /<\/P>/g, to: '</p>' },
    { from: /<Span\s/g, to: '<span ' },
    { from: /<\/Span>/g, to: '</span>' },
    { from: /<Button\s/g, to: '<button ' },
    { from: /<\/Button>/g, to: '</button>' },
  ];

  divPatterns.forEach(pattern => {
    const matches = newContent.match(pattern.from);
    if (matches) {
      fixCount += matches.length;
      newContent = newContent.replace(pattern.from, pattern.to);
    }
  });

  if (fixCount > 0) {
    fs.writeFileSync(file, newContent);
    console.log(`✅ Fixed ${fixCount} custom tags in ${file}`);
    totalFixed += fixCount;
  }
});

console.log(`\n✨ Done! Fixed ${totalFixed} custom tags in total.`); 