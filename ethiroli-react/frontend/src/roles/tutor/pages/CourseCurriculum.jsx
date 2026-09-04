import React from 'react';

export default function TutorCurriculum() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Curriculum Lesson Planner</h2>
      </div>
      <div className="cardBody">
        <p>Define syllabus modules and insert video media items or quiz challenges.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
          <div className="card" style={{ padding: '12px' }}>
            <h4>Module 1: React Framework Core Concepts</h4>
            <p style={{ fontSize: '12px' }}>3 lessons • JSX syntax, component render rules</p>
          </div>
          <div className="card" style={{ padding: '12px' }}>
            <h4>Module 2: Application State Routing</h4>
            <p style={{ fontSize: '12px' }}>4 lessons • Redux store, hooks lifecycle</p>
          </div>
        </div>
      </div>
    </div>
  );
}