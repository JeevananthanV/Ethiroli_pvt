import React from 'react';

export default function PayslipViewer({ payslip, onClose }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Payslip</h3>
        {payslip ? (
          <div>
            <div className="formGroup">
              <label className="label">Employee</label>
              <input className="input" value={payslip.employee_name || payslip.employee_id || ''} disabled />
            </div>
            <div className="formGroup">
              <label className="label">Amount</label>
              <input className="input" value={`$${(payslip.amount || 0).toLocaleString()}`} disabled />
            </div>
            <div className="formGroup">
              <label className="label">Date</label>
              <input className="input" value={payslip.date ? new Date(payslip.date).toLocaleDateString() : '—'} disabled />
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--admin-text-secondary)' }}>No payslip selected.</p>
        )}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} className="btn">Close</button>
        </div>
      </div>
    </div>
  );
}
