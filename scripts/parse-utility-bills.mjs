import fs from 'node:fs/promises';
import path from 'node:path';

async function parseUtilityBills() {
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

    const parsedBills = [];

    for (const bill of bills) {
      if (bill.content && bill.content.length > 0) {
        const parsed = parseBillContent(bill.filename, bill.content);
        if (Array.isArray(parsed)) {
          parsed.forEach((row) => parsedBills.push(row));
        } else if (parsed) {
          parsedBills.push(parsed);
        }
      }
    }

    // Create CSV content
    const csvHeader =
      'Filename,Utility Company,Currency,Units Consumed,Total Cost,Cost Per Unit,Bill Period,Location\n';
    const csvRows = parsedBills
      .map(
        (bill) =>
          `"${bill.filename}","${bill.utilityCompany}","${bill.currency}","${bill.unitsConsumed}","${bill.totalCost}","${bill.costPerUnit}","${bill.billPeriod}","${bill.location}"`
      )
      .join('\n');

    const csvContent = csvHeader + csvRows;

    // Save CSV file
    const csvPath = path.join(
      projectRoot,
      'docs',
      'utildata',
      'utility_bills_parsed.csv'
    );
    await fs.writeFile(csvPath, csvContent, 'utf8');

    console.log(`\n✅ Parsed data saved to: ${csvPath}`);
    console.log(`📊 Processed ${parsedBills.length} bills`);

    // Display results
    console.log('\n📋 Parsed Utility Bills:');
    console.log('─'.repeat(100));

    parsedBills.forEach((bill) => {
      console.log(`\n📄 ${bill.filename}`);
      console.log(`   Utility: ${bill.utilityCompany}`);
      console.log(`   Location: ${bill.location}`);
      console.log(`   Period: ${bill.billPeriod}`);
      console.log(`   Units: ${bill.unitsConsumed} kWh`);
      console.log(`   Total Cost: ${bill.currency} ${bill.totalCost}`);
      console.log(
        `   Cost per Unit: ${bill.currency} ${bill.costPerUnit} per kWh`
      );
    });
  } catch (error) {
    console.error('❌ Error parsing utility bills:', error.message);
    process.exit(1);
  }
}

function parseBillContent(filename, content) {
  // Parse Tamil Nadu Power Distribution Corporation bill (cbetneb.pdf)
  if (content.includes('TAMILNADU POWER DISTRIBUTION CORPORATION LIMITED')) {
    return parseTamilNaduBill(filename, content);
  }

  // Parse Duke Energy bill (orlbill.pdf)
  if (content.includes('duke-energy.com') || content.includes('Duke Energy')) {
    return parseDukeEnergyBill(filename, content);
  }

  // Parse Singapore utility bills (SP Services)
  if (
    content.includes('SP Services') ||
    content.includes('SP app') ||
    (content.includes('Account No.') && content.includes('August 2025')) ||
    (content.includes('Account No.') && content.includes('Singapore')) ||
    filename.includes('sgutilbill')
  ) {
    return parseSingaporeBill(filename, content);
  }

  // Parse Enbridge Gas (Toronto / Etobicoke)
  if (
    filename.toLowerCase().includes('toronto_gas') ||
    content.toLowerCase().includes('enbridge gas')
  ) {
    return parseEnbridgeGasBill(filename, content);
  }

  // Parse CARMA Toronto condo bill (electricity + water)
  if (
    filename.toLowerCase().includes('torontobill') ||
    content.toLowerCase().includes('carma')
  ) {
    return parseCarmaTorontoBill(filename, content);
  }

  // Parse Orlando water bill (Seminole County Utilities)
  if (
    filename.toLowerCase().includes('orlandowaterbill') ||
    /Seminole\s+County\s+Utilities/i.test(content)
  ) {
    return parseOrlandoWaterBill(filename, content);
  }

  return null;
}

