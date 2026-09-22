import React, { useEffect, useState } from 'react';
import { listErrorLogs, resolveError } from '../../../services/api/monitoringApi.js';

export default function Monitoring() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolving, setResolving] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listErrorLogs();
      setLogs(data?.data || data || []);
    } catch (err) {
      console.error('Failed to load error logs', err);
      setError('Failed to load error logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleResolve = async (id) => {
    setResolving(id);
    try {
      await resolveError(id);
      setLogs(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to resolve error', err);
      alert('Failed to resolve error.');
    } finally {
      setResolving(null);
    }
  };

  if (loading) return <div className="loading">Loading monitoring data...</div>;
  if (error) return <div className="emptyState">{error}</div>;

  const stats = {
    total: logs.length,
    unresolved: logs.filter(l => !l.resolved && !l.isResolved).length,
    critical: logs.filter(l => l.level === 'critical' || l.severity === 'critical').length,
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Microservice & Host Monitoring</h1>
          <p className="pageSubtitle">Track error logs, system health, and resolve incidents.</p>
        </div>
        <div className="pageActions">
          <button className="btn btnSecondary" onClick={fetchLogs}>Refresh</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="statCard">
          <div className="statLabel">Total Errors</div>
          <div className="statValue">{stats.total}</div>
          <div className="statTrend">All time</div>
        </div>
        <div className="statCard" style={{ borderColor: 'var(--admin-warning)' }}>
          <div className="statLabel">Unresolved</div>
          <div className="statValue" style={{ color: 'var(--admin-warning)' }}>{stats.unresolved}</div>
          <div className="statTrend">Needs attention</div>
        </div>
        <div className="statCard" style={{ borderColor: 'var(--admin-danger)' }}>
          <div className="statLabel">Critical</div>
          <div className="statValue" style={{ color: 'var(--admin-danger)' }}>{stats.critical}</div>
          <div className="statTrend">Immediate action</div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Error Logs</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {logs.length === 0 && <div className="emptyState">No error logs found.</div>}
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Message</th>
                <th>Level</th>
                <th>Service</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td><code>{log.id}</code></td>
                  <td>{log.message || log.errorMessage || '-'}</td>
                  <td><span className={`statusTag ${log.level === 'critical' ? 'error' : log.level === 'warning' ? 'pending' : 'active'}`}>{log.level || 'info'}</span></td>
                  <td>{log.service || log.source || '-'}</td>
                  <td>{log.createdAt || log.created_at ? new Date(log.createdAt || log.created_at).toLocaleString() : '-'}</td>
                  <td>
                    <button className="btn btnPrimary" style={{ padding: '4px 10px', fontSize: '11px' }} disabled={resolving === log.id || log.resolved || log.isResolved} onClick={() => handleResolve(log.id)}>
                      {resolving === log.id ? 'Resolving...' : (log.resolved || log.isResolved ? 'Resolved' : 'Resolve')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
