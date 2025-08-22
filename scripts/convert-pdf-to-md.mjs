import fs from 'node:fs/promises'
import path from 'node:path'
import pdf from 'pdf-parse'

async function main() {
  // Get input file from command line arguments
  const inputFile = process.argv[2]
  
  if (!inputFile) {
    console.error('❌ Please provide a PDF file path as an argument')
    console.error('Usage: node scripts/convert-pdf-to-md.mjs <pdf-file-path>')
    process.exit(1)
  }

  const projectRoot = path.resolve(process.cwd())
  const srcPdf = path.isAbsolute(inputFile) ? inputFile : path.join(projectRoot, inputFile)
  const outDir = path.join(projectRoot, 'src', 'pages', 'books')
  
  // Generate output filename based on input filename
  const inputBasename = path.basename(inputFile, '.pdf')
  const outMd = path.join(outDir, `${inputBasename.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`)

  await fs.mkdir(outDir, { recursive: true })

  try {
    console.log(`📖 Reading PDF file: ${srcPdf}`)
    const buffer = await fs.readFile(srcPdf)
    
    console.log('🔍 Parsing PDF content...')
    const data = await pdf(buffer)
    
    console.log('📝 Converting to Markdown...')
    const markdown = convertToMarkdown(data.text, inputBasename)
    
    console.log(`💾 Writing Markdown file: ${outMd}`)
    await fs.writeFile(outMd, markdown, 'utf8')
    
    console.log(`✅ Successfully converted PDF to Markdown: ${outMd}`)
    console.log(`📊 PDF Info:`)
    console.log(`   - Pages: ${data.numpages}`)
    console.log(`   - Text length: ${data.text.length} characters`)
    console.log(`   - Markdown length: ${markdown.length} characters`)
    
  } catch (error) {
    console.error('❌ Error converting PDF:', error.message)
    process.exit(1)
  }
}

function convertToMarkdown(text, title) {
  // Clean up the text and convert to markdown
  let markdown = text
  
  // Remove excessive whitespace
  markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n')
  markdown = markdown.replace(/\s+/g, ' ')
  
  // Split into paragraphs
  const paragraphs = markdown.split('\n\n').filter(p => p.trim().length > 0)
  
  // Process each paragraph
  const processedParagraphs = paragraphs.map(paragraph => {
    const trimmed = paragraph.trim()
    
    // Detect headings (all caps or short lines)
    if (trimmed.length < 100 && trimmed === trimmed.toUpperCase()) {
      return `## ${trimmed}`
    }
    
    // Detect chapter numbers
    if (/^CHAPTER \d+/i.test(trimmed)) {
      return `# ${trimmed}`
    }
    
    // Regular paragraph
    return trimmed
  })
  
  // Add frontmatter
  const frontmatter = `---
title: "${title}"
author: "David Eagleman"
description: "One of the best books I have read in a while. Observing all the advances in AI and listening to gyan from my kin on neurology brain implants, wanted to dig deeper. As they say these days - learn from First Principles"
tags: ["neuroscience", "brain-science", "ai-technology", "neural-implants"]
date: "2025-01-16"
---

# ${title}

*By David Eagleman*

---

`
  
  return frontmatter + processedParagraphs.join('\n\n')
}

main().catch((err) => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})
