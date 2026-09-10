import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgMap = {
    info: 'rgba(59,130,246,0.15)',
    success: 'rgba(16,185,129,0.15)',
    warning: 'rgba(245,158,11,0.15)',
    error: 'rgba(244,63,94,0.15)',
  };

  const colorMap = {
    info: 'var(--admin-info)',
    success: 'var(--admin-success)',
    warning: 'var(--admin-warning)',
    error: 'var(--admin-danger)',
  };

  return (
    <div
      style={{
        background: bgMap[type],
        border: `1px solid ${colorMap[type]}`,
        color: colorMap[type],
        padding: '12px 16px',
        borderRadius: 10,
        minWidth: 260,
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{message}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>
          ×
        </button>
      </div>
    </div>
  );
}
