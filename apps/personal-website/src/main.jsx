import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { getTheme, ThemeProvider } from "@kumar2net/ui-theme";
import App from "./App.jsx";
import "./output.css";
import { ColorModeProvider, useColorMode } from "./providers/ColorModeProvider";
import { scheduleIdleTask } from "./lib/scheduleIdle";
import GoogleAnalytics from "./components/GoogleAnalytics.jsx";

const SHOULD_RENDER_SPEED_INSIGHTS =
  typeof import.meta !== "undefined" && import.meta.env.PROD;
const SpeedInsights = React.lazy(() =>
  import("@vercel/speed-insights/react").then((module) => ({
    default: module.SpeedInsights,
  })),
);

const DarkModeWrapper = () => {
  const theme = React.useMemo(() => getTheme("dark"), []);

  return (
    <ThemeProvider defaultMode="dark" themeOverride={theme}>
      <ColorModeProvider>
        <ColorModeBridge />
      </ColorModeProvider>
    </ThemeProvider>
  );
};

const ObservabilityBootstrap = () => {
  const [showSpeedInsights, setShowSpeedInsights] = React.useState(false);

  React.useEffect(() => {
    const cancelSpeedInsights = SHOULD_RENDER_SPEED_INSIGHTS
      ? scheduleIdleTask(() => {
          setShowSpeedInsights(true);
        }, { timeout: 2200 })
      : () => {};

    return () => {
      cancelSpeedInsights();
    };
  }, []);

  if (!SHOULD_RENDER_SPEED_INSIGHTS || !showSpeedInsights) {
    return null;
  }

  return (
    <React.Suspense fallback={null}>
      <SpeedInsights />
    </React.Suspense>
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
        <GoogleAnalytics />
        <ObservabilityBootstrap />
      </BrowserRouter>
    </HelmetProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DarkModeWrapper />
  </React.StrictMode>,
);
