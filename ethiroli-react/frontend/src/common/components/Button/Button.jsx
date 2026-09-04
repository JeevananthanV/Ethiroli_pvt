import React from 'react';

export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant} ${className}`}
    >
      {children}
    </button>
  );
}