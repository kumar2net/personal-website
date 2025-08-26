#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WordPressNetlifyButton {
  constructor() {
    this.netlifyFunctionUrl = 'https://kumarsite.netlify.app/.netlify/functions/wordpress-manual-publish';
  }

  generateButtonHTML() {
    return `
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
    const response = await fetch('${this.netlifyFunctionUrl}', {
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
  const urlMatch = window.location.pathname.match(/\\/wp-admin\\/post\\.php\\?post=(\\d+)/);
  if (urlMatch) return urlMatch[1];
  
  // Try to get from post edit page
  const editMatch = window.location.pathname.match(/\\/wp-admin\\/post\\.php\\?action=edit&post=(\\d+)/);
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
`;
  }

  generateWordPressPluginCode() {
    return `<?php
/**
 * Plugin Name: WordPress to Netlify Publisher
 * Description: Adds a "Publish to Netlify" button to WordPress posts
 * Version: 1.0.0
 * Author: Kumar
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class WordPressToNetlifyPublisher {
    
    public function __construct() {
        add_action('add_meta_boxes', array($this, 'add_netlify_meta_box'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_ajax_publish_to_netlify', array($this, 'handle_publish_request'));
    }
    
    public function add_netlify_meta_box() {
        add_meta_box(
            'netlify_publisher',
            '🌐 Publish to Netlify',
            array($this, 'render_meta_box'),
            'post',
            'side',
            'high'
        );
    }
    
    public function render_meta_box($post) {
        if ($post->post_status !== 'publish') {
            echo '<p style="color: #666;">Publish this post first to enable Netlify publishing.</p>';
            return;
        }
        
        echo '<div id="netlify-publisher-meta">';
        echo '<p style="margin-bottom: 10px;">Click the button below to publish this post to your Netlify site.</p>';
        echo '<button id="publish-to-netlify-btn" class="button button-primary" onclick="publishToNetlify(' . $post->ID . ')">';
        echo '📤 Publish to Netlify';
        echo '</button>';
        echo '<div id="publish-status" style="margin-top: 10px; display: none;"></div>';
        echo '</div>';
    }
    
    public function enqueue_scripts() {
        if (is_single() && get_post_type() === 'post') {
            wp_enqueue_script('netlify-publisher', plugin_dir_url(__FILE__) . 'netlify-publisher.js', array(), '1.0.0', true);
            wp_localize_script('netlify-publisher', 'netlifyPublisher', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('netlify_publisher_nonce')
            ));
        }
    }
    
    public function handle_publish_request() {
        check_ajax_referer('netlify_publisher_nonce', 'nonce');
        
        $post_id = intval($_POST['post_id']);
        
        if (!$post_id || get_post_status($post_id) !== 'publish') {
            wp_die('Invalid post or post not published');
        }
        
        // Call Netlify function
        $response = wp_remote_post('https://kumarsite.netlify.app/.netlify/functions/wordpress-manual-publish', array(
            'headers' => array('Content-Type' => 'application/json'),
            'body' => json_encode(array(
                'postId' => $post_id,
                'action' => 'publish'
            )),
            'timeout' => 30
        ));
        
        if (is_wp_error($response)) {
            wp_send_json_error('Network error: ' . $response->get_error_message());
        }
        
        $body = wp_remote_retrieve_body($response);
        $result = json_decode($body, true);
        
        if ($result && isset($result['success']) && $result['success']) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error($result['error'] ?? 'Unknown error');
        }
    }
}

// Initialize the plugin
new WordPressToNetlifyPublisher();
`;
  }

  generateJavaScriptFile() {
    return `
// WordPress to Netlify Publisher JavaScript
function publishToNetlify(postId) {
    const button = document.getElementById('publish-to-netlify-btn');
    const status = document.getElementById('publish-status');
    
    if (!button || !status) return;
    
    // Show loading state
    button.disabled = true;
    button.textContent = '⏳ Publishing...';
    status.innerHTML = '<div style="color: #666;">Publishing to Netlify...</div>';
    status.style.display = 'block';
    
    // Make AJAX request
    fetch(netlifyPublisher.ajaxUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'publish_to_netlify',
            post_id: postId,
            nonce: netlifyPublisher.nonce
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            status.innerHTML = \`
                <div style="color: #28a745; margin-bottom: 10px;">
                    ✅ Successfully published to Netlify!
                </div>
                <div style="font-size: 12px;">
                    <a href="\${data.data.netlify_url}" target="_blank" style="color: #00ad9f;">
                        View on Netlify →
                    </a>
                </div>
            \`;
        } else {
            status.innerHTML = \`
                <div style="color: #dc3545;">
                    ❌ Failed to publish: \${data.data}
                </div>
            \`;
        }
    })
    .catch(error => {
        status.innerHTML = \`
            <div style="color: #dc3545;">
                ❌ Network error: \${error.message}
            </div>
        \`;
    })
    .finally(() => {
        // Re-enable button after 3 seconds
        setTimeout(() => {
            button.disabled = false;
            button.textContent = '📤 Publish to Netlify';
        }, 3000);
    });
}

// Add button to frontend posts
if (typeof netlifyPublisher !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Check if we're on a single post page
        if (document.body.classList.contains('single-post')) {
            const content = document.querySelector('.entry-content, .post-content, .content');
            if (content) {
                const buttonHtml = \`${this.generateButtonHTML()}\`;
                content.insertAdjacentHTML('beforeend', buttonHtml);
            }
        }
    });
}
`;
  }

  async generateFiles() {
    console.log('🔧 Generating WordPress to Netlify Publisher files...');
    
    const outputDir = path.join(__dirname, '../wordpress-netlify-publisher');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate plugin file
    const pluginCode = this.generateWordPressPluginCode();
    await fs.writeFile(path.join(outputDir, 'wordpress-to-netlify-publisher.php'), pluginCode);
    
    // Generate JavaScript file
    const jsCode = this.generateJavaScriptFile();
    await fs.writeFile(path.join(outputDir, 'netlify-publisher.js'), jsCode);
    
    // Generate HTML snippet
    const buttonHtml = this.generateButtonHTML();
    await fs.writeFile(path.join(outputDir, 'button-snippet.html'), buttonHtml);
    
    // Generate README
    const readme = this.generateREADME();
    await fs.writeFile(path.join(outputDir, 'README.md'), readme);
    
    console.log('✅ Files generated in: wordpress-netlify-publisher/');
    console.log('');
    console.log('📁 Generated files:');
    console.log('  - wordpress-to-netlify-publisher.php (WordPress plugin)');
    console.log('  - netlify-publisher.js (JavaScript file)');
    console.log('  - button-snippet.html (HTML snippet for manual insertion)');
    console.log('  - README.md (Setup instructions)');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('  1. Upload the plugin files to your WordPress site');
    console.log('  2. Activate the plugin in WordPress admin');
    console.log('  3. The "Publish to Netlify" button will appear on published posts');
  }

  generateREADME() {
    return `# WordPress to Netlify Publisher

This plugin adds a "Publish to Netlify" button to WordPress posts, allowing authors to selectively cross-publish content to their Netlify site.

## Features

- ✅ Manual publishing control - authors choose which posts to publish
- ✅ One-click publishing from WordPress admin
- ✅ Automatic JSX file generation
- ✅ GitHub integration (optional)
- ✅ Duplicate prevention
- ✅ Status tracking

## Installation

### Method 1: WordPress Plugin (Recommended)

1. Upload the \`wordpress-to-netlify-publisher.php\` file to your WordPress site's \`/wp-content/plugins/\` directory
2. Upload the \`netlify-publisher.js\` file to the same directory
3. Activate the plugin in WordPress Admin → Plugins
4. The "Publish to Netlify" button will appear in the post editor sidebar

### Method 2: Manual HTML Insertion

1. Copy the content from \`button-snippet.html\`
2. Add it to your WordPress theme's \`single.php\` file or use a custom HTML block
3. The button will appear at the bottom of published posts

## Usage

1. **Publish a post on WordPress** (the button only appears on published posts)
2. **Click "Publish to Netlify"** in the post editor sidebar or on the frontend
3. **Wait for confirmation** - the system will convert the post to JSX and publish it
4. **View on Netlify** - click the provided link to see your post on your Netlify site

## Configuration

### Environment Variables (Optional)

For GitHub integration, set these environment variables in your Netlify dashboard:

- \`GITHUB_TOKEN\`: Your GitHub personal access token
- \`GITHUB_REPO\`: Your repository (format: username/repository)

### Netlify Function

The system uses a Netlify function at:
\`https://kumarsite.netlify.app/.netlify/functions/wordpress-manual-publish\`

## Troubleshooting

### Button not appearing
- Ensure the post is published (not draft or private)
- Check that the plugin is activated
- Verify JavaScript is loading properly

### Publishing fails
- Check Netlify function logs
- Verify WordPress API token is valid
- Ensure proper permissions on GitHub (if using)

### Duplicate posts
- The system tracks published posts to prevent duplicates
- You can republish by clicking the button again

## File Structure

\`\`\`
wordpress-netlify-publisher/
├── wordpress-to-netlify-publisher.php  # Main plugin file
├── netlify-publisher.js                # JavaScript functionality
├── button-snippet.html                 # HTML snippet for manual use
└── README.md                           # This file
\`\`\`

## API Endpoints

- **POST** \`/wp-admin/admin-ajax.php\` - WordPress AJAX handler
- **POST** \`https://kumarsite.netlify.app/.netlify/functions/wordpress-manual-publish\` - Netlify function

## Support

For issues or questions, check the Netlify function logs and WordPress error logs.
`;
  }
}

// Main execution
const generator = new WordPressNetlifyButton();

const command = process.argv[2];
if (command === '--generate') {
  generator.generateFiles();
} else {
  console.log('WordPress to Netlify Publisher Button Generator');
  console.log('==============================================');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/wordpress-netlify-button.mjs --generate');
  console.log('');
  console.log('This will generate all necessary files for adding a');
  console.log('"Publish to Netlify" button to your WordPress site.');
}
