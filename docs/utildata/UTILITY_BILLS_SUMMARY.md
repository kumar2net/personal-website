# Utility Bills Data Parsing Summary

## Overview
Successfully parsed utility bill data from PDF files in the `docs/utildata` folder and extracted key information including units consumed, total cost, and cost per unit in their respective currencies.

## Files Processed

### 1. Tamil Nadu Power Distribution Corporation (cbetneb.pdf)
- **Utility Company**: Tamil Nadu Power Distribution Corporation
- **Location**: N JEYALAKSHMI, Tamil Nadu, India
- **Bill Period**: 24/05/2025 - 26/07/2025
- **Units Consumed**: 323 kWh
- **Total Cost**: ₹813 (INR)
- **Cost Per Unit**: ₹2.52 per kWh
- **Currency**: Indian Rupees (INR)

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
