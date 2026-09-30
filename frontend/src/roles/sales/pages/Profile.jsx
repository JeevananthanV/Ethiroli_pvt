import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import AvatarUploader from '../../../common/components/AvatarUploader/AvatarUploader.jsx';
import { useAuth } from '../../../common/hooks/useAuth.js';
import { updateMyProfile } from '../../../services/api/userApi.js';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [salesUser, setSalesUser] = useState({
    name: user?.full_name || 'Rahul Sharma',
    role: 'Senior Enterprise Account Executive',
    email: user?.email || 'sales@ethiroli.net',
    phone: user?.phone || '+91 98450 99887',
    avatar_url: user?.avatar_url || '',
    territory: 'India - South & Enterprise West',
    manager: 'Sales Director (Siddharth Roy)',
    joined_date: 'March 2025',
    target_revenue: 2500000,
    achieved_revenue: 2850000,
    deals_won: 9,
    win_rate: '34.8%'
  });

  useEffect(() => {
    if (user) {
      setSalesUser(prev => ({
        ...prev,
        name: user.full_name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        avatar_url: user.avatar_url || ''
      }));
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...salesUser });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAvatarChange = async (newAvatar) => {
    setSalesUser(prev => ({ ...prev, avatar_url: newAvatar || '' }));
    try {
      await updateMyProfile({ avatar_url: newAvatar || '' });
      updateProfile({ avatar_url: newAvatar || null });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (_) {}
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateMyProfile({
        full_name: editForm.name,
        phone: editForm.phone,
        avatar_url: salesUser.avatar_url || null
      });
      updateProfile({
        full_name: editForm.name,
        phone: editForm.phone,
        avatar_url: salesUser.avatar_url || null
      });
      setSalesUser({ ...editForm, avatar_url: salesUser.avatar_url });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (_) {}
  };

  const attainment = Math.round((user.achieved_revenue / user.target_revenue) * 100);

  return (
    <AdminPage
      title="Sales Representative Profile"
      subtitle="Personal quota performance, assigned commercial territories, commission accelerators, and account credentials"
    >
      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white text-center h-100">
            <div className="mb-3">
              <AvatarUploader
                value={salesUser.avatar_url}
                onChange={handleAvatarChange}
                name={salesUser.name}
                size={100}
              />
            </div>
            <h4 className="fw-bold text-dark mb-1">{salesUser.name}</h4>
            <small className="text-muted d-block mb-3">{salesUser.role}</small>
            <div className="mb-3">
              <span className="badge bg-success bg-opacity-10 text-success fs-6 px-3 py-2 border border-success border-opacity-25">
                <i className="bi bi-award-fill me-1"></i>President's Club (114% Quota)
              </span>
            </div>

            <hr className="my-3" />

            <div className="text-start small">
              <div className="mb-2">
                <strong className="text-muted d-block">Territory:</strong>
                <span className="text-dark fw-semibold">{salesUser.territory}</span>
              </div>
              <div className="mb-2">
                <strong className="text-muted d-block">Reporting Manager:</strong>
                <span className="text-dark fw-semibold">{salesUser.manager}</span>
              </div>
              <div className="mb-2">
                <strong className="text-muted d-block">Official Email:</strong>
                <span className="text-dark fw-semibold">{salesUser.email}</span>
              </div>
              <div>
                <strong className="text-muted d-block">Direct Mobile:</strong>
                <span className="text-dark fw-semibold">{salesUser.phone}</span>
              </div>
            </div>

            <button className="btn btn-outline-primary w-100 mt-4" onClick={() => setIsEditing(true)}>
              <i className="bi bi-pencil me-1"></i> Edit Profile Information
            </button>
          </div>
        </div>

        {/* Performance Statistics */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-2">
            <h5 className="fw-bold mb-3">Fiscal Quota Attainment Pacing</h5>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <div className="p-3 bg-light rounded-3 text-center">
                  <small className="text-muted text-uppercase">Assigned Quota</small>
                  <h4 className="fw-bold text-dark mt-1">₹{salesUser.target_revenue.toLocaleString()}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-light rounded-3 text-center">
                  <small className="text-muted text-uppercase">Achieved Bookings</small>
                  <h4 className="fw-bold text-success mt-1">₹{salesUser.achieved_revenue.toLocaleString()}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-light rounded-3 text-center">
                  <small className="text-muted text-uppercase">Attainment</small>
                  <h4 className="fw-bold text-primary mt-1">{attainment}%</h4>
                </div>
              </div>
            </div>

            <div className="progress mb-2" style={{ height: '10px' }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${Math.min(100, attainment)}%` }}
              ></div>
            </div>
            <small className="text-success fw-semibold">
              <i className="bi bi-check-circle-fill me-1"></i>14% above assigned quarterly target. Tier-2 bonus unlocked!
            </small>
          </div>

          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <h5 className="fw-bold mb-3">Key Performance Indicators</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">Closed Won Deals</small>
                    <strong className="fs-4 text-dark">{salesUser.deals_won} Deals</strong>
                  </div>
                  <i className="bi bi-trophy text-warning fs-3"></i>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">Win Ratio</small>
                    <strong className="fs-4 text-primary">{salesUser.win_rate}</strong>
                  </div>
                  <i className="bi bi-pie-chart text-primary fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Profile Details</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Designation / Role</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.role}
                      onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Territory</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.territory}
                      onChange={e => setEditForm({ ...editForm, territory: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
