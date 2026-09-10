import React, { useState } from 'react';

export default function PayrollRunForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ month: '', year: new Date().getFullYear() });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Payroll run initiated (would call API)');
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Run Payroll</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Month</label>
            <select className="select" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required>
              <option value="">Select month</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Year</label>
            <input className="input" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} required />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">Run Payroll</button>
          </div>
        </form>
      </div>
    </div>
  );
}
