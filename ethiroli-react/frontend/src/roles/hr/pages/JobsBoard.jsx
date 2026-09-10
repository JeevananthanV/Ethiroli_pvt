import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listJobBoardPosts } from '../../../services/api/jobBoardApi.js';

export default function HRJobsBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listJobBoardPosts().catch(() => []);
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load job postings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <AdminPage
      title="Recruitment Openings"
      subtitle="Manage active job postings and hiring pipelines"
      loading={loading}
      error={error}
      onRetry={fetchJobs}
    >
      <div className="dashboard">
        {jobs.length === 0 ? (
          <div className="emptyState">
            <h3>No open positions</h3>
            <p>Create a job posting to start recruiting.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Open Positions</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Employment Model</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td style={{ fontWeight: 600 }}>{job.title || job.position_title || '—'}</td>
                      <td>{job.department || '—'}</td>
                      <td>{job.employment_model || job.employmentType || '—'}</td>
                      <td>
                        <span className={`statusTag ${job.status === 'open' || job.is_active ? 'active' : 'inactive'}`}>
                          {job.status === 'open' || job.is_active ? 'Open' : 'Closed'}
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