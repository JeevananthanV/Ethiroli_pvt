import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { listLogs } from '../../services/api/communicationApi.js';
import { getProviders } from '../../services/api/providerApi.js';
import { getTemplates } from '../../services/api/templateApi.js';

export default function CommunicationCenter() {
  const [logs, setLogs] = useState([]);
  const [providers, setProviders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [composing, setComposing] = useState(false);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0, pending: 0 });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [logsRes, providersRes, templatesRes] = await Promise.all([
        listLogs().catch(() => []),
        getProviders().catch(() => []),
        getTemplates().catch(() => []),
      ]);
      const logsData = Array.isArray(logsRes) ? logsRes : [];
      setLogs(logsData);
      setProviders(Array.isArray(providersRes) ? providersRes : []);
      setTemplates(Array.isArray(templatesRes) ? templatesRes : []);
      setStats({
        total: logsData.length,
        success: logsData.filter((l) => l.status === 'sent' || l.status === 'success').length,
        failed: logsData.filter((l) => l.status === 'failed' || l.status === 'error').length,
        pending: logsData.filter((l) => l.status === 'pending' || l.status === 'queued').length,
      });
    } catch (err) {
      setError(err.message || 'Failed to load communication data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'sent':
      case 'success':
        return 'active';
      case 'failed':
      case 'error':
        return 'error';
      case 'pending':
      case 'queued':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <AdminPage
      title="Communication Center"
      subtitle="Manage providers, templates, and message logs"
      loading={loading}
      error={error}
      onRetry={fetchData}
      actions={
        <button className="btn primary" onClick={() => setComposing(true)}>
          Compose Message
        </button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="statCard">
          <div className="statLabel">Total Messages</div>
          <div className="statValue">{stats.total}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Successful</div>
          <div className="statValue textSuccess">{stats.success}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Failed</div>
          <div className="statValue textDanger">{stats.failed}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Pending</div>
          <div className="statValue textWarning">{stats.pending}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Providers</h3></div>
          <div className="cardBody">
            {providers.length === 0 ? (
              <div className="emptyState">No providers configured.</div>
            ) : (
              providers.map((provider) => (
                <div key={provider.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--admin-border)' }}>
                  <div>
                    <div className="textPrimary" style={{ fontWeight: 500 }}>{provider.name || provider.provider}</div>
                    <div className="textMuted" style={{ fontSize: 12 }}>{provider.channel || 'N/A'}</div>
                  </div>
                  <span className={`statusTag ${provider.status === 'active' ? 'active' : 'error'}`}>
                    {provider.status || 'inactive'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Templates</h3></div>
          <div className="cardBody">
            {templates.length === 0 ? (
              <div className="emptyState">No templates found.</div>
            ) : (
              templates.map((template) => (
                <div key={template.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--admin-border)' }}>
                  <div className="textPrimary" style={{ fontWeight: 500 }}>{template.name}</div>
                  <div className="textMuted" style={{ fontSize: 12 }}>{template.type || 'generic'}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader"><h3 className="cardTitle">Recent Logs</h3></div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {logs.length === 0 ? (
            <div className="emptyState">No communication logs yet.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Channel</th>
                  <th>Recipient</th>
                  <th>Status</th>
                  <th>Sent At</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 50).map((log) => (
                  <tr key={log.id}>
                    <td className="textSecondary"><code>{log.id}</code></td>
                    <td className="textSecondary">{log.channel || 'N/A'}</td>
                    <td className="textSecondary">{log.recipient || '-'}</td>
                    <td>
                      <span className={`statusTag ${getStatusClass(log.status)}`}>
                        {log.status || 'unknown'}
                      </span>
                    </td>
                    <td className="textSecondary">{formatDate(log.sent_at || log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {composing && (
        <ComposeModal onClose={() => setComposing(false)} onSend={fetchData} templates={templates} />
      )}
    </AdminPage>
  );
}
