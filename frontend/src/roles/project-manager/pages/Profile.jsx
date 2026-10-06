import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import AvatarUploader from '../../../common/components/AvatarUploader/AvatarUploader.jsx';
import { useAuth } from '../../../common/hooks/useAuth';
import { updateMyProfile } from '../../../services/api/userApi.js';

export default function PMProfile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || 'Project Manager',
    email: user?.email || 'pm@ethiroli.com',
    phone: user?.phone || '+91 98765 43210',
    avatar_url: user?.avatar_url || '',
    department: 'Engineering Operations',
    designation: 'Senior Technical Project Manager'
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || prev.full_name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        avatar_url: user.avatar_url || ''
      }));
    }
  }, [user]);

  const handleAvatarChange = async (newAvatar) => {
    setFormData(prev => ({ ...prev, avatar_url: newAvatar || '' }));
    try {
      await updateMyProfile({ avatar_url: newAvatar || '' });
      updateProfile({ avatar_url: newAvatar || null });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore avatar update error */ }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        avatar_url: formData.avatar_url || null
      });
      updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        avatar_url: formData.avatar_url || null
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore profile save error */ }
    setSaving(false);
  };

  return (
    <AdminPage
      title="Manager Profile & Security"
      subtitle="Personal information, assigned portfolio governance, and security credentials"
    >
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white text-center">
            <div className="mb-3">
              <AvatarUploader
                value={formData.avatar_url}
                onChange={handleAvatarChange}
                name={formData.full_name}
                size={100}
              />
            </div>
            <h5 className="fw-bold mb-1 text-dark">{formData.full_name}</h5>
            <small className="text-muted d-block mb-3">{formData.designation}</small>
            <span className="badge bg-primary bg-opacity-10 text-primary">ROLE: PROJECT_MANAGER</span>

            <hr className="my-3 opacity-25" />

            <div className="text-start small">
              <div className="mb-2"><i className="bi bi-envelope me-2 text-muted"></i>{formData.email}</div>
              <div className="mb-2"><i className="bi bi-telephone me-2 text-muted"></i>{formData.phone}</div>
              <div><i className="bi bi-building me-2 text-muted"></i>{formData.department}</div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <h6 className="fw-bold mb-3 border-bottom pb-2">Update Profile Details</h6>
            {saved && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-check-circle-fill"></i>
                <span>Profile details updated successfully!</span>
              </div>
            )}
            <form onSubmit={handleSave}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Legal Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email Address (Read-Only)</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    disabled
                    value={formData.email}
                  />
                </div>
              </div>

              <div className="row g-3 mb-2">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Designation Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
