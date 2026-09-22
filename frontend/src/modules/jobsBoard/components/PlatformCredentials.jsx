import React from 'react';

export default function PlatformCredentials() {
  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Platform Credentials</h2>
          <p className="pageSubtitle">Manage platform API credentials</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          <div className="emptyState">
            <h3>No Credentials</h3>
            <p>Platform credentials will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
