# Blog Post Generation Guide

## Overview

This guide documents the automated blog post generation workflow, including recent fixes to ensure proper dark mode support and permanent image storage.

## Quick Start

### Generating a New Blog Post

1. Create a blog hint file in `docs/bloghints/[TopicName].md`
2. Run the generation script:
   ```bash
   node apps/personal-website/scripts/generate-blog-post.mjs
   ```
3. The script will:
   - Generate blog post content using OpenAI
   - Create AI-generated illustrations (if requested)
   - Download images to local storage
   - Create a properly formatted JSX file with dark mode support
4. Manually update `apps/personal-website/src/data/blogPostsData.js` with the new post metadata

## Blog Hint File Format

Create a markdown file in `docs/bloghints/` with the following structure:

```markdown
blog post title: Your Post Title Here
Section 1: First Section Heading
    Your content for section 1 goes here
    Multiple lines are supported
Section 2: Second Section Heading
    Your content for section 2
Section 3: Third Section Heading
    Your content for section 3
Generate an image of the above situation using openai image generator
```

### Example

See `docs/bloghints/FrontierLabs.md` for a complete example.

## Generated Output

### 1. Blog Post JSX File

**Location**: `apps/personal-website/src/pages/blog/[YYYY-MM-DD]-[slug].jsx`

**Features**:
- ✅ Pure MUI v8 components (Box, Typography)
- ✅ Theme-aware colors using MUI tokens (`primary.main`, `text.primary`)
- ✅ Automatic dark mode support via MUI theme
- ✅ Responsive typography with breakpoints
- ✅ Local image paths (no temporary URLs)

**Example Structure**:
```jsx
import { Box, Typography } from "@mui/material";

export default function BlogPost() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Box component="section">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            component="span"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 700,
              fontSize: "1.125rem",
              boxShadow: 2,
            }}
          >
            1
          </Box>
          Section Heading
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          Section content...
        </Typography>
      </Box>
      
      {/* AI-generated image section */}
      <Box component="section">
        <Box
          component="img"
          src="/media/generated/[YYYY-MM-DD]-[slug].png"
          alt="AI Generated Illustration"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            textAlign: "center",
            fontStyle: "italic",
            color: "text.secondary",
          }}
        >
          AI Generated Illustration
        </Typography>
      </Box>
    </Box>
  );
}
```

### 2. AI-Generated Images

**Storage Location**: `apps/personal-website/public/media/generated/`

**Naming Convention**: `[YYYY-MM-DD]-[slug].png`

**Process**:
1. Script generates image using DALL-E 3
2. Downloads image from temporary Azure blob URL
3. Saves to local storage with permanent path
4. Uses local path in JSX (`/media/generated/[filename].png`)

**Benefits**:
- ✅ Images never expire
- ✅ No external dependencies
- ✅ Faster page loads
- ✅ Works offline

## Manual Steps Required

### Update Blog Post Data

After generating a blog post, manually add an entry to `apps/personal-website/src/data/blogPostsData.js`:

```javascript
export const blogPosts = [
  {
    title: "Your Blog Post Title",
    date: "November 19, 2025",
    lastModified: "November 19, 2025",
    excerpt: "A brief description of your blog post content.",
    tags: ["Tag1", "Tag2", "Tag3"],
    image: "/media/generated/2025-11-19-your-slug.png", // ⚠️ Use local path!
    link: "/blog/2025-11-19-your-slug",
  },
  // ... other posts
];
```

**⚠️ IMPORTANT**: Always use local image paths (`/media/generated/...`) instead of temporary URLs!

## MUI v8 Theme Integration

### Theme Tokens

All generated blog posts use MUI v8 theme tokens for automatic dark mode support:

| Element | MUI Token | Light Mode | Dark Mode |
|---------|-----------|------------|-----------|
| Headings | `text.primary` | Dark gray | White |
| Body text | `text.primary` | Dark gray | White |
| Captions | `text.secondary` | Medium gray | Light gray |
| Badge background | `primary.main` | Blue | Blue |
| Badge text | `primary.contrastText` | White | White |

