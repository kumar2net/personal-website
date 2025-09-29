#!/usr/bin/env node

import { execa } from 'execa';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const androidDir = path.join(projectRoot, 'android');

const log = (message, color = '\x1b[37m') => console.log(`${color}${message}\x1b[0m`);
const logSuccess = (message) => log(`✅ ${message}`, '\x1b[32m');
const logFailure = (message) => log(`❌ ${message}`, '\x1b[31m');
const logInfo = (message) => log(`💡 ${message}`, '\x1b[34m');
const logWarning = (message) => log(`⚠️ ${message}`, '\x1b[33m');

const checkAndroidSetup = async () => {
  logInfo('Checking Android development environment...');
  
  try {
    // Check if Android SDK is installed
    await execa('which', ['android']);
    logSuccess('Android SDK found');
  } catch (error) {
    logWarning('Android SDK not found. Please install Android Studio and set up the SDK.');
    return false;
  }

  try {
    // Check if Java is installed
    const { stdout } = await execa('java', ['-version']);
    logSuccess('Java found');
  } catch (error) {
    logWarning('Java not found. Please install Java 8 or higher.');
    return false;
  }

  return true;
};

const generateAppIcons = async () => {
  logInfo('Generating Android app icons...');
  
  const iconSizes = [
    { density: 'mdpi', size: 48 },
    { density: 'hdpi', size: 72 },
    { density: 'xhdpi', size: 96 },
    { density: 'xxhdpi', size: 144 },
    { density: 'xxxhdpi', size: 192 }
  ];

  for (const { density, size } of iconSizes) {
    const iconDir = path.join(androidDir, 'app', 'src', 'main', 'res', `mipmap-${density}`);
    await fs.mkdir(iconDir, { recursive: true });

    // Create placeholder SVG icons
    const svgContent = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="#3B82F6"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="${size / 3}" font-weight="bold">KP</text>
      </svg>
    `;

    await fs.writeFile(path.join(iconDir, 'ic_launcher.svg'), svgContent.trim());
    await fs.writeFile(path.join(iconDir, 'ic_launcher_round.svg'), svgContent.trim());
    
    logSuccess(`Created ${density} icons (${size}x${size})`);
  }
};

const buildAndroidApp = async () => {
  logInfo('Building Android APK...');
  
  try {
    // Clean previous builds
    await execa('gradle', ['clean'], { cwd: androidDir });
    logSuccess('Cleaned previous builds');

    // Build debug APK
    await execa('gradle', ['assembleDebug'], { cwd: androidDir });
    logSuccess('Built debug APK');

    // Build release APK
    await execa('gradle', ['assembleRelease'], { cwd: androidDir });
    logSuccess('Built release APK');

    return true;
  } catch (error) {
    logFailure(`Build failed: ${error.message}`);
    return false;
  }
};

const generateKeystore = async () => {
  logInfo('Generating release keystore...');
  
  const keystorePath = path.join(androidDir, 'app', 'release.keystore');
  
  try {
    await execa('keytool', [
      '-genkey',
      '-v',
      '-keystore', keystorePath,
      '-alias', 'portfolio',
      '-keyalg', 'RSA',
      '-keysize', '2048',
      '-validity', '10000',
      '-storepass', 'android',
      '-keypass', 'android',
      '-dname', 'CN=Kumar Portfolio, OU=Development, O=Kumar, L=City, S=State, C=US'
    ]);
    
    logSuccess('Generated release keystore');
    return true;
  } catch (error) {
    logWarning(`Keystore generation failed: ${error.message}`);
    return false;
  }
};

const main = async () => {
  log('\n\x1b[1m🤖 Android Play Store Build Script\x1b[0m');
  log('\x1b[34m==================================================\x1b[0m');

  // Check Android setup
  const androidReady = await checkAndroidSetup();
  if (!androidReady) {
    logFailure('Android development environment not ready. Please install required tools.');
    process.exit(1);
  }

  // Generate app icons
  await generateAppIcons();

  // Generate keystore for release
  await generateKeystore();

  // Build Android app
  const buildSuccess = await buildAndroidApp();
  
  if (buildSuccess) {
    logSuccess('\n🎉 Android build completed successfully!');
    logInfo('\n📱 Next steps:');
    logInfo('1. Sign the APK with your release keystore');
    logInfo('2. Upload to Google Play Console');
    logInfo('3. Complete Play Store listing');
    logInfo('4. Submit for review');
    
    logInfo('\n📁 Generated files:');
    logInfo(`- Debug APK: ${path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')}`);
    logInfo(`- Release APK: ${path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk')}`);
  } else {
    logFailure('\n❌ Android build failed. Please check the errors above.');
    process.exit(1);
  }
};

main().catch(console.error);
