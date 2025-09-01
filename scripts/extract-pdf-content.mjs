import fs from 'node:fs/promises';
import path from 'node:path';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

async function extractPDFContent() {
  const projectRoot = path.resolve(process.cwd());
  const pdfPath = path.join(projectRoot, 'docs', 'The_Brain_The_Story.pdf');
  const outputPath = path.join(
    projectRoot,
    'src',
    'pages',
    'books',
    'the-brain-story.md'
  );

  try {
    console.log('📖 Reading PDF file...');
    const dataBuffer = await fs.readFile(pdfPath);

    console.log('🔍 Parsing PDF content...');
    const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
    const pdf = await loadingTask.promise;

    console.log(`📄 PDF parsed: ${pdf.numPages} pages`);

    let fullText = '';
    console.log('📝 Extracting text from pages...');

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`📃 Processing page ${pageNum}/${pdf.numPages}...`);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }

    console.log(`📊 Text length: ${fullText.length} characters`);

    console.log('✍️ Converting to Markdown...');
    const markdown = convertToMarkdown(fullText);

    console.log('💾 Writing Markdown file...');
    await fs.writeFile(outputPath, markdown, 'utf8');

    console.log(`✅ Successfully extracted PDF content to: ${outputPath}`);
    console.log(`📝 Markdown length: ${markdown.length} characters`);

    // Show a preview of the extracted content
    console.log('\n📖 Content Preview (first 500 characters):');
    console.log('─'.repeat(50));
    console.log(`${fullText.substring(0, 500)}...`);
    console.log('─'.repeat(50));
  } catch (error) {
    console.error('❌ Error extracting PDF content:', error.message);
    process.exit(1);
  }
}

function convertToMarkdown(text) {
  // Clean up the text
  let markdown = text;

  // Remove excessive whitespace
  markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');
  markdown = markdown.replace(/\s+/g, ' ');

  // Split into paragraphs
  const paragraphs = markdown.split('\n\n').filter((p) => p.trim().length > 0);

  // Process each paragraph
  const processedParagraphs = paragraphs.map((paragraph) => {
    const trimmed = paragraph.trim();

    // Detect chapter headings (all caps or short lines)
    if (trimmed.length < 100 && trimmed === trimmed.toUpperCase()) {
      return `## ${trimmed}`;
    }

    // Detect chapter numbers
    if (/^CHAPTER \d+/i.test(trimmed)) {
      return `# ${trimmed}`;
    }

    // Detect section headings
    if (/^\d+\.\s+[A-Z]/.test(trimmed)) {
      return `### ${trimmed}`;
    }

    // Regular paragraph
    return trimmed;
  });

  // Add frontmatter
  const frontmatter = `---
title: "The Brain: The Story of You"
author: "David Eagleman"
description: "One of the best books I have read in a while. Observing all the advances in AI and listening to gyan from my kin on neurology brain implants, wanted to dig deeper. As they say these days - learn from First Principles"
tags: ["neuroscience", "brain-science", "ai-technology", "neural-implants"]
date: "2025-01-16"
---

# The Brain: The Story of You

*By David Eagleman*

---

`;

  return frontmatter + processedParagraphs.join('\n\n');
}

// Run the extraction
extractPDFContent().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
