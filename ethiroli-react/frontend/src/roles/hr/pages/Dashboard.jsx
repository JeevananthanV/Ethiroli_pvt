import React from 'react';

export default function HRDashboard() {
  return (
    <div className="dashboard-page">
      <div style={{ marginBottom: '24px' }}>
        <h2>HR Management Operations</h2>
        <p style={{ color: 'var(--admin-text-secondary)' }}>Employee onboarding, leaves request review, performance indicators.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Total Employees</p>
          <p className="statValue">18</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Pending Leaves</p>
          <p className="statValue">3</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Scheduled Interviews</p>
          <p className="statValue">5</p>
        </div>
      </div>
    </div>
  );
}