#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  console.log('🚀 Starting PDF generation for Naruvi Water Issues report...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport for mobile-optimized layout
    await page.setViewport({
      width: 375, // Mobile width
      height: 667, // Mobile height
      deviceScaleFactor: 2, // High DPI for crisp text
      isMobile: true,
      hasTouch: true
    });
    
    // Navigate to the HTML file
    const htmlPath = path.join(__dirname, '../docs/naruviwater/Naruvi_Water_Issues_Report.html');
    const fileUrl = `file://${htmlPath}`;
    
    console.log('📄 Loading HTML report...');
    await page.goto(fileUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for content to load
    await page.waitForSelector('.header', { timeout: 10000 });
    
    // Generate PDF optimized for mobile viewing
    console.log('🖨️  Generating mobile-optimized PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      // Mobile-optimized settings
      scale: 0.8, // Slightly smaller for mobile readability
      landscape: false
    });
    
    // Save PDF
    const outputPath = path.join(__dirname, '../docs/naruviwater/Naruvi_Water_Issues_Report.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log(`✅ PDF generated successfully!`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📱 File size: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📱 Mobile-optimized for liquid mode triggering`);
    console.log(`🔗 Open the PDF on mobile to trigger liquid mode`);
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Check if Puppeteer is available
async function checkDependencies() {
  try {
    require('puppeteer');
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking dependencies...');
  
  const hasPuppeteer = await checkDependencies();
  if (!hasPuppeteer) {
    console.log('⚠️  Puppeteer not installed');
    console.log('💡 Please install it first: npm install --save-dev puppeteer');
    console.log('💡 Or use the manual browser method (Option 1)');
    process.exit(1);
  }
  
  await generatePDF();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generatePDF };
