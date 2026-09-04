import React, { useEffect, useState } from 'react';
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [keysRes, webRes] = await Promise.all([
        getApiKeys().catch(() => []),
        getWebhooks().catch(() => []),
      ]);
      setApiKeys(Array.isArray(keysRes) ? keysRes : []);
      setWebhooks(Array.isArray(webRes) ? webRes : []);
    } catch (err) {
      console.error('Failed to load developer portal data:', err);
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
      console.error('Failed to create API key:', err);
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
      console.error('Failed to create webhook:', err);
    }
  };

  if (loading) return <div className="loading">Loading developer portal...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Developer Portal</h2>
          <p className="pageSubtitle">API keys, webhooks, and system integrations</p>
        </div>
        <div className="pageActions" style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowKeyForm(true)} className="btn btnPrimary">+ New API Key</button>
          <button onClick={() => setShowWebhookForm(true)} className="btn">+ New Webhook</button>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">API Keys ({apiKeys.length})</h3></div>
          <div className="cardBody">
            {apiKeys.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No API keys created yet.</p>
            ) : (
              <table className="table">
                <thead><tr><th>Name</th><th>Key</th><th>Scopes</th></tr></thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id}>
                      <td>{key.name}</td>
                      <td><code>{key.key?.slice(0, 8)}...</code></td>
                      <td>{key.scopes || 'all'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Webhooks ({webhooks.length})</h3></div>
          <div className="cardBody">
            {webhooks.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)' }}>No webhooks configured.</p>
            ) : (
              <table className="table">
                <thead><tr><th>URL</th><th>Events</th></tr></thead>
                <tbody>
                  {webhooks.map((wh) => (
                    <tr key={wh.id}>
                      <td><code>{wh.url}</code></td>
                      <td>{wh.events || 'all'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showKeyForm && (
        <div className="modalOverlay" onClick={() => setShowKeyForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Create API Key</h3>
            <form onSubmit={handleCreateKey}>
              <div className="formGroup">
                <label className="label">Key Name</label>
                <input className="input" value={newKey.name} onChange={(e) => setNewKey({ ...newKey, name: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Scopes</label>
                <input className="input" value={newKey.scopes} onChange={(e) => setNewKey({ ...newKey, scopes: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowKeyForm(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btnPrimary">Create Key</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showWebhookForm && (
        <div className="modalOverlay" onClick={() => setShowWebhookForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Create Webhook</h3>
            <form onSubmit={handleCreateWebhook}>
              <div className="formGroup">
                <label className="label">Webhook URL</label>
                <input className="input" value={newWebhook.url} onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Events</label>
                <input className="input" value={newWebhook.events} onChange={(e) => setNewWebhook({ ...newWebhook, events: e.target.value })} required />
              </div>
              <div className="formGroup">
                <label className="label">Secret</label>
                <input className="input" value={newWebhook.secret} onChange={(e) => setNewWebhook({ ...newWebhook, secret: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowWebhookForm(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btnPrimary">Create Webhook</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
