import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Dashboard() {
  return (
    <AdminPage title="Super Admin Dashboard" subtitle="System-wide overview and controls">
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Total Users</h6>
              <h2 className="card-text">1,234</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h6 className="card-title">Active Tenants</h6>
              <h2 className="card-text">45</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body">
              <h6 className="card-title">Pending Approvals</h6>
              <h2 className="card-text">12</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h6 className="card-title">System Alerts</h6>
              <h2 className="card-text">3</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Quick Navigation</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li><a href="/app/super-admin/tenants" className="text-decoration-none">Organizations / Tenants</a></li>
                <li><a href="/app/super-admin/billing" className="text-decoration-none">Plans & Billing</a></li>
                <li><a href="/app/super-admin/subscriptions" className="text-decoration-none">Subscriptions</a></li>
                <li><a href="/app/super-admin/feature-flags" className="text-decoration-none">Feature Flags</a></li>
                <li><a href="/app/super-admin/backups" className="text-decoration-none">Backups</a></li>
                <li><a href="/app/super-admin/api-keys" className="text-decoration-none">API Keys</a></li>
                <li><a href="/app/super-admin/notifications" className="text-decoration-none">Notifications</a></li>
                <li><a href="/app/super-admin/security" className="text-decoration-none">Security</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">More Quick Navigation</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li><a href="/app/super-admin/users" className="text-decoration-none">Users</a></li>
                <li><a href="/app/super-admin/leads" className="text-decoration-none">Leads (CRM)</a></li>
                <li><a href="/app/super-admin/monitoring" className="text-decoration-none">System Monitoring</a></li>
                <li><a href="/app/super-admin/system-search" className="text-decoration-none">System Search</a></li>
                <li><a href="/app/super-admin/audit-logs" className="text-decoration-none">Audit Logs</a></li>
                <li><a href="/app/super-admin/settings" className="text-decoration-none">Settings</a></li>
                <li><a href="/app/super-admin/approvals" className="text-decoration-none">Approvals</a></li>
                <li><a href="/app/super-admin/calendar" className="text-decoration-none">Calendar</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}