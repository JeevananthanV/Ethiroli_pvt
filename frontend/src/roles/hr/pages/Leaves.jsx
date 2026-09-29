import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import LeaveApprovalModal from '../../../modules/hrms/components/LeaveApprovalModal.jsx';
import { useHrData } from '../../../hooks/useHrData';
import { listLeaves, createLeave, approveLeave, rejectLeave } from '../../../../services/api/hrApi.standardized.js';
import { listEmployees } from '../../../../services/api/hrApi.standardized.js';

/**
 * HRLeaves - Dynamic Leave Requests with Proper Data Flow
 * 
 * Uses useHrData hook for consistent state management,
 * hrApi.standardized.js for consistent API calls,
 * and AdminPage for unified loading/error/empty states.
 * Maintains all unique leave management functionality.
 */
export default function HRLeaves() {
  // --- Data Hook with Proper Flow ---
  // useHrData provides: data, loading, error, refresh, search, setSearch
  // For leaves, we also need statusTab filtering which we'll manage separately
  const {
    data: leaves,
    loading,
    error,
    refresh,
    search,
    setSearch,
  } = useHrData(
    () => listLeaves(),
    undefined,
    // createLeave is handled via form in modal
    async (id, formData) => {
      // Update leave status (approve/reject)
      // We need to determine whether to approve or reject based on formData
      if (formData.status === 'APPROVED') {
        await approveLeave(id);
      } else if (formData.status === 'REJECTED') {
        await rejectLeave(id);
      }
      await refresh();
    },
    // No generic update - use approve/reject specific functions
    undefined,
    // No delete for leaves in this version
    undefined
  );

  // --- Additional State for Leave Management ---
  const [employees, setEmployees] = useState([]);
  const [statusTab, setStatusTab] = useState('ALL');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState({
    user_id: '',
    employee_name: '',
    leave_type: 'CASUAL',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date().toISOString().slice(0, 10),
    reason: ''
  });

  // --- Show Toast Helper ---
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // --- Fetch Employees on Mount ---
  useEffect(() => {
    listEmployees().catch(() => []).then((data) => {
      const eList = Array.isArray(data) ? data : (data?.data || []);
      setEmployees(eList);
    });
  }, []);

  // --- Fetch Leaves - useHrData already fetched on mount,
  // but we can re-filter based on statusTab
  const filteredLeaves = leaves.filter((leave) => {
    if (statusTab === 'ALL') return true;
    return String(leave.status || '').toUpperCase() === statusTab;
  });

  // --- Status Classes ---
  const getStatusClass = (status) => {
    if (!status) return 'inactive';
    const s = String(status).toLowerCase();
    if (['approved', 'active'].includes(s)) return 'active';
    if (['pending', 'processing'].includes(s)) return 'pending';
    if (['rejected', 'cancelled'].includes(s)) return 'error';
    return 'inactive';
  };

  // --- Open Review Modal ---
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

  // --- Handle Approved ---
  const handleApproved = (updatedLeave) => {
    setLeaves((prev) =>
      prev.map((leave) => (leave.id === updatedLeave.id ? { ...leave, ...updatedLeave } : leave)),
    );
    showToast(`Leave request ${updatedLeave.status} successfully.`);
  };

  // --- Handle Quick Status (Approve/Reject) ---
  const handleQuickStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'APPROVED') {
        await approveLeave(id);
      } else {
        await rejectLeave(id);
      }
      await refresh();
      showToast(`Leave request marked as ${newStatus}`);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update leave status';
      setError(message);
      showToast(message);
    }
  };

  // --- Handle Apply Leave ---
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedEmp = employees.find(emp => (emp.user_id || emp.id) === formData.user_id);
      const targetUserId = formData.user_id || selectedEmp?.user_id || selectedEmp?.id;

      await createLeave({
        user_id: targetUserId,
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason || 'Leave requested by HR operations'
      });
      await refresh();
      setShowApplyModal(false);
      showToast(`Leave application submitted successfully!`);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to submit leave request';
      setError(message);
      showToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminPage
      title="Leave Requests"
      subtitle="Review and manage staff leave applications and balances"
      loading={loading}
      error={error}
      onRetry={refresh}
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
                {employees.length > 0 ? (
                  <select
                    required
                    value={formData.user_id}
                    onChange={(e) => {
                      const emp = employees.find(x => (x.user_id || x.id) === e.target.value);
                      setFormData({
                        ...formData,
                        user_id: e.target.value,
                        employee_name: emp?.full_name || emp?.name || ''
                      });
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="">-- Select Employee --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.user_id || emp.id}>
                        {emp.full_name || emp.name} ({emp.department || 'Staff'})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={formData.employee_name}
                    onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                    placeholder="e.g. Anand Kumar"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                )}
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
      </div>
    </AdminPage>
  );
}