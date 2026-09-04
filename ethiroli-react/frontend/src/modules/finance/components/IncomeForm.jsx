import React, { useState } from 'react';
import { logIncome } from '../../services/api/transactionApi.js';

export default function IncomeForm({ onSaved }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', category: 'course_fee', date: new Date().toISOString().split('T')[0], clientId: '', reference: '' });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await logIncome({ ...form, amount: Number(form.amount) });
      setForm({ description: '', amount: '', category: 'course_fee', date: new Date().toISOString().split('T')[0], clientId: '', reference: '' });
      onSaved?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log income');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">Log New Income</h3>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="formGroup">
            <label className="label">Description <span className="required">*</span></label>
            <input className="inputField" value={form.description} onChange={handleChange('description')} placeholder="e.g. Course fee payment" required />
          </div>
          <div className="formGroup">
            <label className="label">Amount (₹) <span className="required">*</span></label>
            <input className="inputField" type="number" value={form.amount} onChange={handleChange('amount')} placeholder="0.00" min="0" step="0.01" required />
          </div>
          <div className="formGroup">
            <label className="label">Category</label>
            <select className="select" value={form.category} onChange={handleChange('category')}>
              <option value="course_fee">Course Fee</option>
              <option value="subscription">Subscription</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Date</label>
            <input className="inputField" type="date" value={form.date} onChange={handleChange('date')} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Log Income'}
          </button>
        </div>
      </form>
    </div>
  );
}
