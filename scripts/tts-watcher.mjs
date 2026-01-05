#!/usr/bin/env node
import { watch, existsSync, statSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

const args = parseArgs(process.argv.slice(2));
const targets = args.targets.length ? args.targets : ['agents.md', '.codex/logs'];
const speakEnabled = args.speak || process.env.TTS === '1';

const cache = new Map();

for (const target of targets) {
  const resolved = path.resolve(target);
  if (!existsSync(resolved)) {
    console.warn(`Skipping missing path: ${resolved}`);
    continue;
  }

  const stats = statSync(resolved);
  if (stats.isDirectory()) {
    watchDirectory(resolved);
  } else {
    watchFile(resolved);
  }
}

console.log('TTS watcher active. Press Ctrl+C to stop.');

function parseArgs(rawArgs) {
  const parsed = { targets: [], speak: false };
  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i];
    if (arg === '--speak') {
      parsed.speak = true;
      continue;
    }
    if (arg.startsWith('--target=')) {
      parsed.targets.push(arg.slice('--target='.length));
      continue;
    }
    if (arg === '--target') {
      const next = rawArgs[i + 1];
      if (next) {
        parsed.targets.push(next);
        i += 1;
      }
    }
  }
  return parsed;
}

function watchDirectory(dirPath) {
  watch(dirPath, async (eventType, filename) => {
    if (!filename) {
      return;
    }
    const filePath = path.join(dirPath, filename);
    await handleFile(filePath);
  });
  console.log(`Watching directory: ${dirPath}`);
}

function watchFile(filePath) {
  watch(filePath, async () => {
    await handleFile(filePath);
  });
  console.log(`Watching file: ${filePath}`);
}

async function handleFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }
  let nextContent;
  try {
    nextContent = await readFile(filePath, 'utf8');
  } catch {
    return;
  }

  const prevContent = cache.get(filePath) || '';
  cache.set(filePath, nextContent);

  const summary = summarizeChange(prevContent, nextContent, path.basename(filePath));
  if (!summary) {
    return;
  }

  console.log(summary);
  if (speakEnabled) {
    speak(summary);
  }
}

function summarizeChange(prev, next, label) {
  if (!next || next === prev) {
    return '';
  }

  if (!prev) {
    return `${label} updated.`;
  }

  const prevLines = prev.split('\n');
  const nextLines = next.split('\n');
  const prevSet = new Set(prevLines);
  const nextSet = new Set(nextLines);

  const added = nextLines.filter((line) => line && !prevSet.has(line));
  const removed = prevLines.filter((line) => line && !nextSet.has(line));

  let summary = `${label} updated: +${added.length} -${removed.length}`;
  if (added.length) {
    const preview = added.slice(0, 3).join(' | ');
    summary += `. Added: ${preview}`;
  }
  return summary;
}

function speak(text) {
  const platform = process.platform;
  const command = platform === 'darwin' ? 'say' : platform === 'linux' ? 'espeak' : null;
  if (!command) {
    return;
  }

  const child = spawn(command, [text], { stdio: 'ignore' });
  child.on('error', () => {
    // Ignore missing TTS binaries.
  });
}
