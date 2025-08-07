import fs from 'node:fs/promises'
import path from 'node:path'
import mammoth from 'mammoth'
import TurndownService from 'turndown'

async function main() {
  const projectRoot = path.resolve(process.cwd())
  const srcDocx = path.join(projectRoot, 'docs', 'Applying_Cornell_method.docx')
  const outDir = path.join(projectRoot, 'src', 'pages', 'books')
  const outMd = path.join(outDir, 'applying-cornell-method.md')

  await fs.mkdir(outDir, { recursive: true })

  const buffer = await fs.readFile(srcDocx)
  const { value: html } = await mammoth.convertToHtml({ buffer })

  const turndown = new TurndownService({ headingStyle: 'atx' })
  const markdown = turndown.turndown(html)

  await fs.writeFile(outMd, markdown, 'utf8')
  console.log(`Wrote markdown to ${outMd}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


