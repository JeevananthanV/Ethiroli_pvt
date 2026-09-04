import React from 'react';

export default function StudentDashboard() {
  return (
    <div className="dashboard-page">
      <h2>My Student Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '20px 0' }}>
        <div className="statCard">
          <p className="statLabel">Syllabus Progress</p>
          <p className="statValue">75%</p>
        </div>
        <div className="statCard">
          <p className="statLabel">XP Points Earned</p>
          <p className="statValue">4,820</p>
        </div>
      </div>
    </div>
  );
}