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
      // Non-negotiable reading surface defaults:
      // - Long-form content uses `background.default` as the surface.
      // - LIGHT mode must be white to avoid container-tinted reading surfaces.
      default: scheme === "light" ? "#ffffff" : token("background", scheme),
      paper: scheme === "light" ? "#ffffff" : token("surface", scheme),
    },

    text: {
      // Non-negotiable readability defaults for LIGHT mode:
      // - Body text must meet WCAG AA on white backgrounds.
      // - Do not let text inherit from container roles by default.
      primary:
        scheme === "light" ? "rgba(0,0,0,0.87)" : token("onSurface", scheme),
      secondary:
        scheme === "light"
          ? "rgba(0,0,0,0.6)"
          : token("onSurfaceVariant", scheme),
      disabled:
        scheme === "light"
          ? "rgba(0,0,0,0.38)"
          : alpha(token("onSurface", scheme), 0.38),
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
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            color: "var(--mui-palette-text-primary)",
            backgroundColor: "var(--mui-palette-background-default)",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "inherit",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            // Use palette roles (backed by CSS variables) to stay in sync
            // with `CssVarsProvider` when the active scheme changes.
            backgroundColor: "var(--mui-palette-background-paper)",
            // Paper is a reading surface; it should not inherit accidental
            // "onPrimary"/container foregrounds from ancestors.
            color: "var(--mui-palette-text-primary)",
          },
        },
      },
      // Guardrails: any surface-like UI should default to readable text in both schemes.
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--mui-palette-background-paper)",
            color: "var(--mui-palette-text-primary)",
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--mui-palette-background-paper)",
            color: "var(--mui-palette-text-primary)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "var(--mui-palette-background-paper)",
            color: "var(--mui-palette-text-primary)",
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: "var(--mui-palette-background-paper)",
            color: "var(--mui-palette-text-primary)",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: "var(--mui-palette-background-paper)",
            color: "var(--mui-palette-text-primary)",
          },
        },
      },
    },
  });

export { colorTokens };
