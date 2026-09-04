import React, { useEffect, useState } from 'react';
import { getUsers } from '../../../services/api/userApi.js';
import { getLeads } from '../../../services/api/leadApi.js';
import { getHealth } from '../../../services/api/systemApi.js';
import { getFeed } from '../../../services/api/feedApi.js';

export default function Dashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);
  const [health, setHealth] = useState({ status: 'loading', uptime: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, leadsRes, healthRes, feedRes] = await Promise.all([
        getUsers().catch(() => []),
        getLeads().catch(() => []),
        getHealth().catch(() => ({ status: 'unknown', uptime: 0 })),
        getFeed().catch(() => []),
      ]);
      setUsersCount(Array.isArray(usersRes) ? usersRes.length : 0);
      setLeadsCount(Array.isArray(leadsRes) ? leadsRes.length : 0);
      setHealth(healthRes);
      setRecentActivity(Array.isArray(feedRes) ? feedRes.slice(0, 5) : []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="pageHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="pageTitle" style={{ fontSize: '26px', fontWeight: '700', background: 'linear-gradient(135deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Super Admin Control Panel</h1>
          <p style={{ color: 'var(--admin-text-secondary)', marginTop: '4px' }}>System telemetry, user statistics, and deployment management.</p>
        </div>
        <button onClick={handleRefresh} className="btn" style={{ padding: '10px 18px', background: 'var(--admin-primary)', color: 'white', borderRadius: '10px', fontWeight: '600', transition: 'all 0.2s' }} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Trigger Telemetry Scan'}
        </button>
      </div>

      <div className="dashboardGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="statCard">
          <p className="statLabel">Total System Users</p>
          <p className="statValue">{usersCount.toLocaleString()}</p>
          <div className="statTrend up">Live count from API</div>
        </div>
        <div className="statCard">
          <p className="statLabel">Platform Active Leads</p>
          <p className="statValue">{leadsCount.toLocaleString()}</p>
          <div className="statTrend up">Live count from API</div>
        </div>
        <div className="statCard">
          <p className="statLabel">System Health</p>
          <p className="statValue" style={{ color: health.status === 'ok' ? 'var(--admin-success)' : 'var(--admin-warning)' }}>{health.status?.toUpperCase() || 'UNKNOWN'}</p>
          <div className="statTrend" style={{ color: 'var(--admin-info)', background: 'rgba(59, 130, 246, 0.1)' }}>Uptime: {Math.floor((health.uptime || 0) / 60)}m</div>
        </div>
        <div className="statCard">
          <p className="statLabel">Recent Activity Feed</p>
          <p className="statValue">{recentActivity.length}</p>
          <div className="statTrend" style={{ color: 'var(--admin-info)', background: 'rgba(59, 130, 246, 0.1)' }}>Last {recentActivity.length} events</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Recent System Events</h3>
            <span className="statusTag active">Live Log Feed</span>
          </div>
          <div className="cardBody" style={{ overflowX: 'auto' }}>
            {recentActivity.length === 0 ? (
              <p style={{ color: 'var(--admin-text-secondary)', textAlign: 'center', padding: '20px' }}>No recent activity.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Event ID</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((item) => (
                    <tr key={item.id}>
                      <td><code>{item.id || 'N/A'}</code></td>
                      <td><span className="statusTag active" style={{ fontSize: '11px' }}>{item.type || 'Activity'}</span></td>
                      <td>{item.message || item.description || 'No description'}</td>
                      <td style={{ color: 'var(--admin-text-secondary)', fontSize: '12px' }}>{item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Quick Admin Actions</h3>
          </div>
          <div className="cardBody" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-default)', borderRadius: '10px', color: 'white', fontWeight: '500', textAlign: 'left', cursor: 'pointer' }}>
              Flush Redis Memory Cache
            </button>
            <button className="btn" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-default)', borderRadius: '10px', color: 'white', fontWeight: '500', textAlign: 'left', cursor: 'pointer' }}>
              Trigger Database Backup (S3)
            </button>
            <button className="btn" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border-default)', borderRadius: '10px', color: 'white', fontWeight: '500', textAlign: 'left', cursor: 'pointer' }}>
              Reload Envoy Gateway Rules
            </button>
            <button className="btn" style={{ width: '100%', padding: '12px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', color: 'var(--admin-danger)', fontWeight: '600', textAlign: 'left', cursor: 'pointer' }}>
              Enable Maintenance Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
