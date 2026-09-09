import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getApiKeys, createApiKey } from '../../../services/api/apiKeyApi.js';
import { getWebhooks, createWebhook } from '../../../services/api/webhookApi.js';

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [newKey, setNewKey] = useState({ name: '', scopes: '' });
  const [newWebhook, setNewWebhook] = useState({ url: '', events: '', secret: '' });
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [keysRes, webRes] = await Promise.all([
        getApiKeys().catch(() => []),
        getWebhooks().catch(() => []),
      ]);
      setApiKeys(Array.isArray(keysRes) ? keysRes : []);
      setWebhooks(Array.isArray(webRes) ? webRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load developer portal data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      await createApiKey({ name: newKey.name, scopes: newKey.scopes });
      setShowKeyForm(false);
      setNewKey({ name: '', scopes: '' });
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to create API key');
    }
  };

  const handleCreateWebhook = async (e) => {
    e.preventDefault();
    try {
      await createWebhook({ url: newWebhook.url, events: newWebhook.events, secret: newWebhook.secret });
      setShowWebhookForm(false);
      setNewWebhook({ url: '', events: '', secret: '' });
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to create webhook');
    }
  };

  return (
    <AdminPage
      title="Developer Portal"
      subtitle="API keys, webhooks, and system integrations"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <>
          <button onClick={() => setShowKeyForm(true)} className="btn btnPrimary">+ New API Key</button>
          <button onClick={() => setShowWebhookForm(true)} className="btn">+ New Webhook</button>
        </>
      }
    >
      <div style={{ display: 'grid', gap: 20 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">API Keys ({apiKeys.length})</h3></div>
          <div className="cardBody">
            {apiKeys.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No API keys created yet.</p>
            ) : (
              <div className="overflowAuto">
                <table className="table">
                  <thead><tr><th>Name</th><th>Key</th><th>Scopes</th></tr></thead>
                  <tbody>
                    {apiKeys.map((key) => (
                      <tr key={key.id}>
                        <td className="textPrimary" style={{ fontWeight: 500 }}>{key.name}</td>
                        <td><code>{key.key?.slice(0, 8)}...</code></td>
                        <td className="textSecondary">{key.scopes || 'all'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Webhooks ({webhooks.length})</h3></div>
          <div className="cardBody">
            {webhooks.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No webhooks configured.</p>
            ) : (
              <div className="overflowAuto">
                <table className="table">
                  <thead><tr><th>URL</th><th>Events</th></tr></thead>
                  <tbody>
                    {webhooks.map((wh) => (
                      <tr key={wh.id}>
                        <td><code>{wh.url}</code></td>
                        <td className="textSecondary">{wh.events || 'all'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {showKeyForm && (
        <div className="overlay" onClick={() => setShowKeyForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalTitle">Create API Key</h3>
              <button className="closeBtn" onClick={() => setShowKeyForm(false)}>&times;</button>
            </div>
            <div className="modalBody">
              <form onSubmit={handleCreateKey}>
                <div className="formGroup">
                  <label className="label">Key Name</label>
                  <input className="inputField" value={newKey.name} onChange={(e) => setNewKey({ ...newKey, name: e.target.value })} required />
                </div>
                <div className="formGroup">
                  <label className="label">Scopes</label>
                  <input className="inputField" value={newKey.scopes} onChange={(e) => setNewKey({ ...newKey, scopes: e.target.value })} required />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button type="button" onClick={() => setShowKeyForm(false)} className="btn secondary">Cancel</button>
                  <button type="submit" className="btn primary">Create Key</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showWebhookForm && (
        <div className="overlay" onClick={() => setShowWebhookForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalTitle">Create Webhook</h3>
              <button className="closeBtn" onClick={() => setShowWebhookForm(false)}>&times;</button>
            </div>
            <div className="modalBody">
              <form onSubmit={handleCreateWebhook}>
                <div className="formGroup">
                  <label className="label">Webhook URL</label>
                  <input className="inputField" value={newWebhook.url} onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })} required />
                </div>
                <div className="formGroup">
                  <label className="label">Events</label>
                  <input className="inputField" value={newWebhook.events} onChange={(e) => setNewWebhook({ ...newWebhook, events: e.target.value })} required />
                </div>
                <div className="formGroup">
                  <label className="label">Secret</label>
                  <input className="inputField" value={newWebhook.secret} onChange={(e) => setNewWebhook({ ...newWebhook, secret: e.target.value })} required />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button type="button" onClick={() => setShowWebhookForm(false)} className="btn secondary">Cancel</button>
                  <button type="submit" className="btn primary">Create Webhook</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
