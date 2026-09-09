import React, { useEffect, useState } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { getSystemHealth } from '../../services/api/systemApi.js';

const SERVICES = [
  { key: 'api', label: 'API Gateway' },
  { key: 'database', label: 'Database' },
  { key: 'cache', label: 'Cache (Redis)' },
  { key: 'queue', label: 'Message Queue' },
  { key: 'storage', label: 'Storage' },
  { key: 'auth', label: 'Auth Service' },
];

export default function ServiceHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSystemHealth();
      setHealth(data || null);
    } catch (err) {
      setError(err.message || 'Failed to load system health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHealth();
    setRefreshing(false);
  };

  const getServiceStatus = (serviceKey) => {
    if (!health || !health.services) {
      return { status: 'unknown', uptime: '-', latency: '-' };
    }
    const service = health.services[serviceKey];
    if (!service) return { status: 'unknown', uptime: '-', latency: '-' };
    return {
      status: service.status || 'unknown',
      uptime: service.uptime ? `${Math.floor(service.uptime / 60)}m` : '-',
      latency: service.latency ? `${service.latency}ms` : '-',
    };
  };

  const getStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'healthy':
      case 'up':
      case 'operational':
        return 'active';
      case 'degraded':
      case 'slow':
        return 'warning';
      case 'down':
      case 'unhealthy':
      case 'error':
        return 'error';
      default:
        return 'pending';
    }
  };

  return (
    <AdminPage
      title="Service Health"
      subtitle="Real-time status of infrastructure services"
      loading={loading}
      error={error}
      onRetry={loadHealth}
      actions={
        <button className="btn secondary" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      }
    >
      <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
        {SERVICES.map((service) => {
          const svc = getServiceStatus(service.key);
          return (
            <div key={service.key} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="textPrimary" style={{ fontWeight: 500, fontSize: 15 }}>{service.label}</div>
                  <div className="textMuted" style={{ fontSize: 12, marginTop: 4 }}>
                    Uptime: {svc.uptime} | Latency: {svc.latency}
                  </div>
                </div>
                <span className={`statusTag ${getStatusClass(svc.status)}`}>
                  {svc.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {health && (
        <div className="card">
          <div className="cardHeader"><h3 className="cardTitle">System Summary</h3></div>
          <div className="cardBody" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="textPrimary" style={{ fontWeight: 500 }}>Overall Status</td>
                  <td>
                    <span className={`statusTag ${getStatusClass(health.status)}`}>
                      {health.status || 'unknown'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="textPrimary" style={{ fontWeight: 500 }}>Last Checked</td>
                  <td className="textSecondary">{health.timestamp ? new Date(health.timestamp).toLocaleString() : '-'}</td>
                </tr>
                <tr>
                  <td className="textPrimary" style={{ fontWeight: 500 }}>Active Services</td>
                  <td className="textSecondary">
                    {SERVICES.filter((s) => getServiceStatus(s.key).status !== 'unknown').length} / {SERVICES.length}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
