#!/usr/bin/env node

/**
 * Generate App Icons for PWA
 * Creates app icons in multiple sizes for PWA installation
 */

import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Create a simple SVG icon generator
function generateSVGIcon(size, text = 'K') {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="${size * 0.6}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">${text}</text>
</svg>`;
}

// Create a simple HTML file to convert SVG to PNG (placeholder)
function createIconHTML() {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 20px; background: #f0f0f0; }
    .icon-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .icon-item { text-align: center; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .icon-item svg { border: 1px solid #ddd; border-radius: 8px; }
    .icon-item h3 { margin: 10px 0 5px 0; color: #333; }
    .icon-item p { margin: 0; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <h1>PWA App Icons</h1>
  <p>These are placeholder icons. Replace with your actual app icons.</p>
  
  <div class="icon-grid">
    <div class="icon-item">
      <svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad72" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="72" height="72" rx="14" fill="url(#grad72)"/>
        <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="43" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">K</text>
      </svg>
      <h3>72x72</h3>
      <p>icon-72x72.png</p>
    </div>
    
    <div class="icon-item">
      <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad96" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="96" height="96" rx="19" fill="url(#grad96)"/>
        <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="58" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">K</text>
      </svg>
      <h3>96x96</h3>
      <p>icon-96x96.png</p>
    </div>
    
    <div class="icon-item">
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad128" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="26" fill="url(#grad128)"/>
        <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="77" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">K</text>
      </svg>
      <h3>128x128</h3>
      <p>icon-128x128.png</p>
    </div>
    
    <div class="icon-item">
      <svg width="144" height="144" viewBox="0 0 144 144" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad144" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="144" height="144" rx="29" fill="url(#grad144)"/>
        <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="86" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">K</text>
      </svg>
      <h3>144x144</h3>
      <p>icon-144x144.png</p>
    </div>
    
    <div class="icon-item">
      <svg width="152" height="152" viewBox="0 0 152 152" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad152" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="152" height="152" rx="30" fill="url(#grad152)"/>
        <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="91" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">K</text>
      </svg>
      <h3>152x152</h3>
      <p>icon-152x152.png</p>
    </div>
    
    <div class="icon-item">
      <svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad192" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="192" height="192" rx="38" fill="url(#grad192)"/>
        <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="115" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">K</text>
      </svg>
      <h3>192x192</h3>
      <p>icon-192x192.png</p>
    </div>
    
    <div class="icon-item">
      <svg width="384" height="384" viewBox="0 0 384 384" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad384" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="384" height="384" rx="77" fill="url(#grad384)"/>
        <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="230" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">K</text>
      </svg>
      <h3>384x384</h3>
      <p>icon-384x384.png</p>
    </div>
    
    <div class="icon-item">
      <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad512" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="102" fill="url(#grad512)"/>
        <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="307" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">K</text>
      </svg>
      <h3>512x512</h3>
      <p>icon-512x512.png</p>
    </div>
  </div>
  
  <div style="margin-top: 40px; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
    <h3>📝 Instructions:</h3>
    <ol>
      <li>Right-click on each icon above and "Save image as..."</li>
      <li>Save them as PNG files with the correct names in the <code>public/icons/</code> directory</li>
      <li>Or use an online SVG to PNG converter with the sizes specified</li>
      <li>For production, create high-quality icons with your actual logo/branding</li>
    </ol>
  </div>
</body>
</html>`;
}

function createPlaceholderIcons() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  const iconsDir = 'public/icons';
  
  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  log('Creating placeholder SVG icons...', 'blue');
  
  sizes.forEach(size => {
    const svgContent = generateSVGIcon(size);
    const filename = `icon-${size}x${size}.svg`;
    const filepath = path.join(iconsDir, filename);
    
    fs.writeFileSync(filepath, svgContent);
    log(`✅ Created ${filename}`, 'green');
  });
  
  // Create additional icons
  const additionalIcons = [
    { name: 'badge-72x72.svg', size: 72, text: '🔔' },
    { name: 'blog-shortcut.svg', size: 96, text: '📝' },
    { name: 'notification-shortcut.svg', size: 96, text: '🔔' },
    { name: 'projects-shortcut.svg', size: 96, text: '💼' },
    { name: 'checkmark.svg', size: 24, text: '✓' },
    { name: 'xmark.svg', size: 24, text: '✕' }
  ];
  
  additionalIcons.forEach(icon => {
    const svgContent = generateSVGIcon(icon.size, icon.text);
    const filepath = path.join(iconsDir, icon.name);
    fs.writeFileSync(filepath, svgContent);
    log(`✅ Created ${icon.name}`, 'green');
  });
  
  // Create HTML preview file
  const htmlContent = createIconHTML();
  fs.writeFileSync('public/icons/preview.html', htmlContent);
  log('✅ Created icon preview at public/icons/preview.html', 'green');
}

function createScreenshots() {
  log('Creating screenshot placeholders...', 'blue');
  
  const screenshotsDir = 'public/screenshots';
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  // Create placeholder screenshot HTML
  const screenshotHTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 20px; background: #f0f0f0; }
    .screenshot { background: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin: 20px 0; }
    .desktop { width: 1280px; height: 720px; }
    .mobile { width: 390px; height: 844px; }
    .content { padding: 40px; text-align: center; }
    h1 { color: #3b82f6; margin-bottom: 20px; }
    p { color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <h1>PWA Screenshots</h1>
  <p>These are placeholder screenshots. Replace with actual screenshots of your app.</p>
  
  <div class="screenshot desktop">
    <div class="content">
      <h1>Desktop Screenshot</h1>
      <p>1280x720 - Desktop view of Kumar's Portfolio</p>
      <p>Shows the main homepage with navigation, featured content, and responsive design.</p>
    </div>
  </div>
  
  <div class="screenshot mobile">
    <div class="content">
      <h1>Mobile Screenshot</h1>
      <p>390x844 - Mobile view of Kumar's Portfolio</p>
      <p>Shows the mobile-optimized interface with touch-friendly navigation and responsive layout.</p>
    </div>
  </div>
  
  <div style="margin-top: 40px; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
    <h3>📝 Instructions:</h3>
    <ol>
      <li>Take actual screenshots of your app on desktop (1280x720) and mobile (390x844)</li>
      <li>Save them as PNG files: <code>desktop-screenshot.png</code> and <code>mobile-screenshot.png</code></li>
      <li>Place them in the <code>public/screenshots/</code> directory</li>
      <li>These will be used in the PWA manifest and Play Store listing</li>
    </ol>
  </div>
</body>
</html>`;
  
  fs.writeFileSync('public/screenshots/preview.html', screenshotHTML);
  log('✅ Created screenshot preview at public/screenshots/preview.html', 'green');
}

function main() {
  log('🎨 Generating PWA App Icons and Screenshots...', 'bold');
  log('='.repeat(50), 'blue');
  
  createPlaceholderIcons();
  createScreenshots();
  
  log('\n✅ Icon generation complete!', 'green');
  log('\n📝 Next steps:', 'bold');
  log('1. Open public/icons/preview.html in your browser to see the icons', 'blue');
  log('2. Replace placeholder icons with your actual app icons (PNG format)', 'blue');
  log('3. Open public/screenshots/preview.html to see screenshot placeholders', 'blue');
  log('4. Take actual screenshots and replace the placeholders', 'blue');
  log('5. Run the PWA test again to verify everything is working', 'blue');
}

main();
