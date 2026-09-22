import React, { useState } from 'react';

export default function InvoiceGenerator({ onClose, onSuccess }) {
  const [form, setForm] = useState({ clientId: '', amount: '', dueDate: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Invoice generated (would call API)');
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Generate Invoice</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Client ID</label>
            <input className="input" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Amount</label>
            <input className="input" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Due Date</label>
            <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">Generate Invoice</button>
          </div>
        </form>
      </div>
    </div>
  );
}
