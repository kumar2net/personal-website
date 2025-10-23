# 🧹 Chrome DevTools: Clear Service Worker & Cache

## The Problem

The errors you're seeing are **NOT** from your code. They're from:
1. **Old Service Worker** still running from before our fixes
2. **Cached modules** with the old broken code

## The Solution (30 seconds)

### Visual Step-by-Step Guide

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Open Chrome DevTools                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Press: Cmd + Option + I  (Mac)                         │
│        F12                (Windows/Linux)               │
│                                                         │
│ OR right-click anywhere → "Inspect"                    │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Step 2: Go to Application Tab                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ DevTools Top Menu:                                      │
│ [ Elements ][ Console ][ Sources ]→[ Application ]←    │
│                                                         │
│ Click the "Application" tab                            │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Step 3: Unregister Service Workers                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Left Sidebar:                                           │
│   Manifest                                              │
│   └─ Service Workers     ← Click this                  │
│   └─ Storage                                            │
│   └─ Cache                                              │
│                                                         │
│ Main Panel will show:                                   │
│   http://localhost:5173                                 │
│   Status: #activated and is running                    │
│   [Unregister] ← Click this button                     │
│                                                         │
│ ✅ Check "Update on reload"                            │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Step 4: Clear All Storage                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Left Sidebar:                                           │
│   Storage                                               │
│   └─ Clear storage       ← Click this                  │
│                                                         │
│ Main Panel will show checkboxes:                        │
│   ✅ Application cache                                  │
│   ✅ Cache storage                                      │
│   ✅ Cookies                                            │
│   ✅ Local storage                                      │
│   ✅ Session storage                                    │
│                                                         │
│ Click: [Clear site data]  ← Click this button         │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Step 5: Hard Reload Page                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Press: Cmd + Shift + R  (Mac)                          │
│        Ctrl + Shift + R  (Windows/Linux)                │
│                                                         │
│ OR                                                      │
│                                                         │
│ Right-click the refresh button → "Empty Cache and      │
│                                   Hard Reload"          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## What You Should See After Clearing

### ✅ Console Tab (No Errors)
```
[vite] connecting...
[vite] connected.
Service Worker unregistered in development mode
```

### ❌ Should NOT See
```
❌ sw.js:107 Uncaught (in promise) TypeError: Failed to fetch
❌ WebSocket connection to 'ws://localhost:undefined' failed
❌ TypeError: Cannot read properties of null (reading 'useContext')
❌ ErrorBoundary caught an error
```

## Alternative: Incognito Mode (Quickest)

If you want to test immediately without clearing:

1. **Open Incognito Window**
   ```
   Cmd + Shift + N  (Mac)
   Ctrl + Shift + N  (Windows/Linux)
   ```

2. **Navigate to**
   ```
   http://localhost:5173
   ```

3. **Benefits**:
   - No Service Worker
   - No cache
   - Fresh start
   - Instant verification

## Verification Checklist

After clearing and reloading, check:

### DevTools → Console Tab
- [ ] `[vite] connected.` appears
- [ ] `Service Worker unregistered in development mode` appears
- [ ] No red errors visible
- [ ] No "Failed to fetch" errors
- [ ] No "Cannot read properties of null" errors

### DevTools → Network Tab
- [ ] All requests show `200 OK` or `304`
- [ ] WebSocket shows "101 Switching Protocols" (green)
- [ ] No failed requests (red)

### DevTools → Application Tab → Service Workers
- [ ] Should show "No service workers found" or empty list

### Page Behavior
- [ ] Page loads and renders correctly
- [ ] No error boundary showing
- [ ] React app displays properly

## If Issues Persist

### Nuclear Option: Close Everything

```bash
# 1. Close Chrome completely (Quit, not just close window)
# 2. Clear Vite cache
cd /Users/kumar/personal-website
rm -rf node_modules/.vite
rm -rf dist

# 3. Restart dev server
npm run dev:vite

# 4. Open Chrome Incognito
open -na "Google Chrome" --args --incognito http://localhost:5173
```

### Check Service Worker File

If Service Worker won't unregister:

```bash
# Temporarily rename it
cd /Users/kumar/personal-website/public
mv sw.js sw.js.backup

# Reload browser
# Then restore
mv sw.js.backup sw.js
```

## Why This Happens

**Before our fixes**:
- Service Worker registered on every page load
- Cached all resources aggressively
- Intercepted all fetch requests

**After our fixes**:
- Service Worker code updated to NOT register in dev
- But browser still has OLD Service Worker running
- Old Service Worker still caching/intercepting
- Must manually clear to apply new behavior

**After you clear**:
- No Service Worker in development
- Fresh code loads every time
- HMR works perfectly
- No more cache issues

## Summary

**The code is fixed.** You just need to clear the browser's old cache.

**Time needed**: 30 seconds  
**Difficulty**: Easy  
**Result**: Clean development environment  

---

**Quick Steps**:
1. DevTools → Application → Service Workers → Unregister
2. DevTools → Application → Clear storage → Clear site data
3. Cmd + Shift + R (hard reload)
4. ✅ Done!

**OR**:
- Open Incognito → http://localhost:5173 ✅

---

After clearing, your Chrome DevTools will be clean and you can continue development! 🚀


