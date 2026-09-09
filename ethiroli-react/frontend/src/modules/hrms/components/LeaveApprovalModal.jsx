import React, { useState, useEffect } from 'react';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { updateLeaveStatus } from '../../../services/api/leaveApi.js';
import { listEmployees } from '../../../services/api/employeeApi.js';

export default function LeaveApprovalModal({ isOpen, onClose, leave, onStatusUpdate }) {
  const [action, setAction] = useState('APPROVED');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (isOpen) {
      listEmployees().then((data) => setEmployees(Array.isArray(data) ? data : [])).catch(() => {});
    }
  }, [isOpen]);

  const getEmployeeName = (employeeId) => {
    const emp = employees.find((e) => e.id === employeeId);
    return emp ? (emp.full_name || emp.name || `Employee ${employeeId}`) : `Employee ${employeeId}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leave?.id) return;
    setSubmitting(true);
    try {
      await updateLeaveStatus(leave.id, action, comments);
      if (onStatusUpdate) onStatusUpdate({ ...leave, status: action, comments });
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to update leave status');
    } finally {
      setSubmitting(false);
    }
  };

  if (!leave) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Approval">
      <div className="modalBody">
        <div className="form">
          <div className="formGroup">
            <label className="label">Employee</label>
            <p className="textSecondary">{getEmployeeName(leave.employee_id)}</p>
          </div>
          <div className="formGroup">
            <label className="label">Leave Type</label>
            <p className="textSecondary">{leave.leave_type || 'General Leave'}</p>
          </div>
          <div className="formGroup">
            <label className="label">Dates</label>
            <p className="textSecondary">{leave.start_date} to {leave.end_date}</p>
          </div>
          <div className="formGroup">
            <label className="label">Reason</label>
            <p className="textSecondary">{leave.reason || 'No reason provided'}</p>
          </div>
          <div className="formGroup">
            <label className="label">Decision <span className="required">*</span></label>
            <select className="select" value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="APPROVED">Approve</option>
              <option value="REJECTED">Reject</option>
              <option value="CANCELLED">Cancel</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Comments</label>
            <textarea
              className="textarea"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add approval/rejection comments..."
              rows={3}
            />
          </div>
          <Button type="submit" onClick={handleSubmit} disabled={submitting} variant="primary" className="btnFull">
            {submitting ? 'Updating...' : 'Submit Decision'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
