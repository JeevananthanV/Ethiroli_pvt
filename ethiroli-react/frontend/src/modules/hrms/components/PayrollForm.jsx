import React, { useEffect, useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listEmployees } from '../../../services/api/employeeApi.js';
import { listSalaryStructures, processPayroll } from '../../../services/api/payrollApi.js';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';
import Button from '../../../common/components/Button/Button.jsx';

export default function PayrollForm() {
  const [employees, setEmployees] = useState([]);
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: '',
    hra: '',
    da: '',
    pf: '',
    esi: '',
    tds: '',
    otherAllowances: '',
    otherDeductions: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [empRes, structRes] = await Promise.all([
          listEmployees().catch(() => []),
          listSalaryStructures().catch(() => []),
        ]);
        setEmployees(Array.isArray(empRes) ? empRes : []);
        setStructures(Array.isArray(structRes) ? structRes : []);
      } catch (err) {
        setError(err.message || 'Failed to load payroll data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleEmployeeChange = (e) => {
    const empId = Number(e.target.value);
    const structure = structures.find((s) => s.employee_id === empId);
    if (structure) {
      setForm({
        ...form,
        employeeId: empId,
        basicSalary: structure.basic_salary || structure.basicSalary || '',
        hra: structure.hra || '',
        da: structure.da || '',
        pf: structure.pf || '',
        esi: structure.esi || '',
        otherAllowances: structure.other_allowances || structure.otherAllowances || '',
      });
    } else {
      setForm({ ...form, employeeId: empId });
    }
  };

  const netSalary = useMemo(() => {
    const basic = Number(form.basicSalary) || 0;
    const hra = Number(form.hra) || 0;
    const da = Number(form.da) || 0;
    const allowances = Number(form.otherAllowances) || 0;
    const pf = Number(form.pf) || 0;
    const esi = Number(form.esi) || 0;
    const tds = Number(form.tds) || 0;
    const otherDed = Number(form.otherDeductions) || 0;
    return basic + hra + da + allowances - pf - esi - tds - otherDed;
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeId) return;
    setShowConfirm(true);
  };

  const confirmProcess = async () => {
    setSubmitting(true);
    try {
      await processPayroll({
        employee_id: Number(form.employeeId),
        month: Number(form.month),
        year: Number(form.year),
        basic_salary: Number(form.basicSalary),
        hra: Number(form.hra),
        da: Number(form.da),
        pf: Number(form.pf),
        esi: Number(form.esi),
        tds: Number(form.tds),
        other_allowances: Number(form.otherAllowances),
        other_deductions: Number(form.otherDeductions),
      });
      alert('Payroll processed successfully');
      setForm({
        employeeId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basicSalary: '',
        hra: '',
        da: '',
        pf: '',
        esi: '',
        tds: '',
        otherAllowances: '',
        otherDeductions: '',
      });
      setShowConfirm(false);
    } catch (err) {
      alert(err.message || 'Failed to process payroll');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(amount) || 0);
  };

  return (
    <AdminPage
      title="Payroll Entry"
      subtitle="Process individual payroll for employees"
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
    >
      <div className="card" style={{ maxWidth: 800 }}>
        <div className="cardHeader"><h3 className="cardTitle">Process Payroll</h3></div>
        <div className="cardBody">
          <form onSubmit={handleSubmit} className="form">
            <div className="formGroup">
              <label className="label">Employee <span className="required">*</span></label>
              <select className="select" value={form.employeeId} onChange={handleEmployeeChange} required>
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.full_name || emp.name}</option>
                ))}
              </select>
            </div>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <div className="formGroup">
                <label className="label">Basic Salary (₹)</label>
                <input className="inputField" type="number" value={form.basicSalary} onChange={handleChange('basicSalary')} placeholder="0.00" min="0" step="0.01" />
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
            <div style={{ marginTop: 16, padding: 16, background: 'var(--admin-bg-card)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>Net Salary</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--admin-success)' }}>{formatCurrency(netSalary)}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button type="submit" className="btn primary" disabled={submitting || !form.employeeId}>
                {submitting ? 'Processing...' : 'Process Payroll'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirm && (
        <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Payroll Processing">
          <div className="modalBody">
            <p>Are you sure you want to process payroll for {employees.find((e) => e.id === Number(form.employeeId))?.full_name || 'this employee'}?</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn primary" onClick={confirmProcess} disabled={submitting}>Confirm</button>
            </div>
          </div>
        </Modal>
      )}
    </AdminPage>
  );
}
