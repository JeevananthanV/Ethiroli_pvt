import React from 'react';

export default function WhiteLabelPreview({ tenant }) {
  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">White Label Preview</h2>
          <p className="pageSubtitle">Tenant branding preview</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {tenant ? (
            <div style={{ padding: '24px', border: '2px dashed var(--admin-border-default)', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--admin-primary)', marginBottom: '8px' }}>{tenant.name || 'Tenant'}</h3>
              <p style={{ color: 'var(--admin-text-secondary)' }}>Branded portal preview for {tenant.domain || 'tenant'}</p>
            </div>
          ) : (
            <div className="emptyState"><h3>No Tenant Selected</h3><p>Select a tenant to preview branding.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
