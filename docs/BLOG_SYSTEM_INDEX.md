# Blog System Documentation Index

**Last Updated**: November 19, 2025  
**Status**: MUI v8 Standard ✅

---

## Quick Start

**Generate a new blog post:**
```bash
node apps/personal-website/scripts/generate-blog-post.mjs
```

**Check the checklist:**
- [BLOG_POST_CHECKLIST.md](./BLOG_POST_CHECKLIST.md)

---

## Core Documentation

### 📘 [BLOG_POST_GENERATION.md](./BLOG_POST_GENERATION.md)
**Complete guide to blog post generation**
- How to create blog hint files
- Running the generation script
- Generated output structure (MUI v8)
- MUI theme integration
- Manual steps required
- Troubleshooting guide

### ✅ [BLOG_POST_CHECKLIST.md](./BLOG_POST_CHECKLIST.md)
**Quick reference checklist**
- Pre-generation steps
- Post-generation verification
- Testing checklist (light/dark mode)
- Common issues and quick fixes

### 🔧 [scripts/README.md](../apps/personal-website/scripts/README.md)
**Script technical documentation**
- How the generation script works
- Configuration options
- MUI v8 component structure
- Recent updates and fixes

---

## Migration Documentation

### 🔄 [TAILWIND_TO_MUI_MIGRATION.md](./TAILWIND_TO_MUI_MIGRATION.md)
**Guide for migrating existing blog posts**
- Why migrate from Tailwind to MUI v8
- Step-by-step conversion patterns
- Before/after examples
- Theme token reference
- Migration checklist
- Common issues

### 📊 [MUI_V8_MIGRATION_SUMMARY.md](./MUI_V8_MIGRATION_SUMMARY.md)
**Complete migration summary**
- What was done (all 3 tasks)
- Benefits achieved
- Migration status
- Technical details
- Testing results
- Next steps

---

## Technical Documentation

### 🐛 [MUI_V8_DARK_MODE_FIX.md](./MUI_V8_DARK_MODE_FIX.md)
**Root cause analysis of dark mode issue**
- Problem statement
- Root cause (CSS specificity with `!important`)
- Solution (removed `!important` from BlogPostLayout)
- Why it happened
- Lessons learned
- Prevention strategies

---

## Document Purpose Matrix

| Document | Purpose | Audience | When to Use |
|----------|---------|----------|-------------|
| **BLOG_POST_GENERATION.md** | Complete workflow guide | All users | First time setup, reference |
| **BLOG_POST_CHECKLIST.md** | Quick checklist | All users | Every blog post creation |
| **scripts/README.md** | Technical script docs | Developers | Understanding/modifying script |
| **TAILWIND_TO_MUI_MIGRATION.md** | Migration guide | Developers | Converting old posts |
| **MUI_V8_MIGRATION_SUMMARY.md** | Migration summary | Project leads | Understanding what changed |
| **MUI_V8_DARK_MODE_FIX.md** | Root cause analysis | Developers | Understanding the fix |

---

## Quick Reference

### MUI v8 Components

```jsx
import { Box, Typography } from "@mui/material";

// Container
<Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>

// Heading with badge
<Typography variant="h2" sx={{ fontSize: { xs: "1.5rem", md: "1.875rem" } }}>
  <Box component="span" sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
    1
  </Box>
  Heading
</Typography>

// Body text
<Typography variant="body1" sx={{ fontSize: "1.125rem", color: "text.primary" }}>
  Content
</Typography>

// Image
<Box component="img" src="/media/generated/image.png" sx={{ width: "100%", borderRadius: 2 }} />
```

### Theme Tokens

| Token | Purpose |
|-------|---------|
| `primary.main` | Primary color (blue) |
| `primary.contrastText` | Contrast text (white) |
| `text.primary` | Primary text (auto dark mode) |
| `text.secondary` | Secondary text (auto dark mode) |

### Common Commands

```bash
# Generate blog post
node apps/personal-website/scripts/generate-blog-post.mjs

# Start dev server
npm run dev

# Check for generated images
ls apps/personal-website/public/media/generated/
```

---

## Migration Timeline

| Date | Event |
|------|-------|
| **2025-11-18** | MUI v8 migration caused dark mode issues |
| **2025-11-19** | Fixed dark mode by removing `!important` |
| **2025-11-19** | Migrated to pure MUI v8 standard |
| **2025-11-19** | Updated all documentation |

---

## Current Status

### ✅ Completed
- [x] Blog post generation script (MUI v8)
- [x] Migration guide created
- [x] All documentation updated
- [x] Example post migrated and tested
- [x] Dark mode verified working

### 🎯 Current Standard
- **Styling**: Pure MUI v8 (no Tailwind)
- **Components**: `Box`, `Typography`
- **Theme**: MUI theme tokens
- **Dark Mode**: Automatic via theme

---

## Support

### Having Issues?

1. **Check the checklist**: [BLOG_POST_CHECKLIST.md](./BLOG_POST_CHECKLIST.md)
2. **Read troubleshooting**: [BLOG_POST_GENERATION.md#troubleshooting](./BLOG_POST_GENERATION.md#troubleshooting)
3. **Review migration guide**: [TAILWIND_TO_MUI_MIGRATION.md](./TAILWIND_TO_MUI_MIGRATION.md)
4. **Check root cause doc**: [MUI_V8_DARK_MODE_FIX.md](./MUI_V8_DARK_MODE_FIX.md)

### Common Questions

**Q: Why MUI v8 instead of Tailwind?**  
A: Eliminates CSS conflicts, provides automatic dark mode, single source of truth for theming.

**Q: How do I migrate an old blog post?**  
A: Follow [TAILWIND_TO_MUI_MIGRATION.md](./TAILWIND_TO_MUI_MIGRATION.md)

**Q: Text is invisible in dark mode?**  
A: Ensure using MUI theme tokens (`color: "text.primary"`), hard refresh browser.

**Q: Image not showing?**  
A: Check path uses `/media/generated/` not temporary Azure URL.

---

## Related Files

### Scripts
- `apps/personal-website/scripts/generate-blog-post.mjs`

### Components
- `apps/personal-website/src/components/BlogPostLayout.jsx`

### Data
- `apps/personal-website/src/data/blogPostsData.js`

### Theme
- `apps/personal-website/src/theme/getDesignTokens.ts`
- `apps/personal-website/src/providers/ColorModeProvider.tsx`

---

**Maintained by**: Development Team  
**Last Review**: November 19, 2025  
**Next Review**: As needed
