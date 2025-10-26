// Ensure React is loaded first to prevent context issues
import React from "react";
import ReactDOM from "react-dom/client";

// Verify React is properly loaded before importing Router
if (typeof React.createContext !== "function") {
  throw new Error(
    "React createContext is not available. Please check React installation.",
  );
}

import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./output.css";

// Global error handler for DOM manipulation errors
const handleGlobalError = (event) => {
  // Check if it's a DOM manipulation error
  if (
    event.error?.message &&
    (event.error.message.includes("removeChild") ||
      event.error.message.includes("appendChild") ||
      event.error.message.includes("insertBefore"))
  ) {
    console.warn(
      "DOM manipulation error caught and handled:",
      event.error.message,
    );

    // Prevent the error from being logged to console
    event.preventDefault();

    // Optionally, you can add analytics here
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "dom_manipulation_error", {
        event_category: "error",
        event_label: event.error.message,
        value: 1,
      });
    }

    return false;
  }

  // For other errors, let them pass through
  return true;
};

// Add global error handler
window.addEventListener("error", handleGlobalError);

// Add unhandled rejection handler
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason?.message &&
    (event.reason.message.includes("removeChild") ||
      event.reason.message.includes("appendChild"))
  ) {
    console.warn(
      "Unhandled DOM manipulation promise rejection caught:",
      event.reason.message,
    );
    event.preventDefault();
    return false;
  }
});

const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  // Additional React Router context verification
  if (typeof React.createContext !== "function") {
    console.error("React createContext is not available");
    return;
  }

  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error("Error rendering app:", error);
    // Fallback error display
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace;">
        <h2>Application Error</h2>
        <p>Failed to load the application. Please refresh the page.</p>
        <details>
          <summary>Error Details</summary>
          <pre>${error.message}</pre>
        </details>
      </div>
    `;
  }
};

// Render immediately for faster startup
renderApp();
