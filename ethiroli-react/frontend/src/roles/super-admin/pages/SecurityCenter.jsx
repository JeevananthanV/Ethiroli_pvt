import React, { useState } from 'react';

export default function SecurityCenter() {
  const [threats, setThreats] = useState([
    { id: 1, type: 'BRUTE_FORCE_PREVENTION', sourceIp: '185.220.101.5', target: '/v1/auth/login', blockedAt: '15 mins ago', status: 'IP_BLOCKED' },
    { id: 2, type: 'UNAUTHORIZED_SCOPED_TOKEN', sourceIp: '194.26.29.112', target: '/v1/tenants/export', blockedAt: '1 hour ago', status: 'TOKEN_REVOKED' },
    { id: 3, type: 'RATE_LIMIT_EXCEEDED', sourceIp: '103.14.26.89', target: '/v1/role/navigation', blockedAt: '4 hours ago', status: 'THROTTLED' },
  ]);

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-shield-shaded text-primary" aria-hidden="true"></i>
            Global Security Center & Threat Defense
          </h2>
          <p className="text-secondary small mb-0">
            Real-time automated threat detection, multi-factor hardware policies, and anomalous login containment.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-slash-circle" aria-hidden="true"></i> Block CIDR Range
          </button>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-shield-check" aria-hidden="true"></i> Run Vulnerability Audit
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-success border-4">
            <span className="text-secondary small fw-semibold text-uppercase">Platform Security Posture</span>
            <h3 className="fw-bold text-success my-1">Grade A+</h3>
            <small className="text-muted">SOC2 & ISO 27001 Compliant</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-primary border-4">
            <span className="text-secondary small fw-semibold text-uppercase">2FA Global Adoption</span>
            <h3 className="fw-bold text-primary my-1">94.6%</h3>
            <small className="text-muted">Enforced on Admin roles</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-warning border-4">
            <span className="text-secondary small fw-semibold text-uppercase">Active Firewalled IPs</span>
            <h3 className="fw-bold text-warning my-1">18 IPs</h3>
            <small className="text-muted">Auto-blocked by WAF</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white border-start border-info border-4">
            <span className="text-secondary small fw-semibold text-uppercase">Active JWT Sessions</span>
            <h3 className="fw-bold text-info my-1">284 Sessions</h3>
            <small className="text-muted">Zero revocation anomalies</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
        <h5 className="fw-bold mb-3">Real-time WAF & Threat Interceptions</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Threat Pattern</th>
                <th>Source IP</th>
                <th>Target Endpoint</th>
                <th>Interception Time</th>
                <th>Automated Action</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {threats.map(t => (
                <tr key={t.id}>
                  <td>
                    <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 font-monospace">
                      {t.type}
                    </span>
                  </td>
                  <td><code>{t.sourceIp}</code></td>
                  <td><code className="text-muted">{t.target}</code></td>
                  <td className="small text-muted">{t.blockedAt}</td>
                  <td>
                    <span className="badge bg-dark">{t.status}</span>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-outline-secondary btn-sm py-1 px-2">Inspect Log</button>
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
