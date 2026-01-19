import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useColorScheme } from "@mui/material/styles";

export type SupportedColorMode = "light" | "dark";

type Updater = SupportedColorMode | ((prev: SupportedColorMode) => SupportedColorMode);

type ColorModeContextValue = {
  mode: SupportedColorMode;
  toggleColorMode: () => void;
  setMode: (mode: Updater) => void;
};

const ColorModeContext = createContext<ColorModeContextValue | undefined>(
  undefined,
);

function ColorModeBridge({ children }: { children: ReactNode }) {
  const { setMode: setMuiMode } = useColorScheme();

  const resolvedMode: SupportedColorMode = "dark";

  const setMode = useCallback(
    (_next: Updater) => {
      setMuiMode("dark");
    },
    [setMuiMode],
  );

  const value = useMemo<ColorModeContextValue>(
    () => ({
      mode: resolvedMode,
      setMode,
      toggleColorMode: () => setMode("dark"),
    }),
    [resolvedMode, setMode],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    // Tailwind's `dark:` variant keys off the `.dark` class, while MUI uses
    // `data-mui-color-scheme`. Keep them in sync to avoid "dark text on light
    // surface" (or vice versa) regressions.
    root.classList.add("dark");
    setMuiMode("dark");
  }, [setMuiMode]);

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  return <ColorModeBridge>{children}</ColorModeBridge>;
}

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within ColorModeProvider");
  }
  return context;
}
