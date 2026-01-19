import React, { PropsWithChildren, useMemo } from "react";
import { CssBaseline } from "@mui/material";
import { CssVarsProvider } from "@mui/material/styles";
import { getTheme, type Scheme } from "./theme";

export type ThemeProviderProps = PropsWithChildren<{
  defaultMode?: Scheme | "system";
  themeOverride?: ReturnType<typeof getTheme>;
}>;

export function ThemeProvider({
  children,
  defaultMode = "system",
  themeOverride,
}: ThemeProviderProps) {
  const resolvedMode: Scheme =
    defaultMode === "system" ? "light" : defaultMode;
  const theme = useMemo(
    () => themeOverride ?? getTheme(resolvedMode),
    [resolvedMode, themeOverride],
  );

  return (
    <CssVarsProvider
      theme={theme}
      defaultMode={defaultMode}
      modeStorageKey="k2n-color-scheme-dark"
    >
      <CssBaseline enableColorScheme />
      {children}
    </CssVarsProvider>
  );
}
