import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listInterns } from '../../../services/api/internApi.js';

export default function HRInterns() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listInterns().catch(() => []);
      setInterns(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load interns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterns();
  }, [fetchInterns]);

  return (
    <AdminPage
      title="Intern Management"
      subtitle="Track intern progress, mentors, and project targets"
      loading={loading}
      error={error}
      onRetry={fetchInterns}
    >
      <div className="dashboard">
        {interns.length === 0 ? (
          <div className="emptyState">
            <h3>No interns found</h3>
            <p>Intern records will appear here once added.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Intern Tracker</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Intern</th>
                    <th>Mentor</th>
                    <th>Project Target</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {interns.map((intern) => (
                    <tr key={intern.id}>
                      <td style={{ fontWeight: 600 }}>{intern.full_name || intern.name}</td>
                      <td>{intern.mentor_name || intern.mentor || '—'}</td>
                      <td>{intern.project_target || intern.project || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'var(--admin-border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(Number(intern.progress || 0), 100)}%`, height: '100%', background: 'var(--admin-primary)', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--admin-text-muted)', minWidth: 36 }}>{intern.progress || 0}%</span>
                        </div>
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