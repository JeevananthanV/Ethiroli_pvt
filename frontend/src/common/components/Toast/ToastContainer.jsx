import React, { useState } from 'react';
import Toast from './Toast.jsx';
import { ToastContext } from './useToast.js';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default function ToastContainer({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
