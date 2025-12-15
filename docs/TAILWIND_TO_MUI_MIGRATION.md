# Tailwind to MUI Migration Guide for Blog Posts

**Purpose**: Migrate existing blog posts from Tailwind CSS to MUI components + theme-aware styling  
**Status**: Active Migration  
**Target**: All blog posts in `/apps/personal-website/src/pages/blog/`

## Why Migrate?

### Problems with Tailwind + MUI Mix
1. **CSS Specificity Conflicts**: Tailwind classes and MUI theme compete for priority
2. **Dark Mode Issues**: long-form content can drift if colors don’t track the active MUI scheme
3. **Maintenance Burden**: Two styling systems to maintain and debug
4. **Inconsistent Theming**: Hard to ensure consistent colors across modes

### Benefits of MUI + CSS-variable theming
✅ **Single Source of Truth**: MUI theme controls all colors and spacing  
✅ **Automatic Dark Mode**: Theme handles mode switching seamlessly  
✅ **Type Safety**: Full TypeScript support for all components  
✅ **Better Performance**: No CSS specificity battles  
✅ **Cleaner Code**: Consistent API across all components  

## Migration Steps

### Step 1: Identify Tailwind Patterns

Common Tailwind patterns in blog posts:

```jsx
// Container
<div className="space-y-8">

// Section
<section className="mb-12">

// Heading with badge
<h2 className="text-3xl font-semibold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white dark:bg-blue-500 font-bold text-lg shadow-lg">
    1
  </span>
  Section Heading
</h2>

// Paragraph
<p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
  Content here
</p>

// Image
<img src="/path/to/image.png" alt="Description" className="rounded-lg shadow-lg w-full" />
<p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
  Caption
</p>
```

### Step 2: Convert to MUI Components

#### Import Statement
```jsx
// ADD THIS AT THE TOP
import { Box, Typography } from "@mui/material";
```

#### Container Conversion
```jsx
// BEFORE (Tailwind)
<div className="space-y-8">
  {/* content */}
</div>

// AFTER (MUI)
<Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
  {/* content */}
</Box>
```

**Explanation**: `gap: 6` = 48px (6 × 8px spacing unit) ≈ Tailwind's `space-y-8` (32px)

#### Section Conversion
```jsx
// BEFORE (Tailwind)
<section className="mb-12">
  {/* content */}
</section>

// AFTER (MUI)
<Box component="section">
  {/* content */}
</Box>
```

**Explanation**: Margin is handled by parent's `gap` property

#### Heading with Badge Conversion
```jsx
// BEFORE (Tailwind)
<h2 className="text-3xl font-semibold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white dark:bg-blue-500 font-bold text-lg shadow-lg">
    1
  </span>
  Section Heading
</h2>

// AFTER (MUI)
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
```

**Key Changes**:
- `text-3xl` → `fontSize: { xs: "1.5rem", md: "1.875rem" }` (responsive)
- `text-gray-900 dark:text-white` → Use `color: "var(--mui-palette-text-primary)"` for long-form content
- `bg-blue-600 dark:bg-blue-500` → `bgcolor: "primary.main"` (theme-aware)
- `w-10 h-10` → `width: 40, height: 40` (pixels)
- `gap-3` → `gap: 1.5` (12px)

#### Paragraph Conversion
```jsx
// BEFORE (Tailwind)
<p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
  Content here
</p>

// AFTER (MUI)
<Typography
  variant="body1"
  sx={{
    fontSize: "1.125rem",
    lineHeight: 1.8,
    color: "var(--mui-palette-text-primary)",
  }}
>
  Content here
</Typography>
```

**Key Changes**:
- `text-lg` → `fontSize: "1.125rem"` (18px)
- `leading-relaxed` → `lineHeight: 1.8`
- `text-gray-700 dark:text-gray-300` → `color: "var(--mui-palette-text-primary)"`

#### Image Conversion
```jsx
// BEFORE (Tailwind)
<img 
  src="/path/to/image.png" 
  alt="Description" 
  className="rounded-lg shadow-lg w-full" 
/>
<p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
  Caption
</p>

// AFTER (MUI)
<Box
  component="img"
  src="/path/to/image.png"
  alt="Description"
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
    color: "var(--mui-palette-text-secondary)",
  }}
>
  Caption
</Typography>
```

**Key Changes**:
- `<img>` → `<Box component="img">`
- `rounded-lg` → `borderRadius: 2` (16px)
- `shadow-lg` → `boxShadow: 3`
- `w-full` → `width: "100%"`
- `text-sm` → `variant="caption"`
- `text-gray-500 dark:text-gray-400` → `color: "text.secondary"`

### Step 3: Complete Example

Here's a complete before/after example:

#### BEFORE (Tailwind)
```jsx
export default function BlogPost() {
  return (
    <div className="space-y-8">
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white dark:bg-blue-500 font-bold text-lg shadow-lg">
            1
          </span>
          Introduction
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            This is the introduction paragraph.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <img 
          src="/media/generated/example.png" 
          alt="Example" 
          className="rounded-lg shadow-lg w-full" 
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
          AI Generated Illustration
        </p>
      </section>
    </div>
  );
}
```

