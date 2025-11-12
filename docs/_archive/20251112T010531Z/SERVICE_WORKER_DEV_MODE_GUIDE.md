# Service Worker Development Mode Guide

## ⚠️ CRITICAL: Preventing Service Worker Issues in Development

This guide ensures Service Worker problems **never happen again** in your development environment.

## The Problem (Now Fixed)

**Before our fix**, Service Workers would:
- ❌ Register on every page load in development
- ❌ Cache all resources aggressively
- ❌ Intercept fetch requests
- ❌ Cause "Failed to fetch" errors
- ❌ Create React duplicate instance errors
- ❌ Break hot module replacement (HMR)

## The Solution (Implemented)

**After our fix**, Service Workers now:
- ✅ Auto-unregister in development mode
- ✅ Only register in production builds
- ✅ Never interfere with HMR
- ✅ Allow fresh code to load every time

## Implementation Details

### 1. Service Worker Registration Logic

**File**: `src/main.jsx`

```javascript
// Register service worker only in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  serviceWorkerService.initialize().then(() => {
    console.log('Service Worker initialized successfully');
  }).catch((error) => {
    console.error('Service Worker initialization failed:', error);
  });
} else if ('serviceWorker' in navigator && import.meta.env.DEV) {
  // Unregister service worker in development to prevent caching issues
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
      console.log('Service Worker unregistered in development mode');
    });
  });
}
```

**How it works**:
- Checks `import.meta.env.PROD` - only true in production builds
- Checks `import.meta.env.DEV` - only true in development mode
- In dev: Actively unregisters any existing Service Workers
- In prod: Registers Service Worker normally

### 2. Service Worker File Detection

**File**: `public/sw.js`

The Service Worker file itself has dev mode detection:

```javascript
// Skip caching in development
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  console.log('Development mode - skipping cache');
  self.skipWaiting();
  return;
}
```

This provides **double protection** against dev mode caching.

## How to Verify It's Working

### Development Mode (Current)

**Open Chrome DevTools** → Console:
```
✅ Service Worker unregistered in development mode
✅ [vite] connected.
```

**Open Chrome DevTools** → Application → Service Workers:
```
Status: No service workers found
```

### Production Mode (After Build)

**Build and preview**:
```bash
npm run build
npm run preview
```

**Open Chrome DevTools** → Console:
```
✅ Service Worker initialized successfully
✅ Service Worker activated
```

**Open Chrome DevTools** → Application → Service Workers:
```
Status: Activated and running
Scope: /
Source: /sw.js
```

## When Service Worker Issues Can Reappear

### Scenario 1: Browser Cache Not Cleared

**Problem**: Old Service Worker still cached in browser  
**Symptoms**:
- "Failed to fetch" errors
- "TypeError: Cannot read properties of null"
- WebSocket errors

**Solution**:
```
1. Chrome DevTools → Application → Service Workers → Unregister
2. Chrome DevTools → Application → Clear storage → Clear site data
3. Hard reload: Cmd + Shift + R
```

**Prevention**: Use Incognito mode for fresh testing

### Scenario 2: Accidental Code Changes

**Problem**: Someone modifies `src/main.jsx` and removes dev mode check  
**Symptoms**: Service Worker registers in development

**Solution**: Restore from git:
```bash
git checkout src/main.jsx
```

**Prevention**: Add to code review checklist

### Scenario 3: Service Worker File Modified

**Problem**: `public/sw.js` modified to remove dev mode detection  
**Symptoms**: Resources cached in development

**Solution**: Restore from git:
```bash
git checkout public/sw.js
```

**Prevention**: Document importance in file header

## Checklist: Preventing Future Issues

### For Developers

- [ ] Always use `npm run dev:vite` for development
- [ ] Never modify Service Worker registration logic in `src/main.jsx`
- [ ] Keep dev mode detection in `public/sw.js`
- [ ] Clear browser cache when switching between projects
- [ ] Use Incognito mode to test with clean slate

### For Code Reviews

- [ ] Check `src/main.jsx` - Service Worker registration unchanged
- [ ] Check `public/sw.js` - Dev mode detection intact
- [ ] Verify `import.meta.env.PROD` and `.DEV` checks present
- [ ] Test in both dev and production modes

### For New Team Members

- [ ] Read this guide: `docs/SERVICE_WORKER_DEV_MODE_GUIDE.md`
- [ ] Read: `CLEAR_BROWSER_CACHE.md`
- [ ] Test dev mode: Verify Service Worker unregistered
- [ ] Test prod mode: Verify Service Worker registers
- [ ] Understand difference between `npm run dev:vite` and `npm run build`

## Testing Procedure

### Test 1: Development Mode
```bash
# Start dev server
npm run dev:vite

# Open http://localhost:5173
# Open Chrome DevTools → Console
# Should see: "Service Worker unregistered in development mode"
# Application → Service Workers: Should be empty
```

### Test 2: Production Build
```bash
# Build
npm run build

# Preview
npm run preview

# Open http://localhost:4173
# Open Chrome DevTools → Console
# Should see: "Service Worker initialized successfully"
# Application → Service Workers: Should show active worker
```

### Test 3: Offline Mode (Production Only)
```bash
# After Test 2 (production preview)
# Chrome DevTools → Network → Check "Offline"
# Refresh page
# Should still work (cached by Service Worker)
```

## Troubleshooting

### Issue: Service Worker Won't Unregister

**Check**:
```javascript
// In src/main.jsx, verify:
import.meta.env.DEV === true  // Should be true in dev mode
```

**Force unregister**:
```javascript
// Temporary: Add to src/main.jsx for one reload
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
  location.reload();
});
```

### Issue: Service Worker Registers in Dev

**Check git history**:
```bash
git log --oneline src/main.jsx
git diff HEAD~1 src/main.jsx
```

**Restore correct version**:
```bash
git checkout HEAD src/main.jsx
```

### Issue: Browser Still Shows Errors

**Nuclear option**:
```bash
# 1. Close all Chrome windows
# 2. Clear Vite cache
rm -rf node_modules/.vite

# 3. Restart dev server
npm run dev:vite

# 4. Open Incognito
open -na "Google Chrome" --args --incognito http://localhost:5173
```

## Best Practices

### Always

✅ Use `npm run dev:vite` for development  
✅ Clear browser cache when switching between projects  
✅ Test in Incognito for clean environment  
✅ Check DevTools console for Service Worker status  
✅ Keep `src/main.jsx` Service Worker logic unchanged  

### Never

❌ Modify Service Worker registration in `src/main.jsx`  
❌ Remove `import.meta.env.PROD` checks  
❌ Register Service Worker unconditionally  
❌ Cache resources in development mode  
❌ Ignore "Service Worker unregistered" message  

## Related Documentation

- **Quick Reference**: `README_START_HERE.md`
- **Browser Cache**: `CLEAR_BROWSER_CACHE.md`
- **DevTools Guide**: `CHROME_DEVTOOLS_CLEAR_STEPS.md`
- **Complete Fix**: `docs/ESBUILD_CRASH_FIX.md`
- **Session Notes**: `docs/SESSION_SUMMARY.md`

## Summary

**Service Worker issues are now permanently prevented** through:
1. Automatic unregistration in development mode
2. Production-only registration logic
3. Double protection via hostname detection
4. Clear documentation and verification procedures

**If issues ever reappear**, check:
1. Browser cache (clear it)
2. `src/main.jsx` (verify dev mode check intact)
3. `public/sw.js` (verify hostname detection intact)
4. Git history (restore if modified)

---

**Last Updated**: October 22, 2025  
**Status**: ✅ Implemented and Tested  
**Commit**: 930e819 - "fix: Permanently resolve esbuild crash and Service Worker dev issues"


