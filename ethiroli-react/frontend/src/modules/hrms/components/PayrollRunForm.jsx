import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listEmployees } from '../../../services/api/employeeApi.js';
import { processPayroll } from '../../../services/api/payrollApi.js';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Button from '../../../common/components/Button/Button.jsx';

export default function PayrollRunForm() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [form, setForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listEmployees();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const toggleEmployee = (empId) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const handleProcess = async () => {
    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee');
      return;
    }
    setProcessing(true);
    try {
      await processPayroll({
        employee_ids: selectedEmployees,
        month: Number(form.month),
        year: Number(form.year),
      });
      alert(`Payroll processed for ${selectedEmployees.length} employees`);
      setShowConfirm(false);
      setSelectedEmployees([]);
    } catch (err) {
      alert(err.message || 'Failed to process payroll');
    } finally {
      setProcessing(false);
    }
  };

  const monthName = new Date(0, form.month - 1).toLocaleString('en-US', { month: 'long' });

  return (
    <AdminPage
      title="Run Payroll"
      subtitle="Select Month/Year to calculate salary components"
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
    >
      <div className="card" style={{ maxWidth: 800 }}>
        <div className="cardHeader"><h3 className="cardTitle">Bulk Payroll Processing</h3></div>
        <div className="cardBody">
          <div className="form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="formGroup">
                <label className="label">Month</label>
                <select className="select" value={form.month} onChange={handleChange('month')}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en-US', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
              <div className="formGroup">
                <label className="label">Year</label>
                <input className="inputField" type="number" value={form.year} onChange={handleChange('year')} min="2000" max="2099" />
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <label className="label" style={{ marginBottom: 10, display: 'block' }}>Select Employees ({selectedEmployees.length} selected)</label>
              <div className="overflowAuto" style={{ maxHeight: 400, border: '1px solid var(--admin-border-subtle)', borderRadius: 8 }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}><input type="checkbox" onChange={(e) => {
                        if (e.target.checked) setSelectedEmployees(employees.map((emp) => emp.id));
                        else setSelectedEmployees([]);
                      }} checked={selectedEmployees.length === employees.length && employees.length > 0} /></th>
                      <th>Name</th>
                      <th>Employee Code</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} onClick={() => toggleEmployee(emp.id)} style={{ cursor: 'pointer', background: selectedEmployees.includes(emp.id) ? 'var(--admin-bg-card)' : 'transparent' }}>
                        <td><input type="checkbox" checked={selectedEmployees.includes(emp.id)} onChange={() => toggleEmployee(emp.id)} /></td>
                        <td className="textPrimary" style={{ fontWeight: 500 }}>{emp.full_name || emp.name}</td>
                        <td className="textSecondary">{emp.employee_code || '-'}</td>
                        <td className="textSecondary">{emp.department || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn primary" onClick={() => setShowConfirm(true)} disabled={selectedEmployees.length === 0}>
                Process Payroll ({selectedEmployees.length} employees)
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Payroll Run">
          <div className="modalBody">
            <p>You are about to process payroll for <strong>{selectedEmployees.length} employees</strong> for <strong>{monthName} {form.year}</strong>.</p>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>This action will calculate salaries and generate payslips.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn primary" onClick={handleProcess} disabled={processing}>
                {processing ? 'Processing...' : 'Process Payroll'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminPage>
  );
}
