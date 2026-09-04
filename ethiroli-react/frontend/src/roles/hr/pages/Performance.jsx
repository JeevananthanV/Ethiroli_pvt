import React from 'react';

export default function HRPerformance() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Employee KPI Reviews</h2>
      </div>
      <div className="cardBody">
        <table className="table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Self Score</th>
              <th>Manager Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Komalatha R</td>
              <td>4.8 / 5.0</td>
              <td>4.7 / 5.0</td>
              <td><span className="statusTag active">Excellent</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}