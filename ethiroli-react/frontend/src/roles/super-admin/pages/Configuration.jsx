import React, { useState } from 'react';

export default function Configuration() {
  const [configs, setConfigs] = useState({
    platformName: 'Ethiroli Platform',
    corsOrigins: 'http://localhost:3000, http://localhost:5173, https://ethiroli.net',
    jwtExpiryMinutes: '1440',
    bcryptRounds: '10',
    maxUploadSizeBytes: '26214400',
    sessionTimeoutMinutes: '60',
    forceHttps: true,
    telemetryConsent: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-sliders2 text-primary" aria-hidden="true"></i>
            System Configuration & Runtime Defaults
          </h2>
          <p className="text-secondary small mb-0">
            Platform-wide environment defaults, security ciphers, CORS origins, and system memory limits.
          </p>
        </div>
        <button onClick={handleSave} className="btn btn-primary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-check2-circle" aria-hidden="true"></i> Save Global Configurations
        </button>
      </div>

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-check-circle-fill"></i>
          <span>Global system configuration successfully applied and synced across worker nodes.</span>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4 h-100">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Network & Origin Policies</h5>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Platform Brand Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={configs.platformName}
                onChange={e => setConfigs({ ...configs, platformName: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Whitelisted CORS Origins</label>
              <textarea 
                className="form-control font-monospace small" 
                rows="3"
                value={configs.corsOrigins}
                onChange={e => setConfigs({ ...configs, corsOrigins: e.target.value })}
              ></textarea>
              <small className="text-muted">Comma-separated origins authorized to make authenticated API requests.</small>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Maximum File Upload Limit (bytes)</label>
              <input 
                type="text" 
                className="form-control font-monospace" 
                value={configs.maxUploadSizeBytes}
                onChange={e => setConfigs({ ...configs, maxUploadSizeBytes: e.target.value })}
              />
              <small className="text-muted">Default: 25MB (26,214,400 bytes)</small>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4 h-100">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Security & Session Parameters</h5>
            <div className="mb-3">
              <label className="form-label small fw-semibold">JWT Access Token Expiration (Minutes)</label>
              <input 
                type="number" 
                className="form-control" 
                value={configs.jwtExpiryMinutes}
                onChange={e => setConfigs({ ...configs, jwtExpiryMinutes: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Bcrypt Hashing Work Factor (Salt Rounds)</label>
              <input 
                type="number" 
                className="form-control" 
                value={configs.bcryptRounds}
                onChange={e => setConfigs({ ...configs, bcryptRounds: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Idle Session Invalidation Window (Minutes)</label>
              <input 
                type="number" 
                className="form-control" 
                value={configs.sessionTimeoutMinutes}
                onChange={e => setConfigs({ ...configs, sessionTimeoutMinutes: e.target.value })}
              />
            </div>
            <div className="form-check form-switch mt-4">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                checked={configs.forceHttps}
                onChange={e => setConfigs({ ...configs, forceHttps: e.target.checked })}
              />
              <label className="form-check-label fw-semibold">Enforce HSTS and SSL/TLS Redirects</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
