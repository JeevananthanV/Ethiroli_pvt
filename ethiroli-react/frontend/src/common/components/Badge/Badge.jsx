import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`statusTag ${variant} ${className}`}>
      {children}
    </span>
  );
}