function parseTamilNaduBill(filename, content) {
  try {
    // Extract units consumed - look for the consumption value
    // Try different patterns to find the consumption
    let consumptionMatch = content.match(
      /Consumption \[After MF & DT Loss\] :\s*(\d+\.?\d*)/
    );
    if (!consumptionMatch) {
      // Look for the actual consumption value in the meter reading section
      consumptionMatch = content.match(
        /READING\s*(\d+\.?\d*)\s*(\d+\.?\d*)\s*(\d+\.?\d*)/
      );
      if (consumptionMatch) {
        // Calculate consumption as final - initial reading
        const finalReading = parseFloat(consumptionMatch[1]);
        const initialReading = parseFloat(consumptionMatch[2]);
        const consumption = finalReading - initialReading;
        consumptionMatch = [null, consumption.toString()];
      }
    }
    if (!consumptionMatch) {
      // Look for consumption directly
      consumptionMatch = content.match(/Consumption.*?:\s*(\d+\.?\d*)/);
    }

    const unitsConsumed = consumptionMatch
      ? parseFloat(consumptionMatch[1])
      : null;

    // Extract total cost - look for "Bill Amount Rs.813/-"
    const billAmountMatch = content.match(/Bill Amount\s*Rs\.(\d+)/);
    const totalCost = billAmountMatch ? parseFloat(billAmountMatch[1]) : null;

    // Extract bill period
    const billPeriodMatch = content.match(
      /Bill Period\s*(\d{2}\/\d{2}\/\d{4}-\s*\d{2}\/\d{2}\/\d{4})/
    );
    const billPeriod = billPeriodMatch ? billPeriodMatch[1].trim() : '';

    // Extract location
    const locationMatch = content.match(
      /Name\/Address & GST of the Consumer\s*([^,]+)/
    );
    const location = locationMatch
      ? locationMatch[1].trim()
      : 'Tamil Nadu, India';

    if (unitsConsumed && totalCost) {
      const costPerUnit = (totalCost / unitsConsumed).toFixed(2);

      return {
        filename,
        utilityCompany: 'Tamil Nadu Power Distribution Corporation',
        currency: 'INR',
        unitsConsumed: unitsConsumed,
        totalCost: totalCost,
        costPerUnit: costPerUnit,
        billPeriod: billPeriod,
        location: location,
      };
    }
  } catch (error) {
    console.log(`❌ Error parsing Tamil Nadu bill: ${error.message}`);
  }

  return null;
}

function parseDukeEnergyBill(filename, content) {
  try {
    // Extract units consumed
    const usageMatch = content.match(/Energy Used\s*(\d+,\d+)\s*kWh/);
    const unitsConsumed = usageMatch
      ? parseFloat(usageMatch[1].replace(',', ''))
      : null;

    // Extract total cost
    const totalChargesMatch = content.match(
      /Total Current Charges\s*\$(\d+\.\d+)/
    );
    const taxesMatch = content.match(/Total Taxes\s*\$(\d+\.\d+)/);

    const currentCharges = totalChargesMatch
      ? parseFloat(totalChargesMatch[1])
      : 0;
    const taxes = taxesMatch ? parseFloat(taxesMatch[1]) : 0;
    const totalCost = currentCharges + taxes;

    // Extract bill period
    const periodMatch = content.match(
      /Billing Period - (\w+ \d+ \d+ to \w+ \d+ \d+)/
    );
    const billPeriod = periodMatch ? periodMatch[1] : '';

    // Extract location
    const addressMatch = content.match(
      /For service\s*([^,]+,\s*[^,]+,\s*[A-Z]{2}\s*\d{5})/
    );
    const location = addressMatch ? addressMatch[1].trim() : 'Florida, USA';

    if (unitsConsumed && totalCost > 0) {
      const costPerUnit = (totalCost / unitsConsumed).toFixed(4);

      return {
        filename,
        utilityCompany: 'Duke Energy',
        currency: 'USD',
        unitsConsumed: unitsConsumed,
        totalCost: totalCost.toFixed(2),
        costPerUnit: costPerUnit,
        billPeriod: billPeriod,
        location: location,
      };
    }
  } catch (error) {
    console.log(`❌ Error parsing Duke Energy bill: ${error.message}`);
  }

  return null;
}

