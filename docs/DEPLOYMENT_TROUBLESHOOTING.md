# Deployment Troubleshooting Guide

## 🎯 Overview

This guide documents critical deployment issues encountered and resolved during a 2-day debugging session. It serves as a comprehensive reference for diagnosing and fixing common Netlify deployment problems.

## 📅 Timeline: 2-Day Debugging Session

### Day 1: Build Errors (4 hours)
**Issue:** `sh: 1: vite: not found` - Complete build failure
**Impact:** Unable to deploy any changes
**Resolution:** Dependency configuration fix

### Day 2: Runtime Errors (6 hours)
**Issue:** Comments not displaying despite API working
**Impact:** Frontend functionality broken
**Resolution:** Function versioning and deployment conflicts

## 🚨 Critical Issues & Solutions

### Issue 1: "vite: not found" Build Error

#### Symptoms
```
❯ Loading extensions
- neon
❯ build.command from netlify.toml
$ npm run build
sh: 1: vite: not found
Failed during stage 'building site': Build script returned non-zero exit code: 2
```

#### Root Cause Analysis
- **Primary Issue:** Vite listed in `devDependencies` instead of `dependencies`
- **Secondary Issue:** Netlify's default behavior only installs production dependencies
- **Technical Detail:** Build command `npm run build` requires vite CLI to be available

#### Diagnostic Steps
1. **Check package.json dependencies:**
   ```json
   {
     "devDependencies": {
       "vite": "^5.0.12"  // ❌ Wrong location
     }
   }
   ```

2. **Verify netlify.toml configuration:**
   ```toml
   [build]
   command = "npm run build"  # Only installs prod deps
   ```

3. **Check build logs:**
   - Exit code 127 indicates command not found
   - Functions deploy but frontend build fails

#### Solution Implementation

**Step 1: Move vite to dependencies**
```json
{
  "dependencies": {
    "vite": "^5.0.12"  // ✅ Correct location
  },
  "devDependencies": {
    // Remove vite from here
  }
}
```

**Step 2: Update netlify.toml**
```toml
[build]
command = "npm ci --include=dev && npm run build"
environment = { NPM_FLAGS = "--include=dev" }
```

**Step 3: Force redeployment**
```bash
git add package.json netlify.toml
git commit -m "fix: Move vite to dependencies to resolve build error"
git push origin master
```

#### Prevention Measures
- **Always put build tools in dependencies:** vite, webpack, rollup, etc.
- **Use `npm ci --include=dev`:** Ensures all dependencies are installed
- **Test locally:** Run `npm run build` before pushing
- **Monitor build logs:** Check for exit code 127 errors

### Issue 2: Function Version Conflicts

#### Symptoms
- API returns `{"success": true, "comments": [], "total": 0}`
- Frontend shows "No comments yet"
- Some functions work, others don't
- Comments exist in Netlify Forms but not returned

#### Root Cause Analysis
- **Primary Issue:** Multiple conflicting function files
- **Secondary Issue:** Netlify deployed wrong function version
- **Technical Detail:** Function caching and versioning conflicts

#### Diagnostic Steps
1. **Check function files:**
   ```bash
   ls netlify/functions/
   # get-comments.js
   # get-comments-simple.js
   # get-comments-working.js
   # get-comments-backup.js
   ```

2. **Compare function contents:**
   ```bash
   grep -n "semantic-search" netlify/functions/get-comments*
   ```

3. **Test deployed function:**
   ```bash
   curl https://kumar2net.com/.netlify/functions/get-comments
   ```

4. **Check Netlify function logs:**
   - Go to Netlify Dashboard → Functions → get-comments
   - Check recent invocations and errors

#### Solution Implementation

**Step 1: Consolidate functions**
```bash
# Identify the correct version
ls -la netlify/functions/get-comments*

# Copy working version to main file
cp netlify/functions/get-comments-working.js netlify/functions/get-comments.js

# Remove conflicting files
rm netlify/functions/get-comments-simple.js
rm netlify/functions/get-comments-backup.js
```

**Step 2: Fix parameter handling**
```javascript
// Handle both parameter formats
const targetPostSlug = postSlug || postId;

// Ensure consistent data structure
return {
  success: true,
  comments: processedComments,
  total: processedComments.length,
  postSlug: targetPostSlug
};
```

**Step 3: Force function redeployment**
```bash
# Make small change to force redeployment
echo "// Force redeployment" >> netlify/functions/get-comments.js

# Commit and push
git add .
git commit -m "fix: Force function redeployment"
git push origin master
```

**Step 4: Verify deployment**
```bash
# Wait 2-5 minutes for function deployment
sleep 300

# Test the function
curl -X POST https://kumar2net.com/.netlify/functions/get-comments \
  -H "Content-Type: application/json" \
  -d '{"postId": "test-post"}'
```

#### Prevention Measures
- **Single source of truth:** One function file per endpoint
- **Version control:** Use git to track function changes
- **Test deployments:** Always test functions after deployment
- **Clean up:** Remove old/unused function files
- **Parameter consistency:** Use consistent parameter names across frontend/backend

## 🔧 General Debugging Methodology

### Step 1: Isolate the Problem
1. **Check build vs runtime:** Is it a build error or runtime error?
2. **Test locally:** Does the issue exist in local development?
3. **Check logs:** Review Netlify build logs and function logs
4. **Minimal reproduction:** Create simplest possible test case

### Step 2: Check Configuration
1. **package.json:** Dependencies and scripts
2. **netlify.toml:** Build commands and environment variables
3. **Environment variables:** Correctly set in Netlify dashboard
4. **Function files:** Correct naming and content

### Step 3: Test Incrementally
1. **Deploy small changes:** Test one change at a time
2. **Use feature flags:** Enable/disable features for testing
3. **Monitor logs:** Watch for new errors after each change
4. **Rollback if needed:** Keep backup versions

### Step 4: Force Redeployment
```bash
# Method 1: Amend commit
git commit --amend --no-edit
git push --force-with-lease

# Method 2: Add empty commit
git commit --allow-empty -m "force redeploy"
git push origin master

# Method 3: Clear cache (Netlify dashboard)
# Go to Site settings → Build & deploy → Clear cache and deploy
```

## 📊 Common Error Patterns

### Exit Code Meanings
- **Exit code 1:** General error
- **Exit code 2:** Build script error
- **Exit code 127:** Command not found
- **Exit code 130:** Process terminated

### Build Error Patterns
- `sh: 1: [command]: not found` → Missing dependency
- `Module not found` → Import path issue
- `SyntaxError` → JavaScript syntax error
- `TypeError` → Runtime type error

### Function Error Patterns
- `Function not found` → Function not deployed
- `403 Forbidden` → Authentication issue
- `500 Internal Server Error` → Function runtime error
- `Timeout` → Function taking too long

## 🛠️ Useful Commands

### Local Testing
```bash
# Test build locally
npm run build

# Test functions locally
npm run dev:netlify

# Check function logs
netlify functions:log get-comments
```

### Remote Testing
```bash
# Test deployed function
curl https://kumar2net.com/.netlify/functions/get-comments

# Test with parameters
curl -X POST https://kumar2net.com/.netlify/functions/get-comments \
  -H "Content-Type: application/json" \
  -d '{"postId": "test"}'

# Check site status
curl -I https://kumar2net.com
```

### Netlify CLI
```bash
# Deploy manually
netlify deploy --prod --dir=dist

# Check site status
netlify status

# Open dashboard
netlify open
```

## 📚 Best Practices Learned

### 1. Dependency Management
- **Put build tools in dependencies:** vite, webpack, rollup
- **Use exact versions:** `"vite": "^5.0.12"` not `"vite": "^5"`
- **Keep devDependencies minimal:** Only development tools

### 2. Build Configuration
- **Use `npm ci --include=dev`:** Installs all dependencies
- **Set environment variables:** `NPM_FLAGS="--include=dev"`
- **Test builds locally:** Before pushing to production

### 3. Function Development
- **Single function per endpoint:** Avoid multiple versions
- **Consistent parameters:** Use same parameter names
- **Error handling:** Proper try/catch and error responses
- **Testing:** Test functions before deployment

### 4. Deployment Strategy
- **Incremental changes:** Deploy small changes
- **Monitor logs:** Check build and function logs
- **Force redeployment:** When needed for cache issues
- **Rollback plan:** Keep backup versions

### 5. Debugging Process
- **Systematic approach:** Isolate, diagnose, fix, test
- **Documentation:** Keep records of fixes
- **Prevention:** Learn from each issue
- **Tools:** Use appropriate debugging tools

## 🎯 Key Takeaways

1. **Build tools belong in dependencies:** Not devDependencies
2. **Single source of truth:** One function file per endpoint
3. **Test before deploying:** Local testing prevents issues
4. **Monitor logs:** Essential for debugging
5. **Force redeployment:** Sometimes necessary for cache issues
6. **Documentation:** Record solutions for future reference

## 📞 Support Resources

- [Netlify Build Troubleshooting](https://docs.netlify.com/configure-builds/troubleshooting-tips/)
- [Netlify Functions Debugging](https://docs.netlify.com/functions/troubleshooting/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Netlify Community Forums](https://community.netlify.com/)

---

**Last Updated:** January 15, 2025
**Based on:** 2-day debugging session resolution
**Status:** Production ready, issues resolved
