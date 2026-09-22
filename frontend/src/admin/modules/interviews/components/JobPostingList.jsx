import React, { useEffect, useState } from 'react';
import { getJobs } from '../../../../services/api/jobApi.js';

export default function JobPostingList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getJobs().catch(() => []);
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading jobs...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Job Postings</h2>
          <p className="pageSubtitle">Active job listings</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {jobs.length === 0 ? (
            <div className="emptyState"><h3>No Jobs</h3><p>No job postings found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Title</th><th>Department</th><th>Type</th><th>Status</th></tr></thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.department || '—'}</td>
                    <td>{job.type || 'Full-time'}</td>
                    <td><span className={`statusTag ${job.is_active ? 'active' : 'inactive'}`}>{job.is_active ? 'Active' : 'Closed'}</span></td>
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
