import React from 'react';

export default function StudentCoursePlayer() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
      <div className="card">
        <div style={{ background: '#000', width: '100%', height: '350px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontSize: '18px' }}>🖥️ E-Learning Video Player Mock</span>
        </div>
        <h3 style={{ marginTop: '16px' }}>Lesson 14: Dynamic State Routing</h3>
      </div>
      <div className="card">
        <h3>Class Index Syllabus</h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
          <li>🟢 Lesson 12: JSX Rendering Basics</li>
          <li>🟢 Lesson 13: Redux Stores Setup</li>
          <li style={{ fontWeight: '700', color: 'var(--admin-primary)' }}>🔵 Lesson 14: Dynamic State Routing</li>
          <li>⚪ Lesson 15: Database Persistence API</li>
        </ul>
      </div>
    </div>
  );
}