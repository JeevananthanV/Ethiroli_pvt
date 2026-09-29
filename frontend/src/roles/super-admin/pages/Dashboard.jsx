import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import axiosInstance from '../../../services/api/axiosInstance.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLiveStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/v1/role/dashboard');
      const data = res?.data?.dashboard?.stats || res?.dashboard?.stats || null;
      setStats(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
      setError('Unable to fetch live platform statistics from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
  }, []);

  return (
    <AdminPage 
      title="Super Admin Dashboard" 
      subtitle="Real-time multi-tenant platform controls, database telemetry, and system operations"
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i> Live Database Connected
          </span>
          {lastUpdated && (
            <span className="text-secondary small">
              Synced at {lastUpdated}
            </span>
          )}
        </div>
        <button 
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
          onClick={fetchLiveStats}
          disabled={loading}
        >
          <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i>
          {loading ? 'Refreshing...' : 'Refresh Live Data'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger py-2 mb-2" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Live Metrics Grid fetched directly from MySQL */}
      <div className="row g-3 mb-2">
        <div className="col-md-3 col-sm-6">
          <div className="card bg-primary text-white h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h6 className="card-title text-white-50 text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  Total Users
                </h6>
                <i className="bi bi-people fs-4 text-white-50"></i>
              </div>
              <h2 className="card-text fw-bold mb-0 mt-2">
                {loading ? '...' : (stats?.users ?? 0)}
              </h2>
              <small className="text-white-50" style={{ fontSize: '0.72rem' }}>
                Active MySQL records
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card bg-success text-white h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h6 className="card-title text-white-50 text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  Active Tenants
                </h6>
                <i className="bi bi-building fs-4 text-white-50"></i>
              </div>
              <h2 className="card-text fw-bold mb-0 mt-2">
                {loading ? '...' : (stats?.tenants ?? 0)}
              </h2>
              <small className="text-white-50" style={{ fontSize: '0.72rem' }}>
                {stats?.activeTenants ?? 0} active organizations
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card bg-info text-white h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h6 className="card-title text-white-50 text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  Automation Workflows
                </h6>
                <i className="bi bi-robot fs-4 text-white-50"></i>
              </div>
              <h2 className="card-text fw-bold mb-0 mt-2">
                {loading ? '...' : (stats?.workflows ?? 0)}
              </h2>
              <small className="text-white-50" style={{ fontSize: '0.72rem' }}>
                Active triggers & jobs
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card bg-warning text-dark h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h6 className="card-title text-black-50 text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  System Telemetry Alerts
                </h6>
                <i className="bi bi-activity fs-4 text-black-50"></i>
              </div>
              <h2 className="card-text fw-bold mb-0 mt-2">
                {loading ? '...' : (stats?.alerts ?? 0)}
              </h2>
              <small className="text-black-50" style={{ fontSize: '0.72rem' }}>
                System error & anomaly logs
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-2">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0" style={{ background: 'var(--admin-card-bg, #1a1f2c)' }}>
            <div className="card-header bg-transparent border-bottom border-secondary border-opacity-25 py-3">
              <h6 className="mb-0 fw-semibold text-white">
                <i className="bi bi-diagram-3 text-primary me-2"></i> Platform & Multi-Tenant Management
              </h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                <li>
                  <a href="/app/super-admin/tenants" className="text-decoration-none text-light text-opacity-75 d-flex align-items-center justify-content-between p-2 rounded hover-bg">
                    <span><i className="bi bi-building me-2 text-primary"></i> Tenants & Organizations</span>
                    <span className="badge bg-primary bg-opacity-25 text-primary">{stats?.tenants ?? 0}</span>
                  </a>
                </li>
                <li>
                  <a href="/app/super-admin/users" className="text-decoration-none text-light text-opacity-75 d-flex align-items-center justify-content-between p-2 rounded hover-bg">
                    <span><i className="bi bi-people me-2 text-primary"></i> Global User Access</span>
                    <span className="badge bg-primary bg-opacity-25 text-primary">{stats?.users ?? 0}</span>
                  </a>
                </li>
                <li>
                  <a href="/app/super-admin/billing" className="text-decoration-none text-light text-opacity-75 d-flex align-items-center justify-content-between p-2 rounded hover-bg">
                    <span><i className="bi bi-credit-card me-2 text-primary"></i> Subscriptions & Invoices</span>
                    <span className="badge bg-primary bg-opacity-25 text-primary">{stats?.invoices ?? 0}</span>
                  </a>
                </li>
                <li>
                  <a href="/app/super-admin/automation" className="text-decoration-none text-light text-opacity-75 d-flex align-items-center justify-content-between p-2 rounded hover-bg">
                    <span><i className="bi bi-robot me-2 text-primary"></i> Automation Studio</span>
                    <span className="badge bg-primary bg-opacity-25 text-primary">{stats?.workflows ?? 0}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0" style={{ background: 'var(--admin-card-bg, #1a1f2c)' }}>
            <div className="card-header bg-transparent border-bottom border-secondary border-opacity-25 py-3">
              <h6 className="mb-0 fw-semibold text-white">
                <i className="bi bi-shield-lock text-primary me-2"></i> Security & Operations Center
              </h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                <li>
                  <a href="/app/super-admin/monitoring" className="text-decoration-none text-light text-opacity-75 d-flex align-items-center justify-content-between p-2 rounded hover-bg">
                    <span><i className="bi bi-activity me-2 text-warning"></i> System Monitoring & Health</span>
                    <span className="badge bg-warning bg-opacity-25 text-warning">{stats?.alerts ?? 0}</span>
                  </a>
                </li>
                <li>
                  <a href="/app/super-admin/audit-logs" className="text-decoration-none text-light text-opacity-75 d-flex align-items-center justify-content-between p-2 rounded hover-bg">
                    <span><i className="bi bi-clock-history me-2 text-info"></i> Security & Audit Logs</span>
                    <i className="bi bi-arrow-right text-secondary"></i>
                  </a>
                </li>
                <li>
                  <a href="/app/super-admin/roles-permissions" className="text-decoration-none text-light text-opacity-75 d-flex align-items-center justify-content-between p-2 rounded hover-bg">
                    <span><i className="bi bi-shield-check me-2 text-success"></i> RBAC Matrix & Scopes</span>
                    <i className="bi bi-arrow-right text-secondary"></i>
                  </a>
                </li>
                <li>
                  <a href="/app/super-admin/settings" className="text-decoration-none text-light text-opacity-75 d-flex align-items-center justify-content-between p-2 rounded hover-bg">
                    <span><i className="bi bi-gear me-2 text-secondary"></i> System Configuration</span>
                    <i className="bi bi-arrow-right text-secondary"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}