# MUI CSS Variables - Dark Mode Text Fix

**Issue**: Blog content (especially headings) can become unreadable in dark mode when MUI CSS-variable theming is enabled.

## Root cause

This project uses MUI `CssVarsProvider` (via `@kumar2net/ui-theme`) to switch between light/dark schemes using CSS variables like:

- `var(--mui-palette-text-primary)`
- `var(--mui-palette-background-paper)`

In that setup:

- `sx={{ color: "text.primary" }}` (or `theme.palette.text.primary`) can resolve using the *default* scheme (often light) even when dark mode is active.
- For long-form content wrappers, this can produce “black text on dark surface” in dark mode.

## Fix strategy

For long-form content (blog posts, markdown surfaces), use CSS variables so colors always track the active scheme:

- Text: `color: "var(--mui-palette-text-primary)"`
- Secondary text: `color: "var(--mui-palette-text-secondary)"`
- Card/surface: `backgroundColor: "var(--mui-palette-background-paper)"`

## Where it’s implemented

- `apps/personal-website/src/components/BlogPostLayout.jsx` uses CSS variables for heading/body colors.
- `apps/personal-website/src/components/MarkdownSurface.jsx` renders markdown posts on a “paper” surface using CSS variables.
- `apps/personal-website/src/providers/ColorModeProvider.tsx` keeps Tailwind’s `.dark` class in sync with MUI’s active scheme.

## Rule of thumb

If the element is part of “reading content” (headings, paragraphs inside cards), prefer `var(--mui-palette-...)` over `theme.palette...` / `color: "text.primary"`.
