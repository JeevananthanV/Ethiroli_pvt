import React from 'react';

export default function HRInterviews() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Recruitment Scheduler</h2>
      </div>
      <div className="cardBody">
        <table className="table">
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Target Vacancy</th>
              <th>Interview Date & Time</th>
              <th>Interviewer Assigned</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nithya Sri</td>
              <td>Frontend Intern</td>
              <td>Aug 22, 11:00 AM</td>
              <td>Komalatha R</td>
              <td><span className="statusTag pending">Scheduled</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}