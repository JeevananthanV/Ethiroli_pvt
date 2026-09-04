import React from 'react';

export default function TutorStudents() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Student Progress Tracker</h2>
      </div>
      <div className="cardBody">
        <table className="table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course Selected</th>
              <th>Progress Ratio</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Karthik Raja</td>
              <td>React Bootcamp</td>
              <td>88% complete</td>
              <td>Today</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}