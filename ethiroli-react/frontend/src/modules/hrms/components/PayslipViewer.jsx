import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listEmployees } from '../../../services/api/employeeApi.js';
import { listPayrollHistory } from '../../../services/api/payrollApi.js';

export default function PayslipViewer() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [empRes, historyRes] = await Promise.all([
          listEmployees().catch(() => []),
          listPayrollHistory().catch(() => []),
        ]);
        setEmployees(Array.isArray(empRes) ? empRes : []);
        setRecords(Array.isArray(historyRes) ? historyRes : []);
      } catch (err) {
        setError(err.message || 'Failed to load payslip data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const record = records.find(
    (r) => r.employee_id === Number(selectedEmployee) && r.month === Number(selectedMonth) && r.year === Number(selectedYear)
  );

  const employee = employees.find((e) => e.id === Number(selectedEmployee));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount) || 0);
  };

  const earnings = [
    { label: 'Basic Salary', amount: Number(record?.basic_salary || record?.basicSalary) || 0 },
    { label: 'HRA', amount: Number(record?.hra) || 0 },
    { label: 'DA', amount: Number(record?.da) || 0 },
    { label: 'Other Allowances', amount: Number(record?.other_allowances || record?.otherAllowances) || 0 },
  ];

  const deductions = [
    { label: 'PF', amount: Number(record?.pf) || 0 },
    { label: 'ESI', amount: Number(record?.esi) || 0 },
    { label: 'TDS', amount: Number(record?.tds) || 0 },
    { label: 'Other Deductions', amount: Number(record?.other_deductions || record?.otherDeductions) || 0 },
  ];

  const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
  const netSalary = totalEarnings - totalDeductions;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminPage
      title="Payslip Viewer"
      subtitle="View earnings, deductions, and download payslips"
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
      actions={
        <button className="btn primary" onClick={handlePrint}>Print Payslip</button>
      }
    >
      <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="cardHeader" style={{ textAlign: 'center' }}>
          <h3 className="cardTitle">Payslip</h3>
          <p style={{ color: 'var(--admin-text-muted)', marginTop: 4 }}>
            {new Date(selectedYear, selectedMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="cardBody">
          <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="formGroup">
                <label className="label">Employee</label>
                <select className="select" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.full_name || emp.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="formGroup">
                  <label className="label">Month</label>
                  <select className="select" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en-US', { month: 'short' })}</option>
                    ))}
                  </select>
                </div>
                <div className="formGroup">
                  <label className="label">Year</label>
                  <input className="inputField" type="number" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} />
                </div>
              </div>
            </div>
          </div>

          {record ? (
            <div style={{ border: '1px solid var(--admin-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: 16, background: 'var(--admin-bg-card)', borderBottom: '1px solid var(--admin-border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{employee?.full_name || employee?.name || 'Employee'}</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--admin-text-muted)' }}>{employee?.employee_code || employee?.email || ''}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--admin-text-muted)' }}>Payslip ID</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>{record.id}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <div style={{ padding: 16 }}>
                  <h5 style={{ marginBottom: 10, color: 'var(--admin-success)' }}>Earnings</h5>
                  {earnings.filter((e) => e.amount > 0).map((item) => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>{item.label}</span>
                      <span style={{ fontWeight: 500 }}>{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--admin-border-subtle)', fontWeight: 600 }}>
                    <span>Total Earnings</span>
                    <span>{formatCurrency(totalEarnings)}</span>
                  </div>
                </div>
                <div style={{ padding: 16, borderLeft: '1px solid var(--admin-border-subtle)' }}>
                  <h5 style={{ marginBottom: 10, color: 'var(--admin-danger)' }}>Deductions</h5>
                  {deductions.filter((d) => d.amount > 0).map((item) => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                      <span style={{ color: 'var(--admin-text-secondary)' }}>{item.label}</span>
                      <span style={{ fontWeight: 500 }}>{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--admin-border-subtle)', fontWeight: 600 }}>
                    <span>Total Deductions</span>
                    <span>{formatCurrency(totalDeductions)}</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: 16, background: 'var(--admin-success)', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Net Salary</span>
                <span style={{ fontWeight: 700, fontSize: 18 }}>{formatCurrency(netSalary)}</span>
              </div>
            </div>
          ) : (
            <div className="emptyState">
              <h3>No payslip found</h3>
              <p>Select an employee and month to view payslip.</p>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
