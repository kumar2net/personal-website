import fs from 'node:fs/promises';
import path from 'node:path';

async function debugSingaporeBills() {
  const projectRoot = process.cwd();
  const extractedDataPath = path.join(
    projectRoot,
    'docs',
    'utildata',
    'extracted_data.json'
  );

  try {
    console.log('📁 Reading extracted utility bill data...');
    const data = await fs.readFile(extractedDataPath, 'utf8');
    const bills = JSON.parse(data);

    // Find Singapore bills
    const singaporeBills = bills.filter(
      (bill) => bill.filename.includes('sgutilbill') && bill.type === 'image'
    );

    console.log(`\n🔍 Found ${singaporeBills.length} Singapore utility bills`);

    singaporeBills.forEach((bill, _index) => {
      console.log(`\n📄 ${bill.filename}`);
      console.log('─'.repeat(80));
      console.log('Full OCR Text:');
      console.log(bill.content);
      console.log('─'.repeat(80));

      // Look for dollar amounts
      const dollarMatches = bill.content.match(/\$(\d+\.?\d*)/g);
      if (dollarMatches) {
        console.log('\n💰 Dollar amounts found:');
        dollarMatches.forEach((match) => {
          console.log(`   ${match}`);
        });
      }

      // Look for usage patterns
      const usageMatches = bill.content.match(/Usage:\s*(\d+)\s*(Wh|uM|cuM)/gi);
      if (usageMatches) {
        console.log('\n⚡ Usage patterns found:');
        usageMatches.forEach((match) => {
          console.log(`   ${match}`);
        });
      }
    });
  } catch (error) {
    console.error('❌ Error debugging Singapore bills:', error.message);
    process.exit(1);
  }
}

// Run the debug
debugSingaporeBills().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
