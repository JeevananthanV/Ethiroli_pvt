import React, { useEffect, useState } from 'react';
import { getErrorLogs, resolveError } from '../../../../services/api/monitoringApi.js';

export default function ErrorTracker() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getErrorLogs().catch(() => []);
        setErrors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load errors:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleResolve = async (id) => {
    try {
      await resolveError(id);
      setErrors((prev) => prev.map((e) => (e.id === id ? { ...e, resolved: true } : e)));
    } catch (err) {
      console.error('Failed to resolve error:', err);
    }
  };

  if (loading) return <div className="loading">Loading errors...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Error Tracker</h2>
          <p className="pageSubtitle">Monitor and resolve system errors</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {errors.length === 0 ? (
            <div className="emptyState"><h3>No Errors</h3><p>System is healthy.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Error ID</th><th>Service</th><th>Message</th><th>Status</th><th>Action</th></tr></thead>
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
