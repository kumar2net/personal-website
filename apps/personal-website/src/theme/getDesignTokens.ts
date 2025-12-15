import { alpha, darken, lighten, createTheme } from "@mui/material/styles";
import { colorTokens } from "@kumar2net/ui-theme";

const transitionBase =
  "color 180ms ease, background-color 180ms ease, border-color 180ms ease";

type Scheme = "light" | "dark";

const densityScale = {
  comfortable: {
    buttonPaddingY: 0.85,
    buttonPaddingX: 1.6,
    chipPaddingY: 0.35,
    chipPaddingX: 1,
    cardPadding: 2,
    containerPadding: 1.5,
  },
  compact: {
    buttonPaddingY: 0.6,
    buttonPaddingX: 1.25,
    chipPaddingY: 0.25,
    chipPaddingX: 0.85,
    cardPadding: 1.25,
    containerPadding: 1,
  },
} as const;

type DensityScale = keyof typeof densityScale;
const defaultDensity: DensityScale = "comfortable";

declare module "@mui/material/styles" {
  interface Theme {
    defaultDensity: DensityScale;
    densityScale: typeof densityScale;
  }
  interface ThemeOptions {
    defaultDensity?: DensityScale;
    densityScale?: typeof densityScale;
  }
}

const getToken = <K extends keyof typeof colorTokens>(
  token: K,
  scheme: Scheme,
) => colorTokens[token][scheme];

const buildColorScheme = (scheme: Scheme) => {
  const isDark = scheme === "dark";
  const primary = getToken("primary", scheme);
  const secondary = getToken("secondary", scheme);
  const tertiary = getToken("tertiary", scheme);
  const success = getToken("success", scheme);
  const warning = getToken("warning", scheme);
  const error = getToken("error", scheme);
  const onSurface = getToken("onSurface", scheme);
  const onSurfaceVariant = getToken("onSurfaceVariant", scheme);

  return {
    palette: {
      mode: scheme,
      primary: {
        main: primary,
        light: lighten(primary, isDark ? 0.08 : 0.16),
        dark: darken(primary, 0.2),
        contrastText: getToken("onPrimary", scheme),
      },
      secondary: {
        main: secondary,
        light: lighten(secondary, isDark ? 0.08 : 0.16),
        dark: darken(secondary, 0.18),
        contrastText: getToken("onSecondary", scheme),
      },
      info: {
        main: tertiary,
        light: lighten(tertiary, isDark ? 0.08 : 0.14),
        dark: darken(tertiary, 0.18),
        contrastText: getToken("onTertiary", scheme),
      },
      success: {
        main: success,
        light: lighten(success, 0.1),
        dark: darken(success, 0.18),
        contrastText: getToken("onSuccess", scheme),
      },
      warning: {
        main: warning,
        light: lighten(warning, 0.08),
        dark: darken(warning, 0.2),
        contrastText: getToken("onWarning", scheme),
      },
      error: {
        main: error,
        light: lighten(error, 0.08),
        dark: darken(error, 0.2),
        contrastText: getToken("onError", scheme),
      },
      background: {
        default: getToken("surface", scheme),
        paper: getToken("surfaceContainer", scheme),
      },
      text: {
        primary: onSurface,
        secondary: onSurfaceVariant,
        disabled: alpha(onSurface, 0.38),
      },
      divider: alpha(getToken("outline", scheme), isDark ? 0.36 : 0.26),
      action: {
        active: onSurface,
        hover: alpha(onSurface, 0.08),
        hoverOpacity: 0.08,
        selected: alpha(onSurface, 0.16),
        selectedOpacity: 0.16,
        disabled: alpha(onSurface, 0.38),
        disabledBackground: alpha(onSurfaceVariant, isDark ? 0.18 : 0.08),
        disabledOpacity: 0.38,
        focus: alpha(onSurface, 0.12),
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
      },
    },
  };
};

export const createAppTheme = () => {
  const density = densityScale[defaultDensity];

  return createTheme({
    cssVarPrefix: "k2n",
    cssVariables: { cssVarPrefix: "k2n" },
    defaultDensity,
    densityScale,
    colorSchemes: {
      light: buildColorScheme("light"),
      dark: buildColorScheme("dark"),
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      allVariants: {
        // Force readable text across MUI v8 + Markdown content
        color: "var(--mui-palette-text-primary)",
      },
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
          ":root": {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            fontSynthesis: "none",
            textRendering: "optimizeLegibility",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },
          body: {
            margin: 0,
            minHeight: "100vh",
            transition: transitionBase,
            color: "var(--mui-palette-text-primary)",
            backgroundColor: "var(--mui-palette-background-default)",
          },
          "#root": {
            minHeight: "100vh",
            transition: transitionBase,
          },
          a: {
            fontWeight: 500,
            color: "var(--mui-palette-primary-main)",
            textDecorationColor: "inherit",
            transition: "color 150ms ease",
          },
          "a:hover": {
            color: "var(--mui-palette-primary-dark)",
          },
          "h1, h2, h3, h4, h5, h6": {
            color: "var(--mui-palette-text-primary)",
            marginTop: 0,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 999,
            fontWeight: 600,
            letterSpacing: 0.2,
            padding: theme.spacing(density.buttonPaddingY, density.buttonPaddingX),
            border: "1px solid transparent",
            transition:
              "transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease, color 180ms ease, border-color 180ms ease",
            "&:hover": {
              transform: "translateY(-1px)",
              borderColor: alpha(theme.palette.primary.main, 0.5),
              boxShadow: "0 12px 20px rgba(15, 23, 42, 0.18)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 6px 12px rgba(15, 23, 42, 0.22)",
            },
            "&:focus-visible": {
              outline: `3px solid ${alpha(theme.palette.primary.main, 0.35)}`,
              outlineOffset: 2,
            },
          }),
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
            padding: `${density.cardPadding}rem`,
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
          root: ({ theme }) => ({
            borderRadius: 999,
            fontWeight: 600,
            letterSpacing: 0.2,
            padding: `${density.chipPaddingY}rem ${density.chipPaddingX}rem`,
            // M3 suggestion: use `theme.palette.m3.primaryContainer` for container-style chips,
            // and `theme.palette.m3.onPrimaryContainer` for their text/icon color.
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          }),
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: `${density.containerPadding}rem`,
            paddingRight: `${density.containerPadding}rem`,
            "@media (max-width: 600px)": {
              paddingLeft: "1rem",
              paddingRight: "1rem",
            },
          },
        },
      },
    },
  });
};

export type SupportedColorMode = "light" | "dark";
