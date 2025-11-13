import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { ColorModeProvider } from "./providers/ColorModeProvider";

// Error handling and recovery system
let initializationAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

// Function to handle vendor bundle initialization errors
function handleVendorError(error) {
  console.error("Vendor bundle initialization error:", error);

  if (initializationAttempts < MAX_INIT_ATTEMPTS) {
    initializationAttempts++;
    console.log(
      `Retrying initialization (attempt ${initializationAttempts}/${MAX_INIT_ATTEMPTS})`,
    );

    // Clear any cached modules and retry
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    return;
  }

  // Show fallback error page
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; max-width: 600px; margin: 50px auto; font-family: system-ui, sans-serif;">
        <h1 style="color: #dc2626;">Application Loading Error</h1>
        <p>There was an issue loading the application. This could be due to:</p>
        <ul>
          <li>Network connectivity issues</li>
          <li>Browser cache conflicts</li>
          <li>Module loading conflicts</li>
        </ul>
        <p><strong>Suggested solutions:</strong></p>
        <ol>
          <li>Refresh the page (Ctrl+F5 or Cmd+Shift+R)</li>
          <li>Clear browser cache and reload</li>
          <li>Try opening in an incognito/private window</li>
        </ol>
        <button onclick="window.location.reload()" style="
          background: #2563eb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
        ">
          Reload Page
        </button>
        <details style="margin-top: 20px;">
          <summary>Technical Details</summary>
          <pre style="background: #f3f4f6; padding: 10px; border-radius: 5px; overflow: auto;">
${error.message}
${error.stack || ""}
          </pre>
        </details>
      </div>
    `;
  }
}

// Verify React is properly loaded
if (!React || typeof React.createContext !== "function") {
  handleVendorError(
    new Error(
      "React createContext is not available. Please check React installation.",
    ),
  );
  throw new Error("React context not available");
}

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

  // Check for vendor bundle initialization errors
  if (
    event.error?.message &&
    (event.error.message.includes("Cannot access") ||
      event.error.message.includes("before initialization") ||
      event.error.message.includes("createContext"))
  ) {
    console.error("Vendor/React error detected:", event.error);
    handleVendorError(event.error);
    event.preventDefault();
    return false;
  }

  // For other errors, let them pass through
  return true;
};

// Add unhandled rejection handler
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason?.message &&
    (event.reason.message.includes("removeChild") ||
      event.reason.message.includes("appendChild") ||
      event.reason.message.includes("Cannot access") ||
      event.reason.message.includes("before initialization") ||
      event.reason.message.includes("createContext"))
  ) {
    console.warn(
      "Unhandled DOM/vendor promise rejection caught:",
      event.reason.message,
    );
    handleVendorError(event.reason);
    event.preventDefault();
    return false;
  }
});

// Add window error handlers for vendor bundle issues
window.addEventListener("error", (event) => {
  if (
    event.filename &&
    (event.filename.includes("vendor-") ||
      event.filename.includes("react-") ||
      event.message.includes("Cannot access") ||
      event.message.includes("before initialization"))
  ) {
    console.error("Vendor bundle error detected:", event);
    handleVendorError(
      new Error(
        `Vendor error: ${event.message} at ${event.filename}:${event.lineno}`,
      ),
    );
    event.preventDefault();
  } else {
    handleGlobalError(event);
  }
});

// Async initialization function to handle HelmetProvider loading
async function initializeApp() {
  try {
    // Load HelmetProvider safely after React is confirmed working
    const { HelmetProvider } = await import("react-helmet-async");

    if (!HelmetProvider) {
      throw new Error("HelmetProvider not available");
    }

    console.log("HelmetProvider loaded successfully");
    renderApp(HelmetProvider);
  } catch (error) {
    console.error("Failed to load HelmetProvider:", error);
    // Fallback: use a dummy provider
    const FallbackProvider = ({ children }) =>
      React.createElement(React.Fragment, null, children);
    renderApp(FallbackProvider);
  }
}

const renderApp = (HelmetProvider) => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  // Additional verification before rendering
  if (!React || typeof React.createContext !== "function") {
    console.error("React createContext is not available");
    handleVendorError(new Error("React context not available during render"));
    return;
  }

  if (!BrowserRouter) {
    console.error("BrowserRouter is not available");
    handleVendorError(new Error("BrowserRouter not available during render"));
    return;
  }

  if (!HelmetProvider) {
    console.error("HelmetProvider is not available");
    handleVendorError(new Error("HelmetProvider not available during render"));
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(
          ColorModeProvider,
          null,
          React.createElement(
            HelmetProvider,
            null,
            React.createElement(
              BrowserRouter,
              {
                future: {
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                },
              },
              React.createElement(App, null),
            ),
          ),
        ),
      ),
    );

    console.log("Application rendered successfully");
  } catch (error) {
    console.error("Error rendering app:", error);
    handleVendorError(error);
  }
};

// Initialize the app with proper async handling
try {
  initializeApp();
} catch (error) {
  console.error("Failed to start application:", error);
  handleVendorError(error);
}
