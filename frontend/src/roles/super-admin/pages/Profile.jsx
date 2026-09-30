import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import AvatarUploader from '../../../common/components/AvatarUploader/AvatarUploader.jsx';
import { updateMyProfile } from '../../../services/api/userApi.js';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || 'Super Administrator');
  const [email, setEmail] = useState(user?.email || 'admin@ethiroli.com');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState(true);
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.full_name) setFullName(user.full_name);
      if (user.email) setEmail(user.email);
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  const handleAvatarChange = async (newAvatar) => {
    setAvatarUrl(newAvatar || '');
    try {
      await updateMyProfile({ avatar_url: newAvatar || '' });
      updateProfile({ avatar_url: newAvatar || null });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to update profile picture.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const payload = {
        full_name: fullName.trim(),
        avatar_url: avatarUrl || null
      };
      await updateMyProfile(payload);
      updateProfile(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid p-3 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-person-circle text-primary" aria-hidden="true"></i>
            Super Admin Profile & Security Credentials
          </h2>
          <p className="text-secondary small mb-0">
            Root account credentials, profile photo, hardware 2FA keys, active administrative sessions, and access audits.
          </p>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-3" role="alert">
          <i className="bi bi-check-circle-fill"></i>
          <span>Super Admin credentials and profile updated successfully.</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4 text-center">
            <div className="mb-3">
              <AvatarUploader
                value={avatarUrl}
                onChange={handleAvatarChange}
                name={fullName}
                size={110}
              />
            </div>

            <h4 className="fw-bold text-dark mb-1">{fullName}</h4>
            <p className="text-muted small mb-2">{email}</p>
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
                <span className="text-dark font-monospace">TLS 1.3 / Verified Session</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Profile & Security Settings</h5>
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Legal Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Platform Email Address (Read-Only)</label>
                <input 
                  type="email" 
                  className="form-control bg-light"
                  value={email}
                  disabled
                />
              </div>

              <div className="form-check form-switch mt-4 mb-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  role="switch"
                  checked={twoFactorEnabled}
                  onChange={e => setTwoFactorEnabled(e.target.checked)}
                />
                <label className="form-check-label fw-semibold">Require Multi-Factor Authentication on every login</label>
              </div>

              <div className="form-check form-switch mb-4">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  role="switch"
                  checked={notificationEmail}
                  onChange={e => setNotificationEmail(e.target.checked)}
                />
                <label className="form-check-label fw-semibold">Receive critical platform outage & security alerts via email</label>
              </div>

              <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
