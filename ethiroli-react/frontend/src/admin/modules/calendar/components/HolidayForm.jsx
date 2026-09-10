import React, { useState } from 'react';
import { createHoliday } from '../../../../services/api/holidayApi.js';

export default function HolidayForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', date: '', type: 'public' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createHoliday(form);
      setForm({ name: '', date: '', type: 'public' });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to create holiday:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="formGroup">
        <label className="label">Holiday Name</label>
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div className="formGroup">
        <label className="label">Date</label>
        <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
      </div>
      <div className="formGroup">
        <label className="label">Type</label>
        <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="public">Public</option>
          <option value="optional">Optional</option>
        </select>
      </div>
      <button type="submit" className="btn btnPrimary" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save Holiday'}
      </button>
    </form>
  );
}
