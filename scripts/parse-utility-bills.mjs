import fs from 'node:fs/promises'
import path from 'node:path'

async function parseUtilityBills() {
  const projectRoot = process.cwd()
  const extractedDataPath = path.join(projectRoot, 'docs', 'utildata', 'extracted_data.json')
  
  try {
    console.log('📁 Reading extracted utility bill data...')
    const data = await fs.readFile(extractedDataPath, 'utf8')
    const bills = JSON.parse(data)
    
    const parsedBills = []
    
    for (const bill of bills) {
      if (bill.content && bill.content.length > 0) {
        const parsed = parseBillContent(bill.filename, bill.content)
        if (Array.isArray(parsed)) {
          parsed.forEach(row => parsedBills.push(row))
        } else if (parsed) {
          parsedBills.push(parsed)
        }
      }
    }
    
    // Create CSV content
    const csvHeader = 'Filename,Utility Company,Currency,Units Consumed,Total Cost,Cost Per Unit,Bill Period,Location\n'
    const csvRows = parsedBills.map(bill => 
      `"${bill.filename}","${bill.utilityCompany}","${bill.currency}","${bill.unitsConsumed}","${bill.totalCost}","${bill.costPerUnit}","${bill.billPeriod}","${bill.location}"`
    ).join('\n')
    
    const csvContent = csvHeader + csvRows
    
    // Save CSV file
    const csvPath = path.join(projectRoot, 'docs', 'utildata', 'utility_bills_parsed.csv')
    await fs.writeFile(csvPath, csvContent, 'utf8')
    
    console.log(`\n✅ Parsed data saved to: ${csvPath}`)
    console.log(`📊 Processed ${parsedBills.length} bills`)
    
    // Display results
    console.log('\n📋 Parsed Utility Bills:')
    console.log('─'.repeat(100))
    
    parsedBills.forEach(bill => {
      console.log(`\n📄 ${bill.filename}`)
      console.log(`   Utility: ${bill.utilityCompany}`)
      console.log(`   Location: ${bill.location}`)
      console.log(`   Period: ${bill.billPeriod}`)
      console.log(`   Units: ${bill.unitsConsumed} kWh`)
      console.log(`   Total Cost: ${bill.currency} ${bill.totalCost}`)
      console.log(`   Cost per Unit: ${bill.currency} ${bill.costPerUnit} per kWh`)
    })
    
  } catch (error) {
    console.error('❌ Error parsing utility bills:', error.message)
    process.exit(1)
  }
}

function parseBillContent(filename, content) {
  // Parse Tamil Nadu Power Distribution Corporation bill (cbetneb.pdf)
  if (content.includes('TAMILNADU POWER DISTRIBUTION CORPORATION LIMITED')) {
    return parseTamilNaduBill(filename, content)
  }
  
  // Parse Duke Energy bill (orlbill.pdf)
  if (content.includes('duke-energy.com') || content.includes('Duke Energy')) {
    return parseDukeEnergyBill(filename, content)
  }
  
  // Parse Singapore utility bills (SP Services)
  if (content.includes('SP Services') || content.includes('SP app') || 
      (content.includes('Account No.') && content.includes('August 2025')) ||
      (content.includes('Account No.') && content.includes('Singapore')) ||
      filename.includes('sgutilbill')) {
    return parseSingaporeBill(filename, content)
  }

  // Parse Enbridge Gas (Toronto / Etobicoke)
  if (filename.toLowerCase().includes('toronto_gas') || content.toLowerCase().includes('enbridge gas')) {
    return parseEnbridgeGasBill(filename, content)
  }
  
  return null
}

