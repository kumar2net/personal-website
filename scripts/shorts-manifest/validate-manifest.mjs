#!/usr/bin/env node
import path from 'node:path';
import { loadManifest } from './schema.mjs';

function parseArgs(args) {
  const parsed = { manifest: '' };
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
    if (!parsed.manifest && !arg.startsWith('--')) {
      parsed.manifest = arg;
    }
  }
  return parsed;
}

async function main() {
  const { manifest } = parseArgs(process.argv.slice(2));
  if (!manifest) {
    console.error('Usage: node scripts/shorts-manifest/validate-manifest.mjs --manifest <path-to-manifest.json>');
    process.exit(1);
  }

  const resolved = path.resolve(manifest);
  try {
    await loadManifest(resolved);
  } catch (error) {
    console.error(`Invalid manifest: ${resolved}`);
    console.error(error.message);
    process.exit(1);
  }

  console.log(`Manifest valid: ${resolved}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
