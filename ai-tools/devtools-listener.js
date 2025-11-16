const { AxeBuilder } = require('@axe-core/playwright');

const HYDRATION_PATTERNS = [
  /hydration/i,
  /did not match/i,
  /content does not match/i
];
const REACT_WARNING = /react/i;
const SUSPENSE_PATTERN = /suspense/i;

class DevtoolsListener {
  constructor(page, options = {}) {
    this.page = page;
    this.route = options.route || 'unknown';
    this.slowThreshold = options.slowThreshold || 300;
    this.issues = [];
    this.requestTimings = new Map();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    await this.page.addInitScript(() => {
      window.__layoutShiftScore = 0;
      window.__layoutShiftEntries = [];
      window.__clientErrors = [];
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__layoutShiftScore += entry.value;
              window.__layoutShiftEntries.push({
                value: entry.value,
                startTime: entry.startTime
              });
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {
        // Layout shift observer not supported.
      }

      window.addEventListener('error', (event) => {
        window.__clientErrors.push({
          message: event.message,
          source: event.filename,
          line: event.lineno,
          column: event.colno
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        window.__clientErrors.push({
          message: event.reason && event.reason.message ? event.reason.message : String(event.reason),
          source: 'unhandledrejection'
        });
      });
    });

    this.page.on('console', (msg) => {
      const text = msg.text();
      const location = msg.location();
      const metadata = {
        route: this.route,
        location: location.url ? `${location.url}:${location.lineNumber}:${location.columnNumber}` : undefined
      };

      if (msg.type() === 'error') {
        this.pushIssue('console-error', text, metadata);
        if (/TypeError/i.test(text) || /undefined/i.test(text)) {
          this.pushIssue('type-error', text, metadata);
        }
      } else if (msg.type() === 'warning') {
        if (HYDRATION_PATTERNS.some((pattern) => pattern.test(text))) {
          this.pushIssue('hydration-warning', text, metadata);
        } else if (SUSPENSE_PATTERN.test(text)) {
          this.pushIssue('suspense-warning', text, metadata);
        } else if (REACT_WARNING.test(text)) {
          this.pushIssue('react-warning', text, metadata);
        } else {
          this.pushIssue('console-warning', text, metadata);
        }
      }
    });

    this.page.on('pageerror', (error) => {
      this.pushIssue('runtime-error', error.message, { route: this.route, stack: error.stack });
    });

    this.page.on('request', (request) => {
      this.requestTimings.set(request, Date.now());
    });

    this.page.on('requestfailed', (request) => {
      this.pushIssue('network-failure', request.failure()?.errorText || 'Request failed', {
        route: this.route,
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    this.page.on('response', async (response) => {
      const status = response.status();
      if (status >= 400) {
        this.pushIssue('network-error', `HTTP ${status}`, {
          route: this.route,
          url: response.url(),
          status
        });
      }

      const startTime = this.requestTimings.get(response.request());
      if (startTime) {
        const duration = Date.now() - startTime;
        if (duration > this.slowThreshold) {
          this.pushIssue('slow-request', `Request took ${duration}ms`, {
            route: this.route,
            url: response.url(),
            duration
          });
        }
      }
    });
  }

  pushIssue(type, message, metadata = {}) {
    this.issues.push({
      type,
      route: this.route,
      message,
      timestamp: new Date().toISOString(),
      metadata
    });
  }

  async collectAccessibilityViolations() {
    try {
      const builder = new AxeBuilder({ page: this.page });
      const results = await builder.analyze();
      for (const violation of results.violations || []) {
        this.pushIssue('accessibility', violation.help, {
          route: this.route,
          impact: violation.impact,
          nodes: violation.nodes?.map((node) => node.target)
        });
      }
    } catch (error) {
      this.pushIssue('accessibility-scan-error', error.message, { route: this.route });
    }
  }

  async collectDomInsights() {
    const domReport = await this.page.evaluate(() => {
      const missingImages = Array.from(document.images || [])
        .filter((img) => !img.complete || !img.naturalWidth)
        .map((img) => img.currentSrc || img.src || img.getAttribute('src'));

      const anchors = Array.from(document.querySelectorAll('a[href]'))
        .filter((anchor) => anchor.getAttribute('href') === '#')
        .map((anchor) => anchor.outerHTML);

      return {
        missingImages,
        anchors,
        clientErrors: window.__clientErrors || []
      };
    });

    if (domReport.missingImages.length) {
      this.pushIssue('missing-images', `Images failed to load: ${domReport.missingImages.join(', ')}`, {
        route: this.route,
        images: domReport.missingImages
      });
    }

    if (domReport.anchors.length) {
      this.pushIssue('broken-links', 'Anchor tags with placeholder href detected', {
        route: this.route,
        samples: domReport.anchors.slice(0, 5)
      });
    }

    for (const error of domReport.clientErrors) {
      this.pushIssue('unhandled-error', error.message, {
        route: this.route,
        source: error.source,
        line: error.line,
        column: error.column
      });
    }
  }

  async collectLayoutShifts() {
    const cls = await this.page.evaluate(() => ({
      score: window.__layoutShiftScore || 0,
      entries: window.__layoutShiftEntries || []
    }));

    if (cls.score > 0.1) {
      this.pushIssue('layout-shift', `Cumulative layout shift ${cls.score}`, {
        route: this.route,
        shifts: cls.entries
      });
    }
  }

  async finalize() {
    await this.collectAccessibilityViolations();
    await this.collectDomInsights();
    await this.collectLayoutShifts();
    return this.issues;
  }
}

module.exports = { DevtoolsListener };
