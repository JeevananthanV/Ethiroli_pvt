import React, { useEffect, useState } from 'react';
import { getInterviews } from '../../services/api/interviewApi.js';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInterviews = async () => {
    setLoading(true);
    try {
      const data = await getInterviews();
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  if (loading) return <div className="loading">Loading interviews...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Interviews</h2>
          <p className="pageSubtitle">Scheduled interviews and candidates</p>
        </div>
        <div className="pageActions">
          <button onClick={loadInterviews} className="btn">Refresh</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {interviews.length === 0 ? (
            <p style={{ color: 'var(--admin-text-secondary)' }}>No interviews scheduled.</p>
          ) : (
            <table className="table">
              <thead><tr><th>Candidate</th><th>Position</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td>{interview.candidate_name || interview.candidate_id}</td>
                    <td>{interview.position || 'N/A'}</td>
                    <td>{interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleString() : 'N/A'}</td>
                    <td><span className={`statusTag ${interview.status === 'scheduled' ? 'pending' : 'active'}`}>{interview.status || 'Scheduled'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