function parseSingaporeBill(filename, content) {
  try {
    // Normalize OCR spacing glitches (e.g., W ater, Subt otal)
    const text = content.replace(/([A-Za-z])\s+(?=[A-Za-z])/g, '$1');

    // Account number (optional)
    const accountMatch = text.match(/Account No\.\s*(\d+)/);
    const accountNumber = accountMatch ? accountMatch[1] : '';

    // Bill period e.g. "06 Jul 2025 - 05 Aug 2025" or fallback "August 2025"
    let billPeriod = 'August 2025';
    const periodMatch = text.match(
      /(\d{2}\s+[A-Za-z]{3,}\s+\d{4})\s*-\s*(\d{2}\s+[A-Za-z]{3,}\s+\d{4})/
    );
    if (periodMatch) {
      billPeriod = `${periodMatch[1]} - ${periodMatch[2]}`;
    }

    // Extract per-utility breakdowns strictly within the "Breakdown of Current Charges" block
    const breakdownMatch = text.match(
      /Breakdown of Current Charges([\s\S]*?)Subtotal/i
    );
    const breakdown = breakdownMatch ? breakdownMatch[1] : '';
    const elecSectionMatch = breakdown.match(
      /Electricity\s+Services([\s\S]*?)(?:Gas\s+Services|Water\s+Services|Refuse|GST|$)/i
    );
    const gasSectionMatch = breakdown.match(
      /Gas\s+Services([\s\S]*?)(?:Water\s+Services|Refuse|GST|$)/i
    );
    const waterSectionMatch = breakdown.match(
      /Water\s+Services([\s\S]*?)(?:Refuse|GST|$)/i
    );
    let elecRowMatch = null;
    let gasRowMatch = null;
    let waterRowMatch = null;
    if (elecSectionMatch) {
      // Expect: "166 kWh   0.2747   45.60" (units, rate, amount)
      elecRowMatch = elecSectionMatch[1].match(
        /(\d+\.?\d*)\s*kWh\s+(\d+\.?\d*)\s+(\d+\.?\d+)/i
      );
    }
    if (gasSectionMatch) {
      // Expect: "67 kWh   0.2228   14.93" (units, rate, amount)
      gasRowMatch = gasSectionMatch[1].match(
        /(\d+\.?\d*)\s*kWh\s+(\d+\.?\d*)\s+(\d+\.?\d+)/i
      );
    }
    if (waterSectionMatch) {
      // Expect forms like: "57 m3 0.1430 8.15" or "57 CuM 0.1430 8.15"
      waterRowMatch = waterSectionMatch[1].match(
        /(\d+\.?\d*)\s*(?:m[³3]|cum)\s+(\d+\.?\d*)\s+(\d+\.?\d+)/i
      );
    }

    // Global fallback for Water if section header is OCR-mangled
    if (!waterRowMatch) {
      const waterAny = text.match(
        /Water[\s\S]{0,120}?(\d+\.?\d*)\s*(?:m[³3]|cum)[\s\S]{0,80}?(\d+\.?\d*)[\s\S]{0,80}?(\d+\.?\d+)/i
      );
      if (waterAny) {
        waterRowMatch = waterAny;
      }
    }

    // Fallback: global search if section-bounded regex failed (OCR irregularities)
    // No global fallback to avoid accidental capture of trend charts

    const rows = [];

    if (elecRowMatch) {
      const units = parseFloat(elecRowMatch[1]);
      const rate = parseFloat(elecRowMatch[2]);
      const amount = parseFloat(elecRowMatch[3]);
      rows.push({
        filename,
        utilityCompany: 'SP Services (Electricity)',
        currency: 'SGD',
        unitsConsumed: units, // kWh
        totalCost: amount,
        costPerUnit: rate.toFixed(4),
        billPeriod,
        location: 'Singapore',
        accountNumber,
      });
    }

    if (gasRowMatch) {
      const units = parseFloat(gasRowMatch[1]);
      const rate = parseFloat(gasRowMatch[2]);
      const amount = parseFloat(gasRowMatch[3]);
      rows.push({
        filename,
        utilityCompany: 'City Energy (Gas)',
        currency: 'SGD',
        unitsConsumed: units, // kWh equivalent per bill
        totalCost: amount,
        costPerUnit: rate.toFixed(4),
        billPeriod,
        location: 'Singapore',
        accountNumber,
      });
    }
    if (waterRowMatch) {
      const units = parseFloat(waterRowMatch[1]);
      const rate = parseFloat(waterRowMatch[2]);
      const amount = parseFloat(waterRowMatch[3]);
      const unitCost = units > 0 ? amount / units : rate;
      rows.push({
        filename,
        utilityCompany: 'SP Services (Water)',
        currency: 'SGD',
        unitsConsumed: units, // m³
        totalCost: amount,
        costPerUnit: unitCost.toFixed(4),
        billPeriod,
        location: 'Singapore',
        accountNumber,
      });
    }

    if (rows.length > 0) {
      return rows;
    }
  } catch (error) {
    console.log(`❌ Error parsing Singapore bill: ${error.message}`);
  }
  return null;
}

