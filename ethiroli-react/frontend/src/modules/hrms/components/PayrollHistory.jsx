import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listPayrollHistory } from '../../../services/api/payrollApi.js';
import { listEmployees } from '../../../services/api/employeeApi.js';

export default function PayrollHistory() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMonth, setFilterMonth] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [historyRes, empRes] = await Promise.all([
        listPayrollHistory({ month: filterMonth === 'all' ? undefined : Number(filterMonth) }).catch(() => []),
        listEmployees().catch(() => []),
      ]);
      setRecords(Array.isArray(historyRes) ? historyRes : []);
      setEmployees(Array.isArray(empRes) ? empRes : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch payroll history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterMonth]);

  const getEmployeeName = (employeeId) => {
    const emp = employees.find((e) => e.id === employeeId);
    return emp ? (emp.full_name || emp.name || `Employee ${employeeId}`) : `Employee ${employeeId}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount) || 0);
  };

  const stats = {
    total: records.length,
    totalAmount: records.reduce((sum, r) => sum + (Number(r.net_salary || r.netSalary) || 0), 0),
  };

  return (
    <AdminPage
      title="Payroll History"
      subtitle="Processed payroll records and transfer verification codes"
      loading={loading}
      error={error}
      onRetry={fetchData}
      actions={
        <select className="select" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{ width: 150 }}>
          <option value="all">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en-US', { month: 'long' })}</option>
          ))}
        </select>
      }
    >
      <div className="dashboardGrid" style={{ marginBottom: 24 }}>
        <div className="statCard">
          <p className="statLabel">Total Records</p>
          <p className="statValue">{stats.total}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Total Disbursed</p>
          <p className="statValue" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text' }}>{formatCurrency(stats.totalAmount)}</p>
        </div>
      </div>

      <div className="card">
        {records.length === 0 ? (
          <div className="emptyState">
            <h3>No payroll records</h3>
            <p>Processed payroll records will appear here.</p>
          </div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Basic</th>
                  <th>HRA</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{getEmployeeName(record.employee_id)}</td>
                    <td className="textSecondary">{record.month}</td>
                    <td className="textSecondary">{record.year}</td>
                    <td className="textSecondary">{formatCurrency(record.basic_salary || record.basicSalary)}</td>
                    <td className="textSecondary">{formatCurrency(record.hra)}</td>
                    <td className="textSecondary">{formatCurrency((Number(record.pf) || 0) + (Number(record.esi) || 0) + (Number(record.tds) || 0))}</td>
                    <td className="textPrimary" style={{ fontWeight: 600 }}>{formatCurrency(record.net_salary || record.netSalary)}</td>
                    <td><span className="statusTag active">{record.status || 'PROCESSED'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
