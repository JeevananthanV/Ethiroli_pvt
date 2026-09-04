import React from 'react';

export default function TutorDashboard() {
  return (
    <div className="dashboard-page">
      <div style={{ marginBottom: '20px' }}>
        <h2>Tutor Performance Tracker</h2>
        <p style={{ color: 'var(--admin-text-secondary)' }}>Manage courses syllabus, respond to student forum queries, check tests results.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="statCard">
          <p className="statLabel">Courses Taught</p>
          <p className="statValue">4</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Active Students</p>
          <p className="statValue">148</p>
        </div>
      </div>
    </div>
  );
}