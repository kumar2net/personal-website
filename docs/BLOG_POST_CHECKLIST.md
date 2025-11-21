# Blog Post Generation Checklist

## Pre-Generation

- [ ] Create blog hint file in `docs/bloghints/[TopicName].md`
- [ ] Verify `OPENAI_API_KEY` is set in `.env`
- [ ] Ensure dev server is running (`npm run dev`)

## Generation

- [ ] Run: `node apps/personal-website/scripts/generate-blog-post.mjs`
- [ ] Verify no errors in console output
- [ ] Generate a cover image with OpenAI Image API and save to `/generate/` (e.g. `generate/2025-11-21-my-slug.png`)
- [ ] Copy/move the saved image to `apps/personal-website/public/generate/` (served at `/generate/filename.png`)
- [ ] Start dev server (`npm run dev -- --filter=personal-website`) and review the generated page and image manually before staging/committing
- [ ] Ensure tags render as shields.io badges at the top of the post; confirm all tags from the data entry are present

## Post-Generation

- [ ] Open generated JSX file in `src/pages/blog/[date]-[slug].jsx`
- [ ] Verify MUI imports are present: `import { Box, Typography } from "@mui/material";`
- [ ] Verify MUI components are used (not HTML elements):
  - [ ] `<Box>` instead of `<div>` or `<section>`
  - [ ] `<Typography>` instead of `<h2>` or `<p>`
- [ ] Verify theme tokens are used (not hardcoded colors):
  - [ ] `bgcolor: "primary.main"` for badges
  - [ ] `color: "text.primary"` for body text
  - [ ] `color: "text.secondary"` for captions
- [ ] Verify image path uses local storage: `/generate/[filename].png`
- [ ] No Tailwind classes present (no `className` with Tailwind utilities)

## Update Blog Data

- [ ] Open `src/data/blogPostsData.js`
- [ ] Add new entry at the top of the array:
  ```javascript
  {
    title: "Your Title",
    date: "Month DD, YYYY",
    lastModified: "Month DD, YYYY",
    excerpt: "Brief description",
    tags: ["Tag1", "Tag2"],
    image: "/generate/YYYY-MM-DD-slug.png", // ⚠️ LOCAL PATH!
    link: "/blog/YYYY-MM-DD-slug",
  }
  ```
- [ ] Verify image path matches the JSX file

## Testing

- [ ] Navigate to `http://localhost:5173/blog`
- [ ] Verify blog post appears in listing with image
- [ ] Click on blog post to view full content
- [ ] Test in **light mode**:
  - [ ] All text is readable
  - [ ] Image displays correctly
  - [ ] Number badges are visible
- [ ] Test in **dark mode**:
  - [ ] All text is readable (white/light gray)
  - [ ] Image displays correctly
  - [ ] Number badges have proper contrast
- [ ] Test on mobile viewport
- [ ] Verify image loads (not broken)

## Common Issues

### Image Not Showing
- ✅ Check path: `/media/generated/` not `https://oaidalleapiprodscus...`
- ✅ Verify file exists in `public/media/generated/`
- ✅ Check both JSX and blogPostsData.js use same path

### Text Not Visible in Dark Mode
- ✅ Ensure using MUI theme tokens: `color: "text.primary"`
- ✅ Check MUI imports: `import { Box, Typography } from "@mui/material";`
- ✅ Verify no hardcoded colors (no `color: "#000000"`)
- ✅ Hard refresh browser (Cmd+Shift+R) to clear cached CSS

### Styling Looks Wrong
- ✅ Ensure using MUI components (`Box`, `Typography`) not HTML elements
- ✅ Check `sx` prop syntax: `sx={{ fontSize: "1.125rem" }}`
- ✅ Verify no Tailwind classes present
- ✅ Compare with working blog post for reference

### API Key Error
- ✅ Check `.env` has valid `OPENAI_API_KEY`
- ✅ Verify key is not expired
- ✅ Test key at https://platform.openai.com/

## Final Steps

- [ ] Commit changes to git
- [ ] Push to repository
- [ ] Deploy to production (if applicable)
- [ ] Verify on live site

## Quick Reference

| File | Purpose |
|------|---------|
| `docs/bloghints/[Topic].md` | Input content for generation |
| `scripts/generate-blog-post.mjs` | Generation script |
| `src/pages/blog/[date]-[slug].jsx` | Generated blog post |
| `src/data/blogPostsData.js` | Blog listing metadata |
| `public/media/generated/` | Permanent image storage |

## Time Estimate

- Blog hint creation: 10-15 minutes
- Script execution: 30-60 seconds
- Manual updates: 2-3 minutes
- Testing: 5 minutes
- **Total: ~20 minutes per post**
