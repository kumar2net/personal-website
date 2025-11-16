const path = require('node:path');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');
const { DevtoolsListener } = require('./devtools-listener');

const DEFAULT_PORTS = [5173, 4173, 3000, 4321, 8080];
const ROUTE_FILE_EXT = /\.(jsx?|tsx?|mdx?|md)$/i;
const ROUTER_FILE_EXT = /\.(jsx?|tsx?|mjs|cjs|js|ts)$/i;

class RouteCrawler {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.appDir = options.appDir || path.join(this.projectRoot, 'apps', 'personal-website');
    this.baseUrl = options.baseUrl || process.env.AI_DEBUG_BASE_URL;
    this.headless = options.headless ?? process.env.AI_DEBUG_HEADLESS !== 'false';
    this.maxRoutesPerRun = Number(process.env.AI_DEBUG_MAX_ROUTES || options.maxRoutesPerRun || 50);
    this.extraRoutes = new Set(options.extraRoutes || []);
    this.logger = options.logger || console;
    this.slowThreshold = options.slowThreshold || 300;
    this.browser = null;
  }

  async crawl() {
    const baseUrl = await this.resolveBaseUrl();
    const browser = await this.ensureBrowser();
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    try {
      const { routes, discoveredFrom } = await this.discoverRoutes();
      for (const route of this.extraRoutes) {
        const normalizedExtra = this.normalizeRoutePath(route, { preserveCase: true });
        if (normalizedExtra) routes.add(normalizedExtra);
      }

      const queue = Array.from(routes);
      const visited = new Set();
      const issues = [];

      while (queue.length && visited.size < this.maxRoutesPerRun) {
        const routePath = queue.shift();
        if (!routePath || visited.has(routePath)) continue;
        visited.add(routePath);

        const page = await context.newPage();
        const listener = new DevtoolsListener(page, {
          route: routePath,
          slowThreshold: this.slowThreshold
        });
        await listener.init();

        try {
          await page.goto(`${baseUrl}${routePath}`, {
            waitUntil: 'networkidle',
            timeout: 60_000
          });
        } catch (error) {
          listener.pushIssue('navigation-error', error.message, { route: routePath });
        }

        const links = await this.extractLinks(page, baseUrl);
        for (const link of links) {
          if (!routes.has(link) && !visited.has(link)) {
            routes.add(link);
            queue.push(link);
          }
        }

        const pageIssues = await listener.finalize();
        issues.push(...pageIssues);
        await page.close();
      }

      return {
        issues,
        visitedRoutes: Array.from(visited),
        discoveredFrom
      };
    } finally {
      await context.close();
    }
  }

  async ensureBrowser() {
    if (this.browser) return this.browser;
    this.browser = await chromium.launch({
      headless: this.headless,
      args: ['--disable-gpu', '--no-sandbox']
    });
    return this.browser;
  }

  async resolveBaseUrl() {
    if (this.baseUrl) return this.baseUrl;
    const host = process.env.AI_DEBUG_HOST || 'http://localhost';
    const ports = this.detectCandidatePorts();

    for (const port of ports) {
      if (!port) continue;
      if (await this.isPortServing(host, port)) {
        this.baseUrl = `${host}:${port}`;
        return this.baseUrl;
      }
    }

    throw new Error('Unable to detect dev server URL. Set AI_DEBUG_BASE_URL.');
  }

  detectCandidatePorts() {
    const envPort = Number(process.env.AI_DEBUG_PORT || process.env.PORT);
    const unique = new Set([envPort, ...DEFAULT_PORTS]);
    return Array.from(unique).filter(Boolean);
  }

  async isPortServing(host, port) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3_000);
    try {
      const res = await fetch(`${host}:${port}`, {
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

  async discoverRoutes() {
    const fromFileSystem = await this.discoverFileSystemRoutes();
    const fromRouter = await this.discoverRouterRoutes();
    const routes = new Set(['/']);
    const discoveredFrom = {
      filesystem: Array.from(fromFileSystem),
      router: Array.from(fromRouter)
    };

    for (const route of fromFileSystem) routes.add(route);
    for (const route of fromRouter) routes.add(route);

    return { routes, discoveredFrom };
  }

  async discoverFileSystemRoutes() {
    const routes = new Set();
    const pagesDir = path.join(this.appDir, 'src', 'pages');

    try {
      const files = await this.walkDirectory(pagesDir, ROUTE_FILE_EXT);
      for (const file of files) {
        const relative = path.relative(pagesDir, file).replace(/\\/g, '/');
        if (!relative) continue;
        const route = this.deriveRouteFromFile(relative);
        if (route) routes.add(route);
      }
    } catch (error) {
      this.logger.warn(`[route-crawler] Unable to scan pages directory: ${error.message}`);
    }

    return routes;
  }

  deriveRouteFromFile(relativePath) {
    const parts = relativePath.split('/');
    const fileName = parts.pop();
    if (!fileName) return null;

    const nameWithoutExt = fileName.replace(/\.[^.]+$/, '');
    const segments = parts
      .filter(Boolean)
      .map((segment) => this.normalizeSegment(segment));

    if (nameWithoutExt.toLowerCase() !== 'index') {
      segments.push(this.normalizeSegment(nameWithoutExt));
    }

    const route = '/' + segments.filter(Boolean).join('/');
    return this.normalizeRoutePath(route || '/');
  }

  normalizeSegment(segment) {
    return segment
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[_\s]+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase();
  }

  normalizeRoutePath(route, options = {}) {
    if (!route) return null;
    const preserveCase = options.preserveCase || false;
    let normalized = route.trim();
    if (!normalized.startsWith('/')) normalized = `/${normalized}`;
    normalized = normalized.replace(/\/{2,}/g, '/');
    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    return preserveCase ? normalized : normalized.toLowerCase();
  }

  async discoverRouterRoutes() {
    const routes = new Set();
    const srcDir = path.join(this.appDir, 'src');
    const files = await this.walkDirectory(srcDir, ROUTER_FILE_EXT);
    const pathRegex = /path\s*[:=]\s*["'`]([^"'`]+)["'`]/g;
    const routeRegex = /<Route[^>]+path=["'`]([^"'`]+)["'`]/g;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      let match;
      while ((match = pathRegex.exec(content)) !== null) {
        const route = this.normalizeRoutePath(match[1], { preserveCase: true });
        if (route) routes.add(route);
      }

      while ((match = routeRegex.exec(content)) !== null) {
        const route = this.normalizeRoutePath(match[1], { preserveCase: true });
        if (route) routes.add(route);
      }
    }

    return routes;
  }

  async walkDirectory(dir, extensionRegex) {
    const results = [];
    const stack = [dir];
    while (stack.length) {
      const current = stack.pop();
      if (!current) continue;
      let entries;
      try {
        entries = await fs.readdir(current, { withFileTypes: true });
      } catch {
        continue;
      }

      for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        if (['node_modules', 'dist', 'build', '.turbo'].includes(entry.name)) continue;
        const fullPath = path.join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(fullPath);
        } else if (!extensionRegex || extensionRegex.test(entry.name)) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }

  async extractLinks(page, baseUrl) {
    const anchors = await page.$$eval('a[href]', (elements) =>
      elements.map((element) => element.getAttribute('href'))
    );
    const routes = new Set();
    for (const href of anchors) {
      const normalized = this.normalizeHref(href, baseUrl);
      if (normalized) routes.add(normalized);
    }
    return routes;
  }

  normalizeHref(href, baseUrl) {
    if (!href) return null;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return null;
    if (href.startsWith('javascript:')) return null;
    if (href.startsWith('#')) return null;

    let pathFragment = href;
    if (/^https?:\/\//i.test(href)) {
      try {
        const target = new URL(href);
        const base = new URL(baseUrl);
        if (target.origin !== base.origin) return null;
        pathFragment = target.pathname;
      } catch {
        return null;
      }
    } else if (!href.startsWith('/')) {
      pathFragment = `/${href}`;
    }

    pathFragment = pathFragment.split('?')[0].split('#')[0];
    return this.normalizeRoutePath(pathFragment, { preserveCase: true });
  }

  async dispose() {
    if (this.browser) {
      try {
        await this.browser.close();
      } catch {
        // ignore
      }
      this.browser = null;
    }
  }
}

module.exports = { RouteCrawler };
