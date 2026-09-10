import React from 'react'
import ReactDOM from 'react-dom/client'
import AppShell from './common/AppShell'
import App from './App'
import './styles/admin.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppShell>
      <App />
    </AppShell>
  </React.StrictMode>
)
