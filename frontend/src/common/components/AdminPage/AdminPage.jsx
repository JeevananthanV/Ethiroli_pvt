import React from 'react';

/**
 * Standard accessible container for Enterprise Portal pages
 * Provides standardized header, semantic landmarks, accessible skeleton loading, and resilient error recovery.
 */
const AdminPage = ({ title, subtitle, loading, error, onRetry, actions, children }) => {
  return (
    <section className="adminPageContainer" aria-busy={loading || undefined}>
      <header className="pageHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="pageTitle" style={{ margin: '0 0 4px 0', fontSize: '1.75rem', fontWeight: 700, color: 'var(--admin-text-primary, #1e293b)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="pageSubtitle" style={{ margin: 0, fontSize: '0.95rem', color: 'var(--admin-text-secondary, #64748b)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="pageActions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{actions}</div>}
      </header>

      {/* Accessible Skeleton Loading State */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Loading page data"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: '110px',
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg, var(--admin-border-subtle, rgba(0,0,0,0.06)) 25%, var(--admin-bg-light, rgba(0,0,0,0.03)) 50%, var(--admin-border-subtle, rgba(0,0,0,0.06)) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'pulseSkeleton 1.5s infinite'
                }}
              />
            ))}
          </div>
          <div
            style={{
              height: '320px',
              borderRadius: '12px',
              background: 'linear-gradient(90deg, var(--admin-border-subtle, rgba(0,0,0,0.06)) 25%, var(--admin-bg-light, rgba(0,0,0,0.03)) 50%, var(--admin-border-subtle, rgba(0,0,0,0.06)) 75%)',
              backgroundSize: '200% 100%',
              animation: 'pulseSkeleton 1.5s infinite',
              marginTop: '8px'
            }}
          />
          <span className="visually-hidden" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            Loading content, please wait...
          </span>
        </div>
      )}

      {/* Accessible Resilient Error State */}
      {!loading && error && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            margin: '24px 0',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #fca5a5',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            <i className="bi bi-exclamation-triangle-fill" style={{ color: '#dc2626' }}></i>
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 600 }}>Unable to Load Data</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f1d1d', maxWidth: '480px' }}>
              {typeof error === 'string' ? error : error?.message || 'An unexpected error occurred while communicating with the service.'}
            </p>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="btn primary"
              style={{
                marginTop: '8px',
                padding: '8px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="bi bi-arrow-clockwise"></i>
              Retry Request
            </button>
          )}
        </div>
      )}

      {/* Main Page Body */}
      {!loading && !error && children}
    </section>
  );
};

export default AdminPage;
