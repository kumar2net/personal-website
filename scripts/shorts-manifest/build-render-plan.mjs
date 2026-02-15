#!/usr/bin/env node
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { validateManifest } from './schema.mjs';
import { buildRenderPlan } from './plan.mjs';

function parseArgs(args) {
  const parsed = {
    manifest: '',
    cut: '',
    lang: 'en',
    out: '',
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
    if (arg.startsWith('--out=')) {
      parsed.out = arg.slice('--out='.length);
      continue;
    }
    if (arg === '--out' && args[index + 1]) {
      parsed.out = args[index + 1];
      index += 1;
      continue;
    }
  }

  return parsed;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.manifest) {
    console.error('Usage: node scripts/shorts-manifest/build-render-plan.mjs --manifest <path> [--cut <name>] [--lang <code>] [--out <path>]');
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

  const renderPlan = buildRenderPlan(manifest, {
    cutName: options.cut || undefined,
    lang: options.lang || 'en',
  });

  const output = JSON.stringify(renderPlan, null, 2) + '\n';
  if (options.out) {
    const outPath = path.resolve(options.out);
    await writeFile(outPath, output, 'utf8');
    console.log(`Render plan written: ${outPath}`);
    return;
  }

  process.stdout.write(output);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
