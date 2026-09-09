import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listLeaves, updateLeaveStatus } from '../../services/api/leaveApi.js';

export default function LeaveRequestList() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchLeaves = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listLeaves();
      setLeaves(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setProcessingId(id);
    try {
      await updateLeaveStatus(id, status);
      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === id ? { ...leave, status } : leave
        )
      );
    } catch (err) {
      alert(`Failed to ${status.toLowerCase()} leave: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusTag = (status) => {
    const cls = status?.toLowerCase();
    return <span className={`statusTag ${cls}`}>{status || 'PENDING'}</span>;
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <AdminPage
      title="Leave Requests"
      subtitle="Approval queue for casual, sick, and earned leaves"
      loading={loading}
      error={error}
      onRetry={fetchLeaves}
      actions={
        <button className="btn secondary" onClick={fetchLeaves}>
          Refresh
        </button>
      }
    >
      <div className="card">
        {leaves.length === 0 ? (
          <div className="emptyState">
            <h3>No leave requests</h3>
            <p>Leave requests will appear here once submitted.</p>
          </div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>
                      {leave.full_name || `User ${leave.user_id}`}
                    </td>
                    <td className="textSecondary">{leave.leave_type || '-'}</td>
                    <td className="textSecondary">{formatDate(leave.start_date)}</td>
                    <td className="textSecondary">{formatDate(leave.end_date)}</td>
                    <td className="textSecondary">{leave.reason || '-'}</td>
                    <td>{getStatusTag(leave.status)}</td>
                    <td>
                      {leave.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="btn success btnSm"
                            disabled={processingId === leave.id}
                            onClick={() => handleStatusUpdate(leave.id, 'APPROVED')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn danger btnSm"
                            disabled={processingId === leave.id}
                            onClick={() => handleStatusUpdate(leave.id, 'REJECTED')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
