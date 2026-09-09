import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getWebhooks, createWebhook } from '../../services/api/webhookApi.js';

export default function WebhookTester() {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testUrl, setTestUrl] = useState('');
  const [payload, setPayload] = useState('{\n  "event": "test",\n  "data": {\n    "id": 1\n  }\n}');
  const [response, setResponse] = useState(null);
  const [sending, setSending] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '', events: [] });
  const [creating, setCreating] = useState(false);

  const loadWebhooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWebhooks();
      setWebhooks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebhooks();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!testUrl.trim()) {
      alert('Webhook URL is required');
      return;
    }
    setSending(true);
    setResponse(null);
    try {
      const parsedPayload = JSON.parse(payload);
      const res = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedPayload),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
        headers: Object.fromEntries(res.headers.entries()),
      });
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setSending(false);
    }
  };

  const handleCreateWebhook = async (e) => {
    e.preventDefault();
    if (!newWebhook.name || !newWebhook.url) {
      alert('Name and URL are required');
      return;
    }
    setCreating(true);
    try {
      await createWebhook({
        name: newWebhook.name,
        url: newWebhook.url,
        events: newWebhook.events,
      });
      setShowCreate(false);
      setNewWebhook({ name: '', url: '', events: [] });
      loadWebhooks();
    } catch (err) {
      alert(`Failed to create webhook: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminPage
      title="Webhook Tester"
      subtitle="Test and manage webhook endpoints"
      loading={loading}
      error={error}
      onRetry={loadWebhooks}
      actions={
        <button className="btn primary" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Close Form' : 'New Webhook'}
        </button>
      }
    >
      {showCreate && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Register Webhook</h3>
          </div>
          <div className="cardBody">
            <form onSubmit={handleCreateWebhook} className="form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div className="formGroup">
                  <label className="label required">Name</label>
                  <input className="inputField" required value={newWebhook.name} onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })} />
                </div>
                <div className="formGroup">
                  <label className="label required">URL</label>
                  <input className="inputField" required type="url" value={newWebhook.url} onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })} />
                </div>
              </div>
              <div className="formGroup">
                <label className="label">Events (comma-separated)</label>
                <input
                  className="inputField"
                  value={newWebhook.events.join(', ')}
                  onChange={(e) => setNewWebhook({ ...newWebhook, events: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })}
                  placeholder="e.g. user.created, order.updated"
                />
              </div>
              <button type="submit" className="btn primary" disabled={creating}>
                {creating ? 'Creating...' : 'Create Webhook'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Send Test Payload</h3></div>
          <div className="cardBody">
            <form onSubmit={handleSend} className="form">
              <div className="formGroup">
                <label className="label required">Webhook URL</label>
                <input
                  className="inputField"
                  type="url"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="https://example.com/webhook"
                />
              </div>
              <div className="formGroup">
                <label className="label">Payload (JSON)</label>
                <textarea
                  className="textarea"
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  rows={6}
                />
              </div>
              <button type="submit" className="btn primary" disabled={sending}>
                {sending ? 'Sending...' : 'Send Request'}
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">Response</h3></div>
          <div className="cardBody">
            {!response ? (
              <div className="emptyState">Send a request to see the response here.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                {response.error ? (
                  <div className="textDanger">Error: {response.error}</div>
                ) : (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <span className="textMuted">Status: </span>
                      <span className={`statusTag ${response.status < 400 ? 'active' : 'error'}`}>
                        {response.status} {response.statusText}
                      </span>
                    </div>
                    {response.headers && (
                      <div style={{ marginBottom: 12 }}>
                        <span className="textMuted">Headers:</span>
                        <pre style={{ background: 'var(--admin-bg-dark)', padding: 12, borderRadius: 6, fontSize: 12, marginTop: 4 }}>
                          {JSON.stringify(response.headers, null, 2)}
                        </pre>
                      </div>
                    )}
                    <div>
                      <span className="textMuted">Body:</span>
                      <pre style={{ background: 'var(--admin-bg-dark)', padding: 12, borderRadius: 6, fontSize: 12, marginTop: 4, maxHeight: 300, overflow: 'auto' }}>
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader"><h3 className="cardTitle">Registered Webhooks</h3></div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {webhooks.length === 0 ? (
            <div className="emptyState">No webhooks registered.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>URL</th>
                  <th>Events</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((webhook) => (
                  <tr key={webhook.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{webhook.name}</td>
                    <td className="textSecondary">
                      <a href={webhook.url} target="_blank" rel="noreferrer">{webhook.url}</a>
                    </td>
                    <td className="textSecondary">{webhook.events?.join(', ') || '-'}</td>
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
