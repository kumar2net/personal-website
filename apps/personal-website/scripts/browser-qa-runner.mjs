#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { AxeBuilder } from "@axe-core/playwright";
import { chromium, devices } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const appDir = path.resolve(scriptDir, "..");

const DEFAULT_BASE_URL = process.env.BROWSER_QA_BASE_URL || "http://127.0.0.1:5173";
const DEFAULT_WAIT_MS = Number(process.env.BROWSER_QA_WAIT_MS || 1200);
const DEFAULT_SERVER_TIMEOUT_MS = Number(
  process.env.BROWSER_QA_SERVER_TIMEOUT_MS || 15000,
);
const DEFAULT_ROUTES = [
  "/",
  "/about",
  "/projects",
  "/blog",
  "/books",
  "/utilities",
  "/shorts-metrics",
  "/science",
  "/contact",
];

const VIEWPORT_PRESETS = {
  desktop: {
    id: "desktop",
    label: "Desktop",
    contextOptions: {
      viewport: { width: 1440, height: 900 },
    },
  },
  mobile: {
    id: "mobile",
    label: "Mobile",
    contextOptions: {
      ...devices["iPhone 13"],
    },
  },
};

function printUsage() {
  console.log(`Browser QA Runner

Usage:
  node apps/personal-website/scripts/browser-qa-runner.mjs
  node apps/personal-website/scripts/browser-qa-runner.mjs --baseUrl=http://127.0.0.1:4173
  node apps/personal-website/scripts/browser-qa-runner.mjs --routes=/,/blog,/science

Options:
  --baseUrl <url>       Target site root (default: ${DEFAULT_BASE_URL})
  --routes <csv>        Comma-separated route list
  --route <path>        Add a single route; can be repeated
  --desktop-only        Run desktop viewport only
  --mobile-only         Run mobile viewport only
  --headed              Launch the browser in headed mode
  --waitMs <ms>         Extra wait after navigation (default: ${DEFAULT_WAIT_MS})
  --outputDir <path>    Report directory (default: apps/personal-website/reports/browser-qa/<timestamp>)
  --help                Show usage
`);
}

function toTimestampId(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/u, "Z");
}

function sanitizeRoute(route) {
  if (route === "/") {
    return "home";
  }
  return route
    .replace(/^\/+/u, "")
    .replace(/[^a-z0-9/._-]+/giu, "-")
    .replace(/[/.]+/gu, "-")
    .replace(/-+/gu, "-")
    .replace(/^-|-$/gu, "")
    .toLowerCase();
}

function normalizeRoute(route) {
  if (!route) {
    return "/";
  }
  if (/^https?:\/\//iu.test(route)) {
    return route;
  }
  return route.startsWith("/") ? route : `/${route}`;
}

function parseArgs(argv) {
  const parsed = {
    baseUrl: DEFAULT_BASE_URL,
    routes: [],
    desktopOnly: false,
    mobileOnly: false,
    headed: false,
    waitMs: DEFAULT_WAIT_MS,
    outputDir: path.join(appDir, "reports", "browser-qa", toTimestampId()),
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--help" || token === "-h") {
      parsed.help = true;
      continue;
    }

    if (token === "--desktop-only") {
      parsed.desktopOnly = true;
      continue;
    }

    if (token === "--mobile-only") {
      parsed.mobileOnly = true;
      continue;
    }

    if (token === "--headed") {
      parsed.headed = true;
      continue;
    }

    if (token.startsWith("--baseUrl=")) {
      parsed.baseUrl = token.slice("--baseUrl=".length);
      continue;
    }

    if (token === "--baseUrl" && argv[index + 1]) {
      parsed.baseUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if (token.startsWith("--routes=")) {
      parsed.routes.push(...token.slice("--routes=".length).split(","));
      continue;
    }

    if (token === "--routes" && argv[index + 1]) {
      parsed.routes.push(...argv[index + 1].split(","));
      index += 1;
      continue;
    }

    if (token.startsWith("--route=")) {
      parsed.routes.push(token.slice("--route=".length));
      continue;
    }

    if (token === "--route" && argv[index + 1]) {
      parsed.routes.push(argv[index + 1]);
      index += 1;
      continue;
    }

    if (token.startsWith("--waitMs=")) {
      parsed.waitMs = Number(token.slice("--waitMs=".length)) || DEFAULT_WAIT_MS;
      continue;
    }

    if (token === "--waitMs" && argv[index + 1]) {
      parsed.waitMs = Number(argv[index + 1]) || DEFAULT_WAIT_MS;
      index += 1;
      continue;
    }

    if (token.startsWith("--outputDir=")) {
      parsed.outputDir = path.resolve(token.slice("--outputDir=".length));
      continue;
    }

    if (token === "--outputDir" && argv[index + 1]) {
      parsed.outputDir = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }
  }

  const routes = parsed.routes.length
    ? [...new Set(parsed.routes.map((route) => normalizeRoute(route.trim())).filter(Boolean))]
    : DEFAULT_ROUTES;

  return {
    ...parsed,
    routes,
  };
}

