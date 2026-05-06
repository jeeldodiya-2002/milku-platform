import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
import { HelmetProvider } from 'react-helmet-async';
import { initializeGA } from './utils/analytics';
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Initialize GA4 - Milku Production Tracking
initializeGA("G-4VN38TY82Q"); // Real Measurement ID for Milku

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
)
