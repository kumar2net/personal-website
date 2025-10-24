import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Ensure single React instance to prevent useContext errors
    dedupe: ['react', 'react-dom', 'framer-motion'],
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    cssMinify: true,
    sourcemap: false,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) {
            return undefined
          }

          // Core React runtime
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) {
            return 'react-core'
          }

          // Router utilities
          if (id.includes('/node_modules/react-router/')) {
            return 'react-router'
          }

          // Animation libraries
          if (id.includes('/node_modules/framer-motion/')) {
            return 'framer'
          }

          // Markdown pipeline
          if (
            id.includes('/node_modules/react-markdown/') ||
            id.includes('/node_modules/remark-') ||
            id.includes('/node_modules/rehype-')
          ) {
            return 'markdown'
          }

          // Icon libraries in their own chunk
          if (
            id.includes('/node_modules/react-icons/') ||
            id.includes('/node_modules/@heroicons/') ||
            id.includes('/node_modules/lucide-react/')
          ) {
            return 'icons'
          }

          // Helmet and other small utilities
          if (id.includes('/node_modules/react-helmet-async/')) {
            return 'helmet'
          }

          // Everything else from node_modules goes to vendor
          return 'vendor'
        },
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Copy public directory to dist
    copyPublicDir: true,
    // Optimize chunks
    chunkSizeWarningLimit: 500,
    // Enable terser optimizations
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      }
    }
  },
  publicDir: 'public',
  // Ensure Vite treats .docx as static assets when imported with ?url
  assetsInclude: ['**/*.docx'],
  server: {
    port: 5173,
    host: true,
    open: true,
    historyApiFallback: true,
    watch: {
      // Exclude heavy directories from file watching to prevent esbuild crashes
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/docs/**',
        '**/backend/**',
        '**/Library/**',
        '**/scripts/**',
        '**/.git/**',
        '**/EPUB/**',
        '**/KPF/**',
        '**/kumar_life_teaser/**',
        '**/The_Last_Drop_of_Water_KDP_Ready_KC/**',
        '**/*.md',
        '**/*.pdf',
        '**/*.docx',
        '**/*.log',
        '**/*.json',
      ],
      usePolling: false,
    },
    // Increase the maximum number of files to watch
    fs: {
      strict: false,
    },
    // Add CORS headers for development
    cors: true,
  },
  // Optimize dependencies to prevent esbuild crashes
  optimizeDeps: {
    exclude: ['docx-preview', 'tesseract.js', 'pdfjs-dist'],
    esbuildOptions: {
      // Increase memory limit for esbuild
      target: 'es2020',
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
