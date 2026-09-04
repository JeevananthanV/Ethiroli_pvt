import React, { useEffect, useState } from 'react';
import { listTenants } from '../../../services/api/tenantApi.js';

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', domain: '', subscriptionLevel: 'Professional Tier', userCount: 0, datastoreNamespace: '' });

  const fetchTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTenants();
      setTenants(data?.data || data || []);
    } catch (err) {
      console.error('Failed to load tenants', err);
      setError('Failed to load tenants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTenants(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await listTenants(form);
      setTenants(prev => [...prev, data?.data || data]);
      setShowForm(false);
      setForm({ name: '', domain: '', subscriptionLevel: 'Professional Tier', userCount: 0, datastoreNamespace: '' });
    } catch (err) {
      console.error('Failed to create tenant', err);
      alert('Failed to create tenant.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading tenants...</div>;
  if (error) return <div className="emptyState">{error}</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Multi-Tenant Company Accounts</h1>
          <p className="pageSubtitle">Manage tenant domains, subscription levels, and datastore namespaces.</p>
        </div>
        <div className="pageActions">
          <button className="btn btnPrimary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Close Form' : 'New Tenant'}</button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Create Tenant</h3>
          </div>
          <div className="cardBody">
            <form onSubmit={handleCreate} style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
              <div className="formGroup">
                <label className="label">Tenant Name</label>
                <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Client Domain</label>
                <input className="input" required value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Subscription Level</label>
                <select className="select" value={form.subscriptionLevel} onChange={(e) => setForm({ ...form, subscriptionLevel: e.target.value })}>
                  <option value="Professional Tier">Professional Tier</option>
                  <option value="Enterprise Tier">Enterprise Tier</option>
                </select>
              </div>
              <div className="formGroup">
                <label className="label">User Count</label>
                <input type="number" className="input" required value={form.userCount} onChange={(e) => setForm({ ...form, userCount: Number(e.target.value) })} />
              </div>
              <div className="formGroup">
                <label className="label">Datastore Namespace</label>
                <input className="input" required value={form.datastoreNamespace} onChange={(e) => setForm({ ...form, datastoreNamespace: e.target.value })} />
              </div>
              <button type="submit" className="btn btnPrimary" disabled={saving}>{saving ? 'Creating...' : 'Create Tenant'}</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Tenants ({tenants.length})</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {tenants.length === 0 && <div className="emptyState">No tenants found.</div>}
          <table className="table">
            <thead>
              <tr>
                <th>Tenant ID</th>
                <th>Client Domain</th>
                <th>Subscription Level</th>
                <th>User Count</th>
                <th>Datastore Namespace</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t.id}>
                  <td><code>{t.id}</code></td>
                  <td>{t.domain || t.clientDomain}</td>
                  <td><span className="statusTag active">{t.subscriptionLevel || t.tier}</span></td>
                  <td>{t.userCount ?? '-'}</td>
                  <td><code>{t.datastoreNamespace || t.dbSchema || '-'}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
