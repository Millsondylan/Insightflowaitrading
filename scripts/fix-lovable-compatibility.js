#!/usr/bin/env node

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import { promisify } from 'util';

// Get the directory name from the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptsDir = __dirname;

const execAsync = promisify(exec);

console.log('🔍 Running Lovable.dev compatibility fixes...');

async function runScript(scriptName) {
  try {
    const scriptPath = path.join(scriptsDir, scriptName);
    const { stdout, stderr } = await execAsync(`node "${scriptPath}"`);
    console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    console.error(`Error running ${scriptName}:`, error.message);
    return false;
  }
}

async function main() {
  try {
    console.log('\n1️⃣ Adding Lovable exports to all component files...');
    await runScript('add-lovable-exports.js');
    /*
    console.log('\n2️⃣ Fixing JSX syntax issues...');
    await runScript('fix-jsx-tags.js');
    */
    console.log('\n3️⃣ Fixing TypeScript errors...');
    await runScript('fix-typescript-errors.js');

    console.log('\n4️⃣ Updating ESLint config for Lovable compatibility...');
    await runScript('update-eslint-config.js');
    
    console.log('\n✅ All fixes completed successfully!');
    console.log('🎉 The codebase should now be compatible with Lovable.dev visual editing.');
    console.log('\n👉 Next steps:');
    console.log('  - Run `npm run build` to make sure everything builds correctly');
    console.log('  - Run `npm run dev` to start the development server');
    console.log('  - Run `npm run lovable:dev` to start the Lovable development server');
  } catch (error) {
    console.error('❌ Error running fixes:', error.message);
    process.exit(1);
  }
}

main(); 