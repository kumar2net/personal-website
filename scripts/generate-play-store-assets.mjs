#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const playStoreDir = path.join(projectRoot, 'play-store');

const log = (message, color = '\x1b[37m') => console.log(`${color}${message}\x1b[0m`);
const logSuccess = (message) => log(`✅ ${message}`, '\x1b[32m');
const logInfo = (message) => log(`💡 ${message}`, '\x1b[34m');

const createPlayStoreAssets = async () => {
  logInfo('Creating Play Store assets...');
  
  // Create directories
  await fs.mkdir(path.join(playStoreDir, 'screenshots'), { recursive: true });
  await fs.mkdir(path.join(playStoreDir, 'assets'), { recursive: true });
  
  // Create app icon (512x512)
  const appIconSvg = `
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#3B82F6"/>
      <circle cx="256" cy="256" r="200" fill="white" opacity="0.1"/>
      <text x="256" y="280" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="120" font-weight="bold">KP</text>
      <text x="256" y="350" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="normal">Portfolio</text>
    </svg>
  `;
  await fs.writeFile(path.join(playStoreDir, 'assets', 'app-icon.svg'), appIconSvg.trim());
  
  // Create feature graphic (1024x500)
  const featureGraphicSvg = `
    <svg width="1024" height="500" viewBox="0 0 1024 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1024" height="500" fill="#3B82F6"/>
      <rect x="0" y="0" width="1024" height="500" fill="url(#gradient)" opacity="0.8"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <text x="512" y="200" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="72" font-weight="bold">Kumar's Portfolio</text>
      <text x="512" y="280" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="32" font-weight="normal">Progressive Web App with Push Notifications</text>
      <text x="512" y="350" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="normal">Blog • Projects • Contact</text>
    </svg>
  `;
  await fs.writeFile(path.join(playStoreDir, 'assets', 'feature-graphic.svg'), featureGraphicSvg.trim());
  
  // Create screenshots
  const createScreenshot = async (filename, width, height, title) => {
    const screenshotSvg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#f9fafb"/>
        <rect x="20" y="20" width="${width-40}" height="${height-40}" fill="white" stroke="#e5e7eb" stroke-width="2" rx="8"/>
        <text x="${width/2}" y="${height/2}" dominant-baseline="middle" text-anchor="middle" fill="#374151" font-family="Arial" font-size="24" font-weight="bold">${title}</text>
        <text x="${width/2}" y="${height/2 + 40}" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="16">${width}x${height}</text>
      </svg>
    `;
    await fs.writeFile(path.join(playStoreDir, 'screenshots', filename), screenshotSvg.trim());
  };
  
  await createScreenshot('desktop-screenshot.svg', 1280, 720, 'Desktop View');
  await createScreenshot('mobile-screenshot.svg', 390, 844, 'Mobile View');
  await createScreenshot('tablet-screenshot.svg', 1024, 768, 'Tablet View');
  
  logSuccess('Created Play Store assets');
};

const createKeystoreInstructions = async () => {
  const keystoreInstructions = `
# Android Keystore Generation Instructions

## Generate Release Keystore

Run the following command to generate a release keystore for signing your Android app:

\`\`\`bash
keytool -genkey -v -keystore android/app/release.keystore \\
  -alias portfolio \\
  -keyalg RSA \\
  -keysize 2048 \\
  -validity 10000 \\
  -storepass android \\
  -keypass android \\
  -dname "CN=Kumar Portfolio, OU=Development, O=Kumar, L=City, S=State, C=US"
\`\`\`

## Get SHA256 Fingerprint

After generating the keystore, get the SHA256 fingerprint:

\`\`\`bash
keytool -list -v -keystore android/app/release.keystore -alias portfolio
\`\`\`

Copy the SHA256 fingerprint and update the \`assetlinks.json\` file:

\`\`\`json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.kumar.portfolio",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
  }
}]
\`\`\`

## Important Security Notes

- **Never commit the keystore to version control**
- **Store the keystore securely and backup safely**
- **Remember the passwords - losing them means you can't update your app**
- **Use Google Play App Signing for production apps**

## Google Play App Signing

For production apps, it's recommended to use Google Play App Signing:

1. Upload your APK to Google Play Console
2. Google will generate a new signing key
3. Use Google's signing key for future updates
4. Keep your upload key secure for initial uploads
`;

  await fs.writeFile(path.join(playStoreDir, 'keystore-instructions.md'), keystoreInstructions.trim());
  logSuccess('Created keystore instructions');
};

const createDeploymentChecklist = async () => {
  const checklist = `
# Android Play Store Deployment Checklist

## Pre-Deployment ✅

- [ ] Android Studio installed and configured
- [ ] Java Development Kit (JDK) 8+ installed
- [ ] Android SDK Build Tools installed
- [ ] Release keystore generated
- [ ] SHA256 fingerprint obtained and added to assetlinks.json
- [ ] Digital Asset Links file deployed to domain
- [ ] PWA tested and working correctly
- [ ] Push notifications tested
- [ ] Offline functionality tested

## Build Process ✅

- [ ] Android project structure created
- [ ] App icons generated in all required sizes
- [ ] AndroidManifest.xml configured correctly
- [ ] Build.gradle files configured
- [ ] Release APK built successfully
- [ ] APK signed with release keystore
- [ ] APK tested on physical device

## Play Store Console ✅

- [ ] Google Play Developer account created
- [ ] New app created in Play Console
- [ ] App details filled out completely
- [ ] Store listing completed
- [ ] Screenshots uploaded
- [ ] App icon uploaded
- [ ] Feature graphic uploaded
- [ ] Privacy policy URL provided
- [ ] Content rating completed
- [ ] Target audience defined

## Domain Verification ✅

- [ ] SSL certificate installed
- [ ] assetlinks.json accessible at https://kumarsite.netlify.app/.well-known/assetlinks.json
- [ ] SHA256 fingerprint matches keystore
- [ ] Domain verification successful in Play Console

## Testing ✅

- [ ] Internal testing completed
- [ ] TWA opens in fullscreen mode
- [ ] Push notifications work correctly
- [ ] Offline functionality works
- [ ] All app features tested
- [ ] No critical crashes or ANRs

## Submission ✅

- [ ] All required sections completed
- [ ] App information reviewed
- [ ] Release notes written
- [ ] App submitted for review
- [ ] Review status monitored

## Post-Launch ✅

- [ ] App performance monitored
- [ ] User feedback reviewed
- [ ] Crash reports checked
- [ ] Analytics configured
- [ ] Update process documented

## Files Generated

- \`android/\` - Complete Android project structure
- \`play-store/assets/\` - App icon and feature graphic
- \`play-store/screenshots/\` - App screenshots
- \`play-store/listing.md\` - Store listing content
- \`public/.well-known/assetlinks.json\` - Domain verification file
- \`docs/ANDROID_PLAY_STORE_DEPLOYMENT.md\` - Complete deployment guide

## Next Steps

1. Install Android Studio
2. Generate release keystore
3. Build and sign APK
4. Upload to Play Console
5. Complete store listing
6. Submit for review
`;

  await fs.writeFile(path.join(playStoreDir, 'deployment-checklist.md'), checklist.trim());
  logSuccess('Created deployment checklist');
};

const main = async () => {
  log('\n\x1b[1m📱 Generating Android Play Store Assets\x1b[0m');
  log('\x1b[34m==================================================\x1b[0m');

  await createPlayStoreAssets();
  await createKeystoreInstructions();
  await createDeploymentChecklist();

  logSuccess('\n🎉 Android Play Store assets generated successfully!');
  logInfo('\n📁 Generated files:');
  logInfo('- play-store/assets/app-icon.svg (512x512)');
  logInfo('- play-store/assets/feature-graphic.svg (1024x500)');
  logInfo('- play-store/screenshots/ (desktop, mobile, tablet)');
  logInfo('- play-store/keystore-instructions.md');
  logInfo('- play-store/deployment-checklist.md');
  logInfo('- android/ (complete Android project)');
  
  logInfo('\n📝 Next steps:');
  logInfo('1. Install Android Studio');
  logInfo('2. Generate release keystore (see keystore-instructions.md)');
  logInfo('3. Build and sign APK');
  logInfo('4. Upload to Google Play Console');
  logInfo('5. Complete store listing');
  logInfo('6. Submit for review');
  
  logInfo('\n📖 See docs/ANDROID_PLAY_STORE_DEPLOYMENT.md for complete guide');
};

main().catch(console.error);
