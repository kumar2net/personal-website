import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './output.css'
import App from './App.jsx'

// Ensure DOM is ready before rendering
const renderApp = () => {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    console.error('Root element not found')
    return
  }

  try {
    createRoot(rootElement).render(
      <StrictMode>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <App />
        </BrowserRouter>
      </StrictMode>,
    )
  } catch (error) {
    console.error('Error rendering app:', error)
  }
}

// Handle different loading scenarios
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp)
} else {
  renderApp()
}
