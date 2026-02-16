import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envCandidates = [
  path.resolve(__dirname, "../../.env.local"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, ".env.local"),
  path.resolve(__dirname, ".env"),
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
  { prefix: "/api/semantic-search", modulePath: "./api/semantic-search.js" },
  { prefix: "/api/blog-tts", modulePath: "./api/blog-tts.js" },
  { prefix: "/api/engagement", modulePath: "./api/engagement.js" },
  { prefix: "/api/agi", modulePath: "./api/agi.js" },
];

let LOCAL_API_ROUTES = null;
let localApiRoutesLoading = null;

async function getLocalApiRoutes() {
  if (LOCAL_API_ROUTES) {
    return LOCAL_API_ROUTES;
  }

  if (localApiRoutesLoading) {
    return localApiRoutesLoading;
  }

  localApiRoutesLoading = Promise.all(
    LOCAL_API_ROUTE_DEFINITIONS.map(async ({ prefix, modulePath }) => {
      const imported = await import(modulePath);
      return { prefix, handler: imported.default };
    }),
  ).then((routes) => {
    LOCAL_API_ROUTES = routes;
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
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
});
