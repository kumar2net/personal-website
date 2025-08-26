import fs from 'node:fs/promises'
import path from 'node:path'
import { createWorker } from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs'

async function extractUtilityBillsOCR() {
  const projectRoot = process.cwd()
  const utildataPath = path.join(projectRoot, 'docs', 'utildata')
  
  try {
    console.log('📁 Reading utility bill files...')
    const files = await fs.readdir(utildataPath)
    
    const results = []
    
    // Filter for JPEG files
    const jpegFiles = files.filter(file => 
      file.endsWith('.jpeg') || file.endsWith('.jpg')
    )
    
    console.log(`📷 Found ${jpegFiles.length} JPEG files to process`)
    
    for (const file of jpegFiles) {
      const filePath = path.join(utildataPath, file)
      
      console.log(`\n🔍 Processing: ${file}`)
      
      try {
        // Check if file is actually a PDF
        const dataBuffer = await fs.readFile(filePath)
        const isPDF = dataBuffer.toString('ascii', 0, 4) === '%PDF'
        
        if (isPDF) {
          console.log(`📄 File ${file} is actually a PDF, using PDF extraction`)
          
          // Convert Buffer to Uint8Array
          const uint8Array = new Uint8Array(dataBuffer)
          
          // Load the PDF document
          const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
          const pdfDocument = await loadingTask.promise
          
          console.log(`📄 PDF loaded: ${pdfDocument.numPages} pages`)
          
          let fullText = ''
          
          // Extract text from each page
          for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum)
            const textContent = await page.getTextContent()
            
            const pageText = textContent.items
              .map(item => item.str)
              .join(' ')
            
            fullText += pageText + '\n'
          }
          
          results.push({
            filename: file,
            type: 'pdf_disguised_as_jpeg',
            content: fullText.trim(),
            pages: pdfDocument.numPages
          })
          
          console.log(`✅ PDF extraction completed for ${file}`)
          console.log(`📝 Extracted ${fullText.length} characters`)
          
        } else {
          console.log(`📷 File ${file} is a real JPEG image, using OCR`)
          
          // Create Tesseract worker
          const worker = await createWorker('eng')
          
          // Recognize text from image
          const { data: { text } } = await worker.recognize(filePath)
          
          // Terminate worker
          await worker.terminate()
          
          results.push({
            filename: file,
            type: 'image',
            content: text.trim(),
            pages: 1
          })
          
          console.log(`✅ OCR completed for ${file}`)
          console.log(`📝 Extracted ${text.length} characters`)
        }
        
        // Show preview of extracted text
        const content = results[results.length - 1].content
        console.log('\n📖 Text Preview (first 300 characters):')
        console.log('─'.repeat(50))
        console.log(content.substring(0, 300) + '...')
        console.log('─'.repeat(50))
        
      } catch (error) {
        console.log(`❌ Failed to extract from ${file}: ${error.message}`)
        results.push({
          filename: file,
          type: 'error',
          content: `Extraction failed: ${error.message}`,
          pages: 1
        })
      }
    }
    
    // Read existing extracted data
    const existingDataPath = path.join(utildataPath, 'extracted_data.json')
    let existingData = []
    
    try {
      const existingDataContent = await fs.readFile(existingDataPath, 'utf8')
      existingData = JSON.parse(existingDataContent)
    } catch (error) {
      console.log('📄 No existing extracted data found, creating new file')
    }
    
    // Combine existing PDF data with new OCR data
    const combinedData = [...existingData, ...results]
    
    // Save combined extracted data
    await fs.writeFile(existingDataPath, JSON.stringify(combinedData, null, 2), 'utf8')
    
    console.log(`\n✅ Extraction data saved to: ${existingDataPath}`)
    console.log(`📊 Processed ${results.length} files`)
    console.log(`📊 Total files in database: ${combinedData.length}`)
    
  } catch (error) {
    console.error('❌ Error processing utility bills:', error.message)
    process.exit(1)
  }
}

// Run the extraction
extractUtilityBillsOCR().catch((err) => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})
