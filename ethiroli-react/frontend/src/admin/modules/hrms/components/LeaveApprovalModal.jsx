import React from 'react';

export default function LeaveApprovalModal({ leave, onClose, onApprove, onReject }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Leave Approval</h3>
        {leave && (
          <div>
            <p style={{ marginBottom: '12px' }}>Employee: <strong>{leave.employee_name || leave.employee_id}</strong></p>
            <p style={{ marginBottom: '20px' }}>Type: <strong>{leave.leave_type}</strong> ({leave.start_date} to {leave.end_date})</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={onClose} className="btn">Cancel</button>
              <button onClick={() => { if (onReject) onReject(leave.id); onClose(); }} className="btn" style={{ background: 'var(--admin-danger)', color: 'white' }}>Reject</button>
              <button onClick={() => { if (onApprove) onApprove(leave.id); onClose(); }} className="btn btnPrimary">Approve</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
