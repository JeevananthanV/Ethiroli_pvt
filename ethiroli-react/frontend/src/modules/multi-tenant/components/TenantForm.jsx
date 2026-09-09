import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getTenants, createTenant } from '../../services/api/tenantApi.js';

export default function TenantForm() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', domain: '', plan: 'basic', status: 'active' });

  const load = async () => {
    setLoading(true);
    try { setTenants((await getTenants().catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    await createTenant(form);
    setForm({ name: '', domain: '', plan: 'basic', status: 'active' });
    load();
  };

  return (
    <AdminPage title="Tenants" subtitle="Create and manage tenants" loading={loading} error={null} onRetry={load}>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="cardHeader"><h3 className="cardTitle">New Tenant</h3></div>
        <form onSubmit={save} className="form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="formGroup">
              <label className="label">Name</label>
              <input className="inputField" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="formGroup">
              <label className="label">Domain</label>
              <input className="inputField" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} required />
            </div>
            <div className="formGroup">
              <label className="label">Plan</label>
              <select className="select" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Status</label>
              <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn primary">Create Tenant</button>
        </form>
      </div>
      <div className="card">
        <div className="cardBody">
          {tenants.length === 0 ? <p className="textSecondary">No tenants found.</p> : (
            <div className="overflowAuto">
              <table className="table">
                <thead><tr><th>Name</th><th>Domain</th><th>Plan</th><th>Status</th></tr></thead>
                <tbody>
                  {tenants.map((t) => (
                    <tr key={t.id}>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{t.name}</td>
                      <td className="textSecondary">{t.domain}</td>
                      <td className="textSecondary">{t.plan || '-'}</td>
                      <td><span className={'statusTag ' + (t.status === 'active' ? 'active' : 'error')}>{t.status}</span></td>
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
