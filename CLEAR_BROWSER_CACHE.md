# 🧹 Clear Browser Cache and Service Worker

## Critical: You Must Clear Browser Cache

The errors you're seeing are because:
1. Old Service Worker is still active
2. Browser cache has old modules

## Steps to Fix

### 1. Clear Service Worker (Required)
**In Chrome DevTools**:
1. Open DevTools: `Cmd + Option + I`
2. Go to **Application** tab
3. Click **Service Workers** (left sidebar)
4. Click **Unregister** next to any listed workers
5. Check **Update on reload**

### 2. Clear Cache (Required)
**Hard Reload in Chrome**:
```
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows/Linux)
```

OR **Clear All Cache**:
1. DevTools → Application tab
2. Click **Clear storage** (left sidebar)
3. Check all boxes
4. Click **Clear site data**

### 3. Restart Dev Server
```bash
# Kill all processes
pkill -9 -f "vite"

# Clear Vite cache
rm -rf node_modules/.vite

# Restart
npm run dev:vite
```

### 4. Refresh Browser
```
Cmd + Shift + R (hard reload)
```

## What Should Happen

**Console should show**:
```
✅ Service Worker unregistered in development mode
✅ [vite] connected.
✅ No "Failed to fetch" errors
✅ No "Cannot read properties of null" errors
```

## If Errors Persist

### Method 1: Incognito Mode
1. Open Chrome Incognito: `Cmd + Shift + N`
2. Visit http://localhost:5173
3. This bypasses all cache

### Method 2: Clear Everything
```bash
# In Chrome
# Settings → Privacy and security → Clear browsing data
# Select:
# ✅ Cached images and files
# ✅ Cookies and other site data
# Time range: All time
```

### Method 3: Nuclear Option
```bash
# Close Chrome completely
# Clear Vite cache
rm -rf node_modules/.vite
rm -rf dist

# Restart dev server
npm run dev:vite

# Open Chrome in Incognito
open -na "Google Chrome" --args --incognito http://localhost:5173
```

## Why This Is Needed

The old Service Worker (from before our fixes) is:
- Intercepting fetch requests
- Serving cached (broken) modules
- Causing WebSocket errors
- Creating React duplicate instances

Once cleared, the new code will:
- ✅ NOT register Service Worker in dev
- ✅ Load fresh modules every time
- ✅ Use single React instance
- ✅ Connect WebSocket properly

## Quick Command Sequence

```bash
# 1. Kill dev server
pkill -9 -f "vite"

# 2. Clear Vite cache
rm -rf node_modules/.vite

# 3. Start dev server
npm run dev:vite

# 4. In Chrome DevTools:
#    - Application → Service Workers → Unregister all
#    - Application → Clear storage → Clear site data
#    - Cmd + Shift + R (hard reload)
```

## Verification

After clearing everything, Chrome DevTools Console should show:
```
[vite] connecting...
[vite] connected.
Service Worker unregistered in development mode
```

**No errors about**:
- ❌ Failed to fetch
- ❌ TypeError: Cannot read properties of null
- ❌ WebSocket connection failed

---

**Status**: Requires manual browser cache clear  
**Time needed**: 30 seconds  
**Result**: Clean development environment  