### How It Works

MUI v8's CSS variables system automatically handles theme switching:

```jsx
// This color automatically changes based on theme mode
<Typography sx={{ color: "text.primary" }}>
  Text that's dark in light mode, white in dark mode
</Typography>

// Primary color from theme
<Box sx={{ bgcolor: "primary.main" }}>
  Background uses theme's primary color
</Box>
```

### Benefits

✅ **No manual dark mode classes needed** - Theme handles everything  
✅ **Consistent colors** - All components use same theme tokens  
✅ **Type-safe** - TypeScript knows all valid theme tokens  
✅ **Centralized control** - Change theme in one place, affects all posts  

### BlogPostLayout Theme Bridge

The `BlogPostLayout.jsx` component provides a theme bridge for blog content. It no longer needs `!important` declarations because MUI components respect the theme natively.

## Troubleshooting

### Issue: Text Not Visible in Dark Mode

**Symptoms**: Text appears invisible or hard to read in dark mode

**Causes**:
1. Using hardcoded colors instead of theme tokens
2. BlogPostLayout has `!important` declarations (legacy issue)
3. Missing MUI imports

**Solution**:
1. Ensure all colors use theme tokens: `color: "text.primary"`, `bgcolor: "primary.main"`
2. Verify BlogPostLayout.jsx doesn't have `!important` in color properties
3. Check imports: `import { Box, Typography } from "@mui/material";`
4. Hard refresh browser (Cmd+Shift+R) to clear cached CSS

### Issue: Image Not Showing

**Symptoms**: Broken image icon or missing image on blog listing or post page

**Causes**:
1. Using expired Azure blob URL instead of local path
2. Image not downloaded to `/public/media/generated/`
3. Incorrect path in `blogPostsData.js`

**Solution**:
1. Check if image exists: `ls apps/personal-website/public/media/generated/`
2. Verify path in JSX uses `/media/generated/[filename].png`
3. Verify path in `blogPostsData.js` matches JSX
4. If image missing, regenerate or manually download

### Issue: Styling Looks Wrong

**Symptoms**: Spacing, colors, or layout doesn't match other posts

**Causes**:
1. Using Tailwind classes instead of MUI components
2. Incorrect `sx` prop values
3. Missing responsive breakpoints

**Solution**:
1. Ensure using MUI components (`Box`, `Typography`) not HTML elements
2. Check `sx` prop syntax: `sx={{ fontSize: "1.125rem" }}` not `sx="..."`
3. Add responsive values: `fontSize: { xs: "1rem", md: "1.125rem" }`
4. Compare with working blog post for reference

### Issue: OpenAI API Key Error

**Symptoms**: `AuthenticationError: 401 Incorrect API key`

**Causes**:
1. Missing or expired `OPENAI_API_KEY` in `.env`
2. Invalid API key format

**Solution**:
1. Check `.env` file in repository root
2. Verify API key is valid at https://platform.openai.com/account/api-keys
3. Ensure key starts with `sk-proj-` or `sk-`

## Script Configuration

### Environment Variables

Required in `.env` file:

```bash
OPENAI_API_KEY=sk-proj-your-key-here
BLOGHINT_AGENT_MODEL=gpt-4.1-mini  # Optional, defaults to gpt-4.1-mini
```

### File Paths

The script uses these paths (relative to repository root):

```javascript
const inputFile = 'docs/bloghints/FrontierLabs.md'
const outputDir = 'apps/personal-website/src/pages/blog/'
const imageDir = 'apps/personal-website/public/media/generated/'
```

## Recent Fixes (November 19, 2025)

### 1. Dark Mode Text Visibility
- **Issue**: Section headings and paragraph text were invisible in dark mode
- **Fix**: Added explicit dark mode color classes to all text elements
- **Impact**: All blog posts now have proper contrast in both light and dark themes

