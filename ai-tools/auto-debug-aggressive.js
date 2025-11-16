#!/usr/bin/env node
const path = require('node:path');
const { spawn } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');
const { RouteCrawler } = require('./route-crawler');
const { LighthouseAuditor } = require('./lighthouse-auditor');
const { CodexAutoFixAggressive } = require('./codex-auto-fix-aggressive');

const DEFAULT_PORTS = [5173, 4173, 3000, 4321, 8080];

class AutoDebugSupervisor {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot;
    this.appDir = options.appDir;
    this.serverProcess = null;
    this.detectedPort = null;
    this.shouldStop = false;
    this.baseUrl = null;
    this.iteration = 1;
    this.loopDelay = Number(process.env.AI_DEBUG_LOOP_DELAY || 15000);
  }

  async start() {
    await this.launchDevServer();
    const port = await this.waitForServer();
    this.baseUrl = `http://localhost:${port}`;
    console.log(`[auto-debug] Dev server detected on ${this.baseUrl}`);

    this.routeCrawler = new RouteCrawler({
      projectRoot: this.projectRoot,
      appDir: this.appDir,
      baseUrl: this.baseUrl,
      headless: process.env.AI_DEBUG_HEADLESS !== 'false'
    });

    this.lighthouse = new LighthouseAuditor({ baseUrl: this.baseUrl });
    this.autoFix = new CodexAutoFixAggressive({ projectRoot: this.projectRoot });

    process.on('SIGINT', () => {
      this.stop().catch((error) => {
        console.error('[auto-debug] Failed to shutdown gracefully', error);
        process.exit(1);
      });
    });
    process.on('SIGTERM', () => {
      this.stop().catch((error) => {
        console.error('[auto-debug] Failed to shutdown gracefully', error);
        process.exit(1);
      });
    });

    await this.loop();
  }

  async loop() {
    while (!this.shouldStop) {
      console.log(`\n[auto-debug] ===== Iteration ${this.iteration} =====`);
      const crawlResult = await this.routeCrawler.crawl();
      const lighthouseIssues = await this.lighthouse.auditRoutes(crawlResult.visitedRoutes);
      const lintIssues = await this.runLint();
      const issues = [...crawlResult.issues, ...lighthouseIssues, ...lintIssues];

      console.log(`[auto-debug] Routes visited: ${crawlResult.visitedRoutes.length}`);
      console.log(`[auto-debug] Issues detected: ${issues.length}`);

      if (issues.length) {
        await this.autoFix.repair(issues);
      } else {
        console.log('[auto-debug] No issues detected. System stable.');
      }

      this.iteration += 1;
      if (this.shouldStop) break;
      await delay(this.loopDelay);
    }
  }

  async launchDevServer() {
    if (this.serverProcess) return;
    console.log('[auto-debug] Starting dev server...');
    this.serverProcess = spawn('npm', ['run', 'dev'], {
      cwd: this.appDir,
      env: { ...process.env, BROWSER: 'none' },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    this.serverProcess.stdout.on('data', (data) => {
      const text = data.toString();
      process.stdout.write(`[dev-server] ${text}`);
      this.capturePortFromLog(text);
    });

    this.serverProcess.stderr.on('data', (data) => {
      process.stderr.write(`[dev-server] ${data}`);
      this.capturePortFromLog(data.toString());
    });

    this.serverProcess.on('exit', (code) => {
      if (this.shouldStop) return;
      console.error(`[auto-debug] Dev server exited unexpectedly (code ${code}). Restarting...`);
      this.serverProcess = null;
      this.launchDevServer();
    });
  }

  capturePortFromLog(text) {
    const match = text.match(/https?:\/\/localhost:(\d+)/i);
    if (match) {
      this.detectedPort = Number(match[1]);
    }
  }

  async waitForServer() {
    const ports = new Set(DEFAULT_PORTS);
    if (process.env.AI_DEBUG_PORT) ports.add(Number(process.env.AI_DEBUG_PORT));

    const deadline = Date.now() + 120_000;
    while (Date.now() < deadline && !this.shouldStop) {
      if (this.detectedPort && (await this.pingPort(this.detectedPort))) {
        return this.detectedPort;
      }

      for (const port of ports) {
        if (await this.pingPort(port)) {
          this.detectedPort = port;
          return port;
        }
      }

      await delay(1000);
    }

    throw new Error('Dev server did not start in time.');
  }

  async pingPort(port) {
    if (!port) return false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    try {
      const res = await fetch(`http://localhost:${port}`, {
        method: 'GET',
        signal: controller.signal
      });
      return res.ok || res.status < 500;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }

  async runLint() {
    if (process.env.AI_DEBUG_SKIP_LINT === 'true') return [];
    console.log('[auto-debug] Running lint checks...');
    return new Promise((resolve) => {
      const proc = spawn('npm', ['run', 'lint'], {
        cwd: this.projectRoot,
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let log = '';
      proc.stdout.on('data', (data) => {
        const text = data.toString();
        log += text;
        process.stdout.write(`[lint] ${text}`);
      });
      proc.stderr.on('data', (data) => {
        const text = data.toString();
        log += text;
        process.stderr.write(`[lint] ${text}`);
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve([]);
        } else {
          resolve([
            {
              type: 'lint',
              severity: 'error',
              message: 'Lint step failed',
              metadata: { log: log.slice(-5000) }
            }
          ]);
        }
      });
    });
  }

  async stop() {
    if (this.shouldStop) return;
    this.shouldStop = true;
    console.log('[auto-debug] Shutting down...');
    if (this.serverProcess) {
      this.serverProcess.kill();
      this.serverProcess = null;
    }
    if (this.routeCrawler) {
      await this.routeCrawler.dispose?.();
    }
    process.exit(0);
  }
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const appDir = path.join(projectRoot, 'apps', 'personal-website');

  const supervisor = new AutoDebugSupervisor({ projectRoot, appDir });
  await supervisor.start();
}

main().catch((error) => {
  console.error('[auto-debug] Fatal error', error);
  process.exit(1);
});
