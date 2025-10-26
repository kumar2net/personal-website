import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Ensure single React instance to prevent useContext errors
    dedupe: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-router",
      "framer-motion",
    ],
    alias: {
      // Force single React Router instance to prevent context errors
      "react-router-dom": resolve("node_modules/react-router-dom"),
      "react-router": resolve("node_modules/react-router"),
      react: resolve("node_modules/react"),
      "react-dom": resolve("node_modules/react-dom"),
    },
  },
  define: {
    // Ensure NODE_ENV is properly defined for production
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "production",
    ),
  },
  build: {
    outDir: "dist",
    minify: "terser",
    cssMinify: true,
    sourcemap: false,
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          // Keep React Router in its own chunk to prevent context issues
          if (
            id.includes("/node_modules/react-router-dom/") ||
            id.includes("/node_modules/react-router/")
          ) {
            return "react-router";
          }

          // Keep React core in its own chunk
          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/")
          ) {
            return "react-core";
          }

          if (id.includes("/node_modules/framer-motion/")) {
            return "framer";
          }

          if (
            id.includes("/node_modules/react-markdown/") ||
            id.includes("/node_modules/remark-") ||
            id.includes("/node_modules/rehype-")
          ) {
            return "markdown";
          }

          if (
            id.includes("/node_modules/react-icons/") ||
            id.includes("/node_modules/@heroicons/") ||
            id.includes("/node_modules/lucide-react/")
          ) {
            return "icons";
          }

          return "vendor";
        },
        // Optimize chunk naming for better caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
      // Ensure external dependencies are properly handled
      external: [],
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
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
      },
      mangle: {
        // Preserve React Router function names to prevent context issues
        reserved: ["createContext", "useContext", "Router", "BrowserRouter"],
      },
    },
  },
  publicDir: "public",
  // Ensure Vite treats .docx as static assets when imported with ?url
  assetsInclude: ["**/*.docx"],
  server: {
    port: 5173,
    host: true,
    open: true,
    historyApiFallback: true,
    watch: {
      // Exclude heavy directories from file watching to prevent esbuild crashes
      ignored: [
        "**/node_modules/**",
        "**/dist/**",
        "**/docs/**",
        "**/backend/**",
        "**/Library/**",
        "**/scripts/**",
        "**/.git/**",
        "**/EPUB/**",
        "**/KPF/**",
        "**/kumar_life_teaser/**",
        "**/The_Last_Drop_of_Water_KDP_Ready_KC/**",
        "**/*.md",
        "**/*.pdf",
        "**/*.docx",
        "**/*.log",
        "**/*.json",
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
    include: [
      "react-router-dom",
      "react-router",
      "react",
      "react-dom",
      "react/jsx-runtime",
    ],
    exclude: ["docx-preview", "tesseract.js", "pdfjs-dist"],
    esbuildOptions: {
      // Increase memory limit for esbuild
      target: "es2020",
      loader: {
        ".js": "jsx",
      },
      define: {
        global: "globalThis",
      },
    },
    force: true, // Force re-optimization of dependencies
  },
  // Ensure proper environment variables
  envPrefix: ["VITE_", "NODE_ENV"],
});
