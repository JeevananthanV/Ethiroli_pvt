import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import LeaveApprovalModal from '../../../modules/hrms/components/LeaveApprovalModal.jsx';
import { listLeaves } from '../../../services/api/leaveApi.js';

export default function HRLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listLeaves().catch(() => []);
      setLeaves(Array.isArray(data) ? data : []);
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
      employeeName: leave.employee_name || leave.user_name,
      leaveType: leave.leave_type || leave.type,
      startDate: leave.startDate || leave.start_date,
      endDate: leave.endDate || leave.end_date,
    });
    setModalOpen(true);
  };

  const handleApproved = (updatedLeave) => {
    setLeaves((prev) =>
      prev.map((leave) => (leave.id === updatedLeave.id ? { ...leave, ...updatedLeave } : leave)),
    );
  };

  return (
    <AdminPage
      title="Leave Requests"
      subtitle="Review and manage staff leave applications"
      loading={loading}
      error={error}
      onRetry={fetchLeaves}
    >
      <div className="dashboard">
        {leaves.length === 0 ? (
          <div className="emptyState">
            <h3>No leave requests</h3>
            <p>Leave applications will appear here.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Staff Leave Applications</h3>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td style={{ fontWeight: 600 }}>{leave.employee_name || leave.user_name || '—'}</td>
                      <td>{leave.startDate || leave.start_date} - {leave.endDate || leave.end_date}</td>
                      <td>{leave.leave_type || leave.type || 'General'}</td>
                      <td>{leave.reason || '—'}</td>
                      <td>
                        <span className={`statusTag ${getStatusClass(leave.status)}`}>
                          {leave.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        {String(leave.status || '').toLowerCase() === 'pending' && (
                          <Button size="small" onClick={() => openReview(leave)}>
                            Review
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <LeaveApprovalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        leaveRequest={selectedLeave}
        onApproved={handleApproved}
      />
    </AdminPage>
  );
}