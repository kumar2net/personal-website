# esbuild Crash Fix Documentation

## Problem
The development server (`npm run dev`) was crashing with esbuild goroutine deadlocks, causing the process to abort after hanging for 2+ minutes.

## Root Cause
esbuild (used by Vite bundler under Netlify Dev) was attempting to watch and process too many files simultaneously in the project:
- 44+ blog post JSX files
- 113+ documentation files
- Heavy dependencies (pdfjs-dist, tesseract.js, docx-preview)
- Multiple static asset directories

This led to memory exhaustion and goroutine deadlock in esbuild's bundler/resolver.

## Solution Applied

### 1. Memory Limit Increase
Increased Node.js heap memory to 4GB to handle larger projects:

**package.json**:
```json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--max-old-space-size=4096' netlify dev",
    "dev:vite": "NODE_OPTIONS='--max-old-space-size=4096' vite --open"
  }
}
```

**netlify.toml**:
```toml
[dev]
  command = "NODE_OPTIONS='--max-old-space-size=4096' vite"
```

### 2. File Watching Optimization
Configured Vite to exclude non-essential directories and files from the watch process:

**vite.config.js**:
```javascript
export default defineConfig({
  server: {
    watch: {
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
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    exclude: ['docx-preview', 'tesseract.js', 'pdfjs-dist'],
    esbuildOptions: {
      target: 'es2020',
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
```

## Why This Works

1. **Increased Memory**: Provides esbuild with enough RAM to handle the large dependency graph without crashing
2. **Selective Watching**: Reduces the number of files esbuild needs to track, preventing goroutine overload
3. **Dependency Exclusion**: Keeps heavy packages (PDF/OCR/document processors) out of the optimization phase
4. **File System Optimization**: Disables strict mode to handle symlinks and special files better

## Verification
After applying these changes:
1. Clean node_modules: `rm -rf node_modules && npm install`
2. Start dev server: `npm run dev`
3. Verify no goroutine crashes occur
4. Confirm hot module replacement (HMR) works correctly for JSX files

## Prevention
To prevent similar issues in the future:
- Keep non-source files in clearly separated directories
- Use `.gitignore` patterns that align with Vite watch exclusions
- Monitor project growth and adjust memory limits as needed
- Consider code-splitting for projects with 50+ page components

## Bug Report Filed
A detailed bug report has been created in `NETLIFY_BUG_REPORT.md` for submission to the Netlify CLI team.

## Related Files
- `vite.config.js` - Build and dev server configuration
- `package.json` - Script definitions with memory limits
- `netlify.toml` - Netlify-specific dev environment config
- `NETLIFY_BUG_REPORT.md` - Formal bug report for Netlify team

---

**Fix Applied**: October 22, 2025
**Status**: Permanent solution implemented
**Performance Impact**: Minimal (reduced file watching overhead may improve startup time)

