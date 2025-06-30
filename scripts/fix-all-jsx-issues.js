import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get the directory name from the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Fixing all JSX issues comprehensively...\n');

// Find all .tsx and .lovable.tsx files
const findFiles = async () => {
  return await glob('src/**/*.{tsx,lovable.tsx}', { 
    ignore: ['node_modules/**', 'dist/**', 'build/**'] 
  });
};

// Common HTML elements that should be lowercase in JSX
const htmlElements = [
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'button', 'input', 'form', 'label',
  'section', 'article', 'header', 'footer', 'nav', 'main',
  'img', 'pre', 'code', 'table', 'tr', 'td', 'th', 'thead', 'tbody'
];

// React components that should be capitalized
const reactComponents = [
  'Button', 'Card', 'CardHeader', 'CardContent', 'CardTitle', 'CardDescription', 'CardFooter',
  'Tabs', 'TabsList', 'TabsTrigger', 'TabsContent',
  'Dialog', 'DialogContent', 'DialogHeader', 'DialogTitle', 'DialogDescription', 'DialogFooter',
  'Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem',
  'Input', 'Label', 'Textarea', 'Checkbox', 'Switch', 'RadioGroup', 'RadioGroupItem',
  'Popover', 'PopoverTrigger', 'PopoverContent',
  'DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem',
  'Tooltip', 'TooltipTrigger', 'TooltipContent'
];

// Lucide icons that should be capitalized
const lucideIcons = [
  'Activity', 'AlertCircle', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp',
  'BarChart', 'BarChart2', 'BarChart3', 'Bell', 'Book', 'Calendar', 'Check',
  'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'Clock', 'Code',
  'Code2', 'Copy', 'Download', 'Edit', 'Eye', 'EyeOff', 'File', 'Filter',
  'Flag', 'Folder', 'Globe', 'Heart', 'Help', 'Home', 'Image', 'Info',
  'Link', 'List', 'Lock', 'LogIn', 'LogOut', 'Mail', 'Map', 'Menu',
  'Message', 'MessageCircle', 'MessageSquare', 'Minus', 'Monitor', 'Moon',
  'MoreHorizontal', 'MoreVertical', 'Move', 'Music', 'Paperclip', 'Pause',
  'Phone', 'Play', 'Plus', 'Power', 'RefreshCw', 'Save', 'Search', 'Send',
  'Settings', 'Share', 'Share2', 'Shield', 'ShieldOff', 'Smartphone', 'Square',
  'Star', 'Sun', 'Trash', 'Trash2', 'TrendingDown', 'TrendingUp', 'UploadCloud',
  'User', 'Users', 'Video', 'Volume', 'Volume1', 'Volume2', 'VolumeX', 'X',
  'ZoomIn', 'ZoomOut', 'Bitcoin', 'DollarSign', 'Coins'
];

