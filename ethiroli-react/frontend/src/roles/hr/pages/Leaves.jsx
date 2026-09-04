import React from 'react';

export default function HRLeaves() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Staff Leave Request Applications</h2>
      </div>
      <div className="cardBody">
        <table className="table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Leave Dates</th>
              <th>Leave Category</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Prem Kumar</td>
              <td>Aug 25 - Aug 28</td>
              <td>Medical Leave</td>
              <td>Dental recovery appointment</td>
              <td>
                <button className="statusTag active">Approve</button>
                <button className="statusTag error" style={{ marginLeft: '4px' }}>Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}