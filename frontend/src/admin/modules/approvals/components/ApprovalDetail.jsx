import React from 'react';

export default function ApprovalDetail({ approval, onClose }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Approval Details</h3>
        {approval ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="formGroup">
              <label className="label">Request ID</label>
              <input className="input" value={approval.id || ''} disabled />
            </div>
            <div className="formGroup">
              <label className="label">Type</label>
              <input className="input" value={approval.type || 'Approval'} disabled />
            </div>
            <div className="formGroup">
              <label className="label">Status</label>
              <input className="input" value={approval.status || 'Pending'} disabled />
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--admin-text-secondary)' }}>No approval selected.</p>
        )}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} className="btn">Close</button>
        </div>
      </div>
    </div>
  );
}
