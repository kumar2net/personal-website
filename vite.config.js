import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { readdirSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: [
            'framer-motion',
            'react-helmet-async',
            'react-markdown',
            'remark-gfm',
            'remark-frontmatter'
          ]
        }
      }
    },
    // Copy public directory to dist
    copyPublicDir: true
  },
  publicDir: 'public',
  // Ensure Vite treats .docx as static assets when imported with ?url
  assetsInclude: ['**/*.docx'],
  server: {
    historyApiFallback: true,
  },
})
