import path from "node:path";
import { z } from "zod";

const envSchema = z
  .object({
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
    YT_CLIENT_ID: z.string().optional(),
    YT_CLIENT_SECRET: z.string().optional(),
    YT_REFRESH_TOKEN: z.string().optional(),
    GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
    GCP_SERVICE_ACCOUNT_JSON: z.string().optional(),
    SHORTS_OPTIMIZER_OUT_DIR: z.string().optional(),
    SHORTS_OPTIMIZER_FIXTURE: z.string().optional(),
    SHORTS_OPTIMIZER_MOCK: z.string().optional(),
  })
  .passthrough();

export type YouTubeAuthMode = "oauth_refresh" | "adc" | "none";

export interface RuntimeConfig {
  repoRoot: string;
  outDir: string;
  fixturePath: string;
  mockMode: boolean;
  mockReason: string | null;
  openAiApiKey: string | null;
  openAiModel: string;
  youTubeAuthMode: YouTubeAuthMode;
  ytClientId: string | null;
  ytClientSecret: string | null;
  ytRefreshToken: string | null;
  gcpServiceAccountJson: string | null;
}

function toBool(input: string | undefined): boolean {
  if (!input) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(input.toLowerCase());
}

function resolvePath(repoRoot: string, value: string | undefined, fallback: string): string {
  if (!value || !value.trim()) {
    return fallback;
  }

  return path.isAbsolute(value)
    ? value
    : path.resolve(repoRoot, value);
}

export function loadRuntimeConfig(params: {
  env: NodeJS.ProcessEnv;
  repoRoot: string;
  forceMock: boolean;
}): RuntimeConfig {
  const parsed = envSchema.parse(params.env);

  const defaultFixturePath = path.resolve(
    params.repoRoot,
    "apps/shorts-optimizer/fixtures/mock-shorts.json",
  );

  const fixturePath = resolvePath(
    params.repoRoot,
    parsed.SHORTS_OPTIMIZER_FIXTURE,
    defaultFixturePath,
  );

  const outDir = resolvePath(
    params.repoRoot,
    parsed.SHORTS_OPTIMIZER_OUT_DIR,
    path.resolve(params.repoRoot, "out"),
  );

  const hasOAuthRefresh = Boolean(
    parsed.YT_CLIENT_ID && parsed.YT_CLIENT_SECRET && parsed.YT_REFRESH_TOKEN,
  );
  const hasAdc = Boolean(
    parsed.GOOGLE_APPLICATION_CREDENTIALS || parsed.GCP_SERVICE_ACCOUNT_JSON,
  );

  const youTubeAuthMode: YouTubeAuthMode = hasOAuthRefresh
    ? "oauth_refresh"
    : hasAdc
      ? "adc"
      : "none";

  let mockMode = params.forceMock || toBool(parsed.SHORTS_OPTIMIZER_MOCK);
  let mockReason: string | null = null;

  if (!mockMode && youTubeAuthMode === "none") {
    mockMode = true;
    mockReason =
      "No YouTube credentials detected (YT_* or ADC). Falling back to fixture mode.";
  }

  if (params.forceMock && !mockReason) {
    mockReason = "--mock was provided.";
  }

  return {
    repoRoot: params.repoRoot,
    outDir,
    fixturePath,
    mockMode,
    mockReason,
    openAiApiKey: parsed.OPENAI_API_KEY?.trim() || null,
    openAiModel: parsed.OPENAI_MODEL,
    youTubeAuthMode,
    ytClientId: parsed.YT_CLIENT_ID?.trim() || null,
    ytClientSecret: parsed.YT_CLIENT_SECRET?.trim() || null,
    ytRefreshToken: parsed.YT_REFRESH_TOKEN?.trim() || null,
    gcpServiceAccountJson: parsed.GCP_SERVICE_ACCOUNT_JSON?.trim() || null,
  };
}
