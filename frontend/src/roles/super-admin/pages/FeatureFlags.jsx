import React, { useState } from 'react';

export default function FeatureFlags() {
  const [flags, setFlags] = useState([
    { key: 'enable_ai_analytics', name: 'Gemini AI Telemetry', description: 'Enables predictive analytics and curriculum assistant across tenants.', rollout: '100%', status: true, environment: 'PROD' },
    { key: 'enable_stripe_billing', name: 'Stripe International Gateway', description: 'Allows USD and international credit card settlements.', rollout: '50%', status: true, environment: 'PROD' },
    { key: 'enable_gamification_v2', name: 'Gamification Badges v2.0', description: 'New leaderboard algorithms and seasonal streak challenges.', rollout: '25%', status: true, environment: 'CANARY' },
    { key: 'enable_dark_mode_global', name: 'Global OLED Dark Theme', description: 'Platform-wide dark theme toggle for high-density portals.', rollout: '100%', status: true, environment: 'PROD' },
    { key: 'enable_quantum_encryption', name: 'Post-Quantum TLS Handshakes', description: 'Experimental quantum-resistant cipher suite for tenant data.', rollout: '0%', status: false, environment: 'STAGING' },
  ]);

  const toggleFlag = (key) => {
    setFlags(prev => prev.map(f => f.key === key ? { ...f, status: !f.status } : f));
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-toggles text-primary" aria-hidden="true"></i>
            Global Feature Flags & Canary Releases
          </h2>
          <p className="text-secondary small mb-0">
            Dynamically toggle platform features, tenant rollout percentages, and canary deployments without code deployment.
          </p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-plus-lg" aria-hidden="true"></i> Create Feature Flag
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
        <h5 className="fw-bold mb-3">Feature Flag Toggles</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Feature Flag Name & Key</th>
                <th>Description</th>
                <th>Environment</th>
                <th>Rollout %</th>
                <th>Live Status</th>
                <th className="text-end">Toggle</th>
              </tr>
            </thead>
            <tbody>
              {flags.map(f => (
                <tr key={f.key}>
                  <td>
                    <div className="fw-bold text-dark">{f.name}</div>
                    <code className="text-muted font-monospace small">{f.key}</code>
                  </td>
                  <td className="small text-secondary">{f.description}</td>
                  <td>
                    <span className={`badge ${f.environment === 'PROD' ? 'bg-primary' : f.environment === 'CANARY' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                      {f.environment}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{ height: '6px', width: '60px' }}>
                        <div className="progress-bar bg-success" style={{ width: f.rollout }}></div>
                      </div>
                      <small className="fw-semibold">{f.rollout}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${f.status ? 'bg-success' : 'bg-danger'}`}>
                      {f.status ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="form-check form-switch d-inline-block">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch"
                        checked={f.status}
                        onChange={() => toggleFlag(f.key)}
                      />
                    </div>
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
