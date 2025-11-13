import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const rootNodeModules = path.resolve(__dirname, '../../node_modules')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react-router-dom': path.join(rootNodeModules, 'react-router-dom'),
    },
  },
  optimizeDeps: {
    include: ['react-markdown', 'react-router-dom'],
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
