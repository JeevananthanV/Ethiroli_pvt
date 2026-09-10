import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listPayrollHistory } from '../../../services/api/payrollApi.js';

export default function HRPayroll() {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayroll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPayrollHistory().catch(() => []);
      setPayroll(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  return (
    <AdminPage
      title="Payroll Processing"
      subtitle="Review salary, allowances, and deductions"
      loading={loading}
      error={error}
      onRetry={fetchPayroll}
    >
      <div className="dashboard">
        {payroll.length === 0 ? (
          <div className="emptyState">
            <h3>No payroll records</h3>
            <p>Payroll entries will appear here once processed.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Payroll Ledger</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Basic Salary</th>
                    <th>Allowances</th>
                    <th>Deductions</th>
                    <th>Net Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.map((pay) => (
                    <tr key={pay.id}>
                      <td style={{ fontWeight: 600 }}>{pay.employee_name || pay.user_name || '—'}</td>
                      <td>{pay.basicSalary || pay.basic_salary ? `₹${Number(pay.basicSalary || pay.basic_salary).toLocaleString()}` : '—'}</td>
                      <td>{pay.allowances ? `₹${Number(pay.allowances).toLocaleString()}` : '—'}</td>
                      <td>{pay.deductions ? `₹${Number(pay.deductions).toLocaleString()}` : '—'}</td>
                      <td style={{ fontWeight: 600, color: 'var(--admin-success)' }}>
                        {pay.netPay || pay.net_pay ? `₹${Number(pay.netPay || pay.net_pay).toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}