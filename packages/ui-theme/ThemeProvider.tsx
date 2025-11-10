import React, { PropsWithChildren } from "react";
import { CssBaseline } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "./theme";

export type ThemeProviderProps = PropsWithChildren<{
  defaultMode?: "light" | "dark" | "system";
  themeOverride?: typeof theme;
}>;

export function ThemeProvider({
  children,
  defaultMode = "system",
  themeOverride,
}: ThemeProviderProps) {
  return (
    <CssVarsProvider
      theme={themeOverride ?? theme}
      defaultMode={defaultMode}
      modeStorageKey="k2n-color-scheme"
    >
      <CssBaseline enableColorScheme />
      {children}
    </CssVarsProvider>
  );
}