function chooseViewportPresets(options) {
  if (options.desktopOnly && options.mobileOnly) {
    throw new Error("Choose either --desktop-only or --mobile-only, not both.");
  }

  if (options.desktopOnly) {
    return [VIEWPORT_PRESETS.desktop];
  }

  if (options.mobileOnly) {
    return [VIEWPORT_PRESETS.mobile];
  }

  return [VIEWPORT_PRESETS.desktop, VIEWPORT_PRESETS.mobile];
}

async function waitForServer(baseUrl, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastError = null;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, {
        method: "GET",
        redirect: "manual",
      });
      if (response.ok || response.status < 500) {
        return;
      }
      lastError = new Error(`HTTP ${response.status} from ${baseUrl}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(
    `Timed out waiting for ${baseUrl}. ${lastError instanceof Error ? lastError.message : String(lastError)}`,
  );
}

function isSameOrigin(url, baseOrigin) {
  try {
    return new URL(url).origin === baseOrigin;
  } catch {
    return false;
  }
}

async function collectPageSnapshot(page) {
  return page.evaluate(() => {
    const heading = document.querySelector('h1, [role="heading"][aria-level="1"]');
    const missingImages = Array.from(document.images || [])
      .filter((img) => img.complete && img.currentSrc && !img.naturalWidth)
      .map((img) => img.currentSrc || img.src || img.getAttribute("src") || "");
    const placeholderAnchors = Array.from(document.querySelectorAll('a[href="#"]'))
      .slice(0, 5)
      .map((anchor) => anchor.textContent?.trim() || anchor.outerHTML.slice(0, 140));

    return {
      title: document.title || "",
      heading: heading?.textContent?.trim() || "",
      missingImages,
      placeholderAnchors,
    };
  });
}

function summarizeIssueCounts(issues) {
  return {
    consoleErrors: issues.consoleErrors.length,
    consoleWarnings: issues.consoleWarnings.length,
    pageErrors: issues.pageErrors.length,
    sameOriginHttpErrors: issues.sameOriginHttpErrors.length,
    sameOriginRequestFailures: issues.sameOriginRequestFailures.length,
    externalHttpErrors: issues.externalHttpErrors.length,
    missingImages: issues.missingImages.length,
    seriousA11y: issues.seriousA11y.length,
    totalA11yViolations: issues.totalA11yViolations,
  };
}

function shouldFailResult(issueCounts) {
  return (
    issueCounts.consoleErrors > 0 ||
    issueCounts.pageErrors > 0 ||
    issueCounts.sameOriginHttpErrors > 0 ||
    issueCounts.sameOriginRequestFailures > 0 ||
    issueCounts.seriousA11y > 0
  );
}

async function runRouteCheck(params) {
  const { context, route, baseUrl, baseOrigin, waitMs, screenshotsDir, viewport } = params;
  const page = await context.newPage();
  const url = new URL(route, baseUrl).toString();

  const issues = {
    consoleErrors: [],
    consoleWarnings: [],
    pageErrors: [],
    sameOriginHttpErrors: [],
    externalHttpErrors: [],
    sameOriginRequestFailures: [],
    externalRequestFailures: [],
    missingImages: [],
    seriousA11y: [],
    moderateA11y: [],
    totalA11yViolations: 0,
  };

  page.on("console", (message) => {
    const entry = {
      type: message.type(),
      text: message.text(),
      location: message.location(),
    };
    if (message.type() === "error") {
      issues.consoleErrors.push(entry);
    } else if (message.type() === "warning") {
      issues.consoleWarnings.push(entry);
    }
  });

  page.on("pageerror", (error) => {
    issues.pageErrors.push({
      message: error.message,
      stack: error.stack,
    });
  });

  page.on("response", (response) => {
    if (response.status() < 400) {
      return;
    }
    const target = {
      url: response.url(),
      status: response.status(),
      statusText: response.statusText(),
      resourceType: response.request().resourceType(),
    };
    if (isSameOrigin(response.url(), baseOrigin)) {
      issues.sameOriginHttpErrors.push(target);
    } else {
      issues.externalHttpErrors.push(target);
    }
  });

  page.on("requestfailed", (request) => {
    const target = {
      url: request.url(),
      failure: request.failure()?.errorText || "request failed",
      resourceType: request.resourceType(),
      method: request.method(),
    };
    if (isSameOrigin(request.url(), baseOrigin)) {
      issues.sameOriginRequestFailures.push(target);
    } else {
      issues.externalRequestFailures.push(target);
    }
  });

  let navigationStatus = null;
  let navigationStatusText = "";
  let navigationError = null;

  try {
    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    navigationStatus = response?.status() ?? null;
    navigationStatusText = response?.statusText() ?? "";
    await page.waitForLoadState("networkidle", { timeout: 6000 }).catch(() => {});
    if (waitMs > 0) {
      await page.waitForTimeout(waitMs);
    }
  } catch (error) {
    navigationError = error instanceof Error ? error.message : String(error);
  }

  const routeKey = sanitizeRoute(route);
  const screenshotPath = path.join(screenshotsDir, `${viewport.id}-${routeKey}.png`);
  let title = "";
  let heading = "";
  let placeholderAnchors = [];

  if (!navigationError) {
    const axeResults = await new AxeBuilder({ page }).analyze().catch((error) => ({
      violations: [
        {
          id: "axe-runtime",
          impact: "serious",
          help: error instanceof Error ? error.message : String(error),
          nodes: [],
        },
      ],
    }));

    for (const violation of axeResults.violations || []) {
      const entry = {
        id: violation.id,
        impact: violation.impact || "unknown",
        help: violation.help,
        nodes: (violation.nodes || []).map((node) => node.target),
      };
      if (["critical", "serious"].includes(violation.impact || "")) {
        issues.seriousA11y.push(entry);
      } else {
        issues.moderateA11y.push(entry);
      }
    }
    issues.totalA11yViolations = (axeResults.violations || []).length;

    const snapshot = await collectPageSnapshot(page);
    title = snapshot.title;
    heading = snapshot.heading;
    placeholderAnchors = snapshot.placeholderAnchors;
    issues.missingImages = snapshot.missingImages.map((src) => ({ src }));

    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });
  } else {
    await page.screenshot({
      path: screenshotPath,
      fullPage: false,
    }).catch(() => {});
  }

  await page.close();

  const issueCounts = summarizeIssueCounts(issues);
  const failed = navigationError ? true : shouldFailResult(issueCounts);

  return {
    route,
    url,
    viewport: viewport.id,
    viewportLabel: viewport.label,
    navigationStatus,
    navigationStatusText,
    navigationError,
    title,
    heading,
    screenshotPath,
    placeholderAnchors,
    issueCounts,
    issues,
    passed: !failed,
  };
}

function buildMarkdownReport(params) {
  const lines = [
    "# Browser QA Report",
    "",
    `- Generated: ${params.generatedAt}`,
    `- Base URL: ${params.baseUrl}`,
    `- Routes checked: ${params.routes.join(", ")}`,
    `- Viewports: ${params.viewports.map((entry) => entry.label).join(", ")}`,
    `- Results: ${params.summary.passed}/${params.summary.total} passed`,
    "",
  ];

  for (const result of params.results) {
    const screenshotRelative = path.relative(params.outputDir, result.screenshotPath);
    lines.push(
      `## ${result.route} [${result.viewportLabel}]`,
      "",
      `- Status: ${result.passed ? "PASS" : "FAIL"}`,
      `- URL: ${result.url}`,
      `- HTTP: ${result.navigationStatus ?? "n/a"} ${result.navigationStatusText}`.trim(),
      `- Title: ${result.title || "n/a"}`,
      `- H1: ${result.heading || "n/a"}`,
      `- Screenshot: ${screenshotRelative}`,
      `- Console errors: ${result.issueCounts.consoleErrors}`,
      `- Page errors: ${result.issueCounts.pageErrors}`,
      `- Same-origin HTTP errors: ${result.issueCounts.sameOriginHttpErrors}`,
      `- Same-origin request failures: ${result.issueCounts.sameOriginRequestFailures}`,
      `- Serious/critical a11y violations: ${result.issueCounts.seriousA11y}`,
      "",
    );

    if (result.navigationError) {
      lines.push(`Navigation error: ${result.navigationError}`, "");
      continue;
    }

    if (result.issues.consoleErrors.length) {
      lines.push("Console errors:");
      for (const entry of result.issues.consoleErrors.slice(0, 5)) {
        lines.push(`- ${entry.text}`);
      }
      lines.push("");
    }

    if (result.issues.pageErrors.length) {
      lines.push("Page errors:");
      for (const entry of result.issues.pageErrors.slice(0, 5)) {
        lines.push(`- ${entry.message}`);
      }
      lines.push("");
    }

    if (result.issues.sameOriginHttpErrors.length) {
      lines.push("Same-origin HTTP errors:");
      for (const entry of result.issues.sameOriginHttpErrors.slice(0, 5)) {
        lines.push(`- ${entry.status} ${entry.url}`);
      }
      lines.push("");
    }

    if (result.issues.sameOriginRequestFailures.length) {
      lines.push("Same-origin request failures:");
      for (const entry of result.issues.sameOriginRequestFailures.slice(0, 5)) {
        lines.push(`- ${entry.failure} ${entry.url}`);
      }
      lines.push("");
    }

    if (result.issues.seriousA11y.length) {
      lines.push("Serious accessibility violations:");
      for (const entry of result.issues.seriousA11y.slice(0, 5)) {
        lines.push(`- [${entry.impact}] ${entry.help}`);
      }
      lines.push("");
    }

    if (result.issues.missingImages.length) {
      lines.push("Missing images:");
      for (const entry of result.issues.missingImages.slice(0, 5)) {
        lines.push(`- ${entry.src}`);
      }
      lines.push("");
    }
  }

  return `${lines.join("\n").trim()}\n`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printUsage();
    return;
  }

  const viewports = chooseViewportPresets(options);
  const generatedAt = new Date().toISOString();
  const outputDir = path.resolve(options.outputDir);
  const screenshotsDir = path.join(outputDir, "screenshots");

  await fs.mkdir(screenshotsDir, { recursive: true });

  await waitForServer(options.baseUrl, DEFAULT_SERVER_TIMEOUT_MS);

  const browser = await chromium.launch({
    headless: !options.headed,
  });

  const results = [];
  const baseOrigin = new URL(options.baseUrl).origin;

  try {
    for (const viewport of viewports) {
      const context = await browser.newContext(viewport.contextOptions);
      for (const route of options.routes) {
        results.push(
          await runRouteCheck({
            context,
            route,
            baseUrl: options.baseUrl,
            baseOrigin,
            waitMs: options.waitMs,
            screenshotsDir,
            viewport,
          }),
        );
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  const summary = {
    total: results.length,
    passed: results.filter((result) => result.passed).length,
    failed: results.filter((result) => !result.passed).length,
  };

  const payload = {
    generatedAt,
    baseUrl: options.baseUrl,
    routes: options.routes,
    viewports: viewports.map(({ id, label }) => ({ id, label })),
    summary,
    results,
  };

  await fs.writeFile(
    path.join(outputDir, "summary.json"),
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8",
  );
  await fs.writeFile(
    path.join(outputDir, "summary.md"),
    buildMarkdownReport({
      generatedAt,
      baseUrl: options.baseUrl,
      routes: options.routes,
      viewports,
      summary,
      results,
      outputDir,
    }),
    "utf8",
  );

  console.log(`[browser-qa] report written to ${outputDir}`);
  console.log(
    `[browser-qa] ${summary.passed}/${summary.total} checks passed (${summary.failed} failed)`,
  );

  if (summary.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(
    `[browser-qa] ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
