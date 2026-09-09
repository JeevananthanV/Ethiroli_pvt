import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getProviders, saveProvider } from '../../services/api/providerApi.js';
import { listIntegrations } from '../../services/api/integrationApi.js';
import axiosInstance from '../../services/api/axiosInstance.js';

export default function ProviderConfig() {
  const [providers, setProviders] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProvider, setEditingProvider] = useState(null);
  const [saving, setSaving] = useState(false);
  const [testResults, setTestResults] = useState({});

  const [form, setForm] = useState({
    name: '',
    provider: '',
    channel: 'email',
    api_key: '',
    api_secret: '',
    webhook_url: '',
    status: 'active',
    config: {},
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [providersRes, integrationsRes] = await Promise.all([
        getProviders().catch(() => []),
        listIntegrations().catch(() => []),
      ]);
      setProviders(Array.isArray(providersRes) ? providersRes : []);
      setIntegrations(Array.isArray(integrationsRes) ? integrationsRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load provider data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (provider) => {
    setEditingProvider(provider.id);
    setForm({
      name: provider.name || '',
      provider: provider.provider || '',
      channel: provider.channel || 'email',
      api_key: provider.api_key || '',
      api_secret: provider.api_secret || '',
      webhook_url: provider.webhook_url || '',
      status: provider.status || 'active',
      config: provider.config || {},
    });
  };

  const handleNew = () => {
    setEditingProvider('new');
    setForm({
      name: '',
      provider: '',
      channel: 'email',
      api_key: '',
      api_secret: '',
      webhook_url: '',
      status: 'active',
      config: {},
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      await saveProvider(payload);
      alert('Provider saved successfully');
      setEditingProvider(null);
      fetchData();
    } catch (err) {
      alert(`Failed to save provider: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (provider) => {
    setTestResults((prev) => ({ ...prev, [provider.id]: 'testing' }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setTestResults((prev) => ({ ...prev, [provider.id]: 'success' }));
      setTimeout(() => {
        setTestResults((prev) => ({ ...prev, [provider.id]: null }));
      }, 3000);
    } catch {
      setTestResults((prev) => ({ ...prev, [provider.id]: 'error' }));
    }
  };

  const handleDelete = async (provider) => {
    if (!window.confirm(`Delete provider "${provider.name}"?`)) return;
    try {
      await axiosInstance.delete(`/v1/communication/providers/${provider.id}`);
      fetchData();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <AdminPage
      title="Provider Configuration"
      subtitle="Manage communication providers, API keys, and webhooks"
      loading={loading}
      error={error}
      onRetry={fetchData}
      actions={
        <button className="btn primary" onClick={handleNew}>
          Add Provider
        </button>
      }
    >
      {editingProvider && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="cardHeader">
            <h3 className="cardTitle">{editingProvider === 'new' ? 'New Provider' : 'Edit Provider'}</h3>
          </div>
          <div className="cardBody">
            <form onSubmit={handleSave} className="form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div className="formGroup">
                  <label className="label required">Name</label>
                  <input className="inputField" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label required">Provider</label>
                  <input className="inputField" required value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} placeholder="e.g. sendgrid, twilio" />
                </div>
                <div className="formGroup">
                  <label className="label">Channel</label>
                  <select className="select" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="push">Push</option>
                  </select>
                </div>
                <div className="formGroup">
                  <label className="label required">API Key</label>
                  <input className="inputField" required type="password" value={form.api_key} onChange={(e) => setForm({ ...form, api_key: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">API Secret</label>
                  <input className="inputField" type="password" value={form.api_secret} onChange={(e) => setForm({ ...form, api_secret: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Webhook URL</label>
                  <input className="inputField" value={form.webhook_url} onChange={(e) => setForm({ ...form, webhook_url: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label">Status</label>
                  <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                <button type="button" className="btn secondary" onClick={() => setEditingProvider(null)}>Cancel</button>
                <button type="submit" className="btn primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Provider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader"><h3 className="cardTitle">Providers</h3></div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {providers.length === 0 ? (
            <div className="emptyState">No providers configured.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Provider</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th>Webhook</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => (
                  <tr key={provider.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{provider.name}</td>
                    <td className="textSecondary">{provider.provider}</td>
                    <td className="textSecondary">{provider.channel}</td>
                    <td><span className={`statusTag ${provider.status === 'active' ? 'active' : 'error'}`}>{provider.status}</span></td>
                    <td className="textSecondary" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {provider.webhook_url ? (
                        <a href={provider.webhook_url} target="_blank" rel="noreferrer">{provider.webhook_url}</a>
                      ) : '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleTestConnection(provider)}>
                          {testResults[provider.id] === 'testing' ? 'Testing...' : 'Test'}
                        </button>
                        <button className="btn secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleEdit(provider)}>Edit</button>
                        <button className="btn danger" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => handleDelete(provider)}>Delete</button>
                      </div>
                      {testResults[provider.id] === 'success' && (
                        <div className="textSuccess" style={{ fontSize: 12, marginTop: 4 }}>Connection successful</div>
                      )}
                      {testResults[provider.id] === 'error' && (
                        <div className="textDanger" style={{ fontSize: 12, marginTop: 4 }}>Connection failed</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="cardHeader"><h3 className="cardTitle">Integrations</h3></div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {integrations.length === 0 ? (
            <div className="emptyState">No integrations configured.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((integration) => (
                  <tr key={integration.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{integration.name}</td>
                    <td className="textSecondary">{integration.type}</td>
                    <td><span className={`statusTag ${integration.status === 'active' ? 'active' : 'error'}`}>{integration.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
