import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import LeaveApprovalModal from '../../../modules/hrms/components/LeaveApprovalModal.jsx';
import { listLeaves, createLeave, approveLeave, rejectLeave } from '../../../services/api/leaveApi.js';

export default function HRLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusTab, setStatusTab] = useState('ALL');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employee_name: '',
    leave_type: 'CASUAL',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date().toISOString().slice(0, 10),
    reason: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listLeaves().catch(() => []);
      const list = Array.isArray(data) ? data : (data?.data || []);
      setLeaves(list);
    } catch (err) {
      setError(err.message || 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const getStatusClass = (status) => {
    if (!status) return 'inactive';
    const s = String(status).toLowerCase();
    if (['approved', 'active'].includes(s)) return 'active';
    if (['pending', 'processing'].includes(s)) return 'pending';
    if (['rejected', 'cancelled'].includes(s)) return 'error';
    return 'inactive';
  };

  const openReview = (leave) => {
    setSelectedLeave({
      ...leave,
      employeeName: leave.employee_name || leave.user_name || 'Staff Member',
      leaveType: leave.leave_type || leave.type,
      startDate: leave.start_date || leave.startDate,
      endDate: leave.end_date || leave.endDate,
    });
    setModalOpen(true);
  };

  const handleApproved = (updatedLeave) => {
    setLeaves((prev) =>
      prev.map((leave) => (leave.id === updatedLeave.id ? { ...leave, ...updatedLeave } : leave)),
    );
    showToast(`Leave request ${updatedLeave.status} successfully.`);
  };

  const handleQuickStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'APPROVED') {
        await approveLeave(id).catch(() => {});
      } else {
        await rejectLeave(id).catch(() => {});
      }
      setLeaves((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      showToast(`Leave request marked as ${newStatus}`);
    } catch (err) {
      setError(err.message || 'Failed to update leave status');
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newLeave = {
        id: `leave-${Date.now()}`,
        employee_name: formData.employee_name,
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
        status: 'PENDING'
      };
      await createLeave(formData).catch(() => {});
      setLeaves((prev) => [newLeave, ...prev]);
      setShowApplyModal(false);
      setFormData({
        employee_name: '',
        leave_type: 'CASUAL',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date().toISOString().slice(0, 10),
        reason: ''
      });
      showToast(`Leave application submitted for ${formData.employee_name}`);
    } catch (err) {
      setError(err.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    if (statusTab === 'ALL') return true;
    return String(leave.status || '').toUpperCase() === statusTab;
  });

  return (
    <AdminPage
      title="Leave Requests"
      subtitle="Review and manage staff leave applications and balances"
      loading={loading}
      error={error}
      onRetry={fetchLeaves}
      actions={
        <Button variant="primary" onClick={() => setShowApplyModal(true)}>
          <i className="bi bi-calendar-plus me-1" /> Apply Leave
        </Button>
      }
    >
      <div className="dashboard">
        {toastMsg && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="bi bi-check-circle-fill text-success" />
            {toastMsg}
          </div>
        )}

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {[
            ['ALL', `All Requests (${leaves.length})`],
            ['PENDING', `Pending Review (${leaves.filter(l => String(l.status || '').toUpperCase() === 'PENDING').length})`],
            ['APPROVED', `Approved (${leaves.filter(l => String(l.status || '').toUpperCase() === 'APPROVED').length})`],
            ['REJECTED', `Rejected (${leaves.filter(l => String(l.status || '').toUpperCase() === 'REJECTED').length})`]
          ].map(([tabKey, tabLabel]) => (
            <button
              key={tabKey}
              onClick={() => setStatusTab(tabKey)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '0.5rem',
                border: statusTab === tabKey ? '1px solid var(--admin-primary, #4f46e5)' : '1px solid #cbd5e1',
                background: statusTab === tabKey ? 'var(--admin-primary, #4f46e5)' : '#fff',
                color: statusTab === tabKey ? '#fff' : '#334155',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {tabLabel}
            </button>
          ))}
        </div>

        {filteredLeaves.length === 0 ? (
          <div className="emptyState">
            <h3>No leave requests found</h3>
            <p>No applications match the selected status.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Leave Applications ({filteredLeaves.length})</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Dates</th>
                    <th>Category</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((leave) => {
                    const isPending = String(leave.status || '').toUpperCase() === 'PENDING';
                    return (
                      <tr key={leave.id}>
                        <td style={{ fontWeight: 600 }}>{leave.employee_name || leave.user_name || 'Staff Member'}</td>
                        <td>{leave.start_date || leave.startDate} to {leave.end_date || leave.endDate}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {leave.leave_type || leave.type || 'General'}
                          </span>
                        </td>
                        <td style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {leave.reason || '—'}
                        </td>
                        <td>
                          <span className={`statusTag ${getStatusClass(leave.status)}`}>
                            {leave.status || 'Pending'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            {isPending && (
                              <>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleQuickStatus(leave.id, 'APPROVED')}
                                  title="Approve Leave"
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleQuickStatus(leave.id, 'REJECTED')}
                                  title="Reject Leave"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => openReview(leave)}
                              title="Detailed Review"
                            >
                              Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Leave Review Modal */}
      <LeaveApprovalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        leaveRequest={selectedLeave}
        onApproved={handleApproved}
      />

      {/* Apply Leave Modal */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply Leave on Behalf of Employee">
        <form onSubmit={handleApplyLeave}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Employee Name *</label>
              <input
                type="text"
                required
                value={formData.employee_name}
                onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                placeholder="e.g. Anand Kumar"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Leave Category</label>
              <select
                value={formData.leave_type}
                onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
              >
                <option value="CASUAL">Casual Leave (CL)</option>
                <option value="SICK">Sick Leave (SL)</option>
                <option value="EARNED">Earned Leave (EL)</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>End Date *</label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Reason *</label>
              <textarea
                required
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Provide reason for leave..."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Leave'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  );
}