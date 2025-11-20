// theme.ts
// -------------------------------------------
// MUI v8 + Material 3 compatible theme
// with enforced text visibility to prevent
// invisible paragraphs in blog posts.
// -------------------------------------------

import { alpha, createTheme } from "@mui/material/styles";
import { colorTokens } from "./colorTokens"; // your palette file

// Scheme type: "light" | "dark"
export type Scheme = "light" | "dark";

// Main function to generate theme per mode
export const getTheme = (scheme: Scheme) => {
  // Helper to pick color from colorTokens["key"][scheme]
  const tokens = (key: keyof typeof colorTokens) =>
    colorTokens[key][scheme];

  return createTheme({
    // -------------------------------------------
    // 🎨 PALETTE — The heart of your color system
    // -------------------------------------------
    palette: {
      mode: scheme,

      // Material 3 primary roles
      primary: { main: tokens("primary") },
      secondary: { main: tokens("secondary") },
      error: { main: tokens("error") },
      warning: { main: tokens("warning") },
      success: { main: tokens("success") },

      // Backgrounds
      background: {
        default: tokens("background"), // Page background
        paper: tokens("surface"),      // Cards, containers
      },

      // --------------------------------------------------------
      // 🔥 CRITICAL FIX #1 — Explicit text colors for MUI v8
      //
      // MUI v8 no longer assigns text.primary reliably.
      // If this block is missing, text may inherit colors from
      // parent containers (surfaceContainer, variant, etc.)
      // causing **invisible paragraphs**.
      // --------------------------------------------------------
      text: {
        primary: tokens("onSurface"),               // Main readable text
        secondary: tokens("onSurfaceVariant"),      // Slightly muted text
        disabled: alpha(tokens("onSurface"), 0.38), // Disabled text
      },

      // Outline / Dividers
      divider: tokens("outlineVariant"),
    },

    // --------------------------------------------------------
    // 🔥 CRITICAL FIX #2 — Universal text color override
    //
    // MUI v8 Typography often uses `color: inherit`.
    // Markdown, <p>, <div>, headings, lists ALL inherit colors.
    // If a parent has a light background + light text,
    // blog paragraphs become invisible.
    //
    // This forces **every text variant** to use onSurface.
    // --------------------------------------------------------
    typography: {
      allVariants: {
        color: tokens("onSurface"),
      },
    },

    // --------------------------------------------------------
    // COMPONENT OVERRIDES (optional section)
    // You can add per-component color/style overrides here.
    // --------------------------------------------------------
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            // Ensures all Paper surfaces use Material 3 surface
            backgroundColor: tokens("surface"),
            color: tokens("onSurface"),
          },
        },
      },
    },
  });
};

export { colorTokens };
