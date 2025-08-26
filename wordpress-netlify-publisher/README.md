# WordPress to Netlify Publisher

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

1. Upload the `wordpress-to-netlify-publisher.php` file to your WordPress site's `/wp-content/plugins/` directory
2. Upload the `netlify-publisher.js` file to the same directory
3. Activate the plugin in WordPress Admin → Plugins
4. The "Publish to Netlify" button will appear in the post editor sidebar

### Method 2: Manual HTML Insertion

1. Copy the content from `button-snippet.html`
2. Add it to your WordPress theme's `single.php` file or use a custom HTML block
3. The button will appear at the bottom of published posts

## Usage

1. **Publish a post on WordPress** (the button only appears on published posts)
2. **Click "Publish to Netlify"** in the post editor sidebar or on the frontend
3. **Wait for confirmation** - the system will convert the post to JSX and publish it
4. **View on Netlify** - click the provided link to see your post on your Netlify site

## Configuration

### Environment Variables (Optional)

For GitHub integration, set these environment variables in your Netlify dashboard:

- `GITHUB_TOKEN`: Your GitHub personal access token
- `GITHUB_REPO`: Your repository (format: username/repository)

### Netlify Function

The system uses a Netlify function at:
`https://kumarsite.netlify.app/.netlify/functions/wordpress-manual-publish`

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

```
wordpress-netlify-publisher/
├── wordpress-to-netlify-publisher.php  # Main plugin file
├── netlify-publisher.js                # JavaScript functionality
├── button-snippet.html                 # HTML snippet for manual use
└── README.md                           # This file
```

## API Endpoints

- **POST** `/wp-admin/admin-ajax.php` - WordPress AJAX handler
- **POST** `https://kumarsite.netlify.app/.netlify/functions/wordpress-manual-publish` - Netlify function

## Support

For issues or questions, check the Netlify function logs and WordPress error logs.
