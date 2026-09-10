import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listInterviews } from '../../../services/api/interviewApi.js';

export default function HRInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listInterviews().catch(() => []);
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const getStatusClass = (status) => {
    if (!status) return 'inactive';
    const s = String(status).toLowerCase();
    if (['scheduled', 'confirmed'].includes(s)) return 'pending';
    if (['completed', 'selected'].includes(s)) return 'active';
    if (['cancelled', 'rejected'].includes(s)) return 'error';
    return 'inactive';
  };

  return (
    <AdminPage
      title="Recruitment Scheduler"
      subtitle="Manage interview schedules and interviewer assignments"
      loading={loading}
      error={error}
      onRetry={fetchInterviews}
    >
      <div className="dashboard">
        {interviews.length === 0 ? (
          <div className="emptyState">
            <h3>No interviews scheduled</h3>
            <p>Scheduled interviews will appear here.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Upcoming Interviews</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Vacancy</th>
                    <th>Date & Time</th>
                    <th>Interviewer</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((interview) => (
                    <tr key={interview.id}>
                      <td style={{ fontWeight: 600 }}>{interview.candidate_name || interview.candidate?.name || '—'}</td>
                      <td>{interview.vacancy || interview.position || '—'}</td>
                      <td>{interview.interview_date ? new Date(interview.interview_date).toLocaleString() : '—'}</td>
                      <td>{interview.interviewer_name || interview.interviewer || '—'}</td>
                      <td>
                        <span className={`statusTag ${getStatusClass(interview.status)}`}>
                          {interview.status || 'Scheduled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}