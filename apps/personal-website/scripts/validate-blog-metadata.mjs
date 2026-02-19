#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const projectRoot = path.resolve(scriptDir, "..");
const blogDir = path.join(projectRoot, "src", "pages", "blog");

const strictMode = process.argv.includes("--strict");
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const metadataRegex = /export\s+const\s+metadata\s*=\s*({[\s\S]*?})\s*;/m;

function getSlug(fileName) {
  return fileName.replace(/\.(jsx|md)$/i, "");
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function parseMetadata(source, filePath) {
  const match = source.match(metadataRegex);
  if (!match) {
    return { found: false, value: null, error: null };
  }

  try {
    const objectLiteral = match[1];
    const parsed = Function(`"use strict"; return (${objectLiteral});`)();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("metadata export is not an object");
    }
    return { found: true, value: parsed, error: null };
  } catch (error) {
    return {
      found: true,
      value: null,
      error: new Error(`Unable to parse metadata in ${filePath}: ${error.message}`),
    };
  }
}

function validateMetadata(slug, metadata, filePath) {
  const failures = [];

  const requiredStringFields = [
    "slug",
    "title",
    "description",
    "datePublished",
    "dateModified",
  ];

  requiredStringFields.forEach((field) => {
    if (!isNonEmptyString(metadata[field])) {
      failures.push(`${filePath}: metadata.${field} must be a non-empty string`);
    }
  });

  if (isNonEmptyString(metadata.slug) && metadata.slug !== slug) {
    failures.push(`${filePath}: metadata.slug "${metadata.slug}" must match file slug "${slug}"`);
  }

  if (isNonEmptyString(metadata.datePublished) && !isoDateRegex.test(metadata.datePublished)) {
    failures.push(`${filePath}: metadata.datePublished must use YYYY-MM-DD`);
  }

  if (isNonEmptyString(metadata.dateModified) && !isoDateRegex.test(metadata.dateModified)) {
    failures.push(`${filePath}: metadata.dateModified must use YYYY-MM-DD`);
  }

  if (!Array.isArray(metadata.tags) || metadata.tags.length === 0) {
    failures.push(`${filePath}: metadata.tags must be a non-empty string array`);
  } else if (metadata.tags.some((tag) => !isNonEmptyString(tag))) {
    failures.push(`${filePath}: metadata.tags must only contain non-empty strings`);
  }

  const optionalStringFields = ["excerpt", "image", "readingTime"];
  optionalStringFields.forEach((field) => {
    if (metadata[field] != null && typeof metadata[field] !== "string") {
      failures.push(`${filePath}: metadata.${field} must be a string when present`);
    }
  });

  return failures;
}

async function main() {
  const ignoredFiles = new Set(["PostDynamic.jsx"]);
  const files = (await fs.readdir(blogDir))
    .filter((fileName) => /\.(jsx|md)$/i.test(fileName))
    .filter((fileName) => !ignoredFiles.has(fileName))
    .sort();

  const jsxFiles = files.filter((fileName) => fileName.endsWith(".jsx"));
  const warnings = [];
  const failures = [];
  const missingMetadataFiles = [];

  const jsxBySlug = new Map();
  const allBySlug = new Map();

  files.forEach((fileName) => {
    const slug = getSlug(fileName);
    const allEntries = allBySlug.get(slug) || [];
    allEntries.push(fileName);
    allBySlug.set(slug, allEntries);

    if (fileName.endsWith(".jsx")) {
      const jsxEntries = jsxBySlug.get(slug) || [];
      jsxEntries.push(fileName);
      jsxBySlug.set(slug, jsxEntries);
    }
  });

  for (const [slug, entries] of jsxBySlug.entries()) {
    if (entries.length > 1) {
      failures.push(`Duplicate JSX slug "${slug}" in: ${entries.join(", ")}`);
    }
  }

  for (const [slug, entries] of allBySlug.entries()) {
    const hasJsx = entries.some((fileName) => fileName.endsWith(".jsx"));
    const hasMd = entries.some((fileName) => fileName.endsWith(".md"));
    if (hasJsx && hasMd) {
      warnings.push(
        `Slug "${slug}" exists as both .jsx and .md (${entries.join(", ")}). JSX wins at runtime.`,
      );
    }
  }

  for (const fileName of jsxFiles) {
    const slug = getSlug(fileName);
    const filePath = path.join(blogDir, fileName);
    const source = await fs.readFile(filePath, "utf8");
    const parsed = parseMetadata(source, filePath);

    if (parsed.error) {
      failures.push(parsed.error.message);
      continue;
    }

    if (!parsed.found) {
      if (strictMode) {
        failures.push(`${filePath}: missing \`export const metadata = {...}\``);
      } else {
        missingMetadataFiles.push(filePath);
      }
      continue;
    }

    failures.push(...validateMetadata(slug, parsed.value, filePath));
  }

  if (missingMetadataFiles.length > 0) {
    warnings.push(
      `${missingMetadataFiles.length} JSX posts are missing metadata exports (legacy posts allowed in non-strict mode).`,
    );
  }

  warnings.forEach((message) => console.warn(`[blog:validate] warn: ${message}`));

  if (failures.length > 0) {
    failures.forEach((message) => console.error(`[blog:validate] error: ${message}`));
    console.error(
      `[blog:validate] failed with ${failures.length} error(s) and ${warnings.length} warning(s).`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `[blog:validate] passed. Checked ${jsxFiles.length} JSX posts with ${warnings.length} warning(s).`,
  );
}

main().catch((error) => {
  console.error(`[blog:validate] fatal: ${error.message}`);
  process.exitCode = 1;
});
