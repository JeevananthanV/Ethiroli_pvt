import React from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

const stats = [
  { label: 'Active Projects', value: '12', icon: 'bi-folder-fill', color: 'primary', to: '/app/pm/projects' },
  { label: 'On-Time Tasks', value: '68%', icon: 'bi-check2-circle', color: 'success', to: '/app/pm/tasks' },
  { label: 'Client Meetings', value: '4', icon: 'bi-people-fill', color: 'info', to: '/app/pm/client-comms' },
  { label: 'Open Milestones', value: '7', icon: 'bi-flag-fill', color: 'warning', to: '/app/pm/milestones' },
  { label: 'Pending Approvals', value: '5', icon: 'bi-hourglass-split', color: 'danger', to: '/app/pm/approvals' },
  { label: 'Team Members', value: '18', icon: 'bi-person-plus-fill', color: 'secondary', to: '/app/pm/team' },
];

const quickLinks = [
  { label: 'Projects', path: '/app/pm/projects', icon: 'bi-folder2-open', variant: 'primary' },
  { label: 'Tasks', path: '/app/pm/tasks', icon: 'bi-list-task', variant: 'success' },
  { label: 'Team', path: '/app/pm/team', icon: 'bi-people', variant: 'info' },
  { label: 'Timesheets', path: '/app/pm/timesheets', icon: 'bi-clock-history', variant: 'warning' },
  { label: 'Client Comm', path: '/app/pm/client-comms', icon: 'bi-chat-dots', variant: 'secondary' },
  { label: 'Invoices', path: '/app/pm/invoices', icon: 'bi-receipt', variant: 'dark' },
];

const panels = [
  {
    title: 'Project Management',
    items: [
      { label: 'Projects', to: '/app/pm/projects' },
      { label: 'Milestones', to: '/app/pm/milestones' },
      { label: 'Sprints', to: '/app/pm/sprints' },
      { label: 'Files', to: '/app/pm/files' },
      { label: 'Expenses', to: '/app/pm/expenses' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Tasks', to: '/app/pm/tasks' },
      { label: 'Team', to: '/app/pm/team' },
      { label: 'Timesheets', to: '/app/pm/timesheets' },
      { label: 'Performance', to: '/app/pm/performance' },
      { label: 'Reports', to: '/app/pm/reports' },
    ],
  },
  {
    title: 'Client & Finance',
    items: [
      { label: 'Clients', to: '/app/pm/clients' },
      { label: 'Client Communication', to: '/app/pm/client-comms' },
      { label: 'Invoices', to: '/app/pm/invoices' },
      { label: 'Subscriptions', to: '/app/pm/subscriptions' },
    ],
  },
  {
    title: 'Workspace',
    items: [
      { label: 'Approvals', to: '/app/pm/approvals' },
      { label: 'Calendar', to: '/app/pm/calendar' },
      { label: 'Notifications', to: '/app/pm/notifications' },
      { label: 'Company Settings', to: '/app/pm/settings' },
      { label: 'Profile', to: '/app/pm/profile' },
    ],
  },
];

export default function Dashboard() {
  return (
    <AdminPage title="Project Manager Dashboard" subtitle="Project and client management at a glance">
      {/* Stat cards - each clickable to its section */}
      <div className="row g-3 mb-4">
        {stats.map((s, i) => (
          <div className="col-6 col-md-4 col-xl-2" key={i}>
            <Link to={s.to} className="text-decoration-none">
              <div className={`card border-0 shadow-sm h-100 bg-${s.color} bg-opacity-10`} style={{ cursor: 'pointer' }}>
                <div className="card-body d-flex align-items-center gap-3">
                  <span className={`d-inline-flex align-items-center justify-content-center rounded-circle bg-${s.color} text-white`} style={{ width: 44, height: 44, fontSize: '1.25rem' }}>
                    <i className={`bi ${s.icon}`}></i>
                  </span>
                  <div>
                    <small className="text-uppercase text-muted fw-semibold" style={{ fontSize: '0.7rem' }}>{s.label}</small>
                    <h4 className="mb-0 fw-bold">{s.value}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick action buttons */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="mb-0 fw-bold">Quick Actions</h6>
        </div>
        <div className="card-body">
          <div className="d-flex gap-2 flex-wrap">
            {quickLinks.map((q, i) => (
              <Link key={i} to={q.path} className={`btn btn-${q.variant} d-flex align-items-center gap-2`}>
                <i className={`bi ${q.icon}`}></i>
                <span>{q.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Panel directory cards */}
      <div className="row g-3">
        {panels.map((p, i) => (
          <div className="col-md-6 col-xl-3" key={i}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h6 className="mb-0 fw-bold">{p.title}</h6>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  {p.items.map((it, j) => (
                    <li key={j} className="mb-2">
                      <Link to={it.to} className="text-decoration-none fw-semibold text-dark d-flex align-items-center gap-2">
                        <i className="bi bi-chevron-right text-muted"></i>
                        {it.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminPage>
  );
}
