import React from 'react';

export default function AdminPage({ title, subtitle, actions, children, loading, error, onRetry }) {
  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">{title}</h1>
          {subtitle && <p className="pageSubtitle">{subtitle}</p>}
        </div>
        {actions && <div className="pageActions">{actions}</div>}
      </div>

      {error && (
        <div className="card" style={{marginBottom: 20, borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{color: 'var(--admin-danger)', fontSize: 20}}>⚠️</div>
            <div style={{flex: 1}}>
              <p style={{margin: 0, color: 'var(--admin-text-primary)', fontWeight: 500}}>Failed to load data</p>
              <p style={{margin: '4px 0 0', fontSize: 13, color: 'var(--admin-text-muted)'}}>{error}</p>
            </div>
            {onRetry && (
              <button onClick={onRetry} className="btn secondary" style={{padding: '6px 14px', fontSize: 12}}>
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="card">
          <div className="loading">
            <div className="skeleton" style={{width: 40, height: 40, borderRadius: '50%'}}></div>
            <div style={{flex: 1}}>
              <div className="skeleton" style={{width: '60%', height: 16, marginBottom: 8}}></div>
              <div className="skeleton" style={{width: '40%', height: 12}}></div>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}