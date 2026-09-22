import React from 'react';

export default function IndeedWebhookStatus() {
  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Indeed Sync Logs</h2>
          <p className="pageSubtitle">Job posting synchronization with Indeed</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          <div className="emptyState">
            <h3>No Sync Logs</h3>
            <p>Indeed webhook sync logs will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
