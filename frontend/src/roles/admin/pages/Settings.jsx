import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('GENERAL');
  const [saving, setSaving] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);

  const [settings, setSettings] = useState({
    org_name: 'Ethiroli Academy & Technical Solutions',
    tagline: 'Enterprise EdTech, Research & Skill Development',
    support_email: 'admin@ethiroli.org',
    support_phone: '+91 44 2450 8899',
    campus_address: '12, Tech Corridor, OMR Road, Chennai - 600096, Tamil Nadu, India',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST +5:30)',
    working_hours: '08:30 AM - 06:00 PM',
    enforce_2fa: true,
    session_timeout_minutes: 60,
    smtp_host: 'smtp.sendgrid.net',
    sms_gateway: 'Enabled (Karix Telecom)',
    whatsapp_api: 'Connected (Cloud API v19.0)'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 3000);
    }, 600);
  };

  return (
    <AdminPage
      title="Organization Settings & Configuration"
      subtitle="Organization profile, business operational parameters, academic year rules, and security compliance policies"
    >
      {savedAlert && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-2 shadow-sm">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div><strong>Settings Updated!</strong> Organization configurations have been synchronized successfully.</div>
        </div>
      )}

      {/* Tabs */}
      <div className="d-flex gap-2 mb-2 border-bottom pb-2">
        <button
          className={`btn btn-sm ${activeTab === 'GENERAL' ? 'btn-primary' : 'btn-light'}`}
          onClick={() => setActiveTab('GENERAL')}
        >
          <i className="bi bi-building me-1"></i> Organization Profile
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'OPERATIONS' ? 'btn-primary' : 'btn-light'}`}
          onClick={() => setActiveTab('OPERATIONS')}
        >
          <i className="bi bi-sliders me-1"></i> Academic & Ops Rules
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'SECURITY' ? 'btn-primary' : 'btn-light'}`}
          onClick={() => setActiveTab('SECURITY')}
        >
          <i className="bi bi-shield-lock me-1"></i> Security & Access
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'CHANNELS' ? 'btn-primary' : 'btn-light'}`}
          onClick={() => setActiveTab('CHANNELS')}
        >
          <i className="bi bi-hdd-network me-1"></i> Integration Channels
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-2">
          {activeTab === 'GENERAL' && (
            <div>
              <h5 className="fw-bold text-dark mb-3">Company / Institution Profile</h5>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Organization Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.org_name}
                    onChange={(e) => setSettings({ ...settings, org_name: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Tagline / Motto</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Primary Support Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={settings.support_email}
                    onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Support Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={settings.support_phone}
                    onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Main Campus Physical Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={settings.campus_address}
                    onChange={(e) => setSettings({ ...settings, campus_address: e.target.value })}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'OPERATIONS' && (
            <div>
              <h5 className="fw-bold text-dark mb-3">Academic & Operational Parameters</h5>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Primary Currency</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Timezone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Standard Operating Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.working_hours}
                    onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">Default Passing Grade Threshold (%)</label>
                  <input type="number" className="form-control" defaultValue="70" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div>
              <h5 className="fw-bold text-dark mb-3">Security & Compliance Policies</h5>
              <div className="row g-3">
                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="2faSwitch"
                      checked={settings.enforce_2fa}
                      onChange={(e) => setSettings({ ...settings, enforce_2fa: e.target.checked })}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="2faSwitch">
                      Enforce Multi-Factor Authentication (2FA) for All Administrative & Faculty Accounts
                    </label>
                  </div>
                  <small className="text-muted d-block ps-4">Requires authenticator app TOTP verification on each session sign-in.</small>
                </div>
                <div className="col-12 col-md-6 mt-3">
                  <label className="form-label small fw-semibold">Inactivity Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.session_timeout_minutes}
                    onChange={(e) => setSettings({ ...settings, session_timeout_minutes: Number(e.target.value) })}
                  />
                </div>
                <div className="col-12 col-md-6 mt-3">
                  <label className="form-label small fw-semibold">Password Expiration Cycle</label>
                  <select className="form-select">
                    <option value="90">Every 90 Days (Recommended)</option>
                    <option value="180">Every 180 Days</option>
                    <option value="365">Once a Year</option>
                    <option value="NEVER">Never Expire</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CHANNELS' && (
            <div>
              <h5 className="fw-bold text-dark mb-3">Communication & Hardware Integrations</h5>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="p-3 border rounded-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark"><i className="bi bi-envelope-at me-2 text-primary"></i>SMTP Email Gateway</span>
                      <span className="badge bg-success">Active</span>
                    </div>
                    <small className="text-muted font-monospace">{settings.smtp_host}</small>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-3 border rounded-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark"><i className="bi bi-chat-dots me-2 text-info"></i>SMS Broadcast Gateway</span>
                      <span className="badge bg-success">Active</span>
                    </div>
                    <small className="text-muted">{settings.sms_gateway}</small>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-3 border rounded-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark"><i className="bi bi-whatsapp me-2 text-success"></i>WhatsApp Cloud API</span>
                      <span className="badge bg-success">Connected</span>
                    </div>
                    <small className="text-muted">{settings.whatsapp_api}</small>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-3 border rounded-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark"><i className="bi bi-upc-scan me-2 text-warning"></i>RFID Gate Turnstiles</span>
                      <span className="badge bg-success">Online (Gate 1 & 2)</span>
                    </div>
                    <small className="text-muted">Biometric synchronization active</small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={saving}>
            {saving ? 'Saving...' : 'Save Organization Settings'}
          </button>
        </div>
      </form>
    </AdminPage>
  );
}
