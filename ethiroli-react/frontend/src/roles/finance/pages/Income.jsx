import React, { useEffect, useState, useCallback } from 'react';
import { getTransactions, logIncome } from '../../../services/api/transactionApi.js';

export default function FinanceIncome() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', category: 'course_fee', date: new Date().toISOString().split('T')[0], clientId: '', reference: '' });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactions({ type: 'income' });
      const list = Array.isArray(data) ? data : data.transactions || data.data || [];
      setTransactions(list);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load income records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await logIncome({
        ...form,
        amount: Number(form.amount),
      });
      setForm({ description: '', amount: '', category: 'course_fee', date: new Date().toISOString().split('T')[0], clientId: '', reference: '' });
      setShowForm(false);
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log income');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Income</h1>
          <p className="pageSubtitle">Track all incoming revenue: course fees, subscriptions, and other payments</p>
        </div>
        <div className="pageActions">
          <button className="btn primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close Form' : '+ Log Income'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="cardTitle" style={{ marginBottom: 16 }}>Log New Income</h3>
          <form onSubmit={handleSubmit} className="form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="formGroup">
                <label className="label">Description <span className="required">*</span></label>
                <input className="inputField" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. React course fee" required />
              </div>
              <div className="formGroup">
                <label className="label">Amount (₹) <span className="required">*</span></label>
                <input className="inputField" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" min="0" step="0.01" required />
              </div>
              <div className="formGroup">
                <label className="label">Category</label>
                <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="course_fee">Course Fee</option>
                  <option value="subscription">Subscription</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="formGroup">
                <label className="label">Date</label>
                <input className="inputField" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" className="btn primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Log Income'}
              </button>
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {error && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--admin-danger)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button className="btn secondary btnSm" onClick={fetchTransactions}>Retry</button>
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
            <h3>No Income Records</h3>
            <p>Log your first income transaction to start tracking revenue.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Reference</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id || tx._id}>
                  <td>{tx.date ? new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                  <td style={{ fontWeight: 600 }}>{tx.description || '—'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{tx.category || tx.type || '—'}</td>
                  <td>{tx.reference || '—'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--admin-success)' }}>
                    +₹{Number(tx.amount).toLocaleString('en-IN')}
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
