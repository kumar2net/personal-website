import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './output.css';

// Global error handler for DOM manipulation errors
const handleGlobalError = (event) => {
  // Check if it's a DOM manipulation error
  if (
    event.error?.message &&
    (event.error.message.includes('removeChild') ||
      event.error.message.includes('appendChild') ||
      event.error.message.includes('insertBefore'))
  ) {
    console.warn(
      'DOM manipulation error caught and handled:',
      event.error.message
    );

    // Prevent the error from being logged to console
    event.preventDefault();

    // Optionally, you can add analytics here
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'dom_manipulation_error', {
        event_category: 'error',
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
window.addEventListener('error', handleGlobalError);

// Add unhandled rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message &&
    (event.reason.message.includes('removeChild') ||
      event.reason.message.includes('appendChild'))
  ) {
    console.warn(
      'Unhandled DOM manipulation promise rejection caught:',
      event.reason.message
    );
    event.preventDefault();
    return false;
  }
});

const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <HelmetProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error rendering app:', error);
  }
};

// Render immediately for faster startup
renderApp();
