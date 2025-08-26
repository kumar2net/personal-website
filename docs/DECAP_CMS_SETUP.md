# Decap CMS Setup Guide

This document outlines the setup and usage of Decap CMS (formerly Netlify CMS) for managing blog content on your personal website.

## Overview

Decap CMS provides a user-friendly interface for managing blog posts and other content without needing to edit code directly. It integrates with Git Gateway and Netlify Identity for authentication and content management.

## Setup Components

### 1. Admin Interface
- **Location**: `/admin` (accessible at `yoursite.com/admin`)
- **Files**: 
  - `public/admin/index.html` - Admin page
  - `public/admin/config.yml` - CMS configuration

### 2. Content Structure
- **Blog Posts**: `src/pages/blog/` (Markdown files)
- **Pages**: `src/pages/` (General pages)
- **Data Files**: `src/data/` (JSON/configuration files)
- **Media**: `public/media/uploads/` (Images and files)

### 3. Authentication
- Uses Netlify Identity for user authentication
- Git Gateway backend for content management
- Local backend available for development

## Configuration Details

### CMS Configuration (`public/admin/config.yml`)

The CMS is configured with three main collections:

1. **Blog Posts**
   - Folder: `src/pages/blog`
   - Slug format: `{{year}}-{{month}}-{{day}}-{{slug}}`
   - Fields: title, date, featured_image, excerpt, tags, author, draft, body
   - Supports Markdown content

2. **Pages**
   - Folder: `src/pages`
   - Simple structure for general pages
   - Fields: title, body, draft

3. **Data Files**
   - Folder: `src/data`
   - For JSON and configuration files
   - Fields: title, body (code editor)

### Media Management
- Upload folder: `public/media/uploads`
- Public URL: `/media/uploads`
- Supports images and other file types

## Workflow

### Creating Content
1. Navigate to `/admin` on your site
2. Authenticate with Netlify Identity
3. Click "New Blog Post" or "New Page"
4. Fill in the required fields
5. Write content using the Markdown editor
6. Upload images as needed
7. Set draft status if needed
8. Click "Publish" to save

### Converting Markdown to JSX
After creating content in the CMS, you need to convert Markdown files to JSX for your React app:

```bash
npm run cms:convert
```

This script:
- Reads Markdown files from `src/pages/blog/`
- Converts them to JSX format
- Maintains your existing blog post structure
- Preserves frontmatter data

### Publishing Process
1. Create/edit content in CMS
2. Run conversion script: `npm run cms:convert`
3. Commit and push changes to Git
4. Netlify automatically deploys updates

## Netlify Setup Requirements

### 1. Enable Netlify Identity
- Go to your Netlify dashboard
- Navigate to Site settings > Identity
- Click "Enable Identity"
- Configure registration (invite-only recommended)

### 2. Configure Git Gateway
- In Identity settings, go to "Services" tab
- Enable Git Gateway
- This allows the CMS to commit changes to your repository

### 3. Set Up Invitations
- Go to Identity > Users
- Invite yourself and other content creators
- Users will receive email invitations to join

## Development Workflow

### Local Development
1. Start your development server: `npm run dev`
2. Access CMS at `http://localhost:5173/admin`
3. Use local backend for testing (configured in `config.yml`)

### Content Management
1. Create content in CMS
2. Convert Markdown to JSX: `npm run cms:convert`
3. Test locally
4. Commit and push changes

## File Structure

```
public/
├── admin/
│   ├── index.html          # CMS admin page
│   └── config.yml          # CMS configuration
└── media/
    └── uploads/            # Uploaded media files

src/
├── pages/
│   └── blog/
│       ├── _template.md    # Blog post template
│       └── *.jsx           # Converted blog posts
└── data/                   # Data files

scripts/
└── convert-md-to-jsx.mjs   # Conversion script
```

## Troubleshooting

### Common Issues

1. **CMS not loading**
   - Check Netlify Identity is enabled
   - Verify Git Gateway is configured
   - Ensure admin files are in `public/admin/`

2. **Authentication issues**
   - Check user invitations in Netlify Identity
   - Verify email confirmation
   - Check browser console for errors

3. **Content not appearing**
   - Run conversion script: `npm run cms:convert`
   - Check file paths and naming
   - Verify frontmatter format

4. **Images not displaying**
   - Check upload folder permissions
   - Verify public folder configuration
   - Check image paths in content

### Debugging
- Check browser console for JavaScript errors
- Verify Netlify Identity widget is loading
- Check Git Gateway status in Netlify dashboard
- Review build logs for deployment issues

## Security Considerations

- Use invite-only registration for Netlify Identity
- Regularly review user access
- Keep dependencies updated
- Monitor Git commits for unauthorized changes
- Use HTTPS in production

## Future Enhancements

Potential improvements to consider:
- Custom preview templates
- Advanced field types (rich text, code blocks)
- Workflow approvals
- Content scheduling
- SEO optimization fields
- Custom widgets for specific content types
