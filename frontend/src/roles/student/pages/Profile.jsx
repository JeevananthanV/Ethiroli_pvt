import React, { useCallback, useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import AvatarUploader from '../../../common/components/AvatarUploader/AvatarUploader.jsx';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import { getMe } from '../../../services/api/authApi.js';
import { updateMyProfile } from '../../../services/api/userApi.js';

export default function StudentProfile() {
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', avatar_url: '' });
  const [account, setAccount] = useState({ email: '', role: '', id: '' });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await getMe();
      const user = payload?.data?.user || payload?.user || payload || {};
      setAccount({
        email: user.email || '',
        role: user.role || 'STUDENT',
        id: user.id || ''
      });
      setForm({
        full_name: user.full_name || '',
        phone: user.phone || '',
        avatar_url: user.avatar_url || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load your profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAvatarChange = async (newAvatar) => {
    setForm(prev => ({ ...prev, avatar_url: newAvatar || '' }));
    try {
      await updateMyProfile({ avatar_url: newAvatar || '' });
      updateProfile({ avatar_url: newAvatar || null });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || 'Could not update profile picture.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const updated = await updateMyProfile({
        full_name: form.full_name.trim(),
        phone: form.phone.trim() || null,
        avatar_url: form.avatar_url || null
      });
      if (updated) {
        updateProfile({
          full_name: form.full_name.trim(),
          phone: form.phone.trim() || null,
          avatar_url: form.avatar_url || null
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="My Student Profile"
      subtitle="Manage your student identity, avatar photo, and contact information"
      loading={loading}
      error={error}
      onRetry={loadProfile}
    >
      <div className="row g-4 justify-content-center">
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 text-center p-3 bg-white rounded-3">
            <div className="mb-3">
              <AvatarUploader
                value={form.avatar_url}
                onChange={handleAvatarChange}
                name={form.full_name || 'Student'}
                size={110}
              />
            </div>
            <h5 className="fw-bold mb-1 text-dark">{form.full_name || 'Student'}</h5>
            <p className="text-muted small mb-2">{account.email}</p>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1">
              ROLE: {account.role}
            </span>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-3 bg-white rounded-3">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Edit Student Details</h5>

            {saveError && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{saveError}</span>
              </div>
            )}
            {saved && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-check-circle-fill"></i>
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Legal Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    required
                    minLength={2}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Registered Email (Read-Only)</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={account.email}
                    disabled
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
