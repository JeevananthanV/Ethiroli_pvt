import React from 'react';

export default function AdminPage({
  title,
  subtitle,
  children,
  actions,
  loading,
  error,
  onRetry,
}) {
  if (loading) {
    return (
      <div className="adminPageWrapper" style={{ animation: 'fadeIn 0.25s ease' }}>
        {(title || subtitle) && (
          <div className="pageHeader">
            <div>
              {title && <h1 className="pageTitle">{title}</h1>}
              {subtitle && <p className="pageSubtitle">{subtitle}</p>}
            </div>
          </div>
        )}
        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <div className="skeleton" style={{ width: '60%', height: '24px', margin: '0 auto 16px auto', borderRadius: '4px' }} />
          <div className="skeleton" style={{ width: '100%', height: '240px', borderRadius: '8px' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adminPageWrapper" style={{ animation: 'fadeIn 0.25s ease' }}>
        {(title || subtitle) && (
          <div className="pageHeader">
            <div>
              {title && <h1 className="pageTitle">{title}</h1>}
              {subtitle && <p className="pageSubtitle">{subtitle}</p>}
            </div>
          </div>
        )}
        <div className="emptyState" style={{ borderColor: 'rgba(175, 67, 30, 0.3)' }}>
          <i className="bi bi-exclamation-triangle" style={{ fontSize: '2.5rem', color: 'var(--color-secondary)', display: 'block', marginBottom: '12px' }}></i>
          <h3 style={{ color: 'var(--color-secondary)' }}>Unable to Load Data</h3>
          <p className="textSecondary" style={{ maxWidth: '450px', margin: '0 auto 16px auto' }}>{error}</p>
          {onRetry && (
            <button className="btn primary" onClick={onRetry} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <i className="bi bi-arrow-clockwise"></i> Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="adminPageWrapper" style={{ animation: 'fadeIn 0.25s ease' }}>
      {(title || subtitle || actions) && (
        <div className="pageHeader">
          <div>
            {title && <h1 className="pageTitle">{title}</h1>}
            {subtitle && <p className="pageSubtitle">{subtitle}</p>}
          </div>
          {actions && <div className="pageActions">{actions}</div>}
        </div>
      )}
      <div className="adminPageContent">
        {children}
      </div>
    </div>
  );
}
