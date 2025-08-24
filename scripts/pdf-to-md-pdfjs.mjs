import fs from 'node:fs/promises'
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

async function main() {
  const inputFile = process.argv[2]
  if (!inputFile) {
    console.error('❌ Please provide a PDF file path as an argument')
    console.error('Usage: node scripts/pdf-to-md-pdfjs.mjs <pdf-file-path>')
    process.exit(1)
  }

  const projectRoot = path.resolve(process.cwd())
  const srcPdf = path.isAbsolute(inputFile) ? inputFile : path.join(projectRoot, inputFile)
  const outDir = path.join(projectRoot, 'src', 'pages', 'books')

  const inputBasename = path.basename(srcPdf, '.pdf')
  const slug = slugify(inputBasename)
  const outMd = path.join(outDir, `${slug}.md`)

  await fs.mkdir(outDir, { recursive: true })

  try {
    console.log(`📖 Reading PDF file: ${srcPdf}`)
    const dataBuffer = await readFile(srcPdf)

    console.log('🔍 Loading PDF...')
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(dataBuffer) })
    const pdfDoc = await loadingTask.promise

    console.log(`📄 PDF loaded: ${pdfDoc.numPages} pages`)

    let text = ''
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum)
      const content = await page.getTextContent()
      let pageText = ''
      for (const item of content.items) {
        pageText += item.str
        if (item.hasEOL) {
          pageText += '\n'
        } else {
          if (!pageText.endsWith(' ')) pageText += ' '
        }
      }
      // Ensure a blank line between pages
      text += pageText.trimEnd() + '\n\n'
    }

    console.log('📝 Converting to Markdown...')
    const markdown = convertToMarkdown(text, inputBasename)

    console.log(`💾 Writing Markdown file: ${outMd}`)
    await fs.writeFile(outMd, markdown, 'utf8')

    console.log(`✅ Successfully converted: ${outMd}`)
  } catch (error) {
    console.error('❌ Error converting PDF:', error)
    process.exit(1)
  }
}

function slugify(name) {
  const withHyphens = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  return withHyphens.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function convertToMarkdown(text, title) {
  const author = inferAuthorFromTitle(title) || 'Notes'

  if (process.env.VERBATIM === '1') {
    const frontmatter = `---\n` +
      `title: "${title}"\n` +
      `author: "${author}"\n` +
      `description: "Personal notes"\n` +
      `tags: ["notes"]\n` +
      `date: "${new Date().toISOString().slice(0,10)}"\n` +
      `---\n\n` +
      `# ${title}\n\n` +
      `*By ${author}*\n\n---\n\n`
    return frontmatter + text
  }

  // Preserve line breaks; only collapse 3+ blank lines to 2
  let markdown = text
  markdown = markdown.replace(/\n{3,}/g, '\n\n')

  const paragraphs = markdown.split('\n\n').filter(p => p.trim().length > 0)
  const processed = paragraphs.map(paragraph => {
    const trimmed = paragraph.trim()
    if (trimmed.length < 100 && trimmed === trimmed.toUpperCase()) {
      return `## ${trimmed}`
    }
    if (/^CHAPTER \d+/i.test(trimmed)) {
      return `# ${trimmed}`
    }
    if (/^\d+\.\s+[A-Z]/.test(trimmed)) {
      return `### ${trimmed}`
    }
    return trimmed
  })

  const frontmatter = `---\n` +
    `title: "${title}"\n` +
    `author: "${author}"\n` +
    `description: "Personal notes"\n` +
    `tags: ["notes"]\n` +
    `date: "${new Date().toISOString().slice(0,10)}"\n` +
    `---\n\n` +
    `# ${title}\n\n` +
    `*By ${author}*\n\n---\n\n`

  return frontmatter + processed.join('\n\n')
}

function inferAuthorFromTitle(title) {
  // Very light heuristic: map known titles to authors
  const lower = title.toLowerCase()
  if (lower.includes('stoic') || lower.includes("epictetus") || lower.includes('manual')) return "David Tuffley"
  if (lower.includes('atheism')) return 'Tom Miles'
  if (lower.includes('brain')) return 'David Eagleman'
  return null
}

main().catch(err => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})
