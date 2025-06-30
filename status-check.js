#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🔍 Checking system status...\n');

async function checkPort(port, service) {
  try {
    const { stdout } = await execAsync(`lsof -i :${port}`);
    if (stdout.includes('LISTEN')) {
      console.log(`✅ ${service} is running on port ${port}`);
      return true;
    } else {
      console.log(`❌ ${service} is not running on port ${port}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${service} is not running on port ${port}`);
    return false;
  }
}

async function testEndpoint(url, service) {
  try {
    const { stdout } = await execAsync(`curl -s ${url}`);
    if (stdout.includes('status') || stdout.includes('html')) {
      console.log(`✅ ${service} is responding at ${url}`);
      return true;
    } else {
      console.log(`❌ ${service} is not responding properly at ${url}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${service} is not responding at ${url}`);
    return false;
  }
}

async function main() {
  console.log('📊 System Status Report');
  console.log('=======================\n');

  // Check ports
  const backendPort = await checkPort(5050, 'Backend Server');
  const frontendPort = await checkPort(5173, 'Frontend Server');

  console.log('');

  // Test endpoints
  if (backendPort) {
    await testEndpoint('http://localhost:5050/health', 'Backend Health');
  }
  
  if (frontendPort) {
    await testEndpoint('http://localhost:5173', 'Frontend App');
  }

  console.log('\n🎯 Summary:');
  console.log('===========');
  
  if (backendPort && frontendPort) {
    console.log('✅ Both servers are running successfully!');
    console.log('🌐 Frontend: http://localhost:5173');
    console.log('🔧 Backend: http://localhost:5050');
    console.log('📋 Health: http://localhost:5050/health');
    console.log('\n🚀 Your AI Trading Platform is ready!');
  } else {
    console.log('❌ Some services are not running properly.');
    console.log('Please check the error messages above.');
  }

  console.log('\n📝 Next Steps:');
  console.log('1. Add your Supabase credentials to .env file');
  console.log('2. Visit http://localhost:5173 to use the app');
  console.log('3. The backend API is available at http://localhost:5050/api');
}

// Run the main function
main().catch(console.error); 