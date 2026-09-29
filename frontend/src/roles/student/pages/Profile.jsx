import React, { useCallback, useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getMe } from '../../../services/api/authApi.js';
import { updateMyProfile } from '../../../services/api/userApi.js';

/**
 * Student profile - loaded from GET /v1/auth/me and saved through
 * PATCH /v1/users/me (name / phone only; email & role are account-managed).
 */
export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '' });
  const [account, setAccount] = useState({ email: '', role: '', id: '' });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await getMe();
      const user = payload?.user || payload || {};
      setAccount({
        email: user.email || '',
        role: user.role || '',
        id: user.id || ''
      });
      setForm({
        full_name: user.full_name || '',
        phone: user.phone || ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const updated = await updateMyProfile({
        full_name: form.full_name.trim(),
        phone: form.phone.trim() || null
      });
      if (updated) {
        setForm({
          full_name: updated.full_name ?? form.full_name,
          phone: updated.phone ?? form.phone
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
      title="My Profile"
      subtitle="Manage your personal information"
      loading={loading}
      error={error}
      onRetry={loadProfile}
    >
      <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Student Profile</h3>
        </div>
        <div className="cardBody">
          <div
            className="formGroup"
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}
          >
            <div style={{ flex: '1 1 180px' }}>
              <label className="label">Registered Email</label>
              <input
                type="email"
                className="inputField"
                value={account.email}
                readOnly
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
              <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--admin-text-muted)' }}>
                Email changes are handled by the academy office.
              </p>
            </div>
            <div style={{ flex: '0 1 140px' }}>
              <label className="label">Role</label>
              <input type="text" className="inputField" value={account.role} readOnly disabled style={{ opacity: 0.7 }} />
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label className="label required">Full Name</label>
              <input
                type="text"
                className="inputField"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
                minLength={2}
              />
            </div>
            <div className="formGroup">
              <label className="label">Phone</label>
              <input
                type="tel"
                className="inputField"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 ..."
              />
            </div>

            {saveError && (
              <p style={{ margin: '0 0 10px', fontSize: 13, color: '#ff5252' }}>{saveError}</p>
            )}
            {saved && (
              <p style={{ margin: '0 0 10px', fontSize: 13, color: '#2e7d32' }}>
                Profile saved.
              </p>
            )}

            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </AdminPage>
  );
}
