import React from 'react';

export default function StudentMindMap() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Visual MindMap Syllabus</h2>
      </div>
      <div className="cardBody" style={{ textAlign: 'center', padding: '30px' }}>
        <p>Interactive graph showing course pathways and prerequisites.</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
          <div className="card" style={{ padding: '12px' }}>HTML & CSS Fundamentals</div>
          <span>➡️</span>
          <div className="card" style={{ padding: '12px' }}>JavaScript Programming</div>
          <span>➡️</span>
          <div className="card" style={{ padding: '12px', background: 'var(--admin-primary)' }}>React SPA Architectures</div>
        </div>
      </div>
    </div>
  );
}