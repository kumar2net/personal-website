import fs from 'node:fs/promises';
import path from 'node:path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'pdfjs-dist/legacy/build/pdf.worker.mjs';

async function extractUtilityBillData() {
  const projectRoot = process.cwd();
  const utildataPath = path.join(projectRoot, 'docs', 'utildata');

  try {
    console.log('📁 Reading utility bill files...');
    const files = await fs.readdir(utildataPath);

    const results = [];

    for (const file of files) {
      const filePath = path.join(utildataPath, file);

      console.log(`📄 Processing: ${file}`);

      if (file.endsWith('.pdf')) {
        try {
          const dataBuffer = await fs.readFile(filePath);

          // Convert Buffer to Uint8Array
          const uint8Array = new Uint8Array(dataBuffer);

          // Load the PDF document
          const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
          const pdfDocument = await loadingTask.promise;

          console.log(`📄 PDF loaded: ${pdfDocument.numPages} pages`);

          let fullText = '';

          // Extract text from each page
          for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const textContent = await page.getTextContent();

            const pageText = textContent.items
              .map((item) => item.str)
              .join(' ');

            fullText += `${pageText}\n`;
          }

          results.push({
            filename: file,
            type: 'pdf',
            content: fullText.trim(),
            pages: pdfDocument.numPages,
          });

          console.log(
            `✅ Extracted ${pdfDocument.numPages} pages from ${file}`
          );
        } catch (error) {
          console.log(`❌ Failed to extract PDF ${file}: ${error.message}`);
        }
      } else if (file.endsWith('.jpeg') || file.endsWith('.jpg')) {
        // For image files, we'll note them but can't extract text directly
        results.push({
          filename: file,
          type: 'image',
          content: 'Image file - requires OCR for text extraction',
          pages: 1,
        });
        console.log(`📷 Image file: ${file} (requires OCR)`);
      }
    }

    // Save extracted data
    const outputPath = path.join(
      projectRoot,
      'docs',
      'utildata',
      'extracted_data.json'
    );
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf8');

    console.log(`\n✅ Extracted data saved to: ${outputPath}`);
    console.log(`📊 Processed ${results.length} files`);

    // Show preview of extracted content
    console.log('\n📖 Content Preview:');
    console.log('─'.repeat(80));

    results.forEach((result) => {
      console.log(`\n📄 ${result.filename} (${result.type})`);
      console.log('─'.repeat(40));
      if (
        result.content &&
        result.content.length > 0 &&
        result.content !== 'Image file - requires OCR for text extraction'
      ) {
        console.log(`${result.content.substring(0, 500)}...`);
      } else {
        console.log('No text content extracted');
      }
    });
  } catch (error) {
    console.error('❌ Error processing utility bills:', error.message);
    process.exit(1);
  }
}

// Run the extraction
extractUtilityBillData().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
