# @kumar2net/ui-theme

Material 3 theme primitives for the personal website.

This package uses MUI v8 CSS variable theming and exposes a small API via named exports.

```tsx
import { ThemeProvider } from "@kumar2net/ui-theme";

function AppProviders({ children }) {
  return <ThemeProvider defaultMode="system">{children}</ThemeProvider>;
}
```

## Theme access

- Use `getTheme(mode)` when you need a theme object (e.g. testing, SSR, or a one-off theme override).
- Use `colorTokens` to access the underlying palette primitives.

## Material 3 container roles (additive)

The theme adds Material Design 3 container roles under `theme.palette.m3`:

- `theme.palette.m3.primaryContainer` / `theme.palette.m3.onPrimaryContainer`
- `theme.palette.m3.secondaryContainer` / `theme.palette.m3.onSecondaryContainer`

These are intended for tonal surfaces (highlighted containers) and their corresponding readable foreground colors. Existing usage of `theme.palette.primary.main` and `theme.palette.primary.contrastText` remains supported and unchanged.
