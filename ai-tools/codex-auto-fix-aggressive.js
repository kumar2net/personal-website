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
    this.model = process.env.CODEX_MODEL || 'gpt-5-codex';
    const fallbackModelEnv =
      process.env.CODEX_FALLBACK_MODELS ||
      process.env.CODEX_FALLBACK_MODEL ||
      'gpt-5-mini-2025-08-07,gpt-5-nano-2025-08-07,gpt-5-pro-2025-10-06';
    this.fallbackModels = fallbackModelEnv
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry && entry !== this.model);
    this.systemPrompt = [
      'You are an autonomous refactoring agent plugged directly into `git apply`.',
      'Every response MUST include one or more ```patch fenced git patches or ```rewrite:path fences.',
      'Act in aggressive self-healing mode: infer missing imports, regenerate broken components, migrate class components to hooks, rewrite CSS/MUI theme variables, patch hydration mismatches, repair routing/API/A11y issues, and convert old JS to safe TS when helpful.',
      'Preserve file permissions and include the complete file content if you choose rewrite fences.',
      'Never ask for confirmation; fix issues immediately and include all necessary imports.'
    ].join(' ');

    if (OpenAI && process.env.OPENAI_API_KEY) {
      const clientOptions = {
        apiKey: process.env.OPENAI_API_KEY
      };
      const normalizedProject = process.env.OPENAI_PROJECT;
      const normalizedOrg = process.env.OPENAI_ORGANIZATION;
      if (normalizedProject) {
        if (normalizedProject.startsWith('org-') && !normalizedOrg) {
          clientOptions.organization = normalizedProject;
        } else {
          clientOptions.project = normalizedProject;
        }
      }
      if (normalizedOrg) {
        clientOptions.organization = normalizedOrg;
      }
      this.client = new OpenAI(clientOptions);
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

    const batches = this.chunkIssues(issues);
    let appliedPatches = 0;
    let rewriteCount = 0;

    for (let index = 0; index < batches.length; index += 1) {
      const batch = batches[index];
      this.logger.info(
        `[codex-auto-fix] Processing issue batch ${index + 1}/${batches.length} (${batch.length} issues)`
      );
      const prompt = this.buildPrompt(batch);
      const { response } = await this.fetchResponseWithFallback(prompt);
      if (!response) continue;
      const body = this.extractText(response);
      if (!body) {
        this.logger.warn('[codex-auto-fix] Empty response from model.');
        continue;
      }

      const patches = this.extractPatchBlocks(body);
      const rewrites = this.extractRewriteBlocks(body);

      for (const patch of patches) {
        const applied = await this.applyPatch(patch);
        if (applied) appliedPatches += 1;
      }

      if (patches.length === 0 && rewrites.length === 0) {
        this.logger.warn('[codex-auto-fix] Model returned no actionable content for this batch.');
      }

      for (const rewrite of rewrites) {
        const applied = await this.applyRewrite(rewrite);
        if (applied) rewriteCount += 1;
      }
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

  async fetchResponseWithFallback(prompt) {
    const models = [this.model, ...this.fallbackModels];
    let lastError = null;

    for (let i = 0; i < models.length; i += 1) {
      const targetModel = models[i];
      const label = i === 0 ? 'Primary' : 'Fallback';
      try {
        const response = await this.requestFix(prompt, targetModel);
        if (i > 0) {
          this.logger.info(`[codex-auto-fix] Using fallback model ${targetModel}.`);
        }
        return { response, modelUsed: targetModel };
      } catch (error) {
        lastError = error;
        const hasNext = i < models.length - 1;
        if (hasNext && this.shouldFallback(error)) {
          const nextModel = models[i + 1];
          this.logger.warn(
            `[codex-auto-fix] ${label} model ${targetModel} unavailable (${error.message}). Trying ${nextModel}...`
          );
          continue;
        }
        this.logger.error(`[codex-auto-fix] ${label} model ${targetModel} failed: ${error.message}`);
        break;
      }
    }

    if (lastError) {
      this.logger.error(
        `[codex-auto-fix] Exhausted available models without success: ${lastError.message}`
      );
    }
    return { response: null, modelUsed: null };
  }

  shouldFallback(error) {
    if (!error) return false;
    if (!this.fallbackModels.length) return false;
    const status = error.status || error.code;
    const message = (error.message || '').toLowerCase();
    if (status === 401 || status === 403) return true;
    if (message.includes('does not have access')) return true;
    if (message.includes('was not found')) return true;
    if (message.includes('unknown model') || message.includes('unsupported model')) return true;
    return false;
  }

  async requestFix(content, modelOverride) {
    const model = modelOverride || this.model;
    const payload = {
      model,
      input: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content }
      ]
    };
    if (this.supportsReasoning(model)) {
      payload.reasoning = { effort: 'medium' };
    }
    return this.client.responses.create(payload);
  }

  supportsReasoning(modelName) {
    if (!modelName) return false;
    const normalized = modelName.toLowerCase();
    return normalized.includes('codex') || normalized.includes('gpt-5.1') || normalized.includes('o1');
  }

  chunkIssues(issues) {
    const batchSize = Number(process.env.CODEX_ISSUE_BATCH_SIZE || 40);
    if (!Number.isFinite(batchSize) || batchSize <= 0) {
      return [issues];
    }
    const chunks = [];
    for (let i = 0; i < issues.length; i += batchSize) {
      chunks.push(issues.slice(i, i + batchSize));
    }
    return chunks;
  }

  extractText(response) {
    if (!response) return '';
    if (response.output?.length) {
      const segments = [];
      for (const item of response.output) {
        if (!item || !Array.isArray(item.content)) continue;
        const text = item.content
          .map((chunk) => {
            if (!chunk) return '';
            if (typeof chunk === 'string') return chunk;
            return chunk.text || chunk.transcript || chunk.output_text || '';
          })
          .filter(Boolean)
          .join('\n');
        if (text) segments.push(text);
      }
      if (segments.length) return segments.join('\n');
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
