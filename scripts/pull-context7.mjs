#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const args = parseArgs(process.argv.slice(2));
const agentsPath = path.resolve(args.agents || 'AGENTS.md');

const baseUrl = process.env.CONTEXT7_URL;
const apiKey = process.env.CONTEXT7_API_KEY;

if (!baseUrl) {
  console.error('Missing CONTEXT7_URL.');
  process.exit(1);
}

if (!apiKey) {
  console.error('Missing CONTEXT7_API_KEY.');
  process.exit(1);
}

const contextPath = process.env.CONTEXT7_CONTEXT_PATH || 'context';
const contextUrl = buildContextUrl(baseUrl, contextPath);

const response = await fetch(contextUrl, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    Accept: 'application/json, text/plain, text/markdown'
  }
});

if (!response.ok) {
  const body = await safeText(response);
  console.error(`Context7 request failed (${response.status}): ${body}`);
  process.exit(1);
}

const contextText = await extractContext(response);
if (!contextText.trim()) {
  console.error('Context7 response was empty.');
  process.exit(1);
}

const normalizedContext = contextText.replace(/\r\n/g, '\n').trim();
const updatedAt = new Date().toISOString();

const initialAgents = await loadAgentsFile(agentsPath);
const updatedAgents = injectContext(initialAgents, normalizedContext, updatedAt);

await writeFile(agentsPath, updatedAgents, 'utf8');
console.log(`Context7 injected into ${path.relative(process.cwd(), agentsPath)}.`);

function parseArgs(rawArgs) {
  const parsed = {};
  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i];
    if (arg.startsWith('--agents=')) {
      parsed.agents = arg.slice('--agents='.length);
      continue;
    }
    if (arg === '--agents') {
      parsed.agents = rawArgs[i + 1];
      i += 1;
    }
  }
  return parsed;
}

function buildContextUrl(base, contextPathValue) {
  const trimmedBase = base.replace(/\/$/, '');
  if (trimmedBase.endsWith('.json')) {
    return trimmedBase;
  }
  if (trimmedBase.endsWith('/context')) {
    return trimmedBase;
  }
  const cleanPath = contextPathValue.replace(/^\//, '');
  return `${trimmedBase}/${cleanPath}`;
}

async function safeText(response) {
  try {
    return await response.text();
  } catch {
    return '';
  }
}

async function extractContext(response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const payload = await response.json();
    return pickContext(payload);
  }
  return response.text();
}

function pickContext(payload) {
  if (typeof payload === 'string') {
    return payload;
  }
  if (!payload || typeof payload !== 'object') {
    return '';
  }
  if (payload.context) {
    return payload.context;
  }
  if (payload.content) {
    return payload.content;
  }
  if (payload.data) {
    return pickContext(payload.data);
  }
  if (payload.result) {
    return pickContext(payload.result);
  }
  return JSON.stringify(payload, null, 2);
}

async function loadAgentsFile(filePath) {
  if (existsSync(filePath)) {
    return readFile(filePath, 'utf8');
  }

  return [
    '# Agents',
    '',
    '## Context7 Snapshot',
    '<!--CTX7:BEGIN-->',
    '<!--CTX7:END-->',
    ''
  ].join('\n');
}

function injectContext(agentsContent, context, updatedAtValue) {
  const beginMarker = '<!--CTX7:BEGIN-->';
  const endMarker = '<!--CTX7:END-->';

  let content = agentsContent;
  if (!content.includes(beginMarker) || !content.includes(endMarker)) {
    content = content.trimEnd() + `\n\n${beginMarker}\n${endMarker}\n`;
  }

  const indentMatch = content.match(new RegExp(`(^[\\t ]*)${escapeRegex(beginMarker)}`, 'm'));
  const indent = indentMatch ? indentMatch[1] : '';

  const block = [
    `${indent}${beginMarker}`,
    `${indent}Last updated: ${updatedAtValue}`,
    `${indent}`,
    ...context.split('\n').map((line) => `${indent}${line}`),
    `${indent}${endMarker}`
  ].join('\n');

  const regex = new RegExp(
    `(^[\\t ]*)${escapeRegex(beginMarker)}[\\s\\S]*?^[\\t ]*${escapeRegex(endMarker)}`,
    'm'
  );
  return content.replace(regex, block) + '\n';
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
