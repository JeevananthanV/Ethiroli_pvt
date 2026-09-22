import React, { useState } from 'react';

export default function DeveloperPortal() {
  const [apiKeys, setApiKeys] = useState([
    { id: 'key-live-01', name: 'Production Mobile App Key', prefix: 'eth_live_8912...', created: '2026-08-10', status: 'ACTIVE', requests24h: '42,910' },
    { id: 'key-live-02', name: 'CRM Zapier Integration', prefix: 'eth_live_4491...', created: '2026-08-15', status: 'ACTIVE', requests24h: '18,340' },
    { id: 'key-test-01', name: 'Staging Sandbox Key', prefix: 'eth_test_0019...', created: '2026-09-01', status: 'ACTIVE', requests24h: '1,420' },
  ]);

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-code-slash text-primary" aria-hidden="true"></i>
            Platform Developer Portal & API Management
          </h2>
          <p className="text-secondary small mb-0">
            OpenAPI v3 specifications, platform API keys, webhook endpoints, and rate-limit policies.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-journal-code" aria-hidden="true"></i> OpenAPI Docs
          </button>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-key-fill" aria-hidden="true"></i> Generate API Key
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Total API Calls (24h)</span>
            <h3 className="fw-bold text-primary my-1">62,670</h3>
            <small className="text-success"><i className="bi bi-arrow-up me-1"></i>+8.4% traffic growth</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">P99 Response Time</span>
            <h3 className="fw-bold text-success my-1">38ms</h3>
            <small className="text-muted">Edge CDN accelerated</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">API Error Rate (5xx)</span>
            <h3 className="fw-bold text-success my-1">0.02%</h3>
            <small className="text-muted">Within 99.9% SLA target</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <span className="text-secondary small fw-semibold text-uppercase">Active API Keys</span>
            <h3 className="fw-bold text-dark my-1">3 Live Keys</h3>
            <small className="text-muted">Scoped with JWT tokens</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
        <h5 className="fw-bold mb-3">Provisioned Platform API Keys</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Key Name / Client</th>
                <th>Token Prefix</th>
                <th>Created Date</th>
                <th>24h Requests</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map(k => (
                <tr key={k.id}>
                  <td className="fw-semibold text-dark">{k.name}</td>
                  <td>
                    <code className="text-primary font-monospace">{k.prefix}</code>
                  </td>
                  <td className="small text-muted">{k.created}</td>
                  <td className="fw-semibold">{k.requests24h}</td>
                  <td>
                    <span className="badge bg-success">{k.status}</span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-outline-danger btn-sm py-1 px-2">Revoke</button>
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
