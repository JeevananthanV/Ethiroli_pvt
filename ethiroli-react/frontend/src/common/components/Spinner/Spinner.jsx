import React from 'react';

export default function Spinner({ size = 36, thickness = 4, color = '#a855f7' }) {
  return (
    <div
      className="loading"
      style={{
        width: size,
        height: size,
        border: `${thickness}px solid rgba(255,255,255,0.1)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );
}
