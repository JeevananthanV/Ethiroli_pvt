import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { systemApi } from '../../../services/api/systemApi'
import Button from '../../../common/components/Button'

export default function AdminDashboard() {
  const [systemHealth, setSystemHealth] = useState({ status: 'loading', uptime: 0 })
  const [tenants, setTenants] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [healthRes, tenantsRes, activityRes] = await Promise.all([
        systemApi.getHealth().catch(() => ({ status: 'unknown', uptime: 0 })),
        systemApi.getTenants().catch(() => []),
        systemApi.getActivity().catch(() => []),
      ])
      setSystemHealth(healthRes)
      setTenants(Array.isArray(tenantsRes) ? tenantsRes : [])
      setRecentActivity(Array.isArray(activityRes) ? activityRes.slice(0, 5) : [])
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div>
      <div className="pageHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="pageTitle" style={{ fontSize: '26px', fontWeight: '700', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Control Panel
          </h1>
          <p style={{ color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
            Manage tenants, monitor system health, and review activity.
          </p>
        </div>
        <button onClick={handleRefresh} className="btn primary" disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid gridCols4 mb4">
        <div className="statCard">
          <p className="statLabel">Tenants</p>
          <p className="statValue">{tenants.length}</p>
          <div className="textSecondary textSm mt2">Active tenants</div>
        </div>
        <div className="statCard">
          <p className="statLabel">System Health</p>
          <p className="statValue" style={{ color: systemHealth.status === 'ok' ? 'var(--admin-success)' : 'var(--admin-warning)' }}>
            {systemHealth.status?.toUpperCase() || 'UNKNOWN'}
          </p>
          <div className="textSecondary textSm mt2">
            Uptime: {Math.floor((systemHealth.uptime || 0) / 60)}m
          </div>
        </div>
        <div className="statCard">
          <p className="statLabel">Recent Activity</p>
          <p className="statValue">{recentActivity.length}</p>
          <div className="textSecondary textSm mt2">Last events</div>
        </div>
        <div className="statCard">
          <p className="statLabel">Version</p>
          <p className="statValue" style={{ fontSize: '20px' }}>
            {systemHealth.version || '1.0'}
          </p>
          <div className="textSecondary textSm mt2">Platform version</div>
        </div>
      </div>

      <div className="grid gridCols2" style={{ gap: '24px' }}>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Recent Activity</h3>
            <span className="statusTag active">Live Feed</span>
          </div>
          <div className="cardBody overflowAuto">
            {recentActivity.length === 0 ? (
              <p className="textSecondary textCenter py4">No recent activity.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Type</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((item) => (
                    <tr key={item.id}>
                      <td>{item.message || item.description || 'No description'}</td>
                      <td>
                        <span className="statusTag active" style={{ fontSize: '11px' }}>
                          {item.type || 'Activity'}
                        </span>
                      </td>
                      <td className="textSecondary" style={{ fontSize: '12px' }}>
                        {item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Quick Actions</h3>
          </div>
          <div className="cardBody" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              View All Tenants
            </Button>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              System Logs
            </Button>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              Run Health Check
            </Button>
            <Button variant="danger" style={{ width: '100%', justifyContent: 'flex-start' }}>
              Enable Maintenance Mode
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
