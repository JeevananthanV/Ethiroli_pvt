import React, { useState } from 'react';

export default function PayrollForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ employee_id: '', amount: '', pay_date: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Payroll form submitted (would call API)');
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Payroll Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Employee ID</label>
            <input className="input" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Amount</label>
            <input className="input" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Pay Date</label>
            <input className="input" type="date" value={form.pay_date} onChange={(e) => setForm({ ...form, pay_date: e.target.value })} required />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
