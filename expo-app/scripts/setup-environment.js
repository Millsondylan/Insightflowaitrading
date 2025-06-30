#!/usr/bin/env node

/**
 * This script helps developers set up the development environment for the mobile app.
 * It verifies dependencies, checks environment variables, and helps connect to the web app's backend.
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

const ROOT_DIR = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT_DIR, '.env');
const ENV_EXAMPLE_PATH = path.join(ROOT_DIR, '.env.example');

// Ask a question and get user input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Check if a command exists in the path
const commandExists = (command) => {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};

// Check Node.js version
const checkNodeVersion = () => {
  const nodeVersion = process.version.slice(1).split('.')[0];
  console.log(`${chalk.blue('Node.js version:')} ${nodeVersion}`);
  
  if (parseInt(nodeVersion) < 18) {
    console.warn(chalk.yellow('⚠️  You are using an older version of Node.js. We recommend version 18 or later.'));
    return false;
  }
  
  console.log(chalk.green('✅ Node.js version is compatible'));
  return true;
};

// Check required tools
const checkRequiredTools = async () => {
  console.log(chalk.bold('\nChecking development dependencies...'));
  
  const tools = [
    { name: 'npm', installGuide: 'Included with Node.js' },
    { name: 'yarn', installGuide: 'Run: npm install -g yarn' },
    { name: 'expo-cli', installGuide: 'Run: npm install -g expo-cli' },
    { name: 'eas-cli', installGuide: 'Run: npm install -g eas-cli' },
  ];
  
  let allToolsPresent = true;
  
  for (const tool of tools) {
    if (commandExists(tool.name)) {
      console.log(chalk.green(`✅ ${tool.name} is installed`));
    } else {
      console.log(chalk.red(`❌ ${tool.name} is not installed`));
      console.log(`   Installation guide: ${tool.installGuide}`);
      allToolsPresent = false;
    }
  }
  
  // Check mobile platform development tools
  console.log(chalk.bold('\nChecking mobile platform development tools...'));
  
  const platform = process.platform;
  
  if (platform === 'darwin') {  // macOS
    if (commandExists('xcodebuild')) {
      console.log(chalk.green('✅ Xcode is installed for iOS development'));
    } else {
      console.log(chalk.yellow('⚠️  Xcode is not installed. It's required for iOS development.'));
      console.log('   You can install it from the Mac App Store');
    }
    
    if (commandExists('pod')) {
      console.log(chalk.green('✅ CocoaPods is installed'));
    } else {
      console.log(chalk.yellow('⚠️  CocoaPods is not installed. It's required for iOS development.'));
      console.log('   Install it via: gem install cocoapods');
    }
  }
  
  if (commandExists('adb')) {
    console.log(chalk.green('✅ Android SDK tools are installed'));
  } else {
    console.log(chalk.yellow('⚠️  Android SDK tools may not be properly configured.'));
    console.log('   Install Android Studio and configure the Android SDK');
  }
  
  return allToolsPresent;
};

// Setup environment variables
const setupEnvironment = async () => {
  console.log(chalk.bold('\nSetting up environment variables...'));
  
  // Check if .env file exists
  const envExists = fs.existsSync(ENV_PATH);
  
  if (envExists) {
    const overwrite = await askQuestion('.env file already exists. Do you want to overwrite it? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log(chalk.yellow('⚠️  Keeping existing .env file'));
      return true;
    }
  }
  
  // Create .env file if it doesn't exist or user wants to overwrite it
  console.log(chalk.cyan('Please provide the following environment variables:'));
  
  const supabaseUrl = await askQuestion('Supabase URL (EXPO_PUBLIC_SUPABASE_URL): ');
  const supabaseAnonKey = await askQuestion('Supabase Anon Key (EXPO_PUBLIC_SUPABASE_ANON_KEY): ');
  const apiUrl = await askQuestion('API URL (EXPO_PUBLIC_API_URL): ');
  
  const envContent = `EXPO_PUBLIC_SUPABASE_URL=${supabaseUrl}
EXPO_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
EXPO_PUBLIC_API_URL=${apiUrl}`;
  
  try {
    fs.writeFileSync(ENV_PATH, envContent);
    console.log(chalk.green('✅ Environment variables saved to .env file'));
    
    // Create .env.example if it doesn't exist
    if (!fs.existsSync(ENV_EXAMPLE_PATH)) {
      const exampleContent = `EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_URL=your_api_url`;
      fs.writeFileSync(ENV_EXAMPLE_PATH, exampleContent);
      console.log(chalk.green('✅ Created .env.example file'));
    }
    
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Failed to create .env file'), error);
    return false;
  }
};

// Install dependencies
const installDependencies = async () => {
  console.log(chalk.bold('\nInstalling dependencies...'));
  
  try {
    // Check if yarn.lock exists, use yarn if it does, otherwise use npm
    const useYarn = fs.existsSync(path.join(ROOT_DIR, 'yarn.lock'));
    
    if (useYarn) {
      console.log('Using Yarn to install dependencies...');
      execSync('yarn install', { stdio: 'inherit', cwd: ROOT_DIR });
    } else {
      console.log('Using NPM to install dependencies...');
      execSync('npm install', { stdio: 'inherit', cwd: ROOT_DIR });
    }
    
    console.log(chalk.green('✅ Dependencies installed successfully'));
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Failed to install dependencies:'), error.message);
    return false;
  }
};

// Main function
const main = async () => {
  console.log(chalk.bold(chalk.cyan('\n🚀 InsightFlow AI Mobile App Setup\n')));
  
  // Check Node.js version
  const nodeVersionOk = checkNodeVersion();
  if (!nodeVersionOk) {
    const cont = await askQuestion('Continue anyway? (y/n): ');
    if (cont.toLowerCase() !== 'y') {
      console.log(chalk.yellow('Setup cancelled'));
      rl.close();
      return;
    }
  }
  
  // Check required tools
  await checkRequiredTools();
  
  // Setup environment variables
  const envSetupOk = await setupEnvironment();
  if (!envSetupOk) {
    console.log(chalk.red('Failed to set up environment variables'));
    rl.close();
    return;
  }
  
  // Ask if user wants to install dependencies
  const installDeps = await askQuestion('\nDo you want to install dependencies now? (y/n): ');
  if (installDeps.toLowerCase() === 'y') {
    await installDependencies();
  }
  
  console.log(chalk.bold(chalk.green('\n✅ Setup complete!')));
  console.log(chalk.cyan('\nNext steps:'));
  console.log('1. Start the development server: npm start or yarn start');
  console.log('2. Run on iOS: npm run ios or yarn ios');
  console.log('3. Run on Android: npm run android or yarn android');
  
  rl.close();
};

// Run the script
main().catch((error) => {
  console.error(chalk.red('An error occurred during setup:'), error);
  rl.close();
}); 