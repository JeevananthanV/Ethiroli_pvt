import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getApiKeys, createApiKey } from '../../../services/api/apiKeyApi.js';

export default function AdminDeveloperPortal() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState('read,write');
  const [submitting, setSubmitting] = useState(false);

  const fetchKeys = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApiKeys();
      setApiKeys(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createApiKey({
        name: newKeyName,
        scopes: newKeyScopes.split(',').map((s) => s.trim()),
      });
      setNewKeyName('');
      setNewKeyScopes('read,write');
      setShowForm(false);
      fetchKeys();
    } catch (err) {
      alert('Failed to create API key: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminPage
      title="Developer Portal"
      subtitle="Manage API keys, webhooks, and developer tooling"
      loading={loading}
      error={error}
      onRetry={fetchKeys}
      actions={
        <button className="btn primary btnSm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New API Key'}
        </button>
      }
    >
      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 className="cardTitle" style={{ marginBottom: '16px' }}>Create New API Key</h3>
          <form className="form" onSubmit={handleCreateKey}>
            <div className="formGroup">
              <label className="label">Key Name</label>
              <input
                type="text"
                className="inputField"
                placeholder="e.g. Production Integration"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Scopes (comma separated)</label>
              <input
                type="text"
                className="inputField"
                placeholder="read, write, admin"
                value={newKeyScopes}
                onChange={(e) => setNewKeyScopes(e.target.value)}
              />
            </div>
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Generate Key'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {apiKeys.length === 0 ? (
          <div className="emptyState">
            <h3>No API keys found</h3>
            <p>Create your first API key to start integrating with external systems.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Key Prefix</th>
                <th>Scopes</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id}>
                  <td style={{ fontWeight: '500' }}>{key.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                    {key.key_prefix || '••••••••'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(key.scopes || []).map((scope, idx) => (
                        <span key={idx} className="actionTag">{scope}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`statusTag ${key.is_active ? 'active' : 'inactive'}`}>
                      {key.is_active ? 'Active' : 'Revoked'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: '12px' }}>
                    {key.created_at ? new Date(key.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminPage>
  );
}
