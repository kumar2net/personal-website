# Blog System Documentation Index

**Last Updated**: November 19, 2025  
**Status**: MUI 7 + CSS variables ✅

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
- Generated output structure (MUI + CSS variables)
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
- MUI component structure
- Recent updates and fixes

---

## Migration Documentation

### 🔄 [TAILWIND_TO_MUI_MIGRATION.md](./TAILWIND_TO_MUI_MIGRATION.md)
**Guide for migrating existing blog posts**
- Why migrate from Tailwind to MUI
- Step-by-step conversion patterns
- Before/after examples
- Theme token reference
- Migration checklist
- Common issues

---

## Technical Documentation

### 🐛 [MUI_CSS_VARS_DARK_MODE_FIX.md](./MUI_CSS_VARS_DARK_MODE_FIX.md)
**Root cause analysis of dark mode text issues**
- Why `color: "text.primary"` can be wrong under `CssVarsProvider`
- Correct approach for long-form content (use `var(--mui-palette-...)`)
- Where the fix lives (`BlogPostLayout`, `MarkdownSurface`)

---

## Document Purpose Matrix

| Document | Purpose | Audience | When to Use |
|----------|---------|----------|-------------|
| **BLOG_POST_GENERATION.md** | Complete workflow guide | All users | First time setup, reference |
| **BLOG_POST_CHECKLIST.md** | Quick checklist | All users | Every blog post creation |
| **scripts/README.md** | Technical script docs | Developers | Understanding/modifying script |
| **TAILWIND_TO_MUI_MIGRATION.md** | Migration guide | Developers | Converting old posts |
| **MUI_CSS_VARS_DARK_MODE_FIX.md** | Root cause analysis | Developers | Fixing dark-mode text |

---

## Quick Reference

### MUI Components (CSS Variables)

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

// Body text (tracks active scheme)
<Typography variant="body1" sx={{ fontSize: "1.125rem", color: "var(--mui-palette-text-primary)" }}>
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
| **2025-11-18** | Introduced MUI CSS-variable theming; uncovered dark mode text issues |
| **2025-11-19** | Standardized long-form content colors on `var(--mui-palette-...)` |
| **2025-11-19** | Updated all documentation |

---

## Current Status

### ✅ Completed
- [x] Blog post generation script (MUI components)
- [x] Migration guide created
- [x] All documentation updated
- [x] Dark mode verified working

### 🎯 Current Standard
- **Styling**: Prefer MUI `sx` + CSS variables; legacy Tailwind classes may exist in older posts
- **Components**: `Box`, `Typography`
- **Theme**: `@kumar2net/ui-theme` (`CssVarsProvider`)
- **Dark Mode**: Use `var(--mui-palette-...)` for long-form content wrappers

---

## Support

### Having Issues?

1. **Check the checklist**: [BLOG_POST_CHECKLIST.md](./BLOG_POST_CHECKLIST.md)
2. **Read troubleshooting**: [BLOG_POST_GENERATION.md#troubleshooting](./BLOG_POST_GENERATION.md#troubleshooting)
3. **Review migration guide**: [TAILWIND_TO_MUI_MIGRATION.md](./TAILWIND_TO_MUI_MIGRATION.md)
4. **Check root cause doc**: [MUI_CSS_VARS_DARK_MODE_FIX.md](./MUI_CSS_VARS_DARK_MODE_FIX.md)

### Common Questions

**Q: Why prefer MUI over Tailwind for new posts?**  
A: Keeps long-form content theme-aware via `CssVarsProvider` and reduces cross-system CSS conflicts.

**Q: How do I migrate an old blog post?**  
A: Follow [TAILWIND_TO_MUI_MIGRATION.md](./TAILWIND_TO_MUI_MIGRATION.md)

**Q: Text is invisible in dark mode?**  
A: When using MUI `CssVarsProvider`, prefer CSS variables for long-form content (e.g. `color: "var(--mui-palette-text-primary)"`) or rely on `BlogPostLayout` / `MarkdownSurface` wrappers. Avoid assuming `color: "text.primary"` will track the active scheme in all cases.

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
- `packages/ui-theme/theme.ts`
- `packages/ui-theme/ThemeProvider.tsx`
- `apps/personal-website/src/providers/ColorModeProvider.tsx`

---

**Maintained by**: Development Team  
**Last Review**: November 19, 2025  
**Next Review**: As needed
