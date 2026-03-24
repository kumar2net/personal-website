# @kumar2net/ui-theme

Shared MUI 7 theme package for the repo.

## Exports
- `ThemeProvider`
- `getTheme(mode)`
- `colorTokens`

## Rules
- Use named exports only.
- Use this package provider instead of nesting raw `CssVarsProvider`s in app code.
- Treat it as the canonical theme surface for light/dark/system behavior across the repo.

## Notes
- Peer deps support React 18 or 19; the main app currently runs React 19.
- Keep style decisions here when they need to be shared, not duplicated in each app.
