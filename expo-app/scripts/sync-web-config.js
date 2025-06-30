#!/usr/bin/env node

/**
 * This script syncs configuration from the web app to the mobile app.
 * It copies over Supabase configuration, environment variables, and i18n files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const chalk = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
};

// Ask a question and get user input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Copy and process the envionment variables from web app to mobile app
const syncEnvironmentVariables = async (webAppPath) => {
  console.log(chalk.bold('\nSyncing environment variables...'));
  
  // Check if web app .env file exists
  const webEnvPath = path.join(webAppPath, '.env');
  const webEnvExists = fs.existsSync(webEnvPath);
  
  if (!webEnvExists) {
    console.log(chalk.yellow('⚠️  Web app .env file not found. Skipping environment variables sync.'));
    return;
  }
  
  // Read web app .env file
  try {
    const webEnv = fs.readFileSync(webEnvPath, 'utf8');
    let mobileEnvContent = '';
    
    // Process each line
    const webEnvLines = webEnv.split('\n');
    webEnvLines.forEach(line => {
      if (line.trim() === '' || line.startsWith('#')) {
        // Skip empty lines and comments
        return;
      }
      
      // Process variable
      const [key, value] = line.split('=', 2);
      if (key && value) {
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        
        // Check for Supabase variables
        if (trimmedKey === 'VITE_SUPABASE_URL') {
          mobileEnvContent += `EXPO_PUBLIC_SUPABASE_URL=${trimmedValue}\n`;
        } else if (trimmedKey === 'VITE_SUPABASE_ANON_KEY') {
          mobileEnvContent += `EXPO_PUBLIC_SUPABASE_ANON_KEY=${trimmedValue}\n`;
        } else if (trimmedKey === 'VITE_API_URL') {
          mobileEnvContent += `EXPO_PUBLIC_API_URL=${trimmedValue}\n`;
        } else if (trimmedKey.startsWith('VITE_')) {
          // Convert other VITE_ variables to EXPO_PUBLIC_
          const mobileKey = `EXPO_PUBLIC_${trimmedKey.substring(5)}`;
          mobileEnvContent += `${mobileKey}=${trimmedValue}\n`;
        }
      }
    });
    
    // Check if we found any variables to convert
    if (mobileEnvContent === '') {
      console.log(chalk.yellow('⚠️  No compatible environment variables found in web app .env'));
      return;
    }
    
    // Write mobile .env file
    const mobileEnvPath = path.join(__dirname, '..', '.env');
    const mobileEnvExists = fs.existsSync(mobileEnvPath);
    
    if (mobileEnvExists) {
      const overwrite = await askQuestion('Mobile app .env file already exists. Overwrite? (y/n): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log(chalk.yellow('⚠️  Keeping existing mobile app .env file'));
        return;
      }
    }
    
    fs.writeFileSync(mobileEnvPath, mobileEnvContent);
    console.log(chalk.green('✅ Environment variables synced from web app to mobile app'));
  } catch (error) {
    console.error(chalk.red('❌ Error syncing environment variables:'), error);
  }
};

// Copy i18n translation files
const syncI18nFiles = async (webAppPath) => {
  console.log(chalk.bold('\nSyncing i18n translation files...'));
  
  // Define paths
  const webI18nPath = path.join(webAppPath, 'public', 'locales');
  const mobileI18nPath = path.join(__dirname, '..', 'assets', 'locales');
  
  // Check if web i18n directory exists
  if (!fs.existsSync(webI18nPath)) {
    console.log(chalk.yellow('⚠️  Web app i18n directory not found. Skipping i18n sync.'));
    return;
  }
  
  try {
    // Create mobile i18n directory if it doesn't exist
    if (!fs.existsSync(mobileI18nPath)) {
      fs.mkdirSync(mobileI18nPath, { recursive: true });
    }
    
    // Get all language directories
    const langDirs = fs.readdirSync(webI18nPath)
      .filter(item => fs.statSync(path.join(webI18nPath, item)).isDirectory());
    
    if (langDirs.length === 0) {
      console.log(chalk.yellow('⚠️  No language directories found in web app i18n directory.'));
      return;
    }
    
    // Process each language directory
    for (const lang of langDirs) {
      const webLangPath = path.join(webI18nPath, lang);
      const mobileLangPath = path.join(mobileI18nPath, lang);
      
      // Create mobile language directory if it doesn't exist
      if (!fs.existsSync(mobileLangPath)) {
        fs.mkdirSync(mobileLangPath, { recursive: true });
      }
      
      // Copy common.json
      const webCommonPath = path.join(webLangPath, 'common.json');
      const mobileCommonPath = path.join(mobileLangPath, 'common.json');
      
      if (fs.existsSync(webCommonPath)) {
        fs.copyFileSync(webCommonPath, mobileCommonPath);
      }
      
      // Check for other JSON files in the language directory
      const jsonFiles = fs.readdirSync(webLangPath)
        .filter(file => file.endsWith('.json') && file !== 'common.json');
      
      // Copy other JSON files
      for (const jsonFile of jsonFiles) {
        const webJsonPath = path.join(webLangPath, jsonFile);
        const mobileJsonPath = path.join(mobileLangPath, jsonFile);
        fs.copyFileSync(webJsonPath, mobileJsonPath);
      }
      
      console.log(chalk.green(`✅ Synced ${lang} translations`));
    }
    
    console.log(chalk.green('✅ All i18n files synced successfully'));
  } catch (error) {
    console.error(chalk.red('❌ Error syncing i18n files:'), error);
  }
};

// Main function
const main = async () => {
  console.log(chalk.bold(chalk.cyan('\n🔄 InsightFlow Web-to-Mobile Sync Utility\n')));
  
  // Get web app path
  const defaultWebPath = path.resolve(__dirname, '..', '..');
  const webAppPath = await askQuestion(`Path to web app root directory [${defaultWebPath}]: `);
  
  // Use default if user didn't input anything
  const resolvedWebPath = webAppPath.trim() || defaultWebPath;
  
  // Check if the path exists
  if (!fs.existsSync(resolvedWebPath)) {
    console.error(chalk.red('❌ Web app directory does not exist.'));
    rl.close();
    return;
  }
  
  // Sync environment variables
  await syncEnvironmentVariables(resolvedWebPath);
  
  // Sync i18n files
  await syncI18nFiles(resolvedWebPath);
  
  console.log(chalk.bold(chalk.green('\n✅ Sync complete!')));
  rl.close();
};

// Run the script
main().catch((error) => {
  console.error(chalk.red('An error occurred during sync:'), error);
  rl.close();
}); 