#### AFTER (MUI)
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
          Introduction
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          This is the introduction paragraph.
        </Typography>
      </Box>

      <Box component="section">
        <Box
          component="img"
          src="/media/generated/example.png"
          alt="Example"
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
            color: "var(--mui-palette-text-secondary)",
          }}
        >
          AI Generated Illustration
        </Typography>
      </Box>
    </Box>
  );
}
```

## Theme Reference

### Colors
| Tailwind | Recommended value | Light Mode | Dark Mode |
|----------|--------------|------------|-----------|
| `text-gray-900` | `var(--mui-palette-text-primary)` | Dark | Light |
| `text-gray-700` | `var(--mui-palette-text-primary)` | Dark | Light |
| `text-gray-500` | `var(--mui-palette-text-secondary)` | Medium | Medium |
| `text-gray-300` | `var(--mui-palette-text-secondary)` | - | Medium |
| `bg-blue-600` | `primary.main` | `#2563eb` | `#3b82f6` |
| `text-white` | `primary.contrastText` | `#ffffff` | `#ffffff` |

### Spacing
| Tailwind | MUI (`sx`) | Pixels |
|----------|--------|--------|
| `space-y-8` | `gap: 6` | 48px |
| `mb-12` | `mb: 6` | 48px |
| `mb-6` | `mb: 3` | 24px |
| `gap-3` | `gap: 1.5` | 12px |
| `mt-2` | `mt: 1` | 8px |

### Border Radius
| Tailwind | MUI (`sx`) | Pixels |
|----------|--------|--------|
| `rounded-lg` | `borderRadius: 2` | 16px |
| `rounded-full` | `borderRadius: "50%"` | Circle |

### Shadows
| Tailwind | MUI (`sx`) | Description |
|----------|--------|-------------|
| `shadow-lg` | `boxShadow: 3` | Large shadow |
| `shadow-md` | `boxShadow: 2` | Medium shadow |

## Migration Checklist

For each blog post file:

- [ ] Add MUI imports: `import { Box, Typography } from "@mui/material";`
- [ ] Replace `<div className="space-y-8">` with `<Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>`
- [ ] Replace all `<section>` with `<Box component="section">`
- [ ] Replace all `<h2>` with `<Typography variant="h2" sx={{...}}>`
- [ ] Replace all `<p>` with `<Typography variant="body1" sx={{...}}>`
- [ ] Replace all `<img>` with `<Box component="img" sx={{...}}>`
- [ ] Remove all Tailwind classes
- [ ] Use MUI theme tokens (`primary.main`, `text.primary`, etc.)
- [ ] Test in both light and dark modes
- [ ] Verify responsive behavior (mobile/desktop)

## Automated Migration Script (Future)

For bulk migration, consider creating a script:

```javascript
// migrate-blog-posts.mjs
// TODO: Implement automated migration for all blog posts
```

## Testing After Migration

1. **Visual Test**: Open blog post in browser
2. **Dark Mode Test**: Toggle dark mode, verify text visibility
3. **Light Mode Test**: Toggle light mode, verify text visibility
4. **Responsive Test**: Test on mobile and desktop viewports
5. **Theme Test**: Verify colors match MUI theme tokens

## Common Issues

### Issue: Text Still Invisible in Dark Mode
**Cause**: Long-form content colors not bound to CSS variables (so they don’t follow the active scheme)  
**Fix**: Use `var(--mui-palette-text-primary)` / `var(--mui-palette-text-secondary)` for content wrappers (or rely on `BlogPostLayout` / `MarkdownSurface`)

### Issue: Spacing Looks Different
**Cause**: MUI spacing units (8px) vs Tailwind spacing (4px base)  
**Fix**: Adjust `gap` values to match visual appearance

### Issue: Colors Don't Match Theme
**Cause**: Using hardcoded colors instead of theme tokens  
**Fix**: Replace hex colors with theme tokens or CSS variables (`primary.main`, `var(--mui-palette-text-primary)`)

## Related Documentation

- [MUI_CSS_VARS_DARK_MODE_FIX.md](./MUI_CSS_VARS_DARK_MODE_FIX.md) - Root cause analysis
- [BLOG_POST_GENERATION.md](./BLOG_POST_GENERATION.md) - Generation workflow
- [MUI Documentation](https://mui.com/material-ui/)
- [MUI Theme Tokens](https://mui.com/material-ui/customization/default-theme/)

## Migration Progress

Track migration status here:

### ✅ Migrated
- `2025-11-19-lots-of-new-announcements-frontier-labs.jsx`
- `2025-09-13-price-parity.jsx`
- `2025-09-13-agentic-feature-in-a-browser.jsx`

### 🔄 In Progress
- (List files currently being migrated)

### ⏳ Pending
- (List files that need migration)

## Summary

**Goal**: Migrate Tailwind-heavy blog posts to MUI-first styling  
**Method**: Replace Tailwind classes with MUI components and `sx` prop  
**Benefit**: Consistent theming, no CSS conflicts, automatic dark mode  
**Status**: Template updated, migration guide created, ready for bulk migration
