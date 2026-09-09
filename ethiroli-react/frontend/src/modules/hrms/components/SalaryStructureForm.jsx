import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listSalaryStructures, createSalaryStructure } from '../../../services/api/payrollApi.js';
import { listEmployees } from '../../../services/api/employeeApi.js';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';
import Button from '../../../common/components/Button/Button.jsx';

export default function SalaryStructureForm() {
  const [structures, setStructures] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    employeeId: '',
    basicSalary: '',
    hra: '',
    da: '',
    pf: '',
    esi: '',
    tds: '',
    otherAllowances: '',
    otherDeductions: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [structRes, empRes] = await Promise.all([
        listSalaryStructures().catch(() => []),
        listEmployees().catch(() => []),
      ]);
      setStructures(Array.isArray(structRes) ? structRes : []);
      setEmployees(Array.isArray(empRes) ? empRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load salary structures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createSalaryStructure({
        employee_id: Number(form.employeeId),
        basic_salary: Number(form.basicSalary),
        hra: Number(form.hra) || 0,
        da: Number(form.da) || 0,
        pf: Number(form.pf) || 0,
        esi: Number(form.esi) || 0,
        tds: Number(form.tds) || 0,
        other_allowances: Number(form.otherAllowances) || 0,
        other_deductions: Number(form.otherDeductions) || 0,
      });
      setShowCreate(false);
      setForm({
        employeeId: '',
        basicSalary: '',
        hra: '',
        da: '',
        pf: '',
        esi: '',
        tds: '',
        otherAllowances: '',
        otherDeductions: '',
      });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create salary structure');
    } finally {
      setSubmitting(false);
    }
  };

  const getEmployeeName = (employeeId) => {
    const emp = employees.find((e) => e.id === employeeId);
    return emp ? (emp.full_name || emp.name || `Employee ${employeeId}`) : `Employee ${employeeId}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount) || 0);
  };

  return (
    <AdminPage
      title="Salary Structure"
      subtitle="Configure Employee Basic, HRA, DA, PF, ESI, TDS allowances"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <button className="btn primary" onClick={() => setShowCreate(true)}>+ Add Structure</button>
      }
    >
      <div className="card">
        {structures.length === 0 ? (
          <div className="emptyState">
            <h3>No salary structures configured</h3>
            <p>Create a salary structure for employees to get started.</p>
          </div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Basic</th>
                  <th>HRA</th>
                  <th>DA</th>
                  <th>PF</th>
                  <th>ESI</th>
                  <th>TDS</th>
                  <th>Other Allowances</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {structures.map((struct) => (
                  <tr key={struct.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{getEmployeeName(struct.employee_id)}</td>
                    <td className="textSecondary">{formatCurrency(struct.basic_salary || struct.basicSalary)}</td>
                    <td className="textSecondary">{formatCurrency(struct.hra)}</td>
                    <td className="textSecondary">{formatCurrency(struct.da)}</td>
                    <td className="textSecondary">{formatCurrency(struct.pf)}</td>
                    <td className="textSecondary">{formatCurrency(struct.esi)}</td>
                    <td className="textSecondary">{formatCurrency(struct.tds)}</td>
                    <td className="textSecondary">{formatCurrency(struct.other_allowances || struct.otherAllowances)}</td>
                    <td className="textPrimary" style={{ fontWeight: 600 }}>
                      {formatCurrency(
                        (Number(struct.basic_salary || struct.basicSalary) || 0) +
                        (Number(struct.hra) || 0) +
                        (Number(struct.da) || 0) +
                        (Number(struct.other_allowances || struct.otherAllowances) || 0) -
                        (Number(struct.pf) || 0) -
                        (Number(struct.esi) || 0) -
                        (Number(struct.tds) || 0)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Salary Structure">
          <div className="modalBody">
            <form onSubmit={handleSubmit} className="form">
              <div className="formGroup">
                <label className="label">Employee <span className="required">*</span></label>
                <select className="select" value={form.employeeId} onChange={handleChange('employeeId')} required>
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.full_name || emp.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="formGroup">
                  <label className="label">Basic Salary (₹)</label>
                  <input className="inputField" type="number" value={form.basicSalary} onChange={handleChange('basicSalary')} placeholder="0.00" min="0" step="0.01" required />
                </div>
                <div className="formGroup">
                  <label className="label">HRA (₹)</label>
                  <input className="inputField" type="number" value={form.hra} onChange={handleChange('hra')} placeholder="0.00" min="0" step="0.01" />
                </div>
                <div className="formGroup">
                  <label className="label">DA (₹)</label>
                  <input className="inputField" type="number" value={form.da} onChange={handleChange('da')} placeholder="0.00" min="0" step="0.01" />
                </div>
                <div className="formGroup">
                  <label className="label">PF (₹)</label>
                  <input className="inputField" type="number" value={form.pf} onChange={handleChange('pf')} placeholder="0.00" min="0" step="0.01" />
                </div>
                <div className="formGroup">
                  <label className="label">ESI (₹)</label>
                  <input className="inputField" type="number" value={form.esi} onChange={handleChange('esi')} placeholder="0.00" min="0" step="0.01" />
                </div>
                <div className="formGroup">
                  <label className="label">TDS (₹)</label>
                  <input className="inputField" type="number" value={form.tds} onChange={handleChange('tds')} placeholder="0.00" min="0" step="0.01" />
                </div>
                <div className="formGroup">
                  <label className="label">Other Allowances (₹)</label>
                  <input className="inputField" type="number" value={form.otherAllowances} onChange={handleChange('otherAllowances')} placeholder="0.00" min="0" step="0.01" />
                </div>
                <div className="formGroup">
                  <label className="label">Other Deductions (₹)</label>
                  <input className="inputField" type="number" value={form.otherDeductions} onChange={handleChange('otherDeductions')} placeholder="0.00" min="0" step="0.01" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                <button type="button" className="btn secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Structure'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </AdminPage>
  );
}
