import React, { useEffect, useState } from 'react';
import { getPayrollHistory } from '../../../../services/api/payrollApi.js';

export default function PayrollHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPayrollHistory().catch(() => []);
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load payroll history:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading payroll history...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Payroll History</h2>
          <p className="pageSubtitle">Processed payroll records</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {history.length === 0 ? (
            <div className="emptyState"><h3>No Records</h3><p>No payroll records found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Employee</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id}>
                    <td>{record.employee_name || record.employee_id}</td>
                    <td>${(record.amount || 0).toLocaleString()}</td>
                    <td>{record.date ? new Date(record.date).toLocaleDateString() : '—'}</td>
                    <td><span className="statusTag active">{record.status || 'Processed'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
