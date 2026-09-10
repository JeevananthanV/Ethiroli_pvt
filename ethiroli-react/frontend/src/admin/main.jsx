import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/premium-motion.css'
import './styles/career-apply.css'
import './styles/contact-page.css'
import App from './App.jsx'
import ErrorBoundary from './components/shared/ErrorBoundary'
import { registerServiceWorker } from './utils/registerServiceWorker'

registerServiceWorker()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