### 2. Image Storage and Persistence
- **Issue**: AI-generated images used temporary Azure blob URLs that expired after 2 hours
- **Fix**: Added `downloadImage()` function to download and save images locally
- **Impact**: Images are now permanent and never expire

### 3. Automated Template Updates
- **Issue**: Manual fixes required for each generated post
- **Fix**: Updated `buildBlogJSX()` template to include all necessary classes
- **Impact**: Future posts automatically include dark mode support and local image paths

### 4. MUI v8 Migration Dark Mode Issue (ROOT CAUSE)
- **Issue**: After MUI v8 migration, Tailwind dark mode classes stopped working - text was invisible in dark mode
- **Root Cause**: `BlogPostLayout.jsx` was using `!important` in its `sx` prop to force MUI theme colors, which prevented Tailwind classes from overriding them
- **Fix**: Removed `!important` from color properties in `BlogPostLayout.jsx` to allow Tailwind dark mode classes to work
- **Impact**: All blog posts now properly display text in both light and dark modes without requiring inline styles

**Technical Details:**
```jsx
// BEFORE (broken in dark mode)
"& h2": {
  color: `${theme.palette.text.primary} !important`, // Blocks Tailwind
}

// AFTER (works in dark mode)
"& h2": {
  color: theme.palette.text.primary, // Allows Tailwind override
}
```

The Tailwind classes `text-gray-900 dark:text-white` now properly override the MUI theme colors when dark mode is active.

### 5. Complete Migration to MUI v8 Standard (LATEST)
- **Issue**: Mixing Tailwind and MUI v8 caused CSS specificity conflicts and maintenance burden
- **Decision**: Eliminate Tailwind completely, use pure MUI v8 components
- **Fix**: 
  - Updated `buildBlogJSX()` to generate MUI components instead of Tailwind classes
  - Migrated existing blog posts to use `Box`, `Typography`, and `sx` prop
  - Created comprehensive migration guide for converting remaining posts
- **Impact**: 
  - No more CSS conflicts between styling systems
  - Automatic dark mode via MUI theme tokens
  - Cleaner, more maintainable code
  - Single source of truth for theming
  - Better TypeScript support

**New Template Structure:**
```jsx
import { Box, Typography } from "@mui/material";

// Uses MUI theme tokens instead of Tailwind classes
<Typography sx={{ color: "text.primary" }}>  // Auto dark mode
<Box sx={{ bgcolor: "primary.main" }}>       // Theme-aware
```

## Best Practices

### ✅ DO

- Always use local image paths (`/media/generated/...`)
- Use MUI v8 components (`Box`, `Typography`) instead of HTML elements
- Use MUI theme tokens (`primary.main`, `text.primary`) for all colors
- Test in both light and dark modes before publishing
- Keep blog hint files in `docs/bloghints/` for reference
- Use descriptive slugs for SEO
- Add responsive breakpoints for mobile/desktop: `fontSize: { xs: "1rem", md: "1.125rem" }`

### ❌ DON'T

- Don't use temporary Azure blob URLs in production
- Don't use Tailwind classes (use MUI `sx` prop instead)
- Don't hardcode colors (use theme tokens)
- Don't skip updating `blogPostsData.js`
- Don't delete blog hint files (they serve as documentation)
- Don't mix styling systems (pure MUI v8 only)

## Future Improvements

### Potential Enhancements

1. **Automatic blogPostsData.js Updates**: Script could automatically append to the data file
2. **Image Optimization**: Compress images during download for better performance
3. **Multiple Images**: Support for multiple images per blog post
4. **Video Generation**: Integration with Sora for video content
5. **SEO Metadata**: Automatic generation of meta descriptions and keywords

## Related Documentation

- [RUNBOOK-dev.md](./RUNBOOK-dev.md) - Development workflow
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [BlogPostLayout.jsx](../apps/personal-website/src/components/BlogPostLayout.jsx) - Theme bridge implementation

## Support

For issues or questions:
1. Check this documentation
2. Review recent fixes in git history
3. Test in local development environment first
4. Verify all paths and environment variables