function parseTamilNaduBill(filename, content) {
  try {
    // Extract units consumed - look for the consumption value
    // Try different patterns to find the consumption
    let consumptionMatch = content.match(/Consumption \[After MF & DT Loss\] :\s*(\d+\.?\d*)/)
    if (!consumptionMatch) {
      // Look for the actual consumption value in the meter reading section
      consumptionMatch = content.match(/READING\s*(\d+\.?\d*)\s*(\d+\.?\d*)\s*(\d+\.?\d*)/)
      if (consumptionMatch) {
        // Calculate consumption as final - initial reading
        const finalReading = parseFloat(consumptionMatch[1])
        const initialReading = parseFloat(consumptionMatch[2])
        const consumption = finalReading - initialReading
        consumptionMatch = [null, consumption.toString()]
      }
    }
    if (!consumptionMatch) {
      // Look for consumption directly
      consumptionMatch = content.match(/Consumption.*?:\s*(\d+\.?\d*)/)
    }
    
    const unitsConsumed = consumptionMatch ? parseFloat(consumptionMatch[1]) : null
    
    // Extract total cost - look for "Bill Amount Rs.813/-"
    const billAmountMatch = content.match(/Bill Amount\s*Rs\.(\d+)/)
    const totalCost = billAmountMatch ? parseFloat(billAmountMatch[1]) : null
    
    // Extract bill period
    const billPeriodMatch = content.match(/Bill Period\s*(\d{2}\/\d{2}\/\d{4}-\s*\d{2}\/\d{2}\/\d{4})/)
    const billPeriod = billPeriodMatch ? billPeriodMatch[1].trim() : ''
    
    // Extract location
    const locationMatch = content.match(/Name\/Address & GST of the Consumer\s*([^,]+)/)
    const location = locationMatch ? locationMatch[1].trim() : 'Tamil Nadu, India'
    
    if (unitsConsumed && totalCost) {
      const costPerUnit = (totalCost / unitsConsumed).toFixed(2)
      
      return {
        filename,
        utilityCompany: 'Tamil Nadu Power Distribution Corporation',
        currency: 'INR',
        unitsConsumed: unitsConsumed,
        totalCost: totalCost,
        costPerUnit: costPerUnit,
        billPeriod: billPeriod,
        location: location
      }
    }
  } catch (error) {
    console.log(`❌ Error parsing Tamil Nadu bill: ${error.message}`)
  }
  
  return null
}

function parseDukeEnergyBill(filename, content) {
  try {
    // Extract units consumed
    const usageMatch = content.match(/Energy Used\s*(\d+,\d+)\s*kWh/)
    const unitsConsumed = usageMatch ? parseFloat(usageMatch[1].replace(',', '')) : null
    
    // Extract total cost
    const totalChargesMatch = content.match(/Total Current Charges\s*\$(\d+\.\d+)/)
    const taxesMatch = content.match(/Total Taxes\s*\$(\d+\.\d+)/)
    
    const currentCharges = totalChargesMatch ? parseFloat(totalChargesMatch[1]) : 0
    const taxes = taxesMatch ? parseFloat(taxesMatch[1]) : 0
    const totalCost = currentCharges + taxes
    
    // Extract bill period
    const periodMatch = content.match(/Billing Period - (\w+ \d+ \d+ to \w+ \d+ \d+)/)
    const billPeriod = periodMatch ? periodMatch[1] : ''
    
    // Extract location
    const addressMatch = content.match(/For service\s*([^,]+,\s*[^,]+,\s*[A-Z]{2}\s*\d{5})/)
    const location = addressMatch ? addressMatch[1].trim() : 'Florida, USA'
    
    if (unitsConsumed && totalCost > 0) {
      const costPerUnit = (totalCost / unitsConsumed).toFixed(4)
      
      return {
        filename,
        utilityCompany: 'Duke Energy',
        currency: 'USD',
        unitsConsumed: unitsConsumed,
        totalCost: totalCost.toFixed(2),
        costPerUnit: costPerUnit,
        billPeriod: billPeriod,
        location: location
      }
    }
  } catch (error) {
    console.log(`❌ Error parsing Duke Energy bill: ${error.message}`)
  }
  
  return null
}

