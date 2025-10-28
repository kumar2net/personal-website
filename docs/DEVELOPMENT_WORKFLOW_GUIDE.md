# Development Workflow Guide - Stable & Reliable

**Last Updated**: October 28, 2025
**Status**: ✅ **PRODUCTION-READY WORKFLOW**

This guide provides a stable and reliable workflow for developing on this project. The previous issues related to `esbuild` crashes, port conflicts, and Service Worker interference have been permanently fixed.

## 🚀 Quick Start Commands

### **Primary Development** (Recommended for most tasks):
```bash
npm run dev
```
- ✅ **Stable Vite server** on **http://localhost:5173**
- ✅ **Clean console** with no errors or failed requests.
- ✅ **Hot Module Replacement** (HMR) for instant updates.

### **When You Need Netlify Functions**:
```bash
npm run dev:netlify
```
- 🔧 Use this command only when you need to test serverless functions (e.g., contact forms, API endpoints).
- 📡 Runs on **http://localhost:8888**.

### **Automatic Port Cleanup**:
If you encounter a "port already in use" error, this command will clear the ports and restart the server.
```bash
npm run dev:clean
```
- 🧹 Kills any lingering processes on ports 8888 and 5173.
- 🚀 Starts the Vite server automatically.

## 🛠️ Troubleshooting Guide

### **Browser Caching and Service Worker Issues**
If you experience unexpected behavior or see errors related to caching after switching branches or pulling new code, your browser might be holding on to old assets.

**Solution: Clear Cache and Service Worker**

1.  **Open Chrome DevTools** (`Cmd + Option + I` on Mac, `F12` or `Ctrl + Shift + I` on Windows).
2.  Go to the **Application** tab.
3.  On the left sidebar, click **Service Workers**.
    -   Click **Unregister** for any active service workers.
    -   Check the **"Update on reload"** box.
4.  On the left sidebar, click **Storage**.
    -   Click the **"Clear site data"** button.
5.  **Hard Reload the Page** (`Cmd + Shift + R` on Mac, `Ctrl + Shift + R` on Windows).

### **Port Conflicts: "Could not acquire required 'port'"**
This error means another process is already using the port the dev server needs.

**Solution:**
Use the automatic cleanup command:
```bash
npm run dev:clean
```

Or, do it manually:
```bash
# Find and kill the process on the required port (e.g., 5173)
lsof -ti:5173 | xargs kill -9
```

## ✅ Summary of Fixes Applied

The development environment is now stable due to the following permanent fixes:
-   **`esbuild` Crash**: Resolved by increasing Node.js memory allocation to 4GB and optimizing Vite's file-watching configuration to ignore non-essential directories (`vite.config.js`).
-   **Service Worker Interference**: The application now automatically unregisters any active Service Workers in development mode to prevent caching issues and ensure HMR works correctly (`src/main.jsx`).
-   **Port Conflicts**: A new `npm run dev:clean` script was added to automatically handle port cleanup.

These changes ensure a smooth, fast, and reliable development experience without the need for manual workarounds.
