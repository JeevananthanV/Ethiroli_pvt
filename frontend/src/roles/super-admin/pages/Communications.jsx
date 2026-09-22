import React, { useEffect, useState } from 'react';
import { getCommunicationLogs } from '../../../services/api/communicationApi.js';

export default function Communications() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getCommunicationLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load communication logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  if (loading) return <div className="loading">Loading communications...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Communications</h2>
          <p className="pageSubtitle">Message logs and communication history</p>
        </div>
        <div className="pageActions">
          <button onClick={loadLogs} className="btn">Refresh</button>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {logs.length === 0 ? (
            <p style={{ color: 'var(--admin-text-secondary)' }}>No communication logs found.</p>
          ) : (
            <table className="table">
              <thead><tr><th>ID</th><th>Type</th><th>Recipient</th><th>Status</th><th>Timestamp</th></tr></thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td><code>{log.id}</code></td>
                    <td>{log.type || 'Message'}</td>
                    <td>{log.recipient || log.to || 'N/A'}</td>
                    <td><span className={`statusTag ${log.status === 'sent' ? 'active' : 'pending'}`}>{log.status}</span></td>
                    <td style={{ color: 'var(--admin-text-secondary)' }}>{log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}</td>
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
