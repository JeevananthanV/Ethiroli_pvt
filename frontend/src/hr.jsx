import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/admin.css'
import HRApp from './HRApp.jsx'
import ErrorBoundary from './components/shared/ErrorBoundary'
import { registerServiceWorker } from './utils/registerServiceWorker'

registerServiceWorker()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HRApp />
    </ErrorBoundary>
  </StrictMode>,
)
