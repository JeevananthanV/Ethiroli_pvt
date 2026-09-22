import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { jobBoardApi } from '../../../services/api/jobBoardApi.js';

export default function JobPostingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try { setItems((await jobBoardApi.getAll().catch(() => [])) || []); }
    catch (err) { setError(err.message || 'Failed to load'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return (
    <AdminPage title="JobPostingList" subtitle="" loading={loading} error={error} onRetry={load} actions={<button className="btn secondary" onClick={load}>Refresh</button>}>
      <div className="card">
        <div className="cardBody">
          {items.length === 0 ? <p className="textSecondary">No records found.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Name</th><th>Status</th><th>Created</th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      {['Name','Status','Created'].map((col, idx) => (
                        <td key={idx} className="textSecondary">{item[col] || '-'}</td>
                      ))}
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
