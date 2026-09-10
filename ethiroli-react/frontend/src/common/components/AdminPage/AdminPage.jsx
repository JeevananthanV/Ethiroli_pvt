import React from 'react';

const AdminPage = ({ title, subtitle, loading, error, onRetry, actions, children }) => {
  return (
    <div className="admin-app">
      <div className="mainContent">
        <div className="pageHeader">
          <div>
            <h1 className="pageTitle">{title}</h1>
            {subtitle && <p className="pageSubtitle">{subtitle}</p>}
          </div>
          {actions && <div className="pageActions">{actions}</div>}
        </div>
        {loading && <div className="loading">Loading...</div>}
        {error && (
          <div className="emptyState">
            <h3>Error</h3>
            <p>{error}</p>
            {onRetry && <button className="btn primary" onClick={onRetry}>Retry</button>}
          </div>
        )}
        {!loading && !error && children}
      </div>
    </div>
  );
};

export default AdminPage;
