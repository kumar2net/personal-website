#!/usr/bin/env node
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { validateManifest } from './schema.mjs';

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
  let payload;
  try {
    payload = JSON.parse(await readFile(resolved, 'utf8'));
  } catch (error) {
    console.error(`Failed to read or parse JSON: ${resolved}`);
    console.error(error.message);
    process.exit(1);
  }

  const result = validateManifest(payload);
  if (!result.ok) {
    console.error(`Invalid manifest: ${resolved}`);
    result.errors.forEach((entry, index) => {
      console.error(`${index + 1}. ${entry}`);
    });
    process.exit(1);
  }

  console.log(`Manifest valid: ${resolved}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
