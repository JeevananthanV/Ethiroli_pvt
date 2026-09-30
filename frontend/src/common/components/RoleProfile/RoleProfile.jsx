import React, { useState, useEffect } from 'react';
import AdminPage from '../AdminPage/AdminPage.jsx';
import AvatarUploader from '../AvatarUploader/AvatarUploader.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { updateMyProfile } from '../../../services/api/userApi.js';
import { changePassword as apiChangePassword } from '../../../services/api/authApi.js';

export default function RoleProfile({ title = 'My Account Profile', subtitle = 'Manage your identity, profile picture, contact credentials, and security preferences' }) {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
    avatar_url: user?.avatar_url || ''
  });

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Password state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || prev.full_name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        role: user.role || prev.role,
        avatar_url: user.avatar_url || ''
      }));
    }
  }, [user]);

  const handleAvatarChange = async (newAvatar) => {
    setFormData(prev => ({ ...prev, avatar_url: newAvatar || '' }));
    try {
      await updateMyProfile({ avatar_url: newAvatar || '' });
      updateProfile({ avatar_url: newAvatar || null });
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to update profile picture.');
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const payload = {
        full_name: formData.full_name.trim(),
        phone: formData.phone ? formData.phone.trim() : null,
        avatar_url: formData.avatar_url || null
      };
      await updateMyProfile(payload);
      updateProfile(payload);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to update profile information.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwdMsg({ type: 'danger', text: 'New password and confirmation do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPwdMsg({ type: 'danger', text: 'New password must be at least 6 characters.' });
      return;
    }
    setPwdSaving(true);
    setPwdMsg({ type: '', text: '' });
    try {
      await apiChangePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPwdMsg({ type: 'success', text: 'Password successfully changed!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdMsg({ type: 'danger', text: err?.response?.data?.message || err.message || 'Failed to change password.' });
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <AdminPage title={title} subtitle={subtitle}>
      <div className="row g-4">
        {/* Left Card: Avatar & Summary */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white text-center">
            <div className="mb-3">
              <AvatarUploader
                value={formData.avatar_url}
                onChange={handleAvatarChange}
                name={formData.full_name || 'User'}
                size={110}
              />
            </div>
            <h5 className="fw-bold mb-1 text-dark">{formData.full_name || 'Portal User'}</h5>
            <p className="text-muted small mb-3">{formData.email}</p>
            <div className="mb-3">
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1">
                ROLE: {String(formData.role || 'USER').replace(/_/g, ' ')}
              </span>
            </div>

            <hr className="my-3 opacity-25" />

            <div className="text-start small">
              <div className="d-flex justify-content-between py-2 border-bottom text-muted">
                <span>Account Status</span>
                <span className="badge bg-success">Active & Verified</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom text-muted">
                <span>Contact Phone</span>
                <span className="fw-semibold text-dark">{formData.phone || 'Not configured'}</span>
              </div>
              <div className="d-flex justify-content-between py-2 text-muted">
                <span>Session Security</span>
                <span className="text-dark font-monospace">TLS 1.3 / Enforced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Identity Details & Security */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Profile Information</h5>

            {savedMsg && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-3" role="alert">
                <i className="bi bi-check-circle-fill"></i>
                <span>Profile details updated successfully!</span>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveInfo}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Legal Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    minLength={2}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Official Email Address (Read-Only)</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={formData.email}
                    disabled
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Primary Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Assigned Portal Role</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={formData.role}
                    disabled
                  />
                </div>
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Security & Password Section */}
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold mb-0">Password & Security</h5>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowPasswordSection(prev => !prev)}
              >
                {showPasswordSection ? 'Hide Change Password' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection && (
              <form onSubmit={handleChangePassword}>
                {pwdMsg.text && (
                  <div className={`alert alert-${pwdMsg.type} d-flex align-items-center gap-2 mb-3`} role="alert">
                    <i className={`bi bi-${pwdMsg.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}`}></i>
                    <span>{pwdMsg.text}</span>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-danger px-4 shadow-sm" disabled={pwdSaving}>
                    {pwdSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

            {!showPasswordSection && (
              <p className="text-muted small mb-0">
                To update your master login password or review authentication credentials, click &ldquo;Change Password&rdquo; above.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
