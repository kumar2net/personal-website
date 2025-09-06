# Comments System Setup Guide

## Overview
This guide helps you set up the comment system to read real comments from your Netlify forms.

## Required Environment Variables

You need to add these environment variables to your Netlify site:

### 1. NETLIFY_ACCESS_TOKEN
- Go to [Netlify Personal Access Tokens](https://app.netlify.com/user/applications#personal-access-tokens)
- Click "New access token"
- Give it a name like "Comments System"
- Copy the token
- Add it to your Netlify site environment variables

### 2. NETLIFY_SITE_ID (Optional)
- Defaults to 'kumarsite' if not set
- You can find your site ID in your Netlify dashboard URL

## How to Add Environment Variables

1. Go to your Netlify dashboard: https://app.netlify.com/projects/kumarsite
2. Click on "Site settings"
3. Go to "Environment variables"
4. Click "Add variable"
5. Add:
   - Key: `NETLIFY_ACCESS_TOKEN`
   - Value: `your_token_here`
6. Click "Save"

## How It Works

1. **Comment Form**: Users submit comments via the form on your blog post
2. **Netlify Forms**: Comments are stored in your Netlify forms
3. **API Function**: The `get-comments` function fetches comments from Netlify
4. **Display**: Comments are shown on your blog post

## Testing

1. Submit a test comment on your blog post
2. Go to your Netlify forms dashboard to see the submission
3. The comment should appear when you click "Show Comments"

## Troubleshooting

### No Comments Showing
- Check that `NETLIFY_ACCESS_TOKEN` is set correctly
- Verify the form name matches 'blog-comments'
- Check the Netlify function logs for errors

### Comments Not Appearing
- Make sure the comment has the correct `post-id` field
- Check that the comment is in 'received' state (not spam)
- Verify the form submission has all required fields

## Form Fields Required

Your comment form should include these hidden fields:
- `post-id`: The blog post identifier
- `post-title`: The blog post title
- `form-name`: Should be 'blog-comments'

## Security Notes

- The access token should have minimal required permissions
- Comments are filtered by post ID for security
- Only approved comments are displayed
