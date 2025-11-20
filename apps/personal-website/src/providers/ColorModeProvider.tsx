import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "k2n-color-scheme";

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

function getInitialMode(): SupportedColorMode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function ColorModeBridge({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<SupportedColorMode>(getInitialMode);

  const setMode = (next: Updater) => {
    setModeState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, resolved);
      }
      return resolved;
    });
  };

  const value = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      setMode,
      toggleColorMode: () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [mode],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return;
      setModeState(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue === "light" || event.newValue === "dark") {
        setModeState(event.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

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
