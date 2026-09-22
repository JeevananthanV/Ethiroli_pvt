import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function StudentMindMap() {
  return (
    <AdminPage
      title="Visual MindMap"
      subtitle="Interactive course pathways and prerequisites"
    >
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Visual MindMap Syllabus</h3>
        </div>
        <div className="cardBody" style={{ textAlign: 'center', padding: 30 }}>
          <p>Interactive graph showing course pathways and prerequisites.</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div className="card" style={{ padding: 12 }}>HTML & CSS Fundamentals</div>
            <span>➡️</span>
            <div className="card" style={{ padding: 12 }}>JavaScript Programming</div>
            <span>➡️</span>
            <div className="card" style={{ padding: 12, background: 'var(--admin-primary)' }}>React SPA Architectures</div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}