function parseEnbridgeGasBill(filename, content) {
  try {
    // Bill period
    let billPeriod = '';
    const periodMatch = content.match(
      /Billing\s+Period\s+([A-Za-z]{3,}\s+\d{1,2}\s*,\s*\d{4}\s*-\s*[A-Za-z]{3,}\s+\d{1,2}\s*,\s*\d{4})/i
    );
    if (periodMatch) {
      billPeriod = periodMatch[1];
    }

    // Total amount (taxes included)
    let totalCost = null;
    const totalMatch = content.match(
      /Total\s+Amount\s+(?:Due\s+)?\$\s*([0-9]+\.?[0-9]*)/i
    );
    if (totalMatch) {
      totalCost = parseFloat(totalMatch[1]);
    }

    // Units in m3 — prefer the "How much gas did I use" section
    let unitsM3 = null;
    const m3MatchSpecific = content.match(
      /How\s+Much\s+Gas\s+Did\s+I\s+Use\?.*?(\d+)\s*m[³3]/i
    );
    const m3MatchAny = content.match(/(\d+)\s*m[³3][^a-zA-Z]/i);
    if (m3MatchSpecific) {
      unitsM3 = parseFloat(m3MatchSpecific[1]);
    } else if (m3MatchAny) {
      unitsM3 = parseFloat(m3MatchAny[1]);
    }

    // Location — try to capture city tokens in address
    let location = 'Ontario, Canada';
    const locMatch = content.match(/(Etobicoke|Toronto),\s*ON/i);
    if (locMatch) {
      location = `${locMatch[1]}, ON, Canada`;
    }

    if (totalCost != null && unitsM3 != null && unitsM3 > 0) {
      const costPerUnit = (totalCost / unitsM3).toFixed(2);
      return {
        filename,
        utilityCompany: 'Enbridge Gas',
        currency: 'CAD',
        unitsConsumed: unitsM3, // m3
        totalCost: totalCost,
        costPerUnit: costPerUnit, // per m3
        billPeriod: billPeriod,
        location: location,
      };
    }
  } catch (error) {
    console.log(`❌ Error parsing Enbridge bill: ${error.message}`);
  }
  return null;
}

function parseCarmaTorontoBill(filename, content) {
  try {
    // Normalize OCR letter spacing (e.g., W ater, SUBT OT AL)
    const text = content.replace(/([A-Za-z])\s+(?=[A-Za-z])/g, '$1');
    // Bill period: dates like 06/23/2025 07/23/2025 near meter read lines
    let billPeriod = '';
    const periodPair = text.match(
      /(\d{2}\/\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})/
    );
    if (periodPair) {
      billPeriod = `${periodPair[1]} - ${periodPair[2]}`;
    }

    // Location
    let location = 'Toronto, ON, Canada';
    if (/Lindsay\s*,\s*ON/i.test(text)) {
      location = 'Lindsay, ON, Canada';
    }
    if (/Toronto\s*ON|T\s*O\s*R\s*O\s*N\s*T\s*O\s*\s*ON/i.test(text)) {
      location = 'Toronto, ON, Canada';
    }

    const rows = [];

    // Electricity: total kWh and total electricity charges
    // kWh usage: try explicit kWh token or sum of peak buckets
    let kwh = null;
    const kwhMatch = text.match(/kWh\s*(\d{1,5})\b/);
    if (kwhMatch) {
      kwh = parseFloat(kwhMatch[1]);
    } else {
      // Sum On/Off/Mid peak quantities: lines like "On Peak Usage 0.158000 135.0000 $21.33"
      const onPeak = text.match(/On\s*Peak\s*Usage\s*[0-9.]+\s+(\d+\.?\d*)/i);
      const offPeak = text.match(/Off\s*Peak\s*Usage\s*[0-9.]+\s+(\d+\.?\d*)/i);
      const midPeak = text.match(/Mid\s*Peak\s*Usage\s*[0-9.]+\s+(\d+\.?\d*)/i);
      const sum = [onPeak, offPeak, midPeak]
        .map((m) => (m ? parseFloat(m[1]) : 0))
        .reduce((a, b) => a + b, 0);
      if (sum > 0) {
        kwh = sum;
      }
    }

    // Total electricity charges: look for TOTAL ELECTRICITY CHARGES  $131.69
    let elecTotal = null;
    const elecTotalMatch = text.match(
      /TOTAL\s+ELECTRICITY\s+CHARGES\s*\$\s*([0-9]+\.?[0-9]*)/i
    );
    if (elecTotalMatch) {
      elecTotal = parseFloat(elecTotalMatch[1]);
    }
    // Fallback: ELECTRICITY CHARGES SUBTOTAL  $131.69
    if (elecTotal == null) {
      const subMatch = text.match(
        /ELECTRICITY\s+CHARGES\s+SUBT?OTAL\s*\$\s*([0-9]+\.?[0-9]*)/i
      );
      if (subMatch) {
        elecTotal = parseFloat(subMatch[1]);
      }
    }

    if (kwh != null && elecTotal != null) {
      rows.push({
        filename,
        utilityCompany: 'CARMA (Electricity)',
        currency: 'CAD',
        unitsConsumed: kwh,
        totalCost: elecTotal.toFixed(2),
        costPerUnit: (elecTotal / kwh).toFixed(4),
        billPeriod,
        location,
      });
    }

    // Water: line like "Cold Water Consumption   4.687200   7.0000  $32.81"
    const waterLine = text.match(
      /Cold\s*Water\s*Consumption\s+([0-9]+\.?[0-9]*)\s+([0-9]+\.?[0-9]*)\s*\$\s*([0-9]+\.?[0-9]*)/i
    );
    if (waterLine) {
      const rate = parseFloat(waterLine[1]);
      const units = parseFloat(waterLine[2]);
      const amount = parseFloat(waterLine[3]);
      if (units > 0 && amount > 0) {
        rows.push({
          filename,
          utilityCompany: 'CARMA (Water)',
          currency: 'CAD',
          unitsConsumed: units, // m3
          totalCost: amount.toFixed(2),
          costPerUnit: rate.toFixed(4), // per m3
          billPeriod,
          location,
        });
      }
    }

    if (rows.length > 0) {
      return rows;
    }
  } catch (error) {
    console.log(`❌ Error parsing CARMA bill: ${error.message}`);
  }
  return null;
}

function parseOrlandoWaterBill(filename, content) {
  try {
    // Normalize letter-separated OCR, collapse multiple spaces
    const t = content
      .replace(/([A-Za-z])\s+(?=[A-Za-z])/g, '$1')
      .replace(/\s+/g, ' ');

    // Billing period (MM/DD/YYYY to MM/DD/YYYY)
    let billPeriod = '';
    const pm = t.match(/(\d{2}\/\d{2}\/\d{4})\s+to\s+(\d{2}\/\d{2}\/\d{4})/i);
    if (pm) {
      billPeriod = `${pm[1]} - ${pm[2]}`;
    }
    // Fallback to bracketed From/To line with two dates in sequence
    if (!pm) {
      const twoDates = t.match(
        /(\d{2}\/\d{2}\/\d{4}).{0,20}?(\d{2}\/\d{2}\/\d{4})/
      );
      if (twoDates) {
        billPeriod = `${twoDates[1]} - ${twoDates[2]}`;
      }
    }

    // Location
    let location = 'Altamonte Springs, FL, USA';
    if (/LAKE\s*MARY\s*,?\s*FL/i.test(t)) {
      location = 'Lake Mary, FL, USA';
    }

    // Usage: look for "UsageX100" value — this represents hundreds of gallons
    // Example table shows: "UsageX100 | 258" meaning 25,800 gallons
    // Prefer integer right after the UsageX100 header cell and before a pipe or space
    let ux = t.match(/Usage\s*X?\s*100[^\d]{0,40}(\d{1,4})\s*\|/i);
    if (!ux) {
      ux = t.match(/Usage\s*X?\s*100[^\d]{0,80}(\d{1,4})\b/i);
    }
    let unitsM3 = null;
    if (ux) {
      const hundredsOfGallons = parseFloat(ux[1]);
      const gallons = hundredsOfGallons * 100;
      unitsM3 = +((gallons * 3.78541) / 1000).toFixed(2); // gallons → liters → m³
    }

    // Amount: prefer a $ near WATER keyword, else fall back to the largest $ amount
    let amount = null;
    const nearWater = t.match(/Water[\s\S]{0,120}?\$\s*([0-9]+\.?[0-9]*)/i);
    if (nearWater) {
      amount = parseFloat(nearWater[1]);
    }
    if (amount == null) {
      const dollars = Array.from(t.matchAll(/\$\s*([0-9]+\.?[0-9]*)/g)).map(
        (m) => parseFloat(m[1])
      );
      if (dollars.length) {
        amount = Math.max(...dollars);
      }
    }

    if (unitsM3 != null && amount != null) {
      return {
        filename,
        utilityCompany: 'Seminole County Utilities (Water)',
        currency: 'USD',
        unitsConsumed: unitsM3, // m3
        totalCost: amount.toFixed(2),
        costPerUnit: (amount / unitsM3).toFixed(2),
        billPeriod,
        location,
      };
    }
  } catch (error) {
    console.log(`❌ Error parsing Orlando water bill: ${error.message}`);
  }
  return null;
}

// Run the parsing
parseUtilityBills().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
