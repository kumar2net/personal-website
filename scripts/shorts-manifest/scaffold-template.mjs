#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const templateDir = path.join(repoRoot, 'content', 'shorts', 'template');
const textExtensions = new Set([
  '.json',
  '.md',
  '.txt',
  '.yaml',
  '.yml',
  '.srt',
  '.vtt',
  '.svg',
]);

function parseArgs(args) {
  const parsed = {
    slug: '',
    title: '',
    series: 'AI x UPI',
    playlist: 'Wireless Explained',
    site: 'kumar2net.com',
    handle: '@kumar2net',
    topic: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg.startsWith('--slug=')) {
      parsed.slug = arg.slice('--slug='.length);
      continue;
    }
    if (arg === '--slug' && next) {
      parsed.slug = next;
      index += 1;
      continue;
    }
    if (arg.startsWith('--title=')) {
      parsed.title = arg.slice('--title='.length);
      continue;
    }
    if (arg === '--title' && next) {
      parsed.title = next;
      index += 1;
      continue;
    }
    if (arg.startsWith('--series=')) {
      parsed.series = arg.slice('--series='.length);
      continue;
    }
    if (arg === '--series' && next) {
      parsed.series = next;
      index += 1;
      continue;
    }
    if (arg.startsWith('--playlist=')) {
      parsed.playlist = arg.slice('--playlist='.length);
      continue;
    }
    if (arg === '--playlist' && next) {
      parsed.playlist = next;
      index += 1;
      continue;
    }
    if (arg.startsWith('--site=')) {
      parsed.site = arg.slice('--site='.length);
      continue;
    }
    if (arg === '--site' && next) {
      parsed.site = next;
      index += 1;
      continue;
    }
    if (arg.startsWith('--handle=')) {
      parsed.handle = arg.slice('--handle='.length);
      continue;
    }
    if (arg === '--handle' && next) {
      parsed.handle = next;
      index += 1;
      continue;
    }
    if (arg.startsWith('--topic=')) {
      parsed.topic = arg.slice('--topic='.length);
      continue;
    }
    if (arg === '--topic' && next) {
      parsed.topic = next;
      index += 1;
    }
  }

  return parsed;
}

function toTitleCase(value) {
  return value
    .split(/[-_\s]+/u)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

async function copyTemplate(sourceDir, destDir, replacements) {
  await mkdir(destDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyTemplate(sourcePath, destPath, replacements);
      continue;
    }

    if (entry.isFile()) {
      const extension = path.extname(entry.name).toLowerCase();
      if (textExtensions.has(extension) || entry.name === '.gitkeep') {
        let contents = await readFile(sourcePath, 'utf8');
        for (const [token, value] of Object.entries(replacements)) {
          contents = contents.split(token).join(value);
        }
        await writeFile(destPath, contents, 'utf8');
        continue;
      }

      await copyFile(sourcePath, destPath);
    }
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.slug) {
    console.error(
      'Usage: node scripts/shorts-manifest/scaffold-template.mjs --slug <slug> [--title <title>] [--series <series>] [--playlist <playlist>] [--site <site>] [--handle <handle>] [--topic <topic>]',
    );
    process.exit(1);
  }

  const slug = options.slug.trim();
  const title = (options.title || toTitleCase(slug)).trim();
  const topic = (options.topic || title).trim();
  const destinationDir = path.join(repoRoot, 'content', 'shorts', slug);

  try {
    await mkdir(destinationDir, { recursive: false });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST') {
      console.error(`Destination already exists: ${destinationDir}`);
      process.exit(1);
    }
    throw error;
  }

  const replacements = {
    '__SHORT_SLUG__': slug,
    '__SHORT_TITLE__': title,
    '__SHORT_TOPIC__': topic,
    '__SHORT_SERIES__': options.series.trim(),
    '__SHORT_PLAYLIST__': options.playlist.trim(),
    '__SHORT_SITE__': options.site.trim(),
    '__SHORT_HANDLE__': options.handle.trim(),
  };

  await copyTemplate(templateDir, destinationDir, replacements);

  console.log(`Shorts template created: ${destinationDir}`);
  console.log(`Next: npm run shorts:validate -- --manifest content/shorts/${slug}/manifest.json`);
  console.log(`Then: npm run shorts:plan -- --manifest content/shorts/${slug}/manifest.json --cut shorts-9.16-en --lang en`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
