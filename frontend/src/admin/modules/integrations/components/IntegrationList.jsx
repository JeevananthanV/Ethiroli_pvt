import React, { useEffect, useState } from 'react';
import { getIntegrations } from '../../../../services/api/integrationApi.js';

export default function IntegrationList() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getIntegrations().catch(() => []);
        setIntegrations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load integrations:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading integrations...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Integrations</h2>
          <p className="pageSubtitle">Services configuration mesh</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {integrations.length === 0 ? (
            <div className="emptyState"><h3>No Integrations</h3><p>No integrations configured.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Type</th><th>Status</th></tr></thead>
              <tbody>
                {integrations.map((int) => (
                  <tr key={int.id}>
                    <td>{int.name}</td>
                    <td>{int.type}</td>
                    <td><span className="statusTag active">Active</span></td>
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
