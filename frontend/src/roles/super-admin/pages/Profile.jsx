import React, { useState } from 'react';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.full_name || 'Super Administrator',
    email: user?.email || 'admin@ethiroli.com',
    role: 'SUPER_ADMIN',
    scope: 'Global Platform Root',
    twoFactorEnabled: true,
    notificationEmail: true,
    hardwareKeyAuth: true,
  });

  const [saved, setSaved] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container-fluid p-3 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-person-circle text-primary" aria-hidden="true"></i>
            Super Admin Profile & Security Credentials
          </h2>
          <p className="text-secondary small mb-0">
            Root account credentials, hardware 2FA keys, active administrative sessions, and access audits.
          </p>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-2" role="alert">
          <i className="bi bi-check-circle-fill"></i>
          <span>Super Admin credentials and security preferences updated successfully.</span>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3 text-center">
            <div 
              className="rounded-circle bg-primary bg-gradient d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-3 shadow"
              style={{ width: '80px', height: '80px', fontSize: '2rem' }}
            >
              {profile.fullName.charAt(0)}
            </div>
            <h4 className="fw-bold text-dark mb-1">{profile.fullName}</h4>
            <p className="text-muted small mb-2">{profile.email}</p>
            <div className="d-flex justify-content-center gap-2 mb-3">
              <span className="badge bg-danger">SUPER_ADMIN</span>
              <span className="badge bg-dark font-monospace">PLATFORM_ROOT</span>
            </div>

            <hr className="my-3 opacity-25" />

            <div className="text-start">
              <div className="d-flex justify-content-between small text-muted py-2 border-bottom">
                <span>Account Status:</span>
                <span className="badge bg-success">Active & Verified</span>
              </div>
              <div className="d-flex justify-content-between small text-muted py-2 border-bottom">
                <span>Security Clearance:</span>
                <span className="fw-semibold text-dark">Level 5 (Unrestricted)</span>
              </div>
              <div className="d-flex justify-content-between small text-muted py-2 border-bottom">
                <span>Hardware 2FA:</span>
                <span className="text-success fw-semibold"><i className="bi bi-shield-check me-1"></i>Enforced (YubiKey)</span>
              </div>
              <div className="d-flex justify-content-between small text-muted py-2">
                <span>Current Session:</span>
                <span className="text-dark font-monospace">TLS 1.3 / Verified JWT</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Profile & Security Settings</h5>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Legal Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={profile.fullName}
                  onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Platform Email Address</label>
                <input 
                  type="email" 
                  className="form-control"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div className="form-check form-switch mt-4 mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  role="switch"
                  checked={profile.twoFactorEnabled}
                  onChange={e => setProfile({ ...profile, twoFactorEnabled: e.target.checked })}
                />
                <label className="form-check-label fw-semibold">Require Multi-Factor Authentication on every login</label>
              </div>

              <div className="form-check form-switch mb-2">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  role="switch"
                  checked={profile.notificationEmail}
                  onChange={e => setProfile({ ...profile, notificationEmail: e.target.checked })}
                />
                <label className="form-check-label fw-semibold">Receive critical platform outage & security alerts via email</label>
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
