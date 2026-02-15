#!/usr/bin/env node
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { validateManifest } from './schema.mjs';
import { buildRenderPlan } from './plan.mjs';

function parseArgs(args) {
  const parsed = {
    manifest: '',
    cut: '',
    lang: 'en',
    outDir: '',
    format: 'both',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg.startsWith('--manifest=')) {
      parsed.manifest = arg.slice('--manifest='.length);
      continue;
    }
    if (arg === '--manifest' && args[index + 1]) {
      parsed.manifest = args[index + 1];
      index += 1;
      continue;
    }
    if (arg.startsWith('--cut=')) {
      parsed.cut = arg.slice('--cut='.length);
      continue;
    }
    if (arg === '--cut' && args[index + 1]) {
      parsed.cut = args[index + 1];
      index += 1;
      continue;
    }
    if (arg.startsWith('--lang=')) {
      parsed.lang = arg.slice('--lang='.length);
      continue;
    }
    if (arg === '--lang' && args[index + 1]) {
      parsed.lang = args[index + 1];
      index += 1;
      continue;
    }
    if (arg.startsWith('--out-dir=')) {
      parsed.outDir = arg.slice('--out-dir='.length);
      continue;
    }
    if (arg === '--out-dir' && args[index + 1]) {
      parsed.outDir = args[index + 1];
      index += 1;
      continue;
    }
    if (arg.startsWith('--format=')) {
      parsed.format = arg.slice('--format='.length);
      continue;
    }
    if (arg === '--format' && args[index + 1]) {
      parsed.format = args[index + 1];
      index += 1;
      continue;
    }
  }

  return parsed;
}

function toSrtTimestamp(seconds) {
  const safe = Math.max(0, seconds);
  const totalMs = Math.round(safe * 1000);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const secs = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

function toVttTimestamp(seconds) {
  return toSrtTimestamp(seconds).replace(',', '.');
}

function buildSrt(segments) {
  return segments
    .map((segment, index) => {
      const text = segment.text?.trim() || '';
      return `${index + 1}\n${toSrtTimestamp(segment.t0)} --> ${toSrtTimestamp(segment.t1)}\n${text}`;
    })
    .join('\n\n') + '\n';
}

function buildVtt(segments) {
  const body = segments
    .map((segment) => {
      const text = segment.text?.trim() || '';
      return `${toVttTimestamp(segment.t0)} --> ${toVttTimestamp(segment.t1)}\n${text}`;
    })
    .join('\n\n');
  return `WEBVTT\n\n${body}\n`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.manifest) {
    console.error('Usage: node scripts/shorts-manifest/export-subs.mjs --manifest <path> [--cut <name>] [--lang <code>] [--out-dir <path>] [--format srt|vtt|both]');
    process.exit(1);
  }

  const format = options.format.toLowerCase();
  if (!['srt', 'vtt', 'both'].includes(format)) {
    console.error('Invalid --format value. Use: srt, vtt, or both');
    process.exit(1);
  }

  const manifestPath = path.resolve(options.manifest);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const validation = validateManifest(manifest);
  if (!validation.ok) {
    console.error(`Manifest validation failed: ${manifestPath}`);
    validation.errors.forEach((entry, index) => console.error(`${index + 1}. ${entry}`));
    process.exit(1);
  }

  const plan = buildRenderPlan(manifest, {
    cutName: options.cut || undefined,
    lang: options.lang || 'en',
  });

  if (!plan.audio || !Array.isArray(plan.audio.segments) || plan.audio.segments.length === 0) {
    console.error(`No caption-linked audio segments found for lang=${options.lang || 'en'}`);
    process.exit(1);
  }

  const outDir = path.resolve(options.outDir || path.join(path.dirname(manifestPath), 'subs'));
  await mkdir(outDir, { recursive: true });

  const outputs = [];
  if (format === 'srt' || format === 'both') {
    const srtPath = path.join(outDir, `${plan.lang}.srt`);
    await writeFile(srtPath, buildSrt(plan.audio.segments), 'utf8');
    outputs.push(srtPath);
  }
  if (format === 'vtt' || format === 'both') {
    const vttPath = path.join(outDir, `${plan.lang}.vtt`);
    await writeFile(vttPath, buildVtt(plan.audio.segments), 'utf8');
    outputs.push(vttPath);
  }

  outputs.forEach((entry) => console.log(`Subtitle written: ${entry}`));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
