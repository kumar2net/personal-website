# Netlify Dev - esbuild Crash Bug Report

## Issue Summary
`netlify dev` command crashes with esbuild goroutine deadlock when processing a large React/Vite project.

## Environment
- **OS**: macOS 25.0.0 (darwin)
- **Node Version**: 20
- **netlify-cli Version**: 23.1.4
- **Vite Version**: 5.0.12
- **Project Type**: React SPA with Vite bundler

## Error Description
When running `npm run dev` (which executes `netlify dev`), the process crashes with multiple esbuild goroutines stuck in "chan receive" state for 2+ minutes, eventually aborting with signal:
```
zsh: abort      npm run dev
```

## Stack Trace Sample
```
goroutine 1831 [chan receive, 2 minutes]:
main.(*serviceType).sendRequest(0x1400009eb10, {0x1025de700, 0x14014b32d80})
        github.com/evanw/esbuild/cmd/esbuild/service.go:192 +0x138
main.(*serviceType).convertPlugins.func2.3({{0x14002a39230, 0x6}, {0x14002b363f0, 0x69}, {0x1024a1cba, 0x4}, {0x14002b363f0, _}, _, {_, ...}, ...})
        github.com/evanw/esbuild/cmd/esbuild/service.go:997 +0x7c4
github.com/evanw/esbuild/internal/bundler.RunOnResolvePlugins({0x1400059c0c0?, 0x0?, 0x0?}, 0x1400064fb08, {0x140009000e0, 0x1400000c9a8, 0x1400000c9c0, 0x14000326720, 0x4, 0x1400058c1e0}, ...)
        github.com/evanw/esbuild/internal/bundler/bundler.go:1010 +0x690
```

## Project Structure Context
- 44+ React blog post JSX files in `src/pages/blog/`
- 113+ documentation files in `docs/` directory
- Large `node_modules` with multiple heavy dependencies (pdfjs-dist, tesseract.js, docx-preview)
- Multiple static asset directories (EPUB/, KPF/, kumar_life_teaser/, etc.)

## Root Cause
esbuild (used by Vite/Netlify Dev) attempts to watch and process too many files simultaneously, leading to:
1. Memory exhaustion
2. Goroutine deadlock in the resolver/bundler
3. Process abort after 2-minute timeout

## Workaround Applied
### 1. Increased Node.js Memory Limit
Updated `package.json` and `netlify.toml` to allocate 4GB RAM:
```json
"dev": "NODE_OPTIONS='--max-old-space-size=4096' netlify dev"
```

### 2. Optimized Vite Configuration
Added comprehensive file watching exclusions in `vite.config.js`:
```javascript
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
      '**/*.md',
      '**/*.pdf',
      '**/*.docx',
      '**/*.log',
      '**/*.json',
    ],
  },
},
optimizeDeps: {
  exclude: ['docx-preview', 'tesseract.js', 'pdfjs-dist'],
}
```

## Recommendations for Netlify CLI
1. **Memory Management**: Auto-detect large projects and suggest/apply increased memory limits
2. **File Watching**: Implement smarter defaults for excluding common non-source directories
3. **Error Handling**: Provide clearer error messages when esbuild crashes (instead of silent goroutine dumps)
4. **Documentation**: Add troubleshooting guide for esbuild crashes in large projects
5. **Performance**: Consider lazy-loading or chunked file processing for projects with 40+ page components

## Reproduction Steps
1. Create React/Vite project with 40+ JSX page components
2. Add 100+ static files in various directories
3. Include heavy dependencies (pdfjs, tesseract, docx-preview)
4. Run `netlify dev` without memory optimizations
5. Observe esbuild goroutine deadlock after ~2 minutes

## Expected Behavior
`netlify dev` should either:
- Successfully start the dev server with appropriate memory allocation
- Provide clear error message about resource constraints
- Auto-exclude common non-source directories from watching

## Actual Behavior
Process crashes with cryptic esbuild goroutine stack traces and aborts.

## Additional Notes
This issue appears related to esbuild's internal goroutine management when handling large dependency graphs. Similar issues reported in esbuild GitHub issues but not well-documented in Netlify CLI context.

## Files Modified for Fix
- `vite.config.js` - Added watch exclusions and optimizeDeps
- `package.json` - Increased Node memory via NODE_OPTIONS
- `netlify.toml` - Applied NODE_OPTIONS to dev command

---

**Reported by**: Kumar
**Date**: October 22, 2025
**Issue Type**: Performance / Resource Management
**Severity**: High (blocks development workflow)

