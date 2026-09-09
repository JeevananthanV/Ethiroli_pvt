import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getProjects } from '../../../services/api/projectApi.js';

export default function InternProjects() {
  const [projects, setProjects] = useState([]);
  const [_loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setProjects((await getProjects().catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return (
    <AdminPage title="Projects" subtitle="Assigned intern projects">
      <div className="card">
        <div className="cardBody">
          {projects.length === 0 ? <p className="textSecondary">No projects assigned.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Name</th><th>Status</th></tr></thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{p.name}</td>
                      <td><span className={'statusTag ' + (p.status === 'completed' ? 'active' : 'pending')}>{p.status}</span></td>
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