function parseSingaporeBill(filename, content) {
  try {
    // Account number (optional)
    const accountMatch = content.match(/Account No\.\s*(\d+)/)
    const accountNumber = accountMatch ? accountMatch[1] : ''

    // Bill period e.g. "06 Jul 2025 - 05 Aug 2025" or fallback "August 2025"
    let billPeriod = 'August 2025'
    const periodMatch = content.match(/(\d{2}\s+[A-Za-z]{3,}\s+\d{4})\s*-\s*(\d{2}\s+[A-Za-z]{3,}\s+\d{4})/)
    if (periodMatch) billPeriod = `${periodMatch[1]} - ${periodMatch[2]}`

    // Extract per-utility breakdowns strictly within the "Breakdown of Current Charges" block
    const breakdownMatch = content.match(/Breakdown of Current Charges([\s\S]*?)Subtotal/i)
    const breakdown = breakdownMatch ? breakdownMatch[1] : ''
    const elecSectionMatch = breakdown.match(/Electricity\s+Services([\s\S]*?)(?:Gas\s+Services|Water\s+Services|Refuse|GST|$)/i)
    const gasSectionMatch = breakdown.match(/Gas\s+Services([\s\S]*?)(?:Water\s+Services|Refuse|GST|$)/i)
    let elecRowMatch = null
    let gasRowMatch = null
    if (elecSectionMatch) {
      // Expect: "166 kWh   0.2747   45.60" (units, rate, amount)
      elecRowMatch = elecSectionMatch[1].match(/(\d+\.?\d*)\s*kWh\s+(\d+\.?\d*)\s+(\d+\.?\d+)/i)
    }
    if (gasSectionMatch) {
      // Expect: "67 kWh   0.2228   14.93" (units, rate, amount)
      gasRowMatch = gasSectionMatch[1].match(/(\d+\.?\d*)\s*kWh\s+(\d+\.?\d*)\s+(\d+\.?\d+)/i)
    }

    // Fallback: global search if section-bounded regex failed (OCR irregularities)
    // No global fallback to avoid accidental capture of trend charts

    const rows = []

    if (elecRowMatch) {
      const units = parseFloat(elecRowMatch[1])
      const rate = parseFloat(elecRowMatch[2])
      const amount = parseFloat(elecRowMatch[3])
      rows.push({
        filename,
        utilityCompany: 'SP Services (Electricity)',
        currency: 'SGD',
        unitsConsumed: units, // kWh
        totalCost: amount,
        costPerUnit: rate.toFixed(4),
        billPeriod,
        location: 'Singapore',
        accountNumber
      })
    }

    if (gasRowMatch) {
      const units = parseFloat(gasRowMatch[1])
      const rate = parseFloat(gasRowMatch[2])
      const amount = parseFloat(gasRowMatch[3])
      rows.push({
        filename,
        utilityCompany: 'City Energy (Gas)',
        currency: 'SGD',
        unitsConsumed: units, // kWh equivalent per bill
        totalCost: amount,
        costPerUnit: rate.toFixed(4),
        billPeriod,
        location: 'Singapore',
        accountNumber
      })
    }

    if (rows.length > 0) return rows
  } catch (error) {
    console.log(`❌ Error parsing Singapore bill: ${error.message}`)
  }
  return null
}

function parseEnbridgeGasBill(filename, content) {
  try {
    // Bill period
    let billPeriod = ''
    const periodMatch = content.match(/Billing\s+Period\s+([A-Za-z]{3,}\s+\d{1,2}\s*,\s*\d{4}\s*-\s*[A-Za-z]{3,}\s+\d{1,2}\s*,\s*\d{4})/i)
    if (periodMatch) billPeriod = periodMatch[1]

    // Total amount (taxes included)
    let totalCost = null
    const totalMatch = content.match(/Total\s+Amount\s+(?:Due\s+)?\$\s*([0-9]+\.?[0-9]*)/i)
    if (totalMatch) totalCost = parseFloat(totalMatch[1])

    // Units in m3 — prefer the "How much gas did I use" section
    let unitsM3 = null
    const m3MatchSpecific = content.match(/How\s+Much\s+Gas\s+Did\s+I\s+Use\?.*?(\d+)\s*m[³3]/i)
    const m3MatchAny = content.match(/(\d+)\s*m[³3][^a-zA-Z]/i)
    if (m3MatchSpecific) {
      unitsM3 = parseFloat(m3MatchSpecific[1])
    } else if (m3MatchAny) {
      unitsM3 = parseFloat(m3MatchAny[1])
    }

    // Location — try to capture city tokens in address
    let location = 'Ontario, Canada'
    const locMatch = content.match(/(Etobicoke|Toronto),\s*ON/i)
    if (locMatch) {
      location = `${locMatch[1]}, ON, Canada`
    }

    if (totalCost != null && unitsM3 != null && unitsM3 > 0) {
      const costPerUnit = (totalCost / unitsM3).toFixed(2)
      return {
        filename,
        utilityCompany: 'Enbridge Gas',
        currency: 'CAD',
        unitsConsumed: unitsM3, // m3
        totalCost: totalCost,
        costPerUnit: costPerUnit, // per m3
        billPeriod: billPeriod,
        location: location
      }
    }
  } catch (error) {
    console.log(`❌ Error parsing Enbridge bill: ${error.message}`)
  }
  return null
}

// Run the parsing
parseUtilityBills().catch((err) => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})
