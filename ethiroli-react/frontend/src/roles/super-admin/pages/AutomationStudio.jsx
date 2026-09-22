import React, { useState } from 'react';

export default function AutomationStudio() {
  const [automations, setAutomations] = useState([
    { id: 1, name: 'Tenant Onboarding Pipeline', trigger: 'Tenant Registration Created', actions: 4, executions: 142, status: 'ACTIVE', lastRun: '12 mins ago' },
    { id: 2, name: 'Failed Invoice Auto-Retry & Dunning', trigger: 'Invoice Payment Failed', actions: 3, executions: 29, status: 'ACTIVE', lastRun: '2 hours ago' },
    { id: 3, name: 'Database Snapshot & S3 Sync', trigger: 'Daily Schedule (00:00 UTC)', actions: 2, executions: 365, status: 'ACTIVE', lastRun: 'Today 00:00' },
    { id: 4, name: 'Security Anomaly Isolation', trigger: 'High Severity Audit Event', actions: 5, executions: 4, status: 'PAUSED', lastRun: '3 days ago' },
  ]);

  const toggleStatus = (id) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : a));
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-robot text-primary" aria-hidden="true"></i>
            Platform Automation Studio
          </h2>
          <p className="text-secondary small mb-0">
            Design, monitor, and deploy cross-tenant automated event triggers, cron jobs, and webhooks.
          </p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-plus-lg" aria-hidden="true"></i> Build Workflow
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Active Workflows</span>
            <h3 className="fw-bold text-primary my-1">3 Running</h3>
            <small className="text-muted">1 paused</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Total Executions</span>
            <h3 className="fw-bold text-success my-1">540 Runs</h3>
            <small className="text-success">99.8% success rate</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Average Latency</span>
            <h3 className="fw-bold text-info my-1">142ms</h3>
            <small className="text-muted">Sub-second execution</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Webhook Handlers</span>
            <h3 className="fw-bold text-dark my-1">12 Endpoints</h3>
            <small className="text-muted">Active event dispatchers</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
        <h5 className="fw-bold mb-3">Configured Workflows</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Workflow Name</th>
                <th>Trigger Event</th>
                <th>Actions</th>
                <th>Total Executions</th>
                <th>Last Run</th>
                <th>Status</th>
                <th className="text-end">Controls</th>
              </tr>
            </thead>
            <tbody>
              {automations.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="fw-bold text-dark">{a.name}</div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border font-monospace">{a.trigger}</span>
                  </td>
                  <td>
                    <span className="badge bg-secondary bg-opacity-25 text-dark">{a.actions} actions</span>
                  </td>
                  <td className="fw-semibold">{a.executions}</td>
                  <td className="small text-muted">{a.lastRun}</td>
                  <td>
                    <span className={`badge ${a.status === 'ACTIVE' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button 
                      onClick={() => toggleStatus(a.id)}
                      className={`btn btn-sm ${a.status === 'ACTIVE' ? 'btn-outline-warning' : 'btn-outline-success'} me-2`}
                    >
                      {a.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                    </button>
                    <button className="btn btn-outline-primary btn-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
