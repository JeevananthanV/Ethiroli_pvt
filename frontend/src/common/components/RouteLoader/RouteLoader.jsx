import React from 'react';

/**
 * Shared Suspense fallback for lazy-loaded role route trees.
 * Used by every `roles/<slug>/<Role>Routes.jsx` module so each portal
 * shows the same loading affordance while a page chunk streams in.
 */
function RouteLoader({ label = 'Loading module...' }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '350px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{label}</span>
      </div>
    </div>
  );
}

export default RouteLoader;
