import React, { useState } from 'react';
import { logExpense } from '../../../../services/api/transactionApi.js';

export default function ExpenseForm({ onSaved }) {
  const [form, setForm] = useState({ description: '', amount: '', date: '', category: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await logExpense({ ...form, amount: parseFloat(form.amount) });
      setForm({ description: '', amount: '', date: '', category: '' });
      onSaved?.();
    } catch (err) {
      console.error('Failed to log expense:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="formGroup">
        <label className="label">Description</label>
        <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      </div>
      <div className="formGroup">
        <label className="label">Amount</label>
        <input className="input" type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
      </div>
      <div className="formGroup">
        <label className="label">Date</label>
        <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
      </div>
      <div className="formGroup">
        <label className="label">Category</label>
        <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      </div>
      <button type="submit" className="btn btnPrimary" disabled={saving}>{saving ? 'Saving...' : 'Log Expense'}</button>
    </form>
  );
}
