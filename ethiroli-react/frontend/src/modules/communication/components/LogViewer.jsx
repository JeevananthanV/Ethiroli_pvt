import React, { useEffect, useState, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listLogs } from '../../services/api/communicationApi.js';
import { getProviders } from '../../services/api/providerApi.js';

export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    provider: '',
    status: '',
    channel: '',
    startDate: '',
    endDate: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [logsRes, providersRes] = await Promise.all([
        listLogs().catch(() => []),
        getProviders().catch(() => []),
      ]);
      setLogs(Array.isArray(logsRes) ? logsRes : []);
      setProviders(Array.isArray(providersRes) ? providersRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load communication logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (filters.provider && log.provider !== filters.provider) return false;
      if (filters.status && log.status !== filters.status) return false;
      if (filters.channel && log.channel !== filters.channel) return false;
      if (filters.startDate && log.created_at && log.created_at < filters.startDate) return false;
      if (filters.endDate && log.created_at && log.created_at > filters.endDate + 'T23:59:59') return false;
      return true;
    });
  }, [logs, filters]);

  const getStatusTag = (status) => {
    const map = {
      delivered: 'active',
      sent: 'active',
      failed: 'error',
      pending: 'pending',
      queued: 'pending',
      bounced: 'error',
    };
    const cls = map[status?.toLowerCase()] || 'pending';
    return <span className={`statusTag ${cls}`}>{status || 'UNKNOWN'}</span>;
  };

  const getChannelTag = (channel) => {
    const map = {
      email: 'info',
      sms: 'active',
      push: 'pending',
      whatsapp: 'success',
    };
    const cls = map[channel?.toLowerCase()] || 'pending';
    return <span className={`statusTag ${cls}`}>{channel || 'N/A'}</span>;
  };

  const handleExport = () => {
    if (!filteredLogs.length) return;
    const headers = ['Timestamp', 'Provider', 'Channel', 'Status', 'Recipient', 'Subject'];
    const rows = filteredLogs.map((log) => [
      log.created_at ? new Date(log.created_at).toISOString() : '',
      log.provider || '',
      log.channel || '',
      log.status || '',
      log.recipient || '',
      log.subject || '',
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `communication-log-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminPage
      title="Communication Logs"
      subtitle="Message delivery logs and status tracking"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn secondary" onClick={handleExport}>
            Export CSV
          </button>
          <button className="btn primary" onClick={loadData}>
            Refresh
          </button>
        </div>
      }
    >
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="cardHeader"><h3 className="cardTitle">Filters</h3></div>
        <div className="cardBody">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div className="formGroup">
              <label className="label">Provider</label>
              <select
                className="select"
                value={filters.provider}
                onChange={(e) => setFilters({ ...filters, provider: e.target.value })}
              >
                <option value="">All Providers</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Channel</label>
              <select
                className="select"
                value={filters.channel}
                onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
              >
                <option value="">All Channels</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Status</label>
              <select
                className="select"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="delivered">Delivered</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
                <option value="queued">Queued</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Start Date</label>
              <input
                className="inputField"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="formGroup">
              <label className="label">End Date</label>
              <input
                className="inputField"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Logs ({filteredLogs.length})</h3>
        </div>
        <div className="cardBody">
          {filteredLogs.length === 0 ? (
            <div className="emptyState">
              <h3>No logs found</h3>
              <p>Communication logs will appear here once messages are sent.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Provider</th>
                    <th>Channel</th>
                    <th>Status</th>
                    <th>Recipient</th>
                    <th>Subject / Body</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="textSecondary">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : '-'}
                      </td>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{log.provider || '-'}</td>
                      <td>{getChannelTag(log.channel)}</td>
                      <td>{getStatusTag(log.status)}</td>
                      <td className="textSecondary">{log.recipient || '-'}</td>
                      <td className="textSecondary" style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.subject || log.body || '-'}
                      </td>
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
