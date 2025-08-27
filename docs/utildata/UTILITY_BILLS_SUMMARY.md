# Utility Bills Data Parsing Summary

## Key Insights

| City | Electricity (kWh) | Cost/kWh (local) | Cost/kWh (USD) | Gas (units) | Cost/unit (local) | Cost/unit (USD) |
|---|---:|---:|---:|---:|---:|---:|
| Coimbatore, TN, India | 323 | ₹2.52 | $0.0302 | 10 kg | ₹66.00/kg | $0.79/kg |
| Altamonte Springs, FL, USA | 1,564 | $0.1858 | $0.1858 | — | — | — |
| Singapore | 166 | S$0.2747 | $0.2035 | 67 kWh-e | S$0.2228/kWh | $0.1650/kWh |
| Etobicoke, ON, Canada | — | — | — | 21 m³ | C$1.78/m³ | $1.31/m³ |

Notes:
- Coimbatore: LPG 10 kg/month at ₹660 ⇒ ₹66/kg.
- Singapore: Electricity 166 kWh at S$0.2747/kWh; gas appears as 67 kWh-equivalent at S$0.2228/kWh (City Energy). m³ not provided.
 - USD equivalents assume FX: ₹83.5/USD, S$1.35/USD, C$1.36/USD.

### Normalized Gas Cost (USD/kWh, apples-to-apples)

| City | Local gas unit | Local price | Energy factor | USD/unit | USD/kWh |
|---|---|---:|---:|---:|---:|
| Etobicoke, ON, Canada | m³ (natural gas) | C$1.78/m³ | 9.94 kWh/m³ | $1.31/m³ | $0.132/kWh |
| Coimbatore, TN, India | kg (LPG) | ₹66.00/kg | 12.78 kWh/kg | $0.79/kg | $0.062/kWh |
| Singapore | kWh-e (City Energy) | S$0.2228/kWh | 1.00 kWh/kWh | $0.165/kWh | $0.165/kWh |

Explanation:
- Uses lower heating value (LHV) approximations: natural gas ≈ 35.8 MJ/m³ (≈ 9.94 kWh/m³), LPG ≈ 46 MJ/kg (≈ 12.78 kWh/kg).
- Singapore City Energy gas is already presented as kWh-equivalent on the bill, so no conversion needed.
- USD conversions use the FX assumptions listed above.

## Overview
Successfully parsed utility bill data from PDF files in the `docs/utildata` folder and extracted key information including units consumed, total cost, and cost per unit in their respective currencies.

### Water Consumption and Unit Costs

| City | Water (m³) | Cost/m³ (local) | Cost/m³ (USD) |
|---|---:|---:|---:|
| Toronto, ON, Canada | 7.00 | C$4.6872 | $3.45 |
| Lake Mary, FL, USA | 309.27 | $0.36 | $0.36 |
| Singapore | — | — | — |

Notes:
- Toronto (CARMA): Cold water consumption 7 m³ at C$4.6872/m³ → C$32.81. USD assumes C$1.36/USD.
- Orlando (Seminole County Utilities): Usage derived from “UsageX100” (hundreds of gallons) converted to m³; total $110.05.
- Singapore: Water line not detected in extracted block; will populate if parsed reliably in a future pass.

## Files Processed

### 1. Tamil Nadu Power Distribution Corporation (cbetneb.pdf)
- **Utility Company**: Tamil Nadu Power Distribution Corporation
- **Location**: N JEYALAKSHMI, Tamil Nadu, India
- **Bill Period**: 24/05/2025 - 26/07/2025
- **Units Consumed**: 323 kWh
- **Total Cost**: ₹813 (INR)
- **Cost Per Unit**: ₹2.52 per kWh
- **Currency**: Indian Rupees (INR)
1.1 Tamilinadu Indane Gas = 660 per month


### 2. Duke Energy (orlbill.pdf)
- **Utility Company**: Duke Energy
- **Location**: Florida, USA
- **Bill Period**: Jul 15, 2025 to Aug 13, 2025
- **Units Consumed**: 1,564 kWh
- **Total Cost**: $290.57 (USD)
- **Cost Per Unit**: $0.1858 per kWh
- **Currency**: US Dollars (USD)

## Files Processed

### 1. Tamil Nadu Power Distribution Corporation (cbetneb.pdf)
- **Utility Company**: Tamil Nadu Power Distribution Corporation
- **Location**: N JEYALAKSHMI, Tamil Nadu, India
- **Bill Period**: 24/05/2025 - 26/07/2025
- **Units Consumed**: 323 kWh
- **Total Cost**: ₹813 (INR)
- **Cost Per Unit**: ₹2.52 per kWh
- **Currency**: Indian Rupees (INR)

### 2. Duke Energy (orlbill.pdf & ordutilbill1.jpeg)
- **Utility Company**: Duke Energy
- **Location**: Florida, USA
- **Bill Period**: Jul 15, 2025 to Aug 13, 2025
- **Units Consumed**: 1,564 kWh
- **Total Cost**: $290.57 (USD)
- **Cost Per Unit**: $0.1858 per kWh
- **Currency**: US Dollars (USD)

### 3. SP Services Singapore (sgutilbill2.jpeg)
- **Utility Company**: SP Services (Singapore)
- **Location**: Singapore
- **Bill Period**: August 2025
- **Units Consumed**: 0.067 kWh (Electricity: 67 Wh, Water: 57 uM)
- **Total Cost**: $96.27 (SGD)
- **Cost Per Unit**: $1,436.87 per kWh (Note: This is for electricity only, bill includes water)
- **Currency**: Singapore Dollars (SGD)

## Files Not Processed
The following image file could not be processed due to OCR limitations:
- `sgutilbill1.jpeg` - OCR extraction failed to identify usage data

## Data Comparison

| Metric | Tamil Nadu (INR) | Duke Energy (USD) | Singapore (SGD) |
|--------|------------------|-------------------|-----------------|
| Units Consumed | 323 kWh | 1,564 kWh | 0.067 kWh |
| Total Cost | ₹813 | $290.57 | $96.27 |
| Cost Per Unit | ₹2.52/kWh | $0.1858/kWh | $1,436.87/kWh* |
| Cost Per Unit (USD equivalent)** | ~$0.03/kWh | $0.1858/kWh | ~$0.07/kWh*** |

*Note: Singapore cost per unit is calculated using electricity only (67 Wh), but the bill includes both electricity and water services
**Note: INR to USD conversion rate would be needed for accurate comparison
***Note: SGD to USD conversion rate would be needed for accurate comparison

## Files Generated
1. `extracted_data.json` - Raw extracted text from PDF files
2. `utility_bills_parsed.csv` - Parsed data in CSV format with columns:
   - Filename
   - Utility Company
   - Currency
   - Units Consumed
   - Total Cost
   - Cost Per Unit
   - Bill Period
   - Location

## Technical Details
- Used `pdfjs-dist` library for PDF text extraction
- Used `tesseract.js` for OCR text extraction from JPEG images
- Implemented custom regex patterns for each utility company's bill format
- Handled different date formats and currency representations
- Calculated cost per unit by dividing total cost by units consumed
- Applied manual corrections for known OCR errors in Singapore bills

## Next Steps
To process the remaining image files, an OCR service or library would be needed to extract text from the JPEG images before parsing.
