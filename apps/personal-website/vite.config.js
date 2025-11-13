import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'node:fs'
import dotenv from 'dotenv'

const envFiles = [
  path.resolve(__dirname, '.env.local'),
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '../../.env.local'),
  path.resolve(__dirname, '../../.env'),
];

envFiles.forEach((envPath) => {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
});

const API_ROUTES = [
  {
    prefix: '/api/convert',
    name: 'convert',
    load: () => import('./api/convert.js'),
  },
  {
    prefix: '/api/semantic-search',
    name: 'semantic-search',
    load: () => import('./api/semantic-search.js'),
  },
  {
    prefix: '/api/tldr',
    name: 'tldr',
    load: () => import('./api/tldr.js'),
  },
];

const BODY_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

const getRouteHandler = async (route) => {
  if (!route._handlerPromise) {
    route._handlerPromise = route
      .load()
      .then((mod) => mod.default || mod);
  }
  return route._handlerPromise;
};

const attachResponseHelpers = (res) => {
  const original = {
    status: res.status?.bind(res),
    json: res.json?.bind(res),
    send: res.send?.bind(res),
  };

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  res.json = (body) => {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.end(JSON.stringify(body));
    return res;
  };

  res.send = (body) => {
    if (body && typeof body === 'object' && !Buffer.isBuffer(body)) {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(JSON.stringify(body));
    } else {
      res.end(body);
    }
    return res;
  };

  return () => {
    if (original.status) {
      res.status = original.status;
    } else {
      delete res.status;
    }
    if (original.json) {
      res.json = original.json;
    } else {
      delete res.json;
    }
    if (original.send) {
      res.send = original.send;
    } else {
      delete res.send;
    }
  };
};

const withLocalApi = () => ({
  name: 'local-api-mock',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url) {
        return next();
      }

      const route = API_ROUTES.find(({ prefix }) =>
        req.url?.startsWith(prefix),
      );
      if (!route) {
        return next();
      }

      const restoreStatus = attachResponseHelpers(res);

      try {
        if (req.method && BODY_METHODS.has(req.method.toUpperCase())) {
          req.body = await readRequestBody(req);
        }
        const handler = await getRouteHandler(route);
        await handler(req, res);
      } catch (error) {
        console.error(`[local-api-mock] ${route.name} error`, error);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Local ${route.name} API failed` }));
        }
      } finally {
        restoreStatus();
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), withLocalApi()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['react-markdown'],
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    open: false,
  },
})
