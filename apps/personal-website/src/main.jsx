import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline } from "@mui/material";
import { getTheme, ThemeProvider } from "@kumar2net/ui-theme";
import App from "./App.jsx";
import "./output.css";
import { ColorModeProvider, useColorMode } from "./providers/ColorModeProvider";
import { SpeedInsights } from "@vercel/speed-insights/react";

const SHOULD_RENDER_SPEED_INSIGHTS =
  typeof import.meta !== "undefined" && import.meta.env.PROD;

const DarkModeWrapper = () => {
  const theme = React.useMemo(() => getTheme("light"), []);

  return (
    <ThemeProvider defaultMode="system" themeOverride={theme}>
      <CssBaseline />
      <ColorModeProvider>
        <ColorModeBridge />
      </ColorModeProvider>
    </ThemeProvider>
  );
};

const ColorModeBridge = () => {
  const { mode } = useColorMode();

  return (
    <HelmetProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App mode={mode} />
        {SHOULD_RENDER_SPEED_INSIGHTS ? <SpeedInsights /> : null}
      </BrowserRouter>
    </HelmetProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DarkModeWrapper />
  </React.StrictMode>,
);
