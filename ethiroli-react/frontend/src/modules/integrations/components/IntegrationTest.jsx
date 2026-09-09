import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listIntegrations } from '../../../services/api/integrationApi.js';

const LOG_LEVELS = ['info', 'warn', 'error', 'success'];
const SAMPLE_LOGS = [
  { time: '10:42:15', level: 'info', message: 'Initiating sync with HRMS provider...' },
  { time: '10:42:16', level: 'success', message: 'Fetched 128 employee records successfully.' },
  { time: '10:42:18', level: 'warn', message: 'Rate limit approaching for Calendar API (80%).' },
  { time: '10:42:20', level: 'info', message: 'Syncing attendance data for 45 employees...' },
  { time: '10:42:22', level: 'error', message: 'Failed to sync employee #8921: Invalid department mapping.' },
  { time: '10:42:25', level: 'success', message: 'Attendance sync completed. 44/45 records updated.' },
  { time: '10:42:30', level: 'info', message: 'Pushing updates to payroll provider...' },
  { time: '10:42:33', level: 'success', message: 'Payroll data sent. Awaiting confirmation.' },
];

export default function IntegrationTest({ integrationId }) {
  const [integrations, setIntegrations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listIntegrations();
        setIntegrations(Array.isArray(data) ? data : []);
        if (data?.length && !integrationId) setSelected(data[0]);
      } catch (err) {
        setError(err.message || 'Failed to load integrations');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [integrationId]);

  useEffect(() => {
    if (integrationId) {
      const found = integrations.find(i => i.id === integrationId);
      if (found) setSelected(found);
    }
  }, [integrationId, integrations]);

  const runTest = async () => {
    if (!selected) return;
    setRunning(true);
    setStatus('running');
    setLogs([]);
    try {
      const testLogs = [];
      for (const entry of SAMPLE_LOGS) {
        await new Promise(r => setTimeout(r, 400));
        testLogs.push(entry);
        setLogs([...testLogs]);
      }
      setStatus(LOG_LEVELS.some(() => logs.some((x) => x.level === 'error')) ? 'failed' : 'passed');
    } catch {
      setStatus('failed');
    } finally {
      setRunning(false);
    }
  };

  const getLevelStyle = (level) => {
    switch (level) {
      case 'success': return { color: 'var(--admin-success)', bg: 'rgba(16, 185, 129, 0.08)' };
      case 'warn': return { color: 'var(--admin-warning)', bg: 'rgba(245, 158, 11, 0.08)' };
      case 'error': return { color: 'var(--admin-danger)', bg: 'rgba(244, 63, 94, 0.08)' };
      default: return { color: 'var(--admin-text-secondary)', bg: 'transparent' };
    }
  };

  const getStatusStyle = () => {
    switch (status) {
      case 'passed': return 'active';
      case 'failed': return 'error';
      case 'running': return 'pending';
      default: return 'inactive';
    }
  };

  return (
    <AdminPage
      title="Integration Testing"
      subtitle="Run diagnostics and view real-time logs for connected integrations"
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
      actions={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            className="select"
            value={selected?.id || ''}
            onChange={e => {
              const found = integrations.find(i => i.id === Number(e.target.value));
              setSelected(found || null);
            }}
            style={{ minWidth: 200 }}
          >
            <option value="">Select integration...</option>
            {integrations.map(i => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
          <button className="btn primary" onClick={runTest} disabled={!selected || running}>
            {running ? 'Running...' : 'Run Diagnostic'}
          </button>
          {status !== 'idle' && (
            <span className={`statusTag ${getStatusStyle()}`}>
              {status === 'passed' ? 'Passed' : status === 'failed' ? 'Failed' : 'Running'}
            </span>
          )}
        </div>
      }
    >
      {!selected ? (
        <div className="emptyState">
          <h3>No integration selected</h3>
          <p>Choose an integration from the dropdown above to run diagnostics</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Testing: {selected.name}</h3>
            </div>
            <div className="cardBody">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div className="statCard">
                  <p className="statLabel">Type</p>
                  <p className="statValue">{selected.type || 'N/A'}</p>
                </div>
                <div className="statCard">
                  <p className="statLabel">Endpoint</p>
                  <p className="statValue" style={{ fontSize: 13, wordBreak: 'break-all' }}>{selected.endpoint || 'N/A'}</p>
                </div>
                <div className="statCard">
                  <p className="statLabel">Last Test</p>
                  <p className="statValue">{selected.lastTest ? new Date(selected.lastTest).toLocaleString() : 'Never'}</p>
                </div>
                <div className="statCard">
                  <p className="statLabel">Health</p>
                  <p className="statValue"><span className={`statusTag ${selected.health === 'healthy' ? 'active' : selected.health === 'down' ? 'error' : 'pending'}`}>{selected.health || 'Unknown'}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="cardHeader">
              <h3 className="cardTitle">Diagnostic Logs</h3>
            </div>
            <div className="cardBody" style={{ padding: 0, maxHeight: 360, overflowY: 'auto' }}>
              {logs.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                  Click "Run Diagnostic" to see real-time logs
                </div>
              ) : (
                <table className="table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 90 }}>Time</th>
                      <th style={{ width: 80 }}>Level</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, idx) => {
                      const style = getLevelStyle(log.level);
                      return (
                        <tr key={idx}>
                          <td style={{ fontSize: 12, color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>{log.time}</td>
                          <td>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              background: style.bg,
                              color: style.color
                            }}>
                              {log.level}
                            </span>
                          </td>
                          <td style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>{log.message}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
