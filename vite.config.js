import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { readdirSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'terser',
    cssMinify: true,
    sourcemap: false,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['framer-motion', 'react-helmet-async', 'react-markdown', 'remark-gfm']
        }
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
    historyApiFallback: true,
  },
})
