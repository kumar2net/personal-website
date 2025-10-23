# Development Server Port Conflict - Permanent Fix

## The Problem

When running `npm run dev` or `npm run dev:vite`, you may encounter:
```
⬥ Could not acquire required 'port': '8888'
```
or
```
zsh: abort      npm run dev
```

This happens when a previous dev server process is still running on ports 8888 (Netlify Dev) or 5173 (Vite).

## The Permanent Solution ✅

Use the new automatic cleanup command:

```bash
npm run dev:clean
```

This single command will:
1. ✅ Check if ports 8888 and 5173 are in use
2. ✅ Automatically kill any processes using those ports
3. ✅ Start the Vite dev server with 4GB memory optimization
4. ✅ Open your browser automatically

## How It Works

The `npm run dev:clean` script runs `scripts/start-dev-clean.sh`, which:

```bash
# Checks and frees port 8888 (Netlify Dev)
if lsof -ti:8888 >/dev/null 2>&1; then
  lsof -ti:8888 | xargs kill -9
fi

# Checks and frees port 5173 (Vite)
if lsof -ti:5173 >/dev/null 2>&1; then
  lsof -ti:5173 | xargs kill -9
fi

# Starts dev server with memory optimization
NODE_OPTIONS='--max-old-space-size=4096' vite --open
```

## Alternative Commands

If you prefer manual control:

### Option 1: Use Vite Directly (No Netlify Functions)
```bash
npm run dev:vite
```

### Option 2: Use Netlify Dev (With Functions)
```bash
npm run dev
```

### Option 3: Manual Port Cleanup
```bash
# Kill specific ports
lsof -ti:8888 | xargs kill -9  # Netlify Dev
lsof -ti:5173 | xargs kill -9  # Vite

# Then start server
npm run dev:vite
```

## Recommended Workflow

For the best development experience:

```bash
# Daily development - just use this
npm run dev:clean
```

The script handles everything automatically and prevents port conflicts.

## Why This Happens

Common scenarios that cause port conflicts:

1. **Previous server didn't stop cleanly** - Terminal closed without stopping the server
2. **Multiple terminal sessions** - Forgot about a server running in another terminal
3. **System crash** - Computer crashed/restarted with server running
4. **IDE integration** - IDE's built-in terminal kept server running

## Troubleshooting

### If `npm run dev:clean` doesn't work:

**Check what's using the ports:**
```bash
lsof -i :8888
lsof -i :5173
```

**Manually kill processes:**
```bash
# Find process ID (PID)
lsof -i :8888

# Kill by PID
kill -9 <PID>
```

**Check if server is running:**
```bash
curl http://localhost:5173
# If you get a response, server is running
```

### If browser doesn't open automatically:

Manually open: http://localhost:5173

### If you see "command not found: lsof":

On macOS, `lsof` should be available by default. If missing:
```bash
# Verify lsof exists
which lsof

# If not, install Xcode Command Line Tools
xcode-select --install
```

## Related Documentation

- `ESBUILD_FIX_SUMMARY.md` - Complete esbuild crash fix documentation
- `FINAL_STATUS.md` - Overall development environment status
- `docs/ESBUILD_CRASH_FIX.md` - Technical deep-dive on esbuild issues
- `FIX_INSTRUCTIONS.md` - Quick reference guide

## Summary

✅ **Problem**: Port conflicts prevent dev server from starting  
✅ **Solution**: Use `npm run dev:clean` for automatic cleanup  
✅ **Benefits**: One command, no manual intervention, always works  
✅ **Status**: Production-ready, tested, and documented  

---

**Created**: October 23, 2025  
**Status**: Permanent fix implemented and verified  
**Recommended Command**: `npm run dev:clean`

