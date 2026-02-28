#!/usr/bin/env node

/**
 * Setup Verification Script
 * Run this to check if your environment is properly configured
 * Usage: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying NoteTaker Setup...\n');

let hasErrors = false;
let hasWarnings = false;

// Check Node.js version
console.log('📦 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (majorVersion >= 18) {
  console.log(`✅ Node.js version ${nodeVersion} is supported\n`);
} else {
  console.log(`❌ Node.js version ${nodeVersion} is too old. Please upgrade to v18 or higher\n`);
  hasErrors = true;
}

// Check if .env file exists
console.log('📄 Checking environment file...');
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file found\n');

  // Read and check .env contents
  const envContent = fs.readFileSync(envPath, 'utf8');

  console.log('🔐 Checking environment variables...');

  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  const optionalVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'OPENAI_API_KEY',
  ];

  // Check required variables
  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(`${varName}=`) &&
                   !envContent.includes(`${varName}=""`);

    if (hasVar) {
      console.log(`✅ ${varName} is set`);
    } else {
      console.log(`❌ ${varName} is missing or empty`);
      hasErrors = true;
    }
  });

  // Check optional variables
  console.log('\n⚠️  Optional variables:');
  optionalVars.forEach(varName => {
    const hasVar = envContent.includes(`${varName}=`) &&
                   !envContent.includes(`${varName}=""`);

    if (hasVar) {
      console.log(`✅ ${varName} is set`);
    } else {
      console.log(`⚠️  ${varName} is not set (optional)`);
      hasWarnings = true;
    }
  });

  // Check for example values that need to be replaced
  console.log('\n🔍 Checking for placeholder values...');
  const placeholders = [
    'your-secret-key-here',
    'your-google-client-id',
    'your-openai-api-key',
    'user:password@localhost',
  ];

  placeholders.forEach(placeholder => {
    if (envContent.includes(placeholder)) {
      console.log(`⚠️  Found placeholder "${placeholder}" - please replace with actual value`);
      hasWarnings = true;
    }
  });

} else {
  console.log('❌ .env file not found. Run: cp .env.example .env\n');
  hasErrors = true;
}

// Check if node_modules exists
console.log('\n📚 Checking dependencies...');
const nodeModulesPath = path.join(__dirname, 'node_modules');

if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules folder found\n');
} else {
  console.log('❌ node_modules not found. Run: npm install\n');
  hasErrors = true;
}

// Check if Prisma client is generated
console.log('🗄️  Checking Prisma client...');
const prismaClientPath = path.join(__dirname, 'node_modules', '.prisma', 'client');

if (fs.existsSync(prismaClientPath)) {
  console.log('✅ Prisma client is generated\n');
} else {
  console.log('⚠️  Prisma client not generated. Run: npx prisma generate\n');
  hasWarnings = true;
}

// Check if required files exist
console.log('📁 Checking project structure...');
const requiredFiles = [
  'package.json',
  'next.config.ts',
  'tsconfig.json',
  'tailwind.config.ts',
  'prisma/schema.prisma',
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} is missing`);
    hasErrors = true;
  }
});

// Final summary
console.log('\n' + '='.repeat(50));
console.log('📊 SUMMARY\n');

if (!hasErrors && !hasWarnings) {
  console.log('🎉 All checks passed! Your setup looks good.');
  console.log('\nNext steps:');
  console.log('1. Run: npx prisma migrate dev --name init');
  console.log('2. Run: npm run dev');
  console.log('3. Open: http://localhost:3000\n');
} else if (!hasErrors && hasWarnings) {
  console.log('✅ Setup is functional but has warnings.');
  console.log('⚠️  Review the warnings above and configure optional features.\n');
  console.log('You can still run the app with: npm run dev\n');
} else {
  console.log('❌ Setup has errors that need to be fixed.');
  console.log('📖 Check SETUP.md for detailed instructions.\n');
  process.exit(1);
}
