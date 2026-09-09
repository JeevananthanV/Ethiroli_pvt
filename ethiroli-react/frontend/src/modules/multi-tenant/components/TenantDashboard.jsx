import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listTenants } from '../../services/api/tenantApi.js';

export default function TenantDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');

  const loadTenants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTenants();
      setTenants(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch = (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.domain || '').toLowerCase().includes(search.toLowerCase());
    const matchesPlan = !planFilter || t.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === 'active').length;
  const plans = [...new Set(tenants.map((t) => t.plan).filter(Boolean))];

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminPage
      title="Tenant Dashboard"
      subtitle="Multi-tenant overview with usage and quick actions"
      loading={loading}
      error={error}
      onRetry={loadTenants}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="inputField"
            placeholder="Search tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <select className="select" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
            <option value="">All Plans</option>
            {plans.map((plan) => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="statCard">
          <div className="statLabel">Total Tenants</div>
          <div className="statValue">{totalTenants}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Active Tenants</div>
          <div className="statValue textSuccess">{activeTenants}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Inactive</div>
          <div className="statValue textDanger">{totalTenants - activeTenants}</div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Tenant Registry</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {filteredTenants.length === 0 ? (
            <div className="emptyState">No tenants found.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Domain</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Users</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td className="textPrimary" style={{ fontWeight: 500 }}>{tenant.name}</td>
                    <td className="textSecondary">{tenant.domain || '-'}</td>
                    <td className="textSecondary">{tenant.plan || 'basic'}</td>
                    <td>
                      <span className={`statusTag ${tenant.status === 'active' ? 'active' : tenant.status === 'suspended' ? 'error' : 'pending'}`}>
                        {tenant.status || 'active'}
                      </span>
                    </td>
                    <td className="textSecondary">{tenant.user_count || tenant.users?.length || '-'}</td>
                    <td className="textSecondary">{formatDate(tenant.created_at)}</td>
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
