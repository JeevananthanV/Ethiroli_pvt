import React from 'react';

export default function StudentForum() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Student Discussion Board</h2>
      </div>
      <div className="cardBody">
        <p>Post questions, share answers, or find coding project collaborators.</p>
        <div className="card" style={{ margin: '16px 0' }}>
          <h4>Stuck with Redux Slice config error: state.items is undefined</h4>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>Asked by Karthik R • 2 replies</p>
        </div>
      </div>
    </div>
  );
}