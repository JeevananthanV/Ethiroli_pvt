import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate } from 'react-router-dom';
import './styles/global.css';
import './styles/admin.css';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { registerServiceWorker } from './utils/registerServiceWorker';

registerServiceWorker();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Navigate to="/auth/hr/login" replace />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);