#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';

const DEFAULT_PORT = 5173;
const portArg = process.argv.find((arg) => arg.startsWith('--port='));
const urlArg = process.argv.find((arg) => arg.startsWith('--url='));
const port = portArg ? Number(portArg.split('=')[1]) : Number(process.env.DEVTOOLS_PROBE_PORT || DEFAULT_PORT);
const targetUrl = urlArg ? urlArg.split('=')[1] : (process.env.DEVTOOLS_PROBE_URL || `http://localhost:${port}/`);
const headless = process.env.DEVTOOLS_PROBE_HEADLESS ?? 'new';

if (Number.isNaN(port) || !targetUrl) {
  console.error('Usage: node scripts/devtools_probe.mjs [--port=5173] [--url=http://localhost:5173/]');
  process.exit(1);
}

const logDir = path.resolve(process.cwd(), 'docs/_logs');
await fs.mkdir(logDir, { recursive: true });
const logPath = path.join(logDir, `devtools-probe-${Date.now()}.json`);

const findings = {
  url: targetUrl,
  port,
  startedAt: new Date().toISOString(),
  console: [],
  pageErrors: [],
  httpErrors: [],
};

const browser = await puppeteer.launch({ headless });
const page = await browser.newPage();

page.on('console', (msg) => {
  findings.console.push({
    type: msg.type(),
    text: msg.text(),
  });
});

page.on('pageerror', (error) => {
  findings.pageErrors.push({
    message: error.message,
    stack: error.stack,
  });
});

page.on('response', (response) => {
  const status = response.status();
  if (status >= 400) {
    findings.httpErrors.push({
      url: response.url(),
      status,
      statusText: response.statusText(),
    });
  }
});

let ok = false;
try {
  const response = await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  findings.firstStatus = response?.status() ?? null;
  findings.firstStatusText = response?.statusText() ?? null;
  const hangMs = Number(process.env.DEVTOOLS_PROBE_HANG_MS || 3000);
  if (Number.isFinite(hangMs) && hangMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, hangMs));
  }
  ok = true;
} catch (error) {
  findings.pageErrors.push({
    message: error?.message || String(error),
    stack: error?.stack,
  });
} finally {
  findings.endedAt = new Date().toISOString();
  await browser.close();
  await fs.writeFile(logPath, JSON.stringify(findings, null, 2));
  console.log(`DevTools probe log written to ${logPath}`);
  if (!ok || findings.pageErrors.length || findings.httpErrors.length) {
    console.error('Probe detected issues. See log for details.');
    process.exitCode = 1;
  }
}
