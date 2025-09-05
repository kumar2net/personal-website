#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔧 FIXING CODE QUALITY ISSUES');
console.log('================================');

try {
  // Run Biome check
  console.log('📋 Running Biome check...');
  execSync('npx @biomejs/biome check .', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  console.log('✅ Biome check completed successfully');

  // Run Biome format
  console.log('🎨 Running Biome format...');
  execSync('npx @biomejs/biome format --write .', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  console.log('✅ Biome format completed successfully');

  // Run Biome lint with auto-fix
  console.log('🔍 Running Biome lint with auto-fix...');
  execSync('npx @biomejs/biome lint --write .', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  console.log('✅ Biome lint completed successfully');

  // Check for specific security issues
  console.log('🔒 Checking for security issues...');

  const filesToCheck = ['src/main.jsx', 'src/App.jsx'];

  let securityIssues = 0;

  filesToCheck.forEach((file) => {
    const filePath = join(projectRoot, file);
    try {
      const content = readFileSync(filePath, 'utf8');

      // Check for dangerous patterns
      const dangerousPatterns = [
        /innerHTML\s*=/,
        /eval\s*\(/,
        /document\.write/,
        /setTimeout\s*\(\s*['"`][^'"`]*['"`]/,
        /setInterval\s*\(\s*['"`][^'"`]*['"`]/,
      ];

      dangerousPatterns.forEach((pattern, _index) => {
        const matches = content.match(pattern);
        if (matches) {
          console.log(`⚠️  Security issue found in ${file}: ${pattern}`);
          securityIssues++;
        }
      });

      // Check for proper error handling
      if (!content.includes('try') && !content.includes('catch')) {
        console.log(`⚠️  Missing error handling in ${file}`);
        securityIssues++;
      }
    } catch (err) {
      console.log(`❌ Error reading ${file}: ${err.message}`);
      securityIssues++;
    }
  });

  if (securityIssues === 0) {
    console.log('✅ No security issues found');
  } else {
    console.log(`⚠️  Found ${securityIssues} potential security issues`);
  }

  // Update package.json scripts
  console.log('📝 Updating package.json scripts...');
  const packageJsonPath = join(projectRoot, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  // Add Biome scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'biome:check': '@biomejs/biome check .',
    'biome:format': '@biomejs/biome format --write .',
    'biome:lint': '@biomejs/biome lint --write .',
    'biome:fix': '@biomejs/biome check --write .',
    'quality:check': 'npm run biome:check && npm run test:all',
    'quality:fix': 'npm run biome:fix && npm run test:all',
  };

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Package.json scripts updated');

  console.log('\n🎉 CODE QUALITY FIXES COMPLETED!');
  console.log('================================');
  console.log('✅ Biome configured and running');
  console.log('✅ Code formatting applied');
  console.log('✅ Linting rules enforced');
  console.log('✅ Security checks completed');
  console.log('✅ Package.json scripts updated');

  console.log('\n📋 Available commands:');
  console.log('  npm run biome:check    - Check code quality');
  console.log('  npm run biome:format   - Format code');
  console.log('  npm run biome:lint     - Lint code');
  console.log('  npm run biome:fix      - Auto-fix issues');
  console.log('  npm run quality:check  - Full quality check');
  console.log('  npm run quality:fix    - Fix all issues');
} catch (error) {
  console.error('❌ Error during code quality fixes:', error.message);
  process.exit(1);
}
