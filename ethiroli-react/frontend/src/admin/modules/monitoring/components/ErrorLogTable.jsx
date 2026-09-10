import React, { useEffect, useState } from 'react';
import { getErrorLogs } from '../../../../services/api/monitoringApi.js';

export default function ErrorLogTable() {
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

  if (loading) return <div className="loading">Loading error logs...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Captured Exceptions Registry</h2>
          <p className="pageSubtitle">System error logs and exceptions</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {errors.length === 0 ? (
            <div className="emptyState"><h3>No Errors</h3><p>No exceptions captured.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Error ID</th><th>Service</th><th>Message</th><th>Status</th></tr></thead>
              <tbody>
                {errors.map((err) => (
                  <tr key={err.id}>
                    <td><code>{err.id}</code></td>
                    <td>{err.service || 'Unknown'}</td>
                    <td>{err.message || err.error_message || 'No message'}</td>
                    <td><span className={`statusTag ${err.resolved ? 'active' : 'pending'}`}>{err.resolved ? 'Resolved' : 'Unresolved'}</span></td>
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
