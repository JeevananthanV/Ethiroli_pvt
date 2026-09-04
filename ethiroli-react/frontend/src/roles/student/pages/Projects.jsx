import React from 'react';

export default function StudentProjects() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">My Project Submissions</h2>
      </div>
      <div className="cardBody">
        <table className="table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Target Deadline</th>
              <th>Status</th>
              <th>Evaluation Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>React Portfolio Site</td>
              <td>2026-08-28</td>
              <td><span className="statusTag active">Submitted</span></td>
              <td>A+ (Feedback: Excellent UI styling)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}