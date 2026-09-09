import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getJobs } from '../../services/api/jobApi.js';

export default function JobBoardList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try { setJobs((await getJobs().catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = jobs.filter(j => (j.title || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminPage title="Job Board" subtitle="Active openings" loading={loading} error={null} onRetry={load}>
      <div style={{ marginBottom: 16 }}>
        <input className="inputField" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="card">
        <div className="cardBody">
          {filtered.length === 0 ? <p className="textSecondary">No jobs found.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Title</th><th>Department</th><th>Type</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.map((j) => (
                    <tr key={j.id}>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{j.title}</td>
                      <td className="textSecondary">{j.department || '-'}</td>
                      <td className="textSecondary">{j.type || '-'}</td>
                      <td><span className={'statusTag ' + (j.status === 'active' ? 'active' : 'pending')}>{j.status}</span></td>
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
