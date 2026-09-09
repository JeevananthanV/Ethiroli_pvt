import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { listClients } from '../../../services/api/clientApi.js';
import { listSubscriptions } from '../../../services/api/subscriptionApi.js';
import { listTasks } from '../../../services/api/taskApi.js';

function StatCard({ label, value, trend, icon }) {
  return (
    <div className="statCard">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <p className="statLabel" style={{ margin: 0 }}>{label}</p>
      </div>
      <p className="statValue">{value}</p>
      {trend && <span className={`statTrend ${trend.direction}`}>{trend.label}</span>}
    </div>
  );
}

export default function PMDashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeSubscriptions: 0,
    pendingSubscriptions: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentClients, setRecentClients] = useState([]);
  const [recentSubs, setRecentSubs] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [clientsRes, subsRes, tasksRes] = await Promise.all([
        listClients({ per_page: 5 }).catch(() => ({ clients: [], data: [] })),
        listSubscriptions({ per_page: 5 }).catch(() => ({ subscriptions: [], data: [] })),
        listTasks({}).catch(() => ({ tasks: [], data: [] })),
      ]);

      const clients = Array.isArray(clientsRes) ? clientsRes : clientsRes.clients || clientsRes.data || [];
      const subscriptions = Array.isArray(subsRes) ? subsRes : subsRes.subscriptions || subsRes.data || [];
      const tasks = Array.isArray(tasksRes) ? tasksRes : tasksRes.tasks || tasksRes.data || [];

      setRecentClients(clients.slice(0, 5));
      setRecentSubs(subscriptions.slice(0, 5));

      const activeSubs = subscriptions.filter((s) => (s.status || '').toLowerCase() === 'active');
      const pendingSubs = subscriptions.filter((s) => (s.status || '').toLowerCase() === 'pending');
      const pendingTasks = tasks.filter((t) => (t.status || '').toLowerCase() === 'todo');
      const inProgressTasks = tasks.filter((t) => (t.status || '').toLowerCase() === 'in-progress');
      const doneTasks = tasks.filter((t) => (t.status || '').toLowerCase() === 'done');
      const totalRevenue = activeSubs.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

      setStats({
        totalClients: clients.length,
        activeSubscriptions: activeSubs.length,
        pendingSubscriptions: pendingSubs.length,
        pendingTasks: pendingTasks.length,
        inProgressTasks: inProgressTasks.length,
        doneTasks: doneTasks.length,
        totalRevenue,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (val) => {
    if (!val && val !== 0) return '₹0';
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  return (
    <AdminPage
      title="Project Manager Dashboard"
      subtitle="Overview of your clients, subscriptions, and team tasks"
      loading={loading}
      error={error}
      onRetry={fetchDashboardData}
      actions={
        <button className="btn primary" onClick={fetchDashboardData}>Refresh</button>
      }
    >
      <div className="dashboard">
        <div className="dashboardGrid">
          <StatCard
            label="Total Clients"
            value={stats.totalClients}
            trend={{ direction: 'up', label: 'Registered' }}
            icon="👥"
          />
          <StatCard
            label="Active Subscriptions"
            value={stats.activeSubscriptions}
            trend={{ direction: 'up', label: 'Billing' }}
            icon="✅"
          />
          <StatCard
            label="Pending Subscriptions"
            value={stats.pendingSubscriptions}
            trend={{ direction: 'down', label: 'Awaiting' }}
            icon="⏳"
          />
          <StatCard
            label="Monthly Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon="💰"
          />
          <StatCard
            label="Pending Tasks"
            value={stats.pendingTasks}
            trend={{ direction: 'down', label: 'To Do' }}
            icon="📋"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgressTasks}
            icon="🔄"
          />
          <StatCard
            label="Completed"
            value={stats.doneTasks}
            trend={{ direction: 'up', label: 'Done' }}
            icon="🎯"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18, marginTop: 8 }}>
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Recent Clients</h3>
            </div>
            {recentClients.length === 0 ? (
              <div className="emptyState" style={{ padding: '24px 0' }}>
                <p>No clients found.</p>
              </div>
            ) : (
              <table className="table" style={{ marginTop: 0 }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClients.map((client) => (
                    <tr key={client.id || client._id}>
                      <td style={{ fontWeight: 600 }}>{client.name}</td>
                      <td>{client.company || '—'}</td>
                      <td>
                        <span className={`statusTag ${client.status || 'active'}`}>
                          {client.status || 'active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Recent Subscriptions</h3>
            </div>
            {recentSubs.length === 0 ? (
              <div className="emptyState" style={{ padding: '24px 0' }}>
                <p>No subscriptions found.</p>
              </div>
            ) : (
              <table className="table" style={{ marginTop: 0 }}>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubs.map((sub) => (
                    <tr key={sub.id || sub._id}>
                      <td style={{ fontWeight: 600 }}>{sub.clientName || sub.client?.name || '—'}</td>
                      <td>{sub.planName || sub.plan || 'Standard'}</td>
                      <td>{formatCurrency(sub.amount)}</td>
                      <td>
                        <span className={`statusTag ${sub.status || 'active'}`}>
                          {sub.status || 'active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
