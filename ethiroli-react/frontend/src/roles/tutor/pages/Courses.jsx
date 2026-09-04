import React from 'react';

export default function TutorCourses() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">My E-Learning Courses</h2>
      </div>
      <div className="cardBody" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="card">
          <h3>Full Stack React Bootcamp</h3>
          <p style={{ margin: '8px 0', fontSize: '13px' }}>42 Lessons • Intermediate Level</p>
          <span className="statusTag active">PUBLISHED</span>
        </div>
      </div>
    </div>
  );
}