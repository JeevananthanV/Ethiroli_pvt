import React, { useState } from 'react';

export default function Marketplace() {
  const [plugins, setPlugins] = useState([
    { id: 'plugin-ai', name: 'Gemini AI Telemetry & Copilot', author: 'Google Deepmind / Ethiroli', downloads: '1.2k', status: 'ACTIVE', category: 'Artificial Intelligence' },
    { id: 'plugin-stripe', name: 'Stripe Global Payments Connector', author: 'Ethiroli Core', downloads: '3.4k', status: 'ACTIVE', category: 'Fintech & Billing' },
    { id: 'plugin-whatsapp', name: 'Meta Cloud WhatsApp Gateway', author: 'Ethiroli Core', downloads: '2.8k', status: 'ACTIVE', category: 'Communications' },
    { id: 'plugin-slack', name: 'Slack Ops Notification Bot', author: 'Community', downloads: '890', status: 'AVAILABLE', category: 'Collaboration' },
  ]);

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-shop text-primary" aria-hidden="true"></i>
            Platform Marketplace & Extension Hub
          </h2>
          <p className="text-secondary small mb-0">
            Publish, curate, and review platform extensions, ecosystem connectors, and third-party plugins.
          </p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-cloud-upload" aria-hidden="true"></i> Publish New Extension
        </button>
      </div>

      <div className="row g-4">
        {plugins.map(p => (
          <div key={p.id} className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-4 bg-white h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge bg-light text-primary border">{p.category}</span>
                <span className={`badge ${p.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                  {p.status}
                </span>
              </div>
              <h5 className="fw-bold text-dark mt-2 mb-1">{p.name}</h5>
              <small className="text-muted mb-3">By {p.author}</small>
              <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                <span className="small text-muted"><i className="bi bi-download me-1"></i>{p.downloads} installs</span>
                <button className="btn btn-outline-primary btn-sm">Manage</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
