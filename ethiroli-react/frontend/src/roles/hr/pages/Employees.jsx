import React from 'react';

export default function HREmployees() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Employee Directory</h2>
      </div>
      <div className="cardBody">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Komalatha R</td>
              <td>Senior Software Engineer</td>
              <td>Engineering</td>
              <td><span className="statusTag active">Active</span></td>
            </tr>
            <tr>
              <td>Prem Kumar</td>
              <td>Business Developer</td>
              <td>Sales</td>
              <td><span className="statusTag active">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}