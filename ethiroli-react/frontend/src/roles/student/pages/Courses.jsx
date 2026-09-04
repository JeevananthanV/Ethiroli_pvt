import React from 'react';

export default function StudentCourses() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">My Enrolled Courses</h2>
      </div>
      <div className="cardBody">
        <div className="card">
          <h3>Full Stack JavaScript Bootcamp</h3>
          <p>Resume from Lesson 14: React Component Routing</p>
          <button className="actionTag" style={{ marginTop: '10px' }}>Resume Class</button>
        </div>
      </div>
    </div>
  );
}