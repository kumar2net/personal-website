# WordPress.com Free Plan Alternatives

## 🎯 Overview

Since WordPress.com free plan doesn't allow custom plugins, here are alternative approaches to add the "Publish to Netlify" functionality.

## ✅ Available Options

### **Option 1: Custom HTML Block (Recommended)**
### **Option 2: Command Line Interface**
### **Option 3: Automated Polling**
### **Option 4: Direct API Calls**

---

## 🚀 Option 1: Custom HTML Block (Recommended)

### **How It Works**
Add the "Publish to Netlify" button directly to your posts using WordPress.com's Custom HTML block.

### **Step-by-Step Setup**

#### **Step 1: Copy the HTML Snippet**
Copy this complete HTML code:

```html
<!-- WordPress to Netlify Publisher Button -->
<div id="netlify-publisher" style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9;">
  <h3 style="margin: 0 0 10px 0; color: #333;">🌐 Publish to Netlify</h3>
  <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
    Click the button below to publish this post to your Netlify site.
  </p>
  
  <button id="publish-to-netlify-btn" 
          style="background: #00ad9f; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;"
          onclick="publishToNetlify()">
    📤 Publish to Netlify
  </button>
  
  <div id="publish-status" style="margin-top: 10px; display: none;">
    <div id="publish-loading" style="display: none; color: #666;">
      <span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> Publishing to Netlify...
    </div>
    <div id="publish-success" style="display: none; color: #28a745;">
      ✅ Successfully published to Netlify!
      <div id="netlify-url" style="margin-top: 5px; font-size: 12px;"></div>
    </div>
    <div id="publish-error" style="display: none; color: #dc3545;">
      ❌ Failed to publish to Netlify
      <div id="error-details" style="margin-top: 5px; font-size: 12px;"></div>
    </div>
  </div>
</div>

<style>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

#publish-to-netlify-btn:hover {
  background: #008f83 !important;
}

#publish-to-netlify-btn:disabled {
  background: #ccc !important;
  cursor: not-allowed !important;
}
</style>

<script>
async function publishToNetlify() {
  const button = document.getElementById('publish-to-netlify-btn');
  const status = document.getElementById('publish-status');
  const loading = document.getElementById('publish-loading');
  const success = document.getElementById('publish-success');
  const error = document.getElementById('publish-error');
  const netlifyUrl = document.getElementById('netlify-url');
  const errorDetails = document.getElementById('error-details');
  
  // Get post ID from WordPress
  const postId = getPostId();
  
  if (!postId) {
    showError('Could not determine post ID');
    return;
  }
  
  // Show loading state
  button.disabled = true;
  status.style.display = 'block';
  loading.style.display = 'block';
  success.style.display = 'none';
  error.style.display = 'none';
  
  try {
    const response = await fetch('https://kumarsite.netlify.app/.netlify/functions/wordpress-manual-publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId: postId,
        action: 'publish'
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      showSuccess(result.netlify_url);
    } else {
      showError(result.error || result.details || 'Unknown error');
    }
  } catch (err) {
    showError('Network error: ' + err.message);
  }
}

function showSuccess(netlifyUrl) {
  const loading = document.getElementById('publish-loading');
  const success = document.getElementById('publish-success');
  const netlifyUrlDiv = document.getElementById('netlify-url');
  
  loading.style.display = 'none';
  success.style.display = 'block';
  netlifyUrlDiv.innerHTML = '<a href="' + netlifyUrl + '" target="_blank" style="color: #00ad9f;">View on Netlify →</a>';
  
  // Re-enable button after 3 seconds
  setTimeout(() => {
    document.getElementById('publish-to-netlify-btn').disabled = false;
  }, 3000);
}

function showError(message) {
  const loading = document.getElementById('publish-loading');
  const error = document.getElementById('publish-error');
  const errorDetails = document.getElementById('error-details');
  
  loading.style.display = 'none';
  error.style.display = 'block';
  errorDetails.textContent = message;
  
  // Re-enable button
  document.getElementById('publish-to-netlify-btn').disabled = false;
}

function getPostId() {
  // Try different methods to get post ID
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('post');
  
  if (postId) return postId;
  
  // Try to get from WordPress admin
  if (window.wp && window.wp.data && window.wp.data.select('core/editor')) {
    try {
      return window.wp.data.select('core/editor').getCurrentPostId();
    } catch (e) {
      // Ignore error
    }
  }
  
  // Try to get from page URL
  const urlMatch = window.location.pathname.match(/\/wp-admin\/post\.php\?post=(\d+)/);
  if (urlMatch) return urlMatch[1];
  
  // Try to get from post edit page
  const editMatch = window.location.pathname.match(/\/wp-admin\/post\.php\?action=edit&post=(\d+)/);
  if (editMatch) return editMatch[1];
  
  return null;
}

// Auto-detect if we're on a post page and show button
document.addEventListener('DOMContentLoaded', function() {
  const postId = getPostId();
  if (postId) {
    console.log('WordPress to Netlify Publisher: Post ID detected:', postId);
  }
});
</script>

#### **Step 2: Add to Your Posts**
1. **Create or edit a post** in WordPress.com
2. **Add a "Custom HTML" block** (click the + button, search for "Custom HTML")
3. **Paste the HTML code** above into the block
4. **Publish or update** your post
5. **The button will appear** at the bottom of your post

#### **Step 3: Use the Button**
1. **View your published post**
2. **Scroll to the bottom** to see the "Publish to Netlify" button
3. **Click the button** to cross-publish to Netlify
4. **Wait for confirmation** and click the provided link

### **Pros & Cons**
✅ **Works with free plan** - No plugin needed
✅ **Easy to add** - Just paste HTML
✅ **Visual feedback** - Shows status and links
❌ **Manual addition** - Need to add to each post
❌ **Limited automation** - No automatic detection

---

## 🔧 Option 2: Command Line Interface

### **How It Works**
Use the command-line tools to manually publish posts from your local machine.

### **Setup & Usage**

```bash
# Interactive publisher (lists all posts)
npm run wordpress:publisher

# Publish specific post by ID
node scripts/wordpress-netlify-publisher.mjs --publish POST_ID

# List published posts
node scripts/wordpress-netlify-publisher.mjs --list
```

### **Workflow**
1. **Create post on WordPress.com**
2. **Note the post ID** (from URL or admin)
3. **Run command** to publish to Netlify
4. **Check Netlify site** for new post

### **Pros & Cons**
✅ **Full control** - Choose exactly which posts to publish
✅ **Works with free plan** - No WordPress modifications needed
✅ **Batch operations** - Can handle multiple posts
❌ **Requires local setup** - Need to run commands
❌ **Manual process** - Not integrated with WordPress

---

## 🔄 Option 3: Automated Polling

### **How It Works**
Run a script that automatically checks for new WordPress posts and publishes them to Netlify.

### **Setup & Usage**

```bash
# Start continuous polling (checks every 5 minutes)
npm run wordpress:poll

# Check once for new posts
npm run wordpress:poll-once
```

### **Workflow**
1. **Start the polling script**
2. **Create posts on WordPress.com**
3. **Posts automatically appear** on Netlify
4. **Monitor logs** for status

### **Pros & Cons**
✅ **Fully automated** - No manual intervention needed
✅ **Works with free plan** - No WordPress modifications
✅ **Handles all posts** - Publishes everything automatically
❌ **No selective control** - Publishes all new posts
❌ **Requires running script** - Need to keep it running

---

## 🌐 Option 4: Direct API Calls

### **How It Works**
Make direct API calls to the Netlify function to publish specific posts.

### **Usage Examples**

```bash
# Publish post ID 123
curl -X POST https://kumarsite.netlify.app/.netlify/functions/wordpress-manual-publish \
  -H "Content-Type: application/json" \
  -d '{"postId": "123", "action": "publish"}'

# Using JavaScript in browser console
fetch('https://kumarsite.netlify.app/.netlify/functions/wordpress-manual-publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ postId: '123', action: 'publish' })
})
.then(response => response.json())
.then(result => console.log(result));
```

### **Pros & Cons**
✅ **Direct control** - Immediate publishing
✅ **Works with free plan** - No WordPress modifications
✅ **Programmatic** - Can be integrated into other tools
❌ **Technical** - Requires API knowledge
❌ **Manual** - Need to know post IDs

---

## 🎯 Recommended Approach for Free Plan

### **For Casual Users: Custom HTML Block**
- Add the HTML snippet to posts you want to cross-publish
- Simple copy-paste process
- Works immediately with no setup

### **For Power Users: Command Line Interface**
- Use `npm run wordpress:publisher` for interactive selection
- Full control over which posts to publish
- Can handle batch operations

### **For Automated Workflow: Polling**
- Use `npm run wordpress:poll` for continuous monitoring
- Automatically publishes all new posts
- Set it up once and forget about it

---

## 🚀 Quick Start (Recommended)

### **Step 1: Try the HTML Block Method**
1. Copy the HTML snippet above
2. Add it to a test post using Custom HTML block
3. Publish the post and test the button

### **Step 2: Set Up Command Line Tools**
```bash
# Test the interactive publisher
npm run wordpress:publisher

# This will show you all available posts and let you choose which to publish
```

### **Step 3: Choose Your Workflow**
- **HTML Block**: For selective posts
- **Command Line**: For full control
- **Polling**: For automation

---

## 🔧 Troubleshooting

### **HTML Block Issues**
- **Button not appearing**: Check if Custom HTML block is added
- **JavaScript errors**: Check browser console for errors
- **Post ID not found**: Try refreshing the page

### **Command Line Issues**
- **No posts found**: Check WordPress API token
- **Publishing fails**: Check Netlify function logs
- **Permission errors**: Verify file permissions

### **Polling Issues**
- **Not detecting posts**: Check WordPress API access
- **Duplicate posts**: System handles this automatically
- **Script stops**: Check for errors in logs

---

**🎉 All these methods work with WordPress.com free plan! Choose the one that fits your workflow best.**
