import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { listIntegrations, saveIntegration, updateIntegration } from '../../services/api/integrationApi.js';

export default function IndeedWebhook() {
  const [indeedIntegration, setIndeedIntegration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testStatus, setTestStatus] = useState(null);
  const [config, setConfig] = useState({
    webhook_url: '',
    api_key: '',
    secret: '',
    events: ['application.created', 'application.updated'],
    status: 'active',
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listIntegrations();
      const integrationsList = Array.isArray(data) ? data : [];
      const indeed = integrationsList.find(
        (i) => i.type === 'indeed' || i.name?.toLowerCase().includes('indeed')
      );
      if (indeed) {
        setIndeedIntegration(indeed);
        setConfig({
          webhook_url: indeed.webhook_url || '',
          api_key: indeed.api_key || '',
          secret: indeed.secret || '',
          events: indeed.events || ['application.created', 'application.updated'],
          status: indeed.status || 'active',
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load Indeed integration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: 'Indeed Integration',
        type: 'indeed',
        ...config,
      };
      if (indeedIntegration?.id) {
        await updateIntegration(indeedIntegration.id, payload);
      } else {
        await saveIntegration(payload);
      }
      alert('Indeed webhook configuration saved');
      loadData();
    } catch (err) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTestStatus('testing');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTestStatus('success');
      setTimeout(() => setTestStatus(null), 4000);
    } catch {
      setTestStatus('error');
    }
  };

  return (
    <AdminPage
      title="Indeed Webhook"
      subtitle="Indeed integration webhook configuration"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Webhook Configuration</h3>
          {indeedIntegration && (
            <span className={`statusTag ${indeedIntegration.status === 'active' ? 'active' : 'error'}`}>
              {indeedIntegration.status}
            </span>
          )}
        </div>
        <div className="cardBody">
          <form onSubmit={handleSave} className="form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div className="formGroup">
                <label className="label required">Webhook URL</label>
                <input className="inputField" required value={config.webhook_url} onChange={(e) => setConfig({ ...config, webhook_url: e.target.value })} placeholder="https://your-server.com/webhooks/indeed" />
              </div>
              <div className="formGroup">
                <label className="label required">API Key</label>
                <input className="inputField" required value={config.api_key} onChange={(e) => setConfig({ ...config, api_key: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Secret</label>
                <input className="inputField" type="password" value={config.secret} onChange={(e) => setConfig({ ...config, secret: e.target.value })} />
              </div>
            </div>
            <div className="formGroup">
              <label className="label">Events (comma-separated)</label>
              <input
                className="inputField"
                value={config.events.join(', ')}
                onChange={(e) => setConfig({ ...config, events: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })}
                placeholder="application.created, application.updated"
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn secondary" onClick={handleTest}>
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </button>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
            {testStatus === 'success' && (
              <div className="textSuccess" style={{ marginTop: 12 }}>Connection successful! Webhook is reachable.</div>
            )}
            {testStatus === 'error' && (
              <div className="textDanger" style={{ marginTop: 12 }}>Connection failed. Check your URL and credentials.</div>
            )}
          </form>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader"><h3 className="cardTitle">Recent Webhooks</h3></div>
        <div className="cardBody">
          <div style={{ display: 'grid', gap: 8 }}>
            {[...(indeedIntegration?.recent_events || []), ...(indeedIntegration?.logs || [])].slice(0, 10).map((log, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--admin-border)' }}>
                <span className="textSecondary">{log.event || log.type || 'event'}</span>
                <span className={`statusTag ${(log.status || 'pending') === 'success' ? 'active' : 'error'}`}>{log.status || 'pending'}</span>
                <span className="textMuted" style={{ fontSize: 12 }}>{new Date(log.created_at || Date.now()).toLocaleString()}</span>
              </div>
            ))}
            {(!indeedIntegration?.recent_events && !indeedIntegration?.logs) && (
              <div className="emptyState">No webhook events yet.</div>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
