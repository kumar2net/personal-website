// theme.ts
// -------------------------------------------
// MUI v8 theme using Material 3 color semantics (role-based),
// implemented with CSS variables via `experimental_extendTheme`.
//
// Visual parity note:
// This keeps existing palette values exactly as before, so the site
// appearance should remain unchanged while enabling additive M3 roles.
// -------------------------------------------

import { alpha, experimental_extendTheme } from "@mui/material/styles";
import { colorTokens } from "./colorTokens";

export type Scheme = "light" | "dark";

type Material3Roles = {
  primaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
};

declare module "@mui/material/styles" {
  interface Palette {
    /**
     * Material Design 3 color roles.
     *
     * These are additive (non-breaking) roles intended for "tonal" surfaces
     * and their matching foreground ("on") colors.
     *
     * Usage guidelines:
     * - `primaryContainer` / `onPrimaryContainer`: for emphasized surfaces
     *   like highlighted cards, callouts, and selected states.
     * - `secondaryContainer` / `onSecondaryContainer`: for supporting
     *   surfaces like less prominent highlights, filters, or chips.
     *
     * Keep using `palette.primary.*` for classic MUI components and existing
     * `sx`/theme access patterns; use `palette.m3.*` when you want explicit
     * Material 3 container semantics.
     */
    m3: Material3Roles;
  }

  interface PaletteOptions {
    m3?: Partial<Material3Roles>;
  }
}

const token = <K extends keyof typeof colorTokens>(key: K, scheme: Scheme) =>
  colorTokens[key][scheme];

const buildScheme = (scheme: Scheme) => ({
  palette: {
    mode: scheme,

    primary: {
      main: token("primary", scheme),
      contrastText: token("onPrimary", scheme),
    },
    secondary: {
      main: token("secondary", scheme),
      contrastText: token("onSecondary", scheme),
    },
    error: {
      main: token("error", scheme),
      contrastText: token("onError", scheme),
    },
    warning: {
      main: token("warning", scheme),
      contrastText: token("onWarning", scheme),
    },
    success: {
      main: token("success", scheme),
      contrastText: token("onSuccess", scheme),
    },

    background: {
      default: token("background", scheme),
      paper: token("surface", scheme),
    },

    text: {
      primary: token("onSurface", scheme),
      secondary: token("onSurfaceVariant", scheme),
      disabled: alpha(token("onSurface", scheme), 0.38),
    },

    divider: token("outlineVariant", scheme),

    // Material 3 container roles (additive, non-breaking).
    m3: {
      primaryContainer: token("primaryContainer", scheme),
      onPrimaryContainer: token("onPrimaryContainer", scheme),
      secondaryContainer: token("secondaryContainer", scheme),
      onSecondaryContainer: token("onSecondaryContainer", scheme),
    },
  },
});

export const getTheme = (scheme: Scheme) =>
  experimental_extendTheme({
    // Provide both color schemes so `CssVarsProvider` can switch modes
    // without needing to rebuild the theme object.
    colorSchemes: {
      light: buildScheme("light"),
      dark: buildScheme("dark"),
    },
    defaultColorScheme: scheme,

    // Keep typography, spacing, and component overrides unchanged.
    typography: {
      allVariants: {
        // Use CSS variables so the value follows the active color scheme.
        color: "var(--mui-palette-text-primary)",
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            // Use palette roles (backed by CSS variables) to stay in sync
            // with `CssVarsProvider` when the active scheme changes.
            backgroundColor: "var(--mui-palette-background-paper)",
            color: "var(--mui-palette-text-primary)",
          },
        },
      },
    },
  });

export { colorTokens };
