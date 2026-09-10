import React, { useEffect, useState } from 'react';
import { getHealth } from '../../../../services/api/systemApi.js';

export default function HealthDashboard() {
  const [health, setHealth] = useState({ status: 'loading', uptime: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getHealth().catch(() => ({ status: 'unknown', uptime: 0 }));
        setHealth(data);
      } catch (err) {
        console.error('Failed to load health:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading health status...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">System Health</h2>
          <p className="pageSubtitle">Real-time system status and uptime</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="statCard">
          <p className="statLabel">System Status</p>
          <p className="statValue" style={{ color: health.status === 'ok' ? 'var(--admin-success)' : 'var(--admin-warning)' }}>
            {health.status?.toUpperCase() || 'UNKNOWN'}
          </p>
        </div>
        <div className="statCard">
          <p className="statLabel">Uptime</p>
          <p className="statValue">{Math.floor((health.uptime || 0) / 60)}m</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Last Check</p>
          <p className="statValue" style={{ fontSize: '14px' }}>{new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
