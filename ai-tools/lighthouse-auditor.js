const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');

const CATEGORY_THRESHOLDS = {
  performance: 0.9,
  accessibility: 1,
  seo: 0.95,
  'best-practices': 0.95
};

const INTERESTING_AUDITS = [
  'color-contrast',
  'image-size-responsive',
  'unused-javascript',
  'uses-responsive-images',
  'cumulative-layout-shift',
  'largest-contentful-paint',
  'total-blocking-time',
  'server-response-time',
  'dom-size',
  'meta-description',
  'aria-allowed-attr',
  'aria-valid-attr',
  'html-has-lang',
  'heading-order',
  'region',
  'link-name',
  'button-name',
  'uses-long-cache-ttl'
];

class LighthouseAuditor {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || process.env.AI_DEBUG_BASE_URL;
    this.logger = options.logger || console;
    this.maxRoutes = Number(process.env.AI_DEBUG_MAX_LH_ROUTES || options.maxRoutes || 3);
    this.categories = options.categories || ['performance', 'accessibility', 'seo'];
  }

  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async auditRoutes(routes = []) {
    if (!this.baseUrl) {
      throw new Error('LighthouseAuditor requires a baseUrl before running.');
    }

    const uniqueRoutes = Array.from(new Set(routes)).slice(0, this.maxRoutes);
    const issues = [];

    for (const route of uniqueRoutes) {
      const url = `${this.baseUrl}${route}`;
      let chrome;
      try {
        chrome = await chromeLauncher.launch({
          chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
        });

        const result = await lighthouse(
          url,
          {
            port: chrome.port,
            output: 'json',
            logLevel: 'error',
            onlyCategories: this.categories
          },
          undefined
        );

        issues.push(...this.extractIssues(result.lhr, route));
      } catch (error) {
        this.logger.error(`[lighthouse] Failed to audit ${url}: ${error.message}`);
        issues.push({
          type: 'lighthouse',
          severity: 'error',
          route,
          message: `Lighthouse failed: ${error.message}`
        });
      } finally {
        if (chrome) {
          try {
            await chrome.kill();
          } catch {
            // already closed
          }
        }
      }
    }

    return issues;
  }

  extractIssues(lhr, route) {
    const collected = [];
    for (const category of Object.keys(CATEGORY_THRESHOLDS)) {
      if (!lhr.categories?.[category]) continue;
      const score = lhr.categories[category].score || 0;
      if (score < CATEGORY_THRESHOLDS[category]) {
        collected.push({
          type: 'lighthouse-category',
          severity: score < CATEGORY_THRESHOLDS[category] - 0.2 ? 'error' : 'warning',
          route,
          category,
          score,
          requiredScore: CATEGORY_THRESHOLDS[category],
          message: `${category} score ${Math.round(score * 100)}% below target`
        });
      }
    }

    for (const auditId of INTERESTING_AUDITS) {
      const audit = lhr.audits?.[auditId];
      if (!audit || audit.score === null) continue;
      if (audit.score >= 1) continue;
      collected.push({
        type: 'lighthouse-audit',
        severity: audit.score < 0.75 ? 'error' : 'warning',
        route,
        auditId,
        title: audit.title,
        message: audit.displayValue || audit.description,
        details: audit.details || {},
        score: audit.score
      });
    }

    return collected;
  }
}

module.exports = { LighthouseAuditor };
