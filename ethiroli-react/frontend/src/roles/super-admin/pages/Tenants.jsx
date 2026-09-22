import React, { useEffect, useState } from 'react';
import { listTenants, createTenant } from '../../../services/api/tenantApi.js';

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ 
    name: '', 
    subdomain: '', 
    custom_domain: '', 
    currency: 'INR', 
    timezone: 'Asia/Kolkata', 
    is_active: true 
  });

  const fetchTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listTenants();
      const list = res?.data || res || [];
      setTenants(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load tenants', err);
      setError('Failed to fetch real-time tenant records from database.');
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
      const res = await createTenant(form);
      const newId = res?.data?.id || res?.id;
      setTenants(prev => [{ ...form, id: newId || `tenant-${Date.now()}`, created_at: new Date().toISOString() }, ...prev]);
      setShowForm(false);
      setForm({ name: '', subdomain: '', custom_domain: '', currency: 'INR', timezone: 'Asia/Kolkata', is_active: true });
    } catch (err) {
      console.error('Failed to create tenant', err);
      alert('Failed to create tenant organization.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = tenants.filter(t => 
    (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.subdomain || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.custom_domain || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-white mb-1">Multi-Tenant Organizations</h1>
          <p className="text-secondary small mb-0">
            Real-time tenant records fetched live from MySQL datastore ({tenants.length} registered).
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchTenants} 
            disabled={loading}
          >
            <i className={`bi bi-arrow-clockwise me-1 ${loading ? 'spin' : ''}`}></i>
            Refresh
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => setShowForm(!showForm)}
          >
            <i className="bi bi-plus-circle me-1"></i>
            {showForm ? 'Close Form' : 'New Organization'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
        </div>
      )}

      {showForm && (
        <div className="card bg-dark text-white border-secondary mb-4 shadow-sm">
          <div className="card-header border-secondary">
            <h5 className="mb-0 fs-6 fw-semibold text-primary">Provision New Tenant Account</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreate} style={{ maxWidth: '600px' }} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small text-secondary">Organization Name</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary" 
                  required 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="e.g. Coimbatore Tech Institute"
                />
              </div>
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Subdomain</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary" 
                    required 
                    value={form.subdomain} 
                    onChange={(e) => setForm({ ...form, subdomain: e.target.value })} 
                    placeholder="e.g. coimbatore"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Custom Domain (Optional)</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary" 
                    value={form.custom_domain} 
                    onChange={(e) => setForm({ ...form, custom_domain: e.target.value })} 
                    placeholder="e.g. portal.coimbatore.edu"
                  />
                </div>
              </div>
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Currency</label>
                  <select 
                    className="form-select form-select-sm bg-secondary bg-opacity-25 text-white border-secondary"
                    value={form.currency} 
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Timezone</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary" 
                    value={form.timezone} 
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })} 
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Creating...' : 'Provision Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card bg-dark text-white border-secondary shadow-sm">
        <div className="card-header border-secondary d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold small">Live Tenant Records</span>
            <span className="badge bg-primary bg-opacity-25 text-primary">{filtered.length}</span>
          </div>
          <input
            type="text"
            className="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary"
            style={{ maxWidth: '240px' }}
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5 text-secondary">
              <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
              Querying database for live tenant records...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
              No tenant organizations found.
            </div>
          ) : (
            <table className="table table-dark table-hover mb-0 align-middle">
              <thead>
                <tr className="border-secondary text-secondary small text-uppercase" style={{ fontSize: '0.75rem' }}>
                  <th scope="col">Organization Name</th>
                  <th scope="col">Subdomain / Domain</th>
                  <th scope="col">Currency</th>
                  <th scope="col">Timezone</th>
                  <th scope="col">Status</th>
                  <th scope="col">Registered</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-secondary">
                    <td>
                      <div className="fw-semibold text-white">{t.name}</div>
                      <small className="text-secondary font-monospace" style={{ fontSize: '0.72rem' }}>{t.id}</small>
                    </td>
                    <td>
                      <span className="badge bg-secondary bg-opacity-25 text-light font-monospace me-1">
                        {t.subdomain || '-'}.ethiroli.com
                      </span>
                      {t.custom_domain && (
                        <span className="badge bg-info bg-opacity-25 text-info font-monospace">
                          {t.custom_domain}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary">{t.currency || 'INR'}</span>
                    </td>
                    <td className="text-secondary small">{t.timezone || 'Asia/Kolkata'}</td>
                    <td>
                      <span className={`badge ${t.is_active ? 'bg-success bg-opacity-25 text-success' : 'bg-danger bg-opacity-25 text-danger'}`}>
                        {t.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-secondary small">
                      {t.created_at ? new Date(t.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
