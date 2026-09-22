import React, { useEffect, useState } from 'react';
import { listTenants } from '../../../../services/api/tenantApi.js';

export default function TenantList() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await listTenants().catch(() => []);
        setTenants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load tenants:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading tenants...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Tenants</h2>
          <p className="pageSubtitle">Multi-tenant registry</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {tenants.length === 0 ? (
            <div className="emptyState"><h3>No Tenants</h3><p>No tenant records found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>ID</th><th>Name</th><th>Domain</th><th>Status</th></tr></thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td><code>{tenant.id}</code></td>
                    <td>{tenant.name}</td>
                    <td>{tenant.domain}</td>
                    <td><span className={`statusTag ${tenant.is_active ? 'active' : 'inactive'}`}>{tenant.is_active ? 'Active' : 'Inactive'}</span></td>
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
