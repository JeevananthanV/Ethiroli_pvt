import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function StudentCoursePlayer() {
  return (
    <AdminPage
      title="Course Player"
      subtitle="Watch lessons and track your progress"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <div style={{ background: '#000', width: '100%', height: 350, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 18 }}>🖥️ E-Learning Video Player Mock</span>
          </div>
          <h3 style={{ marginTop: 16 }}>Lesson 14: Dynamic State Routing</h3>
        </div>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Class Index Syllabus</h3>
          </div>
          <div className="cardBody">
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>🟢 Lesson 12: JSX Rendering Basics</li>
              <li>🟢 Lesson 13: Redux Stores Setup</li>
              <li style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>🔵 Lesson 14: Dynamic State Routing</li>
              <li>⚪ Lesson 15: Database Persistence API</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}