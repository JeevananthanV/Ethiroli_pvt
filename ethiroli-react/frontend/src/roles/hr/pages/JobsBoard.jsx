import React from 'react';

export default function HRJobsBoard() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Recruitment Openings Management</h2>
      </div>
      <div className="cardBody">
        <table className="table">
          <thead>
            <tr>
              <th>Position title</th>
              <th>Department</th>
              <th>Employment Model</th>
              <th>Job Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Junior Backend Intern</td>
              <td>Engineering</td>
              <td>Full-time Internship</td>
              <td><span className="statusTag active">Open</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}