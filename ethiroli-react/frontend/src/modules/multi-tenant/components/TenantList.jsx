import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { listTenants, createTenant } from '../../../services/api/tenantApi.js';

export default function TenantList() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', domain: '', plan: 'basic' });

  const fetchTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTenants();
      setTenants(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createTenant(form);
      setShowForm(false);
      setForm({ name: '', domain: '', plan: 'basic' });
      fetchTenants();
    } catch (err) {
      console.error('Failed to create tenant:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="Active Tenants"
      subtitle="Isolated data instances management console"
      loading={loading}
      error={error}
      onRetry={fetchTenants}
      actions={
        <button className="btn primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'New Tenant'}
        </button>
      }
    >
      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="cardHeader">
            <h3 className="cardTitle">Create Tenant</h3>
          </div>
          <div className="cardBody">
            <form onSubmit={handleCreate} className="form">
              <div className="formGroup">
                <label className="label">Tenant Name</label>
                <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Domain</label>
                <input className="input" required value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Plan</label>
                <select className="select" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? 'Creating...' : 'Create Tenant'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Tenant Registry</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {tenants.length === 0 ? (
            <div className="emptyState">No tenants found.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Domain</th>
                  <th>Plan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td><code>{tenant.id}</code></td>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{tenant.name}</td>
                    <td className="textSecondary">{tenant.domain}</td>
                    <td className="textSecondary">{tenant.plan || 'basic'}</td>
                    <td><span className="statusTag active">Active</span></td>
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