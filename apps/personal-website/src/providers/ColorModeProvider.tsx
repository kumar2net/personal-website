import { createContext, useContext, useEffect, useMemo } from "react";
import {
  CssVarsProvider,
  extendTheme,
  useColorScheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { ReactNode } from "react";
import { getDesignTokens, type SupportedColorMode } from "../theme/getDesignTokens";

const STORAGE_KEY = "k2n-color-scheme";
const theme = extendTheme(getDesignTokens());

type ColorModeContextValue = {
  mode: SupportedColorMode;
  toggleColorMode: () => void;
  setMode: (mode: SupportedColorMode) => void;
};

const ColorModeContext = createContext<ColorModeContextValue | undefined>(
  undefined,
);

function ModeBridge({ children }: { children: ReactNode }) {
  const { mode, setMode, systemMode } = useColorScheme();
  const effectiveMode = mode === "system" ? systemMode : mode;
  const resolvedMode: SupportedColorMode =
    effectiveMode === "dark" ? "dark" : "light";

  const value = useMemo<ColorModeContextValue>(() => {
    const persist = (nextMode: SupportedColorMode) => {
      setMode(nextMode);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, nextMode);
      }
    };

    return {
      mode: resolvedMode,
      setMode: persist,
      toggleColorMode: () => {
        const next = resolvedMode === "dark" ? "light" : "dark";
        persist(next);
      },
    };
  }, [resolvedMode, setMode]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (resolvedMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedMode]);

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  return (
    <CssVarsProvider
      theme={theme}
      defaultMode="system"
      modeStorageKey={STORAGE_KEY}
    >
      <CssBaseline enableColorScheme />
      <ModeBridge>{children}</ModeBridge>
    </CssVarsProvider>
  );
}

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }
  return context;
}
