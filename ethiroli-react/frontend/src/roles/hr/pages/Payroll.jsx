import React from 'react';

export default function HRPayroll() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Payroll Processing Ledger</h2>
      </div>
      <div className="cardBody">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Taxes & PF Deductions</th>
              <th>Net Remittance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Komalatha R</td>
              <td>₹85,000</td>
              <td>₹12,000</td>
              <td>₹4,500</td>
              <td style={{ fontWeight: '600', color: 'var(--admin-success)' }}>₹92,500</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}