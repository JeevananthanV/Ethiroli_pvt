import React, { useEffect, useState } from 'react';
import { getErrorLogs, resolveError } from '../../../services/api/monitoringApi.js';

export default function ServiceHealthWidget() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadErrors = async () => {
    setLoading(true);
    try {
      const data = await getErrorLogs();
      setErrors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load error logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadErrors();
  }, []);

  const handleResolve = async (id) => {
    try {
      await resolveError(id);
      loadErrors();
    } catch (err) {
      console.error('Failed to resolve error:', err);
    }
  };

  if (loading) return <div className="loading">Loading monitoring data...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">System Monitoring</h2>
          <p className="pageSubtitle">Error logs and service health overview</p>
        </div>
        <div className="pageActions">
          <button onClick={loadErrors} className="btn">Refresh</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px', marginBottom: '24px' }}>
        <div className="statCard">
          <p className="statLabel">Total Errors (24h)</p>
          <p className="statValue">{errors.length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Unresolved</p>
          <p className="statValue">{errors.filter((e) => !e.resolved).length}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Resolved</p>
          <p className="statValue" style={{ color: 'var(--admin-success)' }}>{errors.filter((e) => e.resolved).length}</p>
        </div>
      </div>
      <div className="card">
        <div className="cardHeader"><h3 className="cardTitle">Recent Error Logs</h3></div>
        <div className="cardBody">
          {errors.length === 0 ? (
            <p style={{ color: 'var(--admin-text-secondary)', textAlign: 'center', padding: '20px' }}>No errors reported. System is healthy.</p>
          ) : (
            <table className="table">
              <thead>
                <tr><th>Error ID</th><th>Service</th><th>Message</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {errors.map((err) => (
                  <tr key={err.id}>
                    <td><code>{err.id}</code></td>
                    <td>{err.service || 'Unknown'}</td>
                    <td>{err.message || err.error_message || 'No message'}</td>
                    <td><span className={`statusTag ${err.resolved ? 'active' : 'pending'}`}>{err.resolved ? 'Resolved' : 'Unresolved'}</span></td>
                    <td>
                      {!err.resolved && (
                        <button onClick={() => handleResolve(err.id)} className="btn" style={{ padding: '6px 12px', fontSize: '12px' }}>Resolve</button>
                      )}
                    </td>
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
