import React, { useState } from 'react';
import { logExpense } from '../../services/api/transactionApi.js';

export default function ExpenseForm({ onSaved }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', category: 'infrastructure', date: new Date().toISOString().split('T')[0], payee: '', reference: '' });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await logExpense({ ...form, amount: Number(form.amount) });
      setForm({ description: '', amount: '', category: 'infrastructure', date: new Date().toISOString().split('T')[0], payee: '', reference: '' });
      onSaved?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">Log New Expense</h3>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="formGroup">
            <label className="label">Description <span className="required">*</span></label>
            <input className="inputField" value={form.description} onChange={handleChange('description')} placeholder="e.g. AWS hosting" required />
          </div>
          <div className="formGroup">
            <label className="label">Amount (₹) <span className="required">*</span></label>
            <input className="inputField" type="number" value={form.amount} onChange={handleChange('amount')} placeholder="0.00" min="0" step="0.01" required />
          </div>
          <div className="formGroup">
            <label className="label">Category</label>
            <select className="select" value={form.category} onChange={handleChange('category')}>
              <option value="infrastructure">Infrastructure</option>
              <option value="salary">Salary</option>
              <option value="tools">Tools & Software</option>
              <option value="marketing">Marketing</option>
              <option value="office">Office Expenses</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Payee</label>
            <input className="inputField" value={form.payee} onChange={handleChange('payee')} placeholder="Vendor name" />
          </div>
          <div className="formGroup">
            <label className="label">Date</label>
            <input className="inputField" type="date" value={form.date} onChange={handleChange('date')} />
          </div>
          <div className="formGroup">
            <label className="label">Reference</label>
            <input className="inputField" value={form.reference} onChange={handleChange('reference')} placeholder="Invoice / ref number" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Log Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
