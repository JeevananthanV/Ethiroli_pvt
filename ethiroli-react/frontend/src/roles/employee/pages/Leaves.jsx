import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listLeaves } from '../../../services/api/leaveApi.js';

function getStatusClass(status) {
  if (!status) return 'inactive';
  const s = String(status).toLowerCase();
  if (['approved', 'active', 'paid', 'completed', 'success'].includes(s)) return 'active';
  if (['pending', 'processing', 'awaiting', 'in_progress'].includes(s)) return 'pending';
  if (['rejected', 'cancelled', 'failed', 'error', 'declined'].includes(s)) return 'error';
  return 'inactive';
}

export default function EmployeeLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listLeaves();
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

  return (
    <AdminPage
      title="My Leaves"
      subtitle="View and track your leave requests"
      loading={loading}
      error={error}
      onRetry={fetchLeaves}
    >
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Leave Requests</h3>
        </div>
        <div className="cardBody">
          {leaves.length === 0 ? (
            <div className="emptyState">
              <h3>No leave requests</h3>
              <p>You haven't submitted any leave requests yet.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map(leave => (
                    <tr key={leave.id}>
                      <td>{leave.startDate || 'N/A'}</td>
                      <td>{leave.endDate || 'N/A'}</td>
                      <td>{leave.reason || 'N/A'}</td>
                      <td>
                        <span className={`statusTag ${getStatusClass(leave.status)}`}>
                          {leave.status || 'N/A'}
                        </span>
                      </td>
                      <td>{leave.appliedAt || leave.createdAt || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
