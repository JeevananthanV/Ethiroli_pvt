import React from 'react'

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
      <div className="loading">
        <div className="skeleton" style={{ width: '100%', height: '400px' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="emptyState">
        <h3 className="textDanger">Error Loading Data</h3>
        <p className="textSecondary">{error}</p>
        {onRetry && (
          <button className="btn primary mt3" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      {(title || subtitle || actions) && (
        <div className="pageHeader">
          <div>
            {title && <h1 className="pageTitle">{title}</h1>}
            {subtitle && <p className="pageSubtitle">{subtitle}</p>}
          </div>
          {actions && <div className="pageActions">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
