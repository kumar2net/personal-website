#!/usr/bin/env node
/**
 * Agentic workflow that watches docs/bookhints and turns dropped notes into book pages.
 * Uses OpenAI's Agentic Toolkit (Responses API + JSON schema) to normalize metadata,
 * render markdown that matches /books styling, and keep the latest entry at the top
 * of the autoBooks array used by the React grid + hero template.
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, '..', '..', '..');
const bookhintDir = path.join(repoRoot, 'docs', 'bookhints');
const booksDir = path.join(
  repoRoot,
  'apps',
  'personal-website',
  'src',
  'pages',
  'books'
);
const autoBooksPath = path.join(
  repoRoot,
  'apps',
  'personal-website',
  'src',
  'data',
  'autoBooks.json'
);

const allowedExtensions = new Set(['.md', '.markdown', '.txt']);
const gradients = [
  'from-blue-100 to-cyan-100',
  'from-emerald-100 to-teal-100',
  'from-rose-100 to-fuchsia-100',
  'from-amber-100 to-orange-100',
  'from-slate-100 to-stone-200',
  'from-purple-100 to-indigo-100',
];

const defaultModel =
  process.env.BOOKHINT_AGENT_MODEL ||
  process.env.BLOGHINT_AGENT_MODEL ||
  'gpt-4.1-mini';
const openaiApiKey = process.env.OPENAI_API_KEY;
const client = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

const args = process.argv.slice(2);
const watchMode = args.includes('--watch');
const forceMode = args.includes('--force');
const filesFromArgs = args.filter((arg) => !arg.startsWith('--'));

function log(message) {
  console.log(`[bookhint-agentic] ${message}`);
}

function warn(message) {
  console.warn(`[bookhint-agentic] ${message}`);
}

async function ensureAutoBooksFile() {
  try {
    await fsp.access(autoBooksPath);
  } catch (error) {
    await fsp.mkdir(path.dirname(autoBooksPath), { recursive: true });
    await fsp.writeFile(autoBooksPath, '[]\n', 'utf8');
  }
}

async function loadAutoBooks() {
  await ensureAutoBooksFile();
  const raw = await fsp.readFile(autoBooksPath, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    warn(`Failed to parse ${autoBooksPath}, re-initializing.`);
    await fsp.writeFile(autoBooksPath, '[]\n', 'utf8');
    return [];
  }
}

async function saveAutoBooks(entries) {
  const payload = JSON.stringify(entries, null, 2);
  await fsp.writeFile(`${autoBooksPath}.tmp`, `${payload}\n`, 'utf8');
  await fsp.rename(`${autoBooksPath}.tmp`, autoBooksPath);
}

function slugify(input, fallback = 'book') {
  const slug = input
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
}

function formatDisplayDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatIsoDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

function estimateReadingTime(content) {
  const words = content?.split(/\s+/)?.length || 0;
  const minutes = Math.max(2, Math.round(words / 230));
  return `${minutes} min read`;
}

function hashString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickGradient(key) {
  const hash = hashString(key);
  return gradients[hash % gradients.length];
}

function normalizeCoverUrl(url) {
  if (!url) return null;
  return url.replace(/^http:/, 'https:');
}

async function fetchGoogleBooksCover(title, author) {
  const segments = [];
  if (title) segments.push(`intitle:${title}`);
  if (author) segments.push(`inauthor:${author}`);
  if (segments.length === 0) return null;
  const query = encodeURIComponent(segments.join(' '));
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=3`
  );
  if (!response.ok) {
    throw new Error(`Google Books HTTP ${response.status}`);
  }
  const data = await response.json();
  if (!data.items?.length) return null;
  for (const item of data.items) {
    const links = item.volumeInfo?.imageLinks;
    if (!links) continue;
    const cover =
      links.extraLarge ||
      links.large ||
      links.medium ||
      links.small ||
      links.thumbnail;
    if (cover) {
      return normalizeCoverUrl(cover);
    }
  }
  return null;
}

async function fetchOpenLibraryCover(title, author) {
  const queryParts = [title, author].filter(Boolean).join(' ').trim();
  if (!queryParts) return null;
  const response = await fetch(
    `https://openlibrary.org/search.json?title=${encodeURIComponent(queryParts)}&limit=1`
  );
  if (!response.ok) {
    throw new Error(`OpenLibrary HTTP ${response.status}`);
  }
  const data = await response.json();
  const doc = data.docs?.[0];
  if (doc?.cover_i) {
    return normalizeCoverUrl(
      `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
    );
  }
  return null;
}

async function lookupCoverImage(title, author) {
  try {
    const googleCover = await fetchGoogleBooksCover(title, author);
    if (googleCover) return googleCover;
  } catch (error) {
    warn(`Google Books cover lookup failed: ${error.message}`);
  }

  try {
    const openLibraryCover = await fetchOpenLibraryCover(title, author);
    if (openLibraryCover) return openLibraryCover;
  } catch (error) {
    warn(`OpenLibrary cover lookup failed: ${error.message}`);
  }

  return null;
}

function safeText(value) {
  return JSON.stringify(value ?? '').slice(1, -1);
}

function buildMarkdown(meta, sections) {
  const fm = [
    '---',
    `title: "${safeText(meta.title)}"`,
    `author: "${safeText(meta.author)}"`,
    `description: "${safeText(meta.description)}"`,
    `tags: ${JSON.stringify(meta.tags || [])}`,
    `date: "${meta.date}"`,
    '---',
  ].join('\n');

  let body = `# ${meta.title}\n\n*By ${meta.author}*\n\n${meta.description}\n\n---\n\n`;

  if (meta.punchline) {
    body += `> ${meta.punchline}\n\n---\n\n`;
  }

  if (Array.isArray(sections)) {
    sections.forEach((section) => {
      if (!section?.heading) return;
      body += `## ${section.heading}\n\n`;
      if (section.summary) {
        body += `${section.summary}\n\n`;
      }
      if (Array.isArray(section.bullets) && section.bullets.length > 0) {
        section.bullets.forEach((bullet) => {
          body += `- ${bullet}\n`;
        });
        body += '\n';
      }
    });
  }

  if (meta.takeaways?.length) {
    body += '## Key Takeaways\n\n';
    meta.takeaways.forEach((take) => {
      body += `- ${take}\n`;
    });
    body += '\n';
  }

  return `${fm}\n\n${body}`.trimEnd() + '\n';
}

function parseResponseJSON(response) {
  const chunks = response?.output || response?.choices || [];
  for (const chunk of chunks) {
    const content = chunk?.content || chunk?.message?.content;
    if (!content) continue;
    const parts = Array.isArray(content) ? content : [content];
    for (const part of parts) {
      if (part.type === 'output_text' && part.text) {
        try {
          return JSON.parse(part.text);
        } catch (error) {
          continue;
        }
      }
      if (typeof part === 'string') {
        try {
          return JSON.parse(part);
        } catch (error) {
          continue;
        }
      }
      if (part.type === 'text' && part.text) {
        try {
          return JSON.parse(part.text);
        } catch (error) {
          continue;
        }
      }
    }
  }
  return null;
}

async function agenticSummarize(content, fileName) {
  if (!client) {
    return null;
  }

  const instructions = [
    'You are the Agentic Book Producer for kumar2net.com.',
    'Convert raw research drops into the polished, sectioned format used on the /books route.',
    'Keep the tone thoughtful, concise, and in first-person plural when summarizing ideas.',
    'Always include every field in the schema; use empty strings, 0, or empty arrays when data is missing.',
    'Return JSON only. Do not emit markdown or explanations.',
  ].join(' ');

  const schema = {
    name: 'book_blueprint',
    schema: {
      type: 'object',
      additionalProperties: false,
      required: [
        'title',
        'author',
        'slug',
        'oneLine',
        'description',
        'punchline',
        'tags',
        'readingMinutes',
        'sections',
        'takeaways',
      ],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        slug: { type: 'string' },
        oneLine: { type: 'string' },
        description: { type: 'string' },
        punchline: { type: 'string' },
        tags: {
          type: 'array',
          minItems: 1,
          maxItems: 6,
          items: { type: 'string' },
        },
        readingMinutes: { type: 'number' },
        sections: {
          type: 'array',
          minItems: 2,
          items: {
            type: 'object',
            required: ['heading', 'summary', 'bullets'],
            additionalProperties: false,
            properties: {
              heading: { type: 'string' },
              summary: { type: 'string' },
              bullets: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
        takeaways: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  };

  const response = await client.responses.create({
    model: defaultModel,
    temperature: 0.35,
    max_output_tokens: 1600,
    text: {
      format: {
        type: 'json_schema',
        name: schema.name,
        schema: schema.schema,
      },
    },
    input: [
      {
        role: 'system',
        content: [{ type: 'input_text', text: instructions }],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `Filename: ${fileName}\n\nContent:\n${content}`,
          },
        ],
      },
    ],
  });

  const parsed = parseResponseJSON(response);
  if (!parsed) {
    throw new Error('Agentic response did not include valid JSON payload.');
  }
  return parsed;
}

function buildFallbackPlan(rawContent, fileName) {
  const firstLine = rawContent.split('\n').find((line) => line.trim()) || '';
  let workingTitle = firstLine.replace(/^#+\s*/, '').trim();
  let derivedAuthor = 'Unknown';

  const byMatch = workingTitle.match(/\bby\s+(.+)$/i);
  if (byMatch) {
    derivedAuthor = byMatch[1].replace(/["“”']/g, '').trim();
    workingTitle = workingTitle.slice(0, byMatch.index).trim();
  }

  workingTitle = workingTitle.replace(/^["“]+|["”]+$/g, '').trim();

  const derivedTitle =
    workingTitle && workingTitle.length > 8
      ? workingTitle
      : fileName.replace(/[-_]/g, ' ');
  const sectionText = rawContent.slice(0, 2000);
  return {
    title: derivedTitle,
    author: derivedAuthor || 'Unknown',
    slug: slugify(derivedTitle),
    oneLine: derivedTitle,
    description: derivedTitle,
    tags: ['Notes'],
    sections: [
      {
        heading: 'Highlights',
        summary: sectionText,
      },
    ],
    takeaways: [],
  };
}

async function processFile(fullPath, options = {}) {
  const { allowUpdate = false } = options;
  const stat = await fsp.stat(fullPath);
  if (!stat.isFile()) return;
  const baseName = path.basename(fullPath);
  if (/^readme/i.test(baseName)) {
    log(`Skipping helper file ${baseName}`);
    return;
  }
  const extension = path.extname(fullPath).toLowerCase();
  if (!allowedExtensions.has(extension)) return;

  const relativeSource = path.relative(repoRoot, fullPath);
  const rawContent = await fsp.readFile(fullPath, 'utf8');
  if (!rawContent.trim()) {
    warn(`Skipped empty file ${relativeSource}`);
    return;
  }

  const autoBooks = await loadAutoBooks();
  const existingEntry = autoBooks.find(
    (entry) => entry.sourceFile === relativeSource
  );
  if (existingEntry && !allowUpdate) {
    log(`Skipping ${relativeSource} (already processed). Use --force to rebuild.`);
    return;
  }

  let plan = null;
  if (client) {
    try {
      plan = await agenticSummarize(rawContent, path.basename(fullPath));
      if (plan) {
        log(`Agentic summary ready for ${relativeSource}`);
      }
    } catch (error) {
      warn(`Agentic pass failed (${error.message}). Switching to heuristic plan.`);
    }
  } else if (!client) {
    warn('OPENAI_API_KEY missing. Using heuristic conversion.');
  }

  if (!plan) {
    plan = buildFallbackPlan(rawContent, path.basename(fullPath));
  }

  const slugCandidate =
    existingEntry?.slug || slugify(plan.slug || path.basename(fullPath, extension));
  let slug = slugCandidate;
  let counter = 1;

  while (
    !existingEntry &&
    fs.existsSync(path.join(booksDir, `${slug}.md`))
  ) {
    counter += 1;
    slug = `${slugCandidate}-${counter}`;
  }

  const now = new Date();
  const displayDate = formatDisplayDate(now);
  const markdownMeta = {
    title: plan.title?.trim() || existingEntry?.title || slug,
    author: plan.author?.trim() || existingEntry?.author || 'Unknown',
    description: plan.description?.trim() || plan.oneLine || '',
    punchline: plan.punchline?.trim(),
    tags: plan.tags?.slice?.(0, 6) || ['Notes'],
    takeaways: plan.takeaways || [],
    date: formatIsoDate(now),
  };

  const markdown = buildMarkdown(markdownMeta, plan.sections);
  const targetPath = path.join(booksDir, `${slug}.md`);
  await fsp.writeFile(targetPath, markdown, 'utf8');
  log(`Wrote ${path.relative(repoRoot, targetPath)}`);

  let coverImage = null;
  try {
    const lookupAuthor =
      markdownMeta.author &&
      markdownMeta.author.trim().toLowerCase() !== 'unknown'
        ? markdownMeta.author
        : '';
    coverImage = await lookupCoverImage(markdownMeta.title, lookupAuthor);
    if (coverImage) {
      log(`Fetched cover for ${markdownMeta.title}`);
    }
  } catch (error) {
    warn(`Cover lookup failed for ${markdownMeta.title}: ${error.message}`);
  }

  const updatedEntry = {
    slug,
    title: markdownMeta.title,
    author: markdownMeta.author,
    summary: markdownMeta.description,
    description: markdownMeta.description,
    tags: markdownMeta.tags,
    publishDate: displayDate,
    lastModified: displayDate,
    readingTime:
      plan.readingMinutes && Number.isFinite(plan.readingMinutes)
        ? `${Math.max(2, Math.round(plan.readingMinutes))} min read`
        : estimateReadingTime(rawContent),
    sourceFile: relativeSource,
    heroGradient: plan.heroGradient || pickGradient(slug),
    coverImage,
  };

  const nextEntries = autoBooks.filter(
    (entry) => entry.sourceFile !== relativeSource && entry.slug !== slug
  );
  nextEntries.unshift(updatedEntry);
  await saveAutoBooks(nextEntries);
  log(`Updated autoBooks.json with ${slug} at the top of the stack.`);
}

async function processPaths(paths, options) {
  for (const inputPath of paths) {
    const fullPath = path.isAbsolute(inputPath)
      ? inputPath
      : path.join(process.cwd(), inputPath);
    const target = fs.existsSync(fullPath)
      ? fullPath
      : path.join(bookhintDir, inputPath);
    if (!fs.existsSync(target)) {
      warn(`Cannot locate ${inputPath}`);
      continue;
    }

    const stat = await fsp.stat(target);
    if (stat.isDirectory()) {
      const entries = await fsp.readdir(target);
      for (const entry of entries) {
        await processFile(path.join(target, entry), options);
      }
    } else {
      await processFile(target, options);
    }
  }
}

async function processUntracked(options) {
  const entries = await fsp.readdir(bookhintDir);
  const autoBooks = await loadAutoBooks();
  const tracked = new Set(autoBooks.map((entry) => entry.sourceFile));

  for (const entry of entries) {
    const fullPath = path.join(bookhintDir, entry);
    const relativeSource = path.relative(repoRoot, fullPath);
    if (tracked.has(relativeSource) && !options.allowUpdate) {
      continue;
    }
    await processFile(fullPath, options);
  }
}

function startWatcher() {
  log(`Watching ${bookhintDir} for new or updated files…`);
  const pending = new Map();

  const schedule = (filePath) => {
    if (pending.has(filePath)) {
      clearTimeout(pending.get(filePath));
    }
    const timer = setTimeout(() => {
      pending.delete(filePath);
      processFile(filePath, { allowUpdate: true }).catch((error) =>
        warn(`Watcher failed for ${path.basename(filePath)} (${error.message})`)
      );
    }, 200);
    pending.set(filePath, timer);
  };

  fs.watch(bookhintDir, { persistent: true }, (eventType, filename) => {
    if (!filename) return;
    const fullPath = path.join(bookhintDir, filename);
    const extension = path.extname(fullPath).toLowerCase();
    if (!allowedExtensions.has(extension)) return;
    if (eventType === 'rename') {
      if (fs.existsSync(fullPath)) {
        schedule(fullPath);
      }
    } else if (eventType === 'change') {
      if (fs.existsSync(fullPath)) {
        schedule(fullPath);
      }
    }
  });
}

async function main() {
  if (!fs.existsSync(bookhintDir)) {
    throw new Error(`Bloghint directory missing: ${bookhintDir}`);
  }

  if (!client) {
    warn(
      'OPENAI_API_KEY is not set. Install the key locally or run inside an environment where it exists.'
    );
  }

  const allowUpdate = watchMode || forceMode;

  if (filesFromArgs.length > 0) {
    await processPaths(filesFromArgs, { allowUpdate });
  } else {
    await processUntracked({ allowUpdate });
  }

  if (watchMode) {
    startWatcher();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
