import fs from 'node:fs/promises'
import path from 'node:path'
import pdf from 'pdf-parse'

async function main() {
  const projectRoot = path.resolve(process.cwd())
  const srcPdf = path.join(projectRoot, 'docs', 'The_Brain_The_Story.pdf')
  const outDir = path.join(projectRoot, 'src', 'pages', 'books')
  const outMd = path.join(outDir, 'the-brain-story.md')

  await fs.mkdir(outDir, { recursive: true })

  try {
    console.log('Reading PDF file...')
    const buffer = await fs.readFile(srcPdf)
    
    console.log('Parsing PDF content...')
    const data = await pdf(buffer)
    
    console.log('Converting to Markdown...')
    const markdown = convertToMarkdown(data.text)
    
    console.log('Writing Markdown file...')
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

function convertToMarkdown(text) {
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
title: "The Brain: The Story of You"
author: "David Eagleman"
description: "One of the best books I have read in a while. Observing all the advances in AI and listening to gyan from my kin on neurology brain implants, wanted to dig deeper. As they say these days - learn from First Principles"
tags: ["neuroscience", "brain-science", "ai-technology", "neural-implants"]
date: "2025-01-16"
---

# The Brain: The Story of You

*By David Eagleman*

---

`
  
  return frontmatter + processedParagraphs.join('\n\n')
}

main().catch((err) => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})
