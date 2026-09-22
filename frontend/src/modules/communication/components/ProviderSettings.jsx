import React, { useEffect, useState } from 'react';
import { getProviders } from '../../../../services/api/providerApi.js';

export default function ProviderSettings() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getProviders().catch(() => []);
        setProviders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load providers:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading providers...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Provider Settings</h2>
          <p className="pageSubtitle">Communication provider configurations</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {providers.length === 0 ? (
            <div className="emptyState"><h3>No Providers</h3><p>No providers configured.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Name</th><th>Type</th><th>Status</th></tr></thead>
              <tbody>
                {providers.map((prov) => (
                  <tr key={prov.id}>
                    <td>{prov.name}</td>
                    <td>{prov.type}</td>
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
