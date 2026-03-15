import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT_CANDIDATES = [
  process.cwd(),
  __dirname,
  path.resolve(__dirname, "../.."),
];
const APP_ROOT = APP_ROOT_CANDIDATES.find((candidate) => {
  if (!candidate) {
    return false;
  }
  return (
    fs.existsSync(path.resolve(candidate, "package.json")) &&
    fs.existsSync(path.resolve(candidate, "src")) &&
    fs.existsSync(path.resolve(candidate, "api"))
  );
}) || process.cwd();

const envCandidates = [
  path.resolve(APP_ROOT, "../../.env.local"),
  path.resolve(APP_ROOT, "../../.env"),
  path.resolve(APP_ROOT, ".env.local"),
  path.resolve(APP_ROOT, ".env"),
];
for (const candidate of envCandidates) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate, override: false });
  }
}

function enhanceResponse(res) {
  if (res.__enhanced) {
    return res;
  }
  res.__enhanced = true;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    if (!res.headersSent && !res.getHeader("Content-Type")) {
      res.setHeader("Content-Type", "application/json");
    }
    res.end(JSON.stringify(data));
  };
  res.send = (payload) => {
    if (Buffer.isBuffer(payload)) {
      res.end(payload);
      return;
    }
    if (typeof payload === "object") {
      if (!res.headersSent && !res.getHeader("Content-Type")) {
        res.setHeader("Content-Type", "application/json");
      }
      res.end(JSON.stringify(payload));
      return;
    }
    res.end(payload);
  };
  return res;
}

const LOCAL_API_ROUTE_DEFINITIONS = [
  { prefix: "/api/semantic-search", filePath: "api/semantic-search.js" },
  { prefix: "/api/blog-tts", filePath: "api/blog-tts.js" },
  { prefix: "/api/engagement", filePath: "api/engagement.js" },
  { prefix: "/api/keydata", filePath: "api/keydata.js" },
];

let LOCAL_API_ROUTES = null;
let localApiRoutesLoading = null;
let LOCAL_API_ROUTES_SIGNATURE = "";

function getLocalApiModuleUrl(filePath) {
  const absoluteFilePath = path.resolve(APP_ROOT, filePath);
  const stats = fs.statSync(absoluteFilePath);
  const moduleUrl = pathToFileURL(absoluteFilePath).href;
  return {
    absoluteFilePath,
    moduleUrl: `${moduleUrl}?v=${stats.mtimeMs}`,
    signaturePart: `${absoluteFilePath}:${stats.mtimeMs}`,
  };
}

async function getLocalApiRoutes() {
  const resolvedModules = LOCAL_API_ROUTE_DEFINITIONS.map(({ prefix, filePath }) => ({
    prefix,
    ...getLocalApiModuleUrl(filePath),
  }));
  const signature = resolvedModules
    .map(({ prefix, signaturePart }) => `${prefix}:${signaturePart}`)
    .join("|");

  if (LOCAL_API_ROUTES && LOCAL_API_ROUTES_SIGNATURE === signature) {
    return LOCAL_API_ROUTES;
  }

  if (localApiRoutesLoading) {
    return localApiRoutesLoading;
  }

  localApiRoutesLoading = Promise.all(
    resolvedModules.map(async ({ prefix, moduleUrl, absoluteFilePath }) => {
      const imported = await import(moduleUrl);
      if (typeof imported.default !== "function") {
        throw new Error(`Local API route "${absoluteFilePath}" does not export a default handler`);
      }
      return { prefix, handler: imported.default };
    }),
  ).then((routes) => {
    LOCAL_API_ROUTES = routes;
    LOCAL_API_ROUTES_SIGNATURE = signature;
    localApiRoutesLoading = null;
    return routes;
  }).catch((error) => {
    localApiRoutesLoading = null;
    throw error;
  });

  return localApiRoutesLoading;
}

function localApiPlugin() {
  return {
    name: "dev-local-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const match = LOCAL_API_ROUTE_DEFINITIONS.find(({ prefix }) =>
          req.url?.startsWith(prefix),
        );

        if (!match) {
          next();
          return;
        }

        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("error", (err) => {
          console.error("[dev-api] request stream failed", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Request stream failed" }));
        });
        req.on("end", async () => {
          req.body = chunks.length ? Buffer.concat(chunks).toString() : "";
          try {
            const routes = await getLocalApiRoutes();
            const handlerMatch = routes.find(({ prefix }) =>
              req.url?.startsWith(prefix),
            );
            if (!handlerMatch) {
              next();
              return;
            }

            await handlerMatch.handler(req, enhanceResponse(res));
          } catch (err) {
            console.error("[dev-api] handler error", err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Local API handler failed",
                  details: err?.message || String(err),
                }),
              );
            }
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(APP_ROOT, "src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
