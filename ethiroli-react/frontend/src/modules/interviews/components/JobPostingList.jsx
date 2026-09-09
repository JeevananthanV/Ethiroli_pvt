import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getJobs } from '../../services/api/jobApi.js';

export default function JobPostingList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setJobs((await getJobs().catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return (
    <AdminPage title="Job Postings" subtitle="Active and draft job listings" loading={loading} error={null} onRetry={load} actions={<button className="btn primary" onClick={() => alert('Open create form')}>New Job</button>}>
      <div className="card">
        <div className="cardBody">
          {jobs.length === 0 ? <p className="textSecondary">No job postings found.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Title</th><th>Department</th><th>Type</th><th>Status</th><th>Created</th></tr></thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id}>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{j.title}</td>
                      <td className="textSecondary">{j.department || '-'}</td>
                      <td className="textSecondary">{j.type || '-'}</td>
                      <td><span className={'statusTag ' + (j.status === 'active' ? 'active' : 'pending')}>{j.status}</span></td>
                      <td className="textSecondary">{j.created_at ? new Date(j.created_at).toLocaleDateString() : '-'}</td>
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
