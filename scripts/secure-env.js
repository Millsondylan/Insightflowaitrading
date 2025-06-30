#!/usr/bin/env node

/**
 * Secure Environment Variables Helper
 * 
 * This script helps manage environment variables securely for different environments.
 * It can:
 * 1. Create template files without actual values
 * 2. Check for sensitive data in committed files
 * 3. Validate environment variables against templates
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const ENV_TEMPLATES = {
  development: 'env.development.example',
  production: 'env.production.example',
  lovable: 'lovable.env.example'
};

const SENSITIVE_PATTERNS = [
  /api[_-]?key/i,
  /secret/i,
  /password/i,
  /token/i,
  /credential/i,
  /0x[a-fA-F0-9]{40}/,  // ETH address
  /[13][a-km-zA-HJ-NP-Z1-9]{25,34}/,  // BTC address
  /T[a-zA-Z0-9]{33}/,  // USDT address
  /sk-[a-zA-Z0-9]{48}/,  // OpenAI key pattern
  /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/,  // SendGrid key pattern
];

// Helper functions
function obfuscateValue(value) {
  if (!value) return '';
  if (value.length <= 8) return '********';
  return value.substring(0, 4) + '...' + value.substring(value.length - 4);
}

function checkForSensitiveData(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const sensitiveLines = [];
    
    lines.forEach((line, index) => {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || line.trim() === '') return;
      
      // Check for sensitive patterns
      for (const pattern of SENSITIVE_PATTERNS) {
        if (pattern.test(line)) {
          sensitiveLines.push({
            line: index + 1,
            content: line,
            match: pattern.toString()
          });
          break;
        }
      }
    });
    
    return sensitiveLines;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function createTemplate(sourceEnvPath, templatePath) {
  try {
    if (!fs.existsSync(sourceEnvPath)) {
      console.error(`Source file ${sourceEnvPath} does not exist`);
      return false;
    }
    
    const content = fs.readFileSync(sourceEnvPath, 'utf8');
    const lines = content.split('\n');
    const templateLines = [];
    
    lines.forEach(line => {
      // Keep comments and empty lines as is
      if (line.trim().startsWith('#') || line.trim() === '') {
        templateLines.push(line);
        return;
      }
      
      // Replace values with placeholders
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        templateLines.push(`${key}=your_${key.toLowerCase().replace(/[^a-z0-9]/g, '_')}_here`);
      } else {
        templateLines.push(line);
      }
    });
    
    fs.writeFileSync(templatePath, templateLines.join('\n'));
    console.log(`✅ Template created at ${templatePath}`);
    return true;
  } catch (error) {
    console.error(`Error creating template:`, error.message);
    return false;
  }
}

function validateEnvironment(envPath, templatePath) {
  try {
    if (!fs.existsSync(envPath) || !fs.existsSync(templatePath)) {
      console.error(`One or both files do not exist: ${envPath}, ${templatePath}`);
      return false;
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    
    const envVars = parseEnvFile(envContent);
    const templateVars = parseEnvFile(templateContent);
    
    const missingVars = [];
    
    // Check for missing variables
    Object.keys(templateVars).forEach(key => {
      if (!envVars[key]) {
        missingVars.push(key);
      }
    });
    
    if (missingVars.length > 0) {
      console.warn(`⚠️ Missing environment variables in ${envPath}:`);
      missingVars.forEach(key => console.warn(`  - ${key}`));
      return false;
    }
    
    console.log(`✅ All required environment variables are present in ${envPath}`);
    return true;
  } catch (error) {
    console.error(`Error validating environment:`, error.message);
    return false;
  }
}

function parseEnvFile(content) {
  const result = {};
  const lines = content.split('\n');
  
  lines.forEach(line => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') return;
    
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      result[key] = value;
    }
  });
  
  return result;
}

// Main functions
function showMenu() {
  console.log('\n🔒 Secure Environment Variables Helper\n');
  console.log('1. Create template from .env file');
  console.log('2. Check for sensitive data in files');
  console.log('3. Validate environment variables');
  console.log('4. Exit');
  
  rl.question('\nSelect an option (1-4): ', answer => {
    switch (answer.trim()) {
      case '1':
        createTemplateMenu();
        break;
      case '2':
        checkSensitiveDataMenu();
        break;
      case '3':
        validateEnvironmentMenu();
        break;
      case '4':
        rl.close();
        break;
      default:
        console.log('Invalid option');
        showMenu();
        break;
    }
  });
}

function createTemplateMenu() {
  rl.question('Enter source .env file path: ', sourceEnvPath => {
    rl.question('Enter template output path: ', templatePath => {
      if (createTemplate(sourceEnvPath, templatePath)) {
        console.log('Template created successfully');
      }
      showMenu();
    });
  });
}

function checkSensitiveDataMenu() {
  rl.question('Enter file or directory path to check: ', targetPath => {
    if (fs.existsSync(targetPath)) {
      if (fs.lstatSync(targetPath).isDirectory()) {
        checkDirectoryForSensitiveData(targetPath);
      } else {
        const sensitiveLines = checkForSensitiveData(targetPath);
        if (sensitiveLines.length > 0) {
          console.warn(`⚠️ Found ${sensitiveLines.length} potentially sensitive lines in ${targetPath}:`);
          sensitiveLines.forEach(item => {
            console.warn(`  Line ${item.line}: ${item.content.trim()} (matched ${item.match})`);
          });
        } else {
          console.log(`✅ No sensitive data found in ${targetPath}`);
        }
      }
    } else {
      console.error(`Path does not exist: ${targetPath}`);
    }
    showMenu();
  });
}

function checkDirectoryForSensitiveData(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalSensitiveFiles = 0;
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    // Skip node_modules and .git directories
    if (file === 'node_modules' || file === '.git') return;
    
    if (fs.lstatSync(filePath).isDirectory()) {
      checkDirectoryForSensitiveData(filePath);
    } else {
      // Skip binary files and non-text files
      if (!['.js', '.ts', '.json', '.md', '.txt', '.html', '.css', '.env', '.yml', '.yaml'].some(ext => file.endsWith(ext))) {
        return;
      }
      
      const sensitiveLines = checkForSensitiveData(filePath);
      if (sensitiveLines.length > 0) {
        totalSensitiveFiles++;
        console.warn(`⚠️ Found ${sensitiveLines.length} potentially sensitive lines in ${filePath}:`);
        sensitiveLines.forEach(item => {
          console.warn(`  Line ${item.line}: ${item.content.trim()} (matched ${item.match})`);
        });
      }
    }
  });
  
  if (totalSensitiveFiles === 0) {
    console.log(`✅ No sensitive data found in directory ${dirPath}`);
  } else {
    console.warn(`⚠️ Found sensitive data in ${totalSensitiveFiles} files in directory ${dirPath}`);
  }
}

function validateEnvironmentMenu() {
  rl.question('Enter .env file path: ', envPath => {
    rl.question('Enter template file path: ', templatePath => {
      validateEnvironment(envPath, templatePath);
      showMenu();
    });
  });
}

// Start the program
if (require.main === module) {
  console.log('🔒 Secure Environment Variables Helper');
  
  // Check if arguments were provided
  if (process.argv.length > 2) {
    const command = process.argv[2];
    
    switch (command) {
      case 'template':
        if (process.argv.length >= 5) {
          createTemplate(process.argv[3], process.argv[4]);
        } else {
          console.error('Usage: node secure-env.js template <source-env> <template-path>');
        }
        break;
      case 'check':
        if (process.argv.length >= 4) {
          if (fs.lstatSync(process.argv[3]).isDirectory()) {
            checkDirectoryForSensitiveData(process.argv[3]);
          } else {
            const sensitiveLines = checkForSensitiveData(process.argv[3]);
            if (sensitiveLines.length > 0) {
              console.warn(`⚠️ Found ${sensitiveLines.length} potentially sensitive lines`);
              sensitiveLines.forEach(item => {
                console.warn(`  Line ${item.line}: ${item.content.trim()}`);
              });
              process.exit(1);
            } else {
              console.log(`✅ No sensitive data found`);
            }
          }
        } else {
          console.error('Usage: node secure-env.js check <file-or-directory>');
        }
        break;
      case 'validate':
        if (process.argv.length >= 5) {
          validateEnvironment(process.argv[3], process.argv[4]);
        } else {
          console.error('Usage: node secure-env.js validate <env-file> <template-file>');
        }
        break;
      default:
        console.error('Unknown command:', command);
        console.error('Available commands: template, check, validate');
        break;
    }
    
    process.exit(0);
  } else {
    showMenu();
  }
} 