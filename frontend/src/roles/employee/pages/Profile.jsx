import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import AvatarUploader from '../../../common/components/AvatarUploader/AvatarUploader.jsx';
import { useAuth } from '../../../common/contexts/AuthContext.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';

export default function Profile() {
  const { updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    avatar_url: ''
  });

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getMyProfile();
      const data = res?.data || res;
      setProfile(data);
      if (data?.user) {
        setFormData({
          full_name: data.user.full_name || '',
          phone: data.user.phone || '',
          avatar_url: data.user.avatar_url || ''
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load employee profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAvatarChange = async (newAvatar) => {
    setFormData(prev => ({ ...prev, avatar_url: newAvatar || '' }));
    try {
      await employeePortalApi.updateMyProfile({ avatar_url: newAvatar || '' });
      updateProfile({ avatar_url: newAvatar || null });
      setSuccessMsg('Profile picture updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile picture');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg('');
    try {
      await employeePortalApi.updateMyProfile(formData);
      updateProfile({ full_name: formData.full_name, avatar_url: formData.avatar_url || null });
      setSuccessMsg('Profile contact information updated successfully!');
      await loadProfile();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const user = profile?.user;
  const emp = profile?.employee;

  return (
    <AdminPage
      title="My Employee Profile"
      subtitle="View your employment credentials, job assignments, and personal contact info"
      loading={loading}
      error={error}
      onRetry={loadProfile}
    >
      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center mb-2" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>{successMsg}</div>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Summary Card */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 text-center p-3">
            <div className="mb-3">
              <AvatarUploader
                value={formData.avatar_url}
                onChange={handleAvatarChange}
                name={user?.full_name || 'Employee'}
                size={100}
              />
            </div>

            <h5 className="fw-bold mb-1">{user?.full_name || 'Employee'}</h5>
            <p className="text-muted small mb-2">{emp?.designation || '—'}</p>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 mb-3">
              {emp?.department || '—'}
            </span>

            <hr className="my-3" />

            <div className="text-start">
              <div className="mb-2">
                <span className="text-muted small d-block">Employee ID</span>
                <span className="fw-semibold text-dark">{emp?.employee_code || '—'}</span>
              </div>
              <div className="mb-2">
                <span className="text-muted small d-block">Official Email</span>
                <span className="fw-semibold text-dark">{user?.email || 'N/A'}</span>
              </div>
              <div className="mb-2">
                <span className="text-muted small d-block">Joining Date</span>
                <span className="fw-semibold text-dark">
                  {emp?.date_of_joining ? new Date(emp.date_of_joining).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-muted small d-block">System Role</span>
                <span className="badge bg-dark">{user?.role || 'EMPLOYEE'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Edit & Info Tabs */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-2">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">Contact & Identity Details</h6>
            </div>
            <div className="card-body p-3">
              <form onSubmit={handleUpdate}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Legal Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address (Read-Only)</label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Employee Code</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={emp?.employee_code || ''}
                      disabled
                    />
                  </div>
                </div>

                <div className="mt-4 text-end">
                  <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">Tax & Banking Compliance</h6>
            </div>
            <div className="card-body p-3">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">PAN Number</span>
                    <span className="fw-bold text-dark">{emp?.pan ? '••••••••' + emp.pan.slice(-4) : 'Verified on File'}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">PF / UAN Number</span>
                    <span className="fw-bold text-dark">{emp?.pf_number ? '••••••••' + emp.pf_number.slice(-4) : 'Active'}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Bank Account</span>
                    <span className="fw-bold text-dark">{emp?.bank_account ? '••••••••' + emp.bank_account.slice(-4) : 'Direct Deposit'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