const main = async () => {
  const files = await findFiles();
  let totalFixed = 0;

  // Create regex patterns for HTML elements
  const htmlElementPatterns = htmlElements.map(el => {
    const capitalized = el.charAt(0).toUpperCase() + el.slice(1);
    return { 
      from: new RegExp(`<${capitalized}(\\s|>)`, 'g'), 
      to: `<${el}$1` 
    };
  });

  const closingHtmlElementPatterns = htmlElements.map(el => {
    const capitalized = el.charAt(0).toUpperCase() + el.slice(1);
    return { 
      from: new RegExp(`</${capitalized}>`, 'g'), 
      to: `</${el}>` 
    };
  });

  // Create regex patterns for React components
  const reactComponentPatterns = reactComponents.map(comp => {
    const lowercase = comp.toLowerCase();
    return { 
      from: new RegExp(`<${lowercase}(\\s|>)`, 'g'), 
      to: `<${comp}$1` 
    };
  });

  const closingReactComponentPatterns = reactComponents.map(comp => {
    const lowercase = comp.toLowerCase();
    return { 
      from: new RegExp(`</${lowercase}>`, 'g'), 
      to: `</${comp}>` 
    };
  });

  // Create regex patterns for Lucide icons
  const lucideIconPatterns = lucideIcons.map(icon => {
    const lowercase = icon.toLowerCase();
    return { 
      from: new RegExp(`<${lowercase}(\\s|>)`, 'g'), 
      to: `<${icon}$1` 
    };
  });

  const closingLucideIconPatterns = lucideIcons.map(icon => {
    const lowercase = icon.toLowerCase();
    return { 
      from: new RegExp(`</${lowercase}>`, 'g'), 
      to: `</${icon}>` 
    };
  });

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let newContent = content;
      let fixCount = 0;

      // Fix common patterns
      const patterns = [
        // Fix self-closing tags with space before the closing bracket
        { from: /(<[A-Za-z][A-Za-z0-9]*\s+[^>]*)\s+\/>/g, to: '$1/>' },
        
        // Fix improper self-closing tags with space between / and >
        { from: /(<[A-Za-z][A-Za-z0-9]*\s+[^>]*)\/ >/g, to: '$1/>' },
        
        // Fix extremely improper self-closing tags
        { from: /(<[A-Za-z][A-Za-z0-9]*\s+[^>]*)\/\s+\/>/g, to: '$1/>' },
        
        // Fix non-self-closing tags that should be self-closing
        { from: /<(img|input|br|hr|meta|link|source|area|base|col|embed|keygen|param|track|wbr)([^>]*)><\/\1>/g, to: '<$1$2/>' },
        
        // Fix extra spaces in closing tags
        { from: /(<\/\s+)([A-Za-z][A-Za-z0-9]*\s*>)/g, to: '</$2' },
        
        // Fix missing closing tags for common elements
        { from: /<([A-Za-z][A-Za-z0-9]*)\s+([^>]*)>([^<]*)<\/\s*>/g, to: '<$1 $2>$3</$1>' },
        
        // Fix onClick handlers with spaces
        { from: /onClick={\(\)\s*=\s*\/>/g, to: 'onClick={() =>' },
        { from: /onClick={\(\)\s*=\s*>/g, to: 'onClick={() =>' },
        { from: /onClick={\(\)\s*=\s*}/g, to: 'onClick={() => {}}' },
        
        // Fix onChange handlers with spaces
        { from: /onChange={\(e\)\s*=\s*\/>/g, to: 'onChange={(e) =>' },
        { from: /onChange={\(e\)\s*=\s*>/g, to: 'onChange={(e) =>' },
        
        // Remove extra closing tags
        { from: /<\/[A-Za-z][A-Za-z0-9]*><\/[A-Za-z][A-Za-z0-9]*><\/[A-Za-z][A-Za-z0-9]*><\/[A-Za-z][A-Za-z0-9]*>/g, to: '</div></div>' },
        { from: /<\/[A-Za-z][A-Za-z0-9]*><\/[A-Za-z][A-Za-z0-9]*><\/[A-Za-z][A-Za-z0-9]*>/g, to: '</div>' },
        
        // Fix specific component issues
        { from: /<WalletConnect([^>]*)\s*>\s*<\/WalletConnect>/g, to: '<WalletConnect$1 />' },
        { from: /<Icon\s([^>]+)><\/Icon>/g, to: '<Icon $1 />' },
        { from: /<MarketDetailPage([^>]*)\s*>\s*<\/MarketDetailPage>/g, to: '<MarketDetailPage$1 />' },
        
        // Fix capitalized HTML elements
        ...htmlElementPatterns,
        ...closingHtmlElementPatterns,
        
        // Fix lowercase React components
        ...reactComponentPatterns,
        ...closingReactComponentPatterns,
        
        // Fix lowercase Lucide icons
        ...lucideIconPatterns,
        ...closingLucideIconPatterns,
        
        // Fix common mismatches
        { from: /<\/Div>/g, to: '</div>' },
        { from: /<\/P>/g, to: '</p>' },
        { from: /<\/H1>/g, to: '</h1>' },
        { from: /<\/H2>/g, to: '</h2>' },
        { from: /<\/H3>/g, to: '</h3>' },
        { from: /<\/Button>/g, to: '</button>' },
        
        // Fix specific component capitalization
        { from: /<code2\s/g, to: '<Code2 ' },
        { from: /<\/code2>/g, to: '</Code2>' },
        
        // Fix incorrect closing tags
        { from: /<\/CardDescription>\s*<\/CardFooter>\s*<\/CardFooter>/g, to: '</CardDescription>\n</CardFooter>' },
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
  }

  console.log(`\n✨ Done! Fixed ${totalFixed} issues in total.`);
};

main().catch(console.error); 