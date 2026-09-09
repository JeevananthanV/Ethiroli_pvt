import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getSystemHealth } from '../../services/api/systemApi.js';

export default function HealthDashboard() {
  const [health, setHealth] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setHealth((await getSystemHealth().catch(() => [])) || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return (
    <AdminPage title="Health Dashboard" subtitle="System uptime and service status" loading={loading} error={null} onRetry={load}>
      <div className="dashboardGrid" style={{ marginBottom: 24 }}>
        {health.map((service) => (
          <div className="statCard" key={service.name}>
            <p className="statLabel">{service.name}</p>
            <p className="statValue" style={{ color: service.status === 'healthy' ? 'var(--admin-success)' : 'var(--admin-danger)' }}>{service.status}</p>
            <p className="textSecondary" style={{ fontSize: 12 }}>Uptime: {service.uptime || '-'}</p>
          </div>
        ))}
      </div>
    </AdminPage>
  );
}
