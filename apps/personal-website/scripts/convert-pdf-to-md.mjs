import fs, { readFile } from 'node:fs/promises';
import path from 'node:path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function main() {
  // Get input file from command line arguments
  const inputFile = process.argv[2];

  if (!inputFile) {
    console.error('❌ Please provide a PDF file path as an argument');
    console.error('Usage: node scripts/convert-pdf-to-md.mjs <pdf-file-path>');
    process.exit(1);
  }

  const projectRoot = path.resolve(process.cwd());
  const srcPdf = path.isAbsolute(inputFile)
    ? inputFile
    : path.join(projectRoot, inputFile);
  const outDir = path.join(projectRoot, 'src', 'pages', 'books');

  // Generate output filename based on input filename
  const inputBasename = path.basename(inputFile, '.pdf');
  const slug = slugify(inputBasename);
  const outMd = path.join(outDir, `${slug}.md`);

  await fs.mkdir(outDir, { recursive: true });

  try {
    console.log(`📖 Reading PDF file: ${srcPdf}`);
    const dataBuffer = await readFile(srcPdf);

    console.log('🔍 Loading PDF...');
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(dataBuffer),
    });
    const pdfDoc = await loadingTask.promise;

    let extracted = '';
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const content = await page.getTextContent();
      let pageText = '';
      for (const item of content.items) {
        pageText += item.str;
        if (item.hasEOL) {
          pageText += '\n';
        } else {
          if (!pageText.endsWith(' ')) {
            pageText += ' ';
          }
        }
      }
      extracted += `${pageText.trimEnd()}\n\n`;
    }

    console.log('📝 Converting to Markdown...');
    const markdown = convertToMarkdown(extracted, inputBasename);

    console.log(`💾 Writing Markdown file: ${outMd}`);
    await fs.writeFile(outMd, markdown, 'utf8');

    console.log(`✅ Successfully converted PDF to Markdown: ${outMd}`);
    console.log('📊 Conversion complete');
  } catch (error) {
    console.error('❌ Error converting PDF:', error.message);
    process.exit(1);
  }
}

function slugify(name) {
  // Insert hyphen between camelCase boundaries, then normalize
  const withHyphens = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  return withHyphens
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function convertToMarkdown(text, rawTitle) {
  const { title, author, tags } = inferTitleAuthorTags(rawTitle);

  // VERBATIM mode: keep user's notes as-is
  if (process.env.VERBATIM === '1') {
    const frontmatter =
      `---\n` +
      `title: "${title}"\n` +
      `author: "${author}"\n` +
      `description: "Personal notes"\n` +
      `tags: ${JSON.stringify(tags)}\n` +
      `date: "${new Date().toISOString().slice(0, 10)}"\n` +
      `---\n\n` +
      `# ${title}\n\n` +
      `*By ${author}*\n\n---\n\n`;
    return frontmatter + text;
  }

  // Clean up the text and convert to markdown
  let markdown = text;

  // Preserve line breaks; only collapse 3+ blank lines to 2
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  // Split into paragraphs
  const paragraphs = markdown.split('\n\n').filter((p) => p.trim().length > 0);

  // Process each paragraph
  const processedParagraphs = paragraphs.map((paragraph) => {
    const trimmed = paragraph.trim();

    // Detect headings (all caps or short lines)
    if (trimmed.length < 100 && trimmed === trimmed.toUpperCase()) {
      return `## ${trimmed}`;
    }

    // Detect chapter numbers
    if (/^CHAPTER \d+/i.test(trimmed)) {
      return `# ${trimmed}`;
    }

    // Regular paragraph
    return trimmed;
  });

  // Add frontmatter
  const frontmatter =
    `---\n` +
    `title: "${title}"\n` +
    `author: "${author}"\n` +
    `description: "Personal notes"\n` +
    `tags: ${JSON.stringify(tags)}\n` +
    `date: "${new Date().toISOString().slice(0, 10)}"\n` +
    `---\n\n` +
    `# ${title}\n\n` +
    `*By ${author}*\n\n---\n\n`;

  return frontmatter + processedParagraphs.join('\n\n');
}

function inferTitleAuthorTags(rawTitle) {
  const lower = rawTitle.toLowerCase();
  if (lower.includes('stoic')) {
    return {
      title: "The Stoic Art of Living: Epictetus' Manual for the 21st Century",
      author: 'David Tuffley',
      tags: ['philosophy', 'stoicism', 'epictetus'],
    };
  }
  if (lower.includes('atheism')) {
    return {
      title: 'Atheism: A Wonderful World Without Religion',
      author: 'Tom Miles',
      tags: ['philosophy', 'atheism', 'religion', 'worldview'],
    };
  }
  if (lower.includes('brain')) {
    return {
      title: 'The Brain: The Story of You',
      author: 'David Eagleman',
      tags: [
        'neuroscience',
        'brain-science',
        'ai-technology',
        'neural-implants',
      ],
    };
  }
  return { title: rawTitle, author: 'Notes', tags: ['notes'] };
}

main().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
