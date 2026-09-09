import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { listInterviews } from '../../services/api/interviewApi.js';
import axiosInstance from '../../services/api/axiosInstance.js';

export default function InterviewList() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const loadInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const data = await listInterviews(params);
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, [filterStatus]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/v1/interviews/${id}`, { status: newStatus });
      loadInterviews();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const getStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'scheduled':
        return 'pending';
      case 'completed':
        return 'active';
      case 'cancelled':
      case 'canceled':
        return 'error';
      case 'in_progress':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return timeStr
      ? date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminPage
      title="Interview List"
      subtitle="Manage scheduled interviews and their status"
      loading={loading}
      error={error}
      onRetry={loadInterviews}
      actions={
        <select className="select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      }
    >
      <div className="card">
        {interviews.length === 0 ? (
          <div className="emptyState">No interviews found.</div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Candidate ID</th>
                  <th>Interviewer ID</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td className="textSecondary"><code>{interview.id}</code></td>
                    <td className="textSecondary"><code>{interview.candidate_id}</code></td>
                    <td className="textSecondary"><code>{interview.interviewer_id}</code></td>
                    <td className="textSecondary">{formatDateTime(interview.scheduled_at || interview.date, interview.time)}</td>
                    <td className="textSecondary">{interview.type || '-'}</td>
                    <td className="textSecondary">{interview.duration_minutes ? `${interview.duration_minutes} min` : '-'}</td>
                    <td>
                      <span className={`statusTag ${getStatusClass(interview.status)}`}>
                        {interview.status || 'scheduled'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {interview.status !== 'completed' && (
                          <button className="btn success" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleStatusUpdate(interview.id, 'completed')}>
                            Complete
                          </button>
                        )}
                        {interview.status !== 'cancelled' && (
                          <button className="btn danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleStatusUpdate(interview.id, 'cancelled')}>
                            Cancel
                          </button>
                        )}
                      </div>
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
