import type { ThemeOptions } from "@mui/material/styles";

const transitionBase =
  "color 180ms ease, background-color 180ms ease, border-color 180ms ease";

export const getDesignTokens = (): ThemeOptions => ({
  cssVarPrefix: "k2n",
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#2563eb", contrastText: "#f8fafc" },
        secondary: { main: "#0ea5e9", contrastText: "#022c22" },
        background: {
          default: "#f8fafc",
          paper: "#ffffff",
        },
        text: {
          primary: "#0f172a",
          secondary: "#475569",
        },
        divider: "rgba(15, 23, 42, 0.12)",
      },
    },
    dark: {
      palette: {
        primary: { main: "#60a5fa", contrastText: "#020617" },
        secondary: { main: "#67e8f9", contrastText: "#042f2e" },
        background: {
          default: "#050b16",
          paper: "#0f172a",
        },
        text: {
          primary: "#f8fafc",
          secondary: "#cbd5f5",
        },
        divider: "rgba(226, 232, 240, 0.16)",
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: "clamp(2.75rem, 5vw, 3.5rem)",
      fontWeight: 700,
      lineHeight: 1.12,
      letterSpacing: "-0.015em",
    },
    h2: {
      fontSize: "clamp(2rem, 4vw, 2.75rem)",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "clamp(1.5rem, 3vw, 2rem)",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    subtitle1: {
      fontSize: "1.125rem",
      lineHeight: 1.45,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "1rem",
      lineHeight: 1.4,
      fontWeight: 500,
      letterSpacing: "0.01em",
    },
    body1: {
      fontSize: "1.05rem",
      lineHeight: 1.8,
    },
    body2: {
      fontSize: "0.95rem",
      lineHeight: 1.65,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: 0.2,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: transitionBase,
          color: "var(--mui-palette-text-primary)",
          backgroundColor: "var(--mui-palette-background-default)",
        },
        "#root": {
          minHeight: "100vh",
          transition: transitionBase,
        },
        a: {
          transition: "color 150ms ease",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          letterSpacing: 0.2,
          transition:
            "transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease, color 180ms ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 12px 20px rgba(15, 23, 42, 0.18)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "0 6px 12px rgba(15, 23, 42, 0.22)",
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
          color: "var(--mui-palette-primary-main)",
          transition: transitionBase,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "1px solid rgba(15, 23, 42, 0.08)",
          transition: "transform 180ms ease, box-shadow 180ms ease",
          boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 18px 32px rgba(15, 23, 42, 0.15)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          letterSpacing: 0.2,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          "@media (max-width: 600px)": {
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      },
    },
  },
});

export type SupportedColorMode = "light" | "dark";
