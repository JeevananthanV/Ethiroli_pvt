import React from 'react';

export default function HRAttendance() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Attendance & Timesheets Logger</h2>
      </div>
      <div className="cardBody">
        <table className="table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Clock In Time</th>
              <th>Clock Out Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Komalatha R</td>
              <td>2026-08-21</td>
              <td>09:12 AM</td>
              <td>06:14 PM</td>
              <td><span className="statusTag active">On Time</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}