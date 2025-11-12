import { createTheme } from "@mui/material/styles";

export const colorTokens = {
  primary: {
    light: "#2563eb",
    dark: "#93c5fd",
  },
  onPrimary: {
    light: "#f8fafc",
    dark: "#0f172a",
  },
  secondary: {
    light: "#0ea5e9",
    dark: "#67e8f9",
  },
  onSecondary: {
    light: "#022c22",
    dark: "#042f2e",
  },
  tertiary: {
    light: "#7c3aed",
    dark: "#c4b5fd",
  },
  surface: {
    light: "#f8fafc",
    dark: "#020617",
  },
  neutral: {
    light: "#0f172a",
    dark: "#e2e8f0",
  },
  success: {
    light: "#16a34a",
    dark: "#4ade80",
  },
  warning: {
    light: "#d97706",
    dark: "#facc15",
  },
  error: {
    light: "#dc2626",
    dark: "#fb7185",
  },
} as const;

const theme = createTheme({
  cssVarPrefix: "k2n",
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: colorTokens.primary.light,
          contrastText: colorTokens.onPrimary.light,
        },
        secondary: {
          main: colorTokens.secondary.light,
          contrastText: colorTokens.onSecondary.light,
        },
        tertiary: {
          main: colorTokens.tertiary.light,
        },
        success: {
          main: colorTokens.success.light,
          contrastText: "#022c22",
        },
        warning: {
          main: colorTokens.warning.light,
          contrastText: "#0f0a04",
        },
        error: {
          main: colorTokens.error.light,
          contrastText: "#fff1f2",
        },
        background: {
          default: colorTokens.surface.light,
          paper: "#ffffff",
        },
        text: {
          primary: colorTokens.neutral.light,
          secondary: "#475569",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: colorTokens.primary.dark,
          contrastText: colorTokens.onPrimary.dark,
        },
        secondary: {
          main: colorTokens.secondary.dark,
          contrastText: colorTokens.onSecondary.dark,
        },
        tertiary: {
          main: colorTokens.tertiary.dark,
        },
        success: {
          main: colorTokens.success.dark,
          contrastText: "#022c22",
        },
        warning: {
          main: colorTokens.warning.dark,
          contrastText: "#0f0a04",
        },
        error: {
          main: colorTokens.error.dark,
          contrastText: "#280000",
        },
        background: {
          default: colorTokens.surface.dark,
          paper: "#0b1120",
        },
        text: {
          primary: colorTokens.neutral.dark,
          secondary: "#94a3b8",
        },
      },
    },
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
