import React from 'react';

export default function AutomationDashboard() {
  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Automation Dashboard</h2>
          <p className="pageSubtitle">Automation workflow overview and analytics</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="statCard">
          <p className="statLabel">Active Workflows</p>
          <p className="statValue">0</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Runs Today</p>
          <p className="statValue">0</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Success Rate</p>
          <p className="statValue">0%</p>
        </div>
      </div>
    </div>
  );
}
