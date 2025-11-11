import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import convertHandler from '../../api/convert.js'

const withLocalApi = () => ({
  name: 'local-api-mock',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/convert')) {
        return next();
      }

      const responder = () => ({
        json(body) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        },
        end(body) {
          res.end(body);
        },
      });

      const originalStatus = res.status?.bind(res);
      res.status = (code) => {
        res.statusCode = code;
        return responder();
      };
      res.json = (body) => responder().json(body);

      try {
        await convertHandler(req, res);
      } catch (error) {
        console.error('[local-api-mock] convert error', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Local convert API failed' }));
      } finally {
        res.status = originalStatus ?? res.status;
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
