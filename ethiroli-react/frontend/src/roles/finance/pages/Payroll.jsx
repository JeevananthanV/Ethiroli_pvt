import React, { useEffect, useState, useCallback } from 'react';
import { getTransactions } from '../../../services/api/transactionApi.js';
import { logExpense } from '../../../services/api/transactionApi.js';

export default function FinancePayroll() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', category: 'salary', date: new Date().toISOString().split('T')[0], payee: '', reference: '' });
  const [filterMonth, setFilterMonth] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { type: 'expense', category: 'salary' };
      if (filterMonth) params.month = filterMonth;
      const data = await getTransactions(params);
      const list = Array.isArray(data) ? data : data.transactions || data.data || [];
      setTransactions(list);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  }, [filterMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await logExpense({ ...form, amount: Number(form.amount), category: 'salary' });
      setForm({ description: '', amount: '', category: 'salary', date: new Date().toISOString().split('T')[0], payee: '', reference: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log payroll');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPayroll = transactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Payroll</h1>
          <p className="pageSubtitle">Staff payout disbursements and payroll verification</p>
        </div>
        <div className="pageActions">
          <input
            type="month"
            className="inputField"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{ width: 160 }}
          />
          <button className="btn primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close Form' : '+ Log Payroll'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="cardTitle" style={{ marginBottom: 16 }}>Log Payroll Disbursement</h3>
          <form onSubmit={handleSubmit} className="form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="formGroup">
                <label className="label">Employee / Staff Name <span className="required">*</span></label>
                <input className="inputField" value={form.payee} onChange={(e) => setForm({ ...form, payee: e.target.value })} placeholder="Employee name" required />
              </div>
              <div className="formGroup">
                <label className="label">Amount (₹) <span className="required">*</span></label>
                <input className="inputField" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" min="0" step="0.01" required />
              </div>
              <div className="formGroup">
                <label className="label">Description</label>
                <input className="inputField" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Monthly salary - Aug 2026" />
              </div>
              <div className="formGroup">
                <label className="label">Pay Date</label>
                <input className="inputField" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Reference / Payslip No.</label>
                <input className="inputField" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="Optional reference" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" className="btn primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Log Payroll'}
              </button>
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="dashboardGrid" style={{ marginBottom: 24 }}>
        <div className="statCard">
          <p className="statLabel">Payroll Period</p>
          <p className="statValue" style={{ fontSize: 20 }}>{filterMonth || currentMonth}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Total Disbursed</p>
          <p className="statValue">₹{totalPayroll.toLocaleString('en-IN')}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Disbursements Count</p>
          <p className="statValue">{transactions.length}</p>
        </div>
      </div>

      <div className="card">
        {error && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--admin-danger)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button className="btn secondary btnSm" onClick={fetchData}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }}></div>
              <div className="skeleton" style={{ width: '40%', height: 12 }}></div>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="emptyState">
            <h3>No Payroll Records</h3>
            <p>Log payroll disbursements to track staff payments.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Description</th>
                <th>Reference</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id || tx._id}>
                  <td>{tx.date ? new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                  <td style={{ fontWeight: 600 }}>{tx.payee || '—'}</td>
                  <td>{tx.description || 'Salary disbursement'}</td>
                  <td>{tx.reference || '—'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--admin-danger)' }}>
                    -₹{Number(tx.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
