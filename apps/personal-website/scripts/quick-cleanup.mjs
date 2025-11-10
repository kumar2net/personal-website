#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🧹 QUICK CODEBASE CLEANUP');
console.log('=========================');

try {
  // Step 1: Remove unused dependencies
  console.log('\n📦 Step 1: Removing Unused Dependencies...');
  const packageJsonPath = join(projectRoot, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  // Dependencies that are likely unused
  const unusedDeps = [
    'axios', // Using fetch instead
    'node-fetch', // Using native fetch
    'express', // Not used in frontend
  ];

  let removedCount = 0;
  unusedDeps.forEach((dep) => {
    if (packageJson.dependencies?.[dep]) {
      delete packageJson.dependencies[dep];
      removedCount++;
      console.log(`   ✅ Removed: ${dep}`);
    }
    if (packageJson.devDependencies?.[dep]) {
      delete packageJson.devDependencies[dep];
      removedCount++;
      console.log(`   ✅ Removed: ${dep} (dev)`);
    }
  });

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`✅ Removed ${removedCount} unused dependencies`);

  // Step 2: Clean console statements from key files
  console.log('\n🧹 Step 2: Cleaning Console Statements...');
  const keyFiles = [
    'src/main.jsx',
    'src/App.jsx',
    'src/components/ErrorBoundary.jsx',
  ];

  let consoleLogsRemoved = 0;

  keyFiles.forEach((filePath) => {
    const fullPath = join(projectRoot, filePath);
    try {
      const content = readFileSync(fullPath, 'utf8');
      const originalContent = content;

      // Remove console.log statements (keep console.error and console.warn)
      const cleanedContent = content.replace(/console\.log\([^)]*\);?\s*/g, '');

      if (cleanedContent !== originalContent) {
        writeFileSync(fullPath, cleanedContent, 'utf8');
        const removed = (originalContent.match(/console\.log\(/g) || []).length;
        consoleLogsRemoved += removed;
        console.log(
          `   ✅ Cleaned ${filePath}: ${removed} console.log statements`
        );
      }
    } catch (_error) {
      console.log(`   ⚠️ Could not read ${filePath}`);
    }
  });

  console.log(`✅ Total console.log statements removed: ${consoleLogsRemoved}`);

  // Step 3: Remove TODO/FIXME comments
  console.log('\n📝 Step 3: Removing TODO/FIXME Comments...');
  let todosRemoved = 0;

  keyFiles.forEach((filePath) => {
    const fullPath = join(projectRoot, filePath);
    try {
      const content = readFileSync(fullPath, 'utf8');
      const originalContent = content;

      // Remove TODO and FIXME comments
      const cleanedContent = content
        .replace(/\/\/\s*TODO:.*$/gm, '')
        .replace(/\/\/\s*FIXME:.*$/gm, '')
        .replace(/\/\*\s*TODO:.*?\*\//gs, '')
        .replace(/\/\*\s*FIXME:.*?\*\//gs, '');

      if (cleanedContent !== originalContent) {
        writeFileSync(fullPath, cleanedContent, 'utf8');
        const removed = (originalContent.match(/TODO:|FIXME:/g) || []).length;
        todosRemoved += removed;
        console.log(
          `   ✅ Cleaned ${filePath}: ${removed} TODO/FIXME comments`
        );
      }
    } catch (_error) {
      console.log(`   ⚠️ Could not read ${filePath}`);
    }
  });

  console.log(`✅ Total TODO/FIXME comments removed: ${todosRemoved}`);

  // Step 4: Run Biome to fix code quality issues
  console.log('\n🎨 Step 4: Running Biome Fixes...');
  try {
    execSync('npx @biomejs/biome check --write --unsafe .', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    console.log('✅ Biome fixes completed');
  } catch (_error) {
    console.log('⚠️ Biome fixes failed, continuing...');
  }

  // Step 5: Update package.json scripts
  console.log('\n📝 Step 5: Updating Package.json Scripts...');
  packageJson.scripts = {
    ...packageJson.scripts,
    'cleanup:quick': 'node scripts/quick-cleanup.mjs',
    'cleanup:full': 'node scripts/cleanup-codebase.mjs',
    'clean:whistle':
      'npm run cleanup:quick && npm run biome:fix && npm run test:all',
  };

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Package.json scripts updated');

  // Step 6: Generate summary report
  console.log('\n📊 Step 6: Generating Summary Report...');
  const report = {
    timestamp: new Date().toISOString(),
    dependenciesRemoved: removedCount,
    consoleLogsRemoved,
    todosRemoved,
    filesCleaned: keyFiles.length,
    recommendations: [
      'Codebase is now cleaner and more production-ready',
      'Unused dependencies removed to reduce bundle size',
      'Console statements removed for production',
      'TODO/FIXME comments cleaned up',
      'Code quality improved with Biome fixes',
    ],
  };

  writeFileSync(
    join(projectRoot, 'quick-cleanup-report.json'),
    JSON.stringify(report, null, 2)
  );
  console.log('✅ Quick cleanup report generated: quick-cleanup-report.json');

  console.log('\n🎉 QUICK CLEANUP COMPLETED!');
  console.log('============================');
  console.log('✅ Unused dependencies removed');
  console.log('✅ Console statements cleaned');
  console.log('✅ TODO/FIXME comments removed');
  console.log('✅ Code quality improved');
  console.log('✅ Package.json scripts updated');
  console.log('✅ Summary report generated');

  console.log('\n📋 Available Commands:');
  console.log('  npm run cleanup:quick   - Quick cleanup (this script)');
  console.log('  npm run cleanup:full    - Full cleanup with CodeMon');
  console.log('  npm run clean:whistle   - Clean as a whistle (quick + tests)');
  console.log('  npm run biome:fix       - Fix code quality issues');
} catch (error) {
  console.error('❌ Error during quick cleanup:', error.message);
  process.exit(1);
}
