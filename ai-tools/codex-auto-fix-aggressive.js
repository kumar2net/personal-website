const path = require('node:path');
const fs = require('node:fs/promises');
const { spawn } = require('node:child_process');

let OpenAI;
try {
  OpenAI = require('openai');
} catch {
  OpenAI = null;
}

class CodexAutoFixAggressive {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.logger = options.logger || console;
    this.model = process.env.CODEX_MODEL || 'gpt-5.1-codex';
    this.systemPrompt = [
      'You are an autonomous refactoring agent plugged directly into `git apply`.',
      'Every response MUST include one or more ```patch fenced git patches or ```rewrite:path fences.',
      'Act in aggressive self-healing mode: infer missing imports, regenerate broken components, migrate class components to hooks, rewrite CSS/MUI theme variables, patch hydration mismatches, repair routing/API/A11y issues, and convert old JS to safe TS when helpful.',
      'Preserve file permissions and include the complete file content if you choose rewrite fences.',
      'Never ask for confirmation; fix issues immediately and include all necessary imports.'
    ].join(' ');

    if (OpenAI && process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      this.client = null;
      this.logger.warn('[codex-auto-fix] OPENAI_API_KEY missing. Auto-fix will be skipped.');
    }
  }

  async repair(issues = []) {
    if (!issues.length) {
      return { appliedPatches: 0, rewrites: 0 };
    }
    if (!this.client) {
      this.logger.warn('[codex-auto-fix] Skipping repair because OpenAI client is unavailable.');
      return { appliedPatches: 0, rewrites: 0 };
    }

    const prompt = this.buildPrompt(issues);
    let response;
    try {
      response = await this.requestFix(prompt);
    } catch (error) {
      this.logger.error(`[codex-auto-fix] Failed to request fixes: ${error.message}`);
      return { appliedPatches: 0, rewrites: 0 };
    }
    const body = this.extractText(response);
    if (!body) {
      this.logger.warn('[codex-auto-fix] Empty response from model.');
      return { appliedPatches: 0, rewrites: 0 };
    }

    const patches = this.extractPatchBlocks(body);
    const rewrites = this.extractRewriteBlocks(body);

    let appliedPatches = 0;
    for (const patch of patches) {
      const applied = await this.applyPatch(patch);
      if (applied) appliedPatches += 1;
    }

    let rewriteCount = 0;
    if (appliedPatches === 0 && rewrites.length === 0) {
      this.logger.warn('[codex-auto-fix] Model returned no actionable content.');
    }

    for (const rewrite of rewrites) {
      const applied = await this.applyRewrite(rewrite);
      if (applied) rewriteCount += 1;
    }

    return { appliedPatches, rewrites: rewriteCount };
  }

  buildPrompt(issues) {
    const serializedIssues = JSON.stringify(issues, null, 2);
    return [
      'Detected issues JSON:',
      serializedIssues,
      '',
      'Working directory root:',
      this.projectRoot,
      '',
      'Rules:',
      '- respond with git patches inside ```patch fences (unified diff format).',
      '- include every touched file path relative to repo root.',
      '- if git apply would fail, output ```rewrite:path/to/file fences with the final file contents.',
      '- always add missing imports, fix hydration mismatches, update CSS, migrate React code as needed.',
      '- escalate by regenerating components, rewriting unstable hooks, fixing routing/API/TypeScript issues, and ensuring Lighthouse accessibility issues are resolved.',
      '- prefer modern hooks, strict mode safe patterns, suspense boundaries, accessibility fixes.',
      '- once fixes are ready, end response.'
    ].join('\n');
  }

  async requestFix(content) {
    return this.client.responses.create({
      model: this.model,
      reasoning: { effort: 'medium' },
      input: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content }
      ]
    });
  }

  extractText(response) {
    if (!response) return '';
    if (response.output?.length) {
      return response.output
        .map((item) =>
          item.content
            .map((chunk) => chunk.text || chunk.transcript || '')
            .join('\n')
        )
        .join('\n');
    }

    if (response.choices?.length) {
      return response.choices.map((choice) => {
        if (typeof choice.message?.content === 'string') return choice.message.content;
        if (Array.isArray(choice.message?.content)) {
          return choice.message.content.map((part) => part.text || '').join('\n');
        }
        return '';
      }).join('\n');
    }

    return '';
  }

  extractPatchBlocks(text) {
    const patches = [];
    const regex = /```(?:patch|diff)\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      patches.push(match[1].trim());
    }
    return patches;
  }

  extractRewriteBlocks(text) {
    const results = [];
    const regex = /```rewrite:([^\n]+)\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      results.push({
        filePath: match[1].trim(),
        contents: match[2]
      });
    }
    return results;
  }

  async applyPatch(patch) {
    if (!patch) return false;
    this.logger.info('[codex-auto-fix] Applying patch...');
    return new Promise((resolve) => {
      const child = spawn('git', ['apply', '--allow-empty', '--whitespace=nowarn'], {
        cwd: this.projectRoot,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stderr = '';
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          this.logger.info('[codex-auto-fix] Patch applied.');
          resolve(true);
        } else {
          this.logger.error(`[codex-auto-fix] Patch failed: ${stderr.trim()}`);
          resolve(false);
        }
      });

      child.stdin.write(`${patch}\n`);
      child.stdin.end();
    });
  }

  async applyRewrite(rewrite) {
    if (!rewrite.filePath) return false;
    const absolute = path.isAbsolute(rewrite.filePath)
      ? rewrite.filePath
      : path.join(this.projectRoot, rewrite.filePath);
    try {
      await fs.mkdir(path.dirname(absolute), { recursive: true });
      await fs.writeFile(absolute, rewrite.contents, 'utf8');
      this.logger.info(`[codex-auto-fix] Rewrote ${rewrite.filePath}`);
      return true;
    } catch (error) {
      this.logger.error(`[codex-auto-fix] Failed to rewrite ${rewrite.filePath}: ${error.message}`);
      return false;
    }
  }
}

module.exports = { CodexAutoFixAggressive };
