import {
  alpha,
  createTheme,
  darken,
  lighten,
} from "@mui/material/styles";

type Scheme = "light" | "dark";

export const colorTokens = {
  primary: {
    light: "#2563eb",
    dark: "#93c5fd",
  },
  onPrimary: {
    light: "#f8fafc",
    dark: "#0f172a",
  },
  primaryContainer: {
    light: "#dbe8ff",
    dark: "#1b3a78",
  },
  onPrimaryContainer: {
    light: "#001746",
    dark: "#deebff",
  },
  secondary: {
    light: "#0ea5e9",
    dark: "#67e8f9",
  },
  onSecondary: {
    light: "#012c3a",
    dark: "#042f2e",
  },
  secondaryContainer: {
    light: "#c8f3ff",
    dark: "#053d57",
  },
  onSecondaryContainer: {
    light: "#001b26",
    dark: "#c6f3ff",
  },
  tertiary: {
    light: "#7c3aed",
    dark: "#c4b5fd",
  },
  onTertiary: {
    light: "#f4f1ff",
    dark: "#271046",
  },
  tertiaryContainer: {
    light: "#eadcff",
    dark: "#4d2f81",
  },
  onTertiaryContainer: {
    light: "#2b015f",
    dark: "#f0e8ff",
  },
  surface: {
    light: "#f8fafc",
    dark: "#020617",
  },
  surfaceContainer: {
    light: "#f1f5f9",
    dark: "#0b1221",
  },
  surfaceContainerHigh: {
    light: "#e2e8f0",
    dark: "#111a2b",
  },
  surfaceVariant: {
    light: "#cbd5f5",
    dark: "#1f293f",
  },
  onSurface: {
    light: "#0f172a",
    dark: "#e2e8f0",
  },
  onSurfaceVariant: {
    light: "#475569",
    dark: "#94a3b8",
  },
  background: {
    light: "#f8fafc",
    dark: "#020617",
  },
  onBackground: {
    light: "#0f172a",
    dark: "#e2e8f0",
  },
  inverseSurface: {
    light: "#162032",
    dark: "#e2e8f0",
  },
  inverseOnSurface: {
    light: "#f7fbff",
    dark: "#020617",
  },
  inversePrimary: {
    light: "#93c5fd",
    dark: "#2563eb",
  },
  outline: {
    light: "#94a3b8",
    dark: "#475569",
  },
  outlineVariant: {
    light: "#cbd5f5",
    dark: "#1f2937",
  },
  neutral: {
    light: "#0f172a",
    dark: "#e2e8f0",
  },
  success: {
    light: "#16a34a",
    dark: "#4ade80",
  },
  onSuccess: {
    light: "#022c22",
    dark: "#022c22",
  },
  warning: {
    light: "#d97706",
    dark: "#facc15",
  },
  onWarning: {
    light: "#0f0a04",
    dark: "#0f0a04",
  },
  error: {
    light: "#dc2626",
    dark: "#fb7185",
  },
  onError: {
    light: "#ffffff",
    dark: "#280000",
  },
} as const;

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

const theme = createTheme({
  cssVarPrefix: "k2n",
  colorSchemes: {
    light: buildColorScheme("light"),
    dark: buildColorScheme("dark"),
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    "title-lg": {
      fontSize: "1.375rem",
      fontWeight: 600,
      lineHeight: 1.35,
    },
    "body-lg": {
      fontSize: "1.125rem",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    "body-md": {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    "label-lg": {
      fontSize: "0.875rem",
      fontWeight: 500,
      letterSpacing: "0.01em",
    },
  },
  components: {
    MuiGrid: {
      defaultProps: {
        spacing: 2,
        columns: { xs: 4, sm: 8, md: 12 },
        direction: "row",
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          "body-lg": "p",
          "body-md": "p",
          "label-lg": "span",
          "title-lg": "h3",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "medium",
        margin: "normal",
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
