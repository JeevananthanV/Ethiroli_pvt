import React, { useState } from 'react';

export default function Messaging() {
  const [providers, setProviders] = useState([
    { id: 'smtp', name: 'Transactional SMTP (Amazon SES / SendGrid)', type: 'EMAIL', status: 'CONNECTED', throughput: '12,450/day', latency: '42ms' },
    { id: 'sms', name: 'Twilio SMS & OTP Gateway', type: 'SMS', status: 'CONNECTED', throughput: '4,280/day', latency: '120ms' },
    { id: 'whatsapp', name: 'Meta WhatsApp Cloud Business API', type: 'WHATSAPP', status: 'CONNECTED', throughput: '8,920/day', latency: '85ms' },
    { id: 'gupshup', name: 'Gupshup Regional Gateway', type: 'SMS', status: 'STANDBY', throughput: '0/day', latency: '--' },
  ]);

  return (
    <div className="container-fluid p-3 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-chat-left-text text-primary" aria-hidden="true"></i>
            Platform Messaging & Communication Gateways
          </h2>
          <p className="text-secondary small mb-0">
            Multi-channel dispatch infrastructure for transactional emails, OTP SMS, and WhatsApp Business API.
          </p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-plus-lg" aria-hidden="true"></i> Add Provider Gateway
        </button>
      </div>

      <div className="row g-4">
        {providers.map(prov => (
          <div key={prov.id} className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <span className={`badge ${prov.type === 'EMAIL' ? 'bg-primary' : prov.type === 'SMS' ? 'bg-info text-dark' : 'bg-success'}`}>
                  {prov.type}
                </span>
                <span className={`badge ${prov.status === 'CONNECTED' ? 'bg-success' : 'bg-secondary'}`}>
                  {prov.status}
                </span>
              </div>
              <h6 className="fw-bold text-dark mb-2">{prov.name}</h6>
              <div className="mt-auto pt-3 border-top">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Throughput:</span>
                  <span className="fw-semibold text-dark">{prov.throughput}</span>
                </div>
                <div className="d-flex justify-content-between small text-muted">
                  <span>Avg Latency:</span>
                  <span className="fw-semibold text-dark">{prov.latency}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white p-3 mt-4">
        <h5 className="fw-bold mb-3">Global Dispatch Quotas & Routing Rules</h5>
        <p className="text-secondary small mb-2">
          Configure default fallback carriers, rate-limiting per tenant, and regulatory opt-out suppression lists.
        </p>

        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Primary OTP Channel</label>
            <select className="form-select form-select-sm" defaultValue="SMS">
              <option value="SMS">Twilio SMS & OTP</option>
              <option value="WHATSAPP">WhatsApp Cloud API</option>
              <option value="EMAIL">Transactional Email Only</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Per-Tenant Rate Limit</label>
            <select className="form-select form-select-sm" defaultValue="1000">
              <option value="500">500 messages / min</option>
              <option value="1000">1,000 messages / min</option>
              <option value="5000">5,000 messages / min (Enterprise)</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">DND & Opt-Out Handling</label>
            <select className="form-select form-select-sm" defaultValue="STRICT">
              <option value="STRICT">Strict DND Compliance (TRAI/TCPA)</option>
              <option value="RELAXED">Transactional Exemption Mode</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
