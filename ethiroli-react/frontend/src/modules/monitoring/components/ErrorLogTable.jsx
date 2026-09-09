import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getErrorLogs } from '../../services/api/monitoringApi.js';

export default function ErrorLogTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState('all');

  const load = async () => {
    setLoading(true);
    try { setLogs((await getErrorLogs().catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = severity === 'all' ? logs : logs.filter(l => l.severity === severity);

  return (
    <AdminPage title="Error Logs" subtitle="System error tracking" loading={loading} error={null} onRetry={load} actions={<button className="btn secondary" onClick={load}>Refresh</button>}>
      <div style={{ marginBottom: 16 }}>
        <select className="select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </div>
      <div className="card">
        <div className="cardBody">
          {filtered.length === 0 ? <p className="textSecondary">No errors found.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Time</th><th>Severity</th><th>Message</th><th>Service</th></tr></thead>
                <tbody>
                  {filtered.map((log) => (
                    <tr key={log.id}>
                      <td className="textSecondary">{log.created_at ? new Date(log.created_at).toLocaleString() : '-'}</td>
                      <td><span className={'statusTag ' + (log.severity === 'critical' || log.severity === 'error' ? 'error' : 'pending')}>{log.severity}</span></td>
                      <td className="textSecondary">{log.message}</td>
                      <td className="textSecondary">{log.service || '-'}</td>
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
