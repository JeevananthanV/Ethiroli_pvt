import React, { useEffect, useState } from 'react';
import { getCommunicationLogs } from '../../../../services/api/communicationApi.js';

export default function CommunicationLogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getCommunicationLogs().catch(() => []);
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load communication logs:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading communication logs...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Communication History</h2>
          <p className="pageSubtitle">Message logs with read receipts and delivery status</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {logs.length === 0 ? (
            <div className="emptyState"><h3>No Logs</h3><p>No communication logs found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Recipient</th><th>Type</th><th>Subject</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.recipient || log.to || '—'}</td>
                    <td>{log.type || 'Message'}</td>
                    <td>{log.subject || '—'}</td>
                    <td><span className={`statusTag ${log.status === 'sent' ? 'active' : 'pending'}`}>{log.status}</span></td>
                    <td>{log.created_at ? new Date(log.created_at).toLocaleDateString() : '—'}</td>
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
