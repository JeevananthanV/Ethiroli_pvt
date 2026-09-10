import React from 'react';

export default function LogViewer() {
  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Log Viewer</h2>
          <p className="pageSubtitle">System logs and events</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          <div className="emptyState">
            <h3>No Logs</h3>
            <p>Log entries will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
