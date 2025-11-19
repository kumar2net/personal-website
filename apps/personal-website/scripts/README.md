# Blog Post Generation Scripts

## generate-blog-post.mjs

Automated blog post generation script that converts markdown hints into fully-formatted blog posts with AI-generated images.

### Features

✅ **OpenAI Integration**: Uses GPT-4.1-mini for content generation and DALL-E 3 for images  
✅ **Local Image Storage**: Downloads and saves images permanently to `/public/media/generated/`  
✅ **Dark Mode Support**: Automatically includes proper dark mode CSS classes  
✅ **Structured Output**: Generates clean JSX with numbered sections and proper styling  

### Usage

```bash
# From repository root
node apps/personal-website/scripts/generate-blog-post.mjs
```

### Requirements

1. **Environment Variable**: `OPENAI_API_KEY` must be set in `.env`
2. **Input File**: `docs/bloghints/FrontierLabs.md` must exist
3. **Node.js**: Version 18+ with ES modules support

### Output Files

| File | Description |
|------|-------------|
| `src/pages/blog/[date]-[slug].jsx` | Generated blog post component |
| `public/media/generated/[date]-[slug].png` | AI-generated illustration (if requested) |

### Generated JSX Structure

The script generates blog posts with the following features:

#### MUI v8 Components
```jsx
import { Box, Typography } from "@mui/material";

// Container with flex layout and gap
<Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>

// Section heading with numbered badge
<Typography variant="h2" sx={{ fontSize: { xs: "1.5rem", md: "1.875rem" } }}>
  <Box component="span" sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
    1
  </Box>
  Heading
</Typography>

// Body text with theme colors
<Typography variant="body1" sx={{ color: "text.primary" }}>
  Content
</Typography>
```

#### Theme Tokens
```jsx
// All colors use MUI theme tokens for automatic dark mode
bgcolor: "primary.main"          // Primary color from theme
color: "primary.contrastText"    // Contrast text (white)
color: "text.primary"            // Primary text color (auto dark mode)
color: "text.secondary"          // Secondary text color (auto dark mode)
```

#### Image Handling
```jsx
// Uses local path, never temporary URLs
<Box component="img" src="/media/generated/2025-11-19-slug.png" />
```

### How It Works

1. **Read Input**: Loads markdown from `docs/bloghints/FrontierLabs.md`
2. **Generate Content**: Calls OpenAI API with structured JSON schema
3. **Generate Image**: Creates DALL-E 3 image if `imagePrompt` is present
4. **Download Image**: Fetches image from temporary URL and saves locally
5. **Build JSX**: Constructs React component with proper styling
6. **Write File**: Saves to `src/pages/blog/[date]-[slug].jsx`

### Configuration

Edit these constants in the script:

```javascript
const defaultModel = 'gpt-4.1-mini'  // OpenAI model
const inputFile = 'docs/bloghints/FrontierLabs.md'  // Input file
const blogDir = 'apps/personal-website/src/pages/blog/'  // Output directory
const mediaDir = 'apps/personal-website/public/media/generated/'  // Image storage
```

### Recent Updates (2025-11-19)

#### Fixed: Dark Mode Text Visibility
- Added `text-gray-900 dark:text-white` to all headings
- Added `text-gray-700 dark:text-gray-300` to all paragraphs
- Changed number badges from gradient to solid colors with dark mode variant

#### Fixed: Image Persistence
- Added `downloadImage()` function to save images locally
- Images now stored in `/public/media/generated/` with permanent paths
- No more expired Azure blob URLs

#### Fixed: Automated Best Practices
- Template now includes all necessary dark mode classes
- Future posts automatically get proper styling
- No manual fixes required after generation

#### Migrated: Pure MUI v8 Standard (LATEST)
- **Eliminated Tailwind completely** - Now generates pure MUI v8 components
- **Theme-based styling** - All colors use MUI theme tokens
- **Automatic dark mode** - No manual dark mode classes needed
- **Better maintainability** - Single styling system, no CSS conflicts
- **Type safety** - Full TypeScript support for all components

**Template Changes:**
```jsx
// OLD (Tailwind)
<div className="space-y-8">
  <h2 className="text-gray-900 dark:text-white">

// NEW (MUI v8)
import { Box, Typography } from "@mui/material";
<Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
  <Typography variant="h2" sx={{ color: "text.primary" }}>
```

### Troubleshooting

#### "AuthenticationError: 401"
- Check `OPENAI_API_KEY` in `.env` file
- Verify key is valid at https://platform.openai.com/account/api-keys

#### "Input file missing"
- Ensure `docs/bloghints/FrontierLabs.md` exists
- Check file path is correct

#### "Image download failed"
- Check internet connection
- Verify `/public/media/generated/` directory exists
- Check disk space

#### Text Not Visible in Dark Mode
- **Browser Cache**: Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- **Verify Classes**: Check JSX has `dark:text-white` and `dark:text-gray-300`
- **Check Theme**: Ensure MUI theme is properly configured

### Manual Steps After Generation

1. **Update Blog Data**: Add entry to `src/data/blogPostsData.js`
   ```javascript
   {
     title: "Your Title",
     date: "Month DD, YYYY",
     excerpt: "Description",
     tags: ["Tag1", "Tag2"],
     image: "/media/generated/YYYY-MM-DD-slug.png", // ⚠️ LOCAL PATH
     link: "/blog/YYYY-MM-DD-slug",
   }
   ```

2. **Test in Browser**:
   - Navigate to `/blog` to see listing
   - Click post to view full content
   - Toggle dark mode to verify visibility
   - Check image loads correctly

3. **Commit Changes**:
   ```bash
   git add .
   git commit -m "Add blog post: [title]"
   git push
   ```

### Best Practices

✅ **DO**:
- Use local image paths (`/media/generated/...`)
- Test in both light and dark modes
- Keep blog hints for documentation
- Use descriptive slugs

❌ **DON'T**:
- Use temporary Azure URLs in production
- Hardcode colors (use Tailwind with dark variants)
- Skip testing dark mode
- Delete blog hint files

### Related Documentation

- [BLOG_POST_GENERATION.md](../../docs/BLOG_POST_GENERATION.md) - Complete guide
- [BLOG_POST_CHECKLIST.md](../../docs/BLOG_POST_CHECKLIST.md) - Quick checklist
- [BlogPostLayout.jsx](../src/components/BlogPostLayout.jsx) - Theme bridge

### Support

For issues:
1. Check documentation in `/docs`
2. Verify environment variables
3. Test with sample blog hint
4. Check browser console for errors
