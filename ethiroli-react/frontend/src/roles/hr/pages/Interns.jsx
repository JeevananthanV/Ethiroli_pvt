import React from 'react';

export default function HRInterns() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Intern Track Manager</h2>
      </div>
      <div className="cardBody">
        <table className="table">
          <thead>
            <tr>
              <th>Intern</th>
              <th>Assigned Mentor</th>
              <th>Project Target</th>
              <th>Completion Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ajay S</td>
              <td>Komalatha R</td>
              <td>Ethiroli Admin React Setup</td>
              <td>75% complete</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}