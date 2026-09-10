import React, { useEffect, useState } from 'react';
import { getCommunicationLogs } from '../../../../services/api/communicationApi.js';

export default function CommunicationCenter() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getCommunicationLogs().catch(() => []);
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load communications:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading communications...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Communication Center</h2>
          <p className="pageSubtitle">Send and track messages</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {logs.length === 0 ? (
            <div className="emptyState"><h3>No Communications</h3><p>No message logs found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Recipient</th><th>Type</th><th>Subject</th><th>Status</th></tr></thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.recipient || log.to || '—'}</td>
                    <td>{log.type || 'Message'}</td>
                    <td>{log.subject || '—'}</td>
                    <td><span className={`statusTag ${log.status === 'sent' ? 'active' : 'pending'}`}>{log.status}</span></td>
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
