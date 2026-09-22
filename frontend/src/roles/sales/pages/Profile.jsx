import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Profile() {
  const [user, setUser] = useState({
    name: 'Rahul Sharma',
    role: 'Senior Enterprise Account Executive',
    email: 'rahul.sharma@ethiroli.com',
    phone: '+91 98450 99887',
    territory: 'India - South & Enterprise West',
    manager: 'Sales Director (Siddharth Roy)',
    joined_date: 'March 2025',
    target_revenue: 2500000,
    achieved_revenue: 2850000,
    deals_won: 9,
    win_rate: '34.8%'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...editForm });
    setIsEditing(false);
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
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white text-center h-100">
            <div className="rounded-circle bg-primary bg-opacity-10 text-primary mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold fs-2" style={{ width: '88px', height: '88px' }}>
              RS
            </div>
            <h4 className="fw-bold text-dark mb-1">{user.name}</h4>
            <small className="text-muted d-block mb-3">{user.role}</small>
            <div className="mb-3">
              <span className="badge bg-success bg-opacity-10 text-success fs-6 px-3 py-2 border border-success border-opacity-25">
                <i className="bi bi-award-fill me-1"></i>President's Club (114% Quota)
              </span>
            </div>

            <hr className="my-3" />

            <div className="text-start small">
              <div className="mb-2">
                <strong className="text-muted d-block">Territory:</strong>
                <span className="text-dark fw-semibold">{user.territory}</span>
              </div>
              <div className="mb-2">
                <strong className="text-muted d-block">Reporting Manager:</strong>
                <span className="text-dark fw-semibold">{user.manager}</span>
              </div>
              <div className="mb-2">
                <strong className="text-muted d-block">Official Email:</strong>
                <span className="text-dark fw-semibold">{user.email}</span>
              </div>
              <div>
                <strong className="text-muted d-block">Direct Mobile:</strong>
                <span className="text-dark fw-semibold">{user.phone}</span>
              </div>
            </div>

            <button className="btn btn-outline-primary w-100 mt-4" onClick={() => setIsEditing(true)}>
              <i className="bi bi-pencil me-1"></i> Edit Profile Information
            </button>
          </div>
        </div>

        {/* Performance Statistics */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white mb-4">
            <h5 className="fw-bold mb-3">Fiscal Quota Attainment Pacing</h5>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <div className="p-3 bg-light rounded-3 text-center">
                  <small className="text-muted text-uppercase">Assigned Quota</small>
                  <h4 className="fw-bold text-dark mt-1">₹{user.target_revenue.toLocaleString()}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-light rounded-3 text-center">
                  <small className="text-muted text-uppercase">Achieved Bookings</small>
                  <h4 className="fw-bold text-success mt-1">₹{user.achieved_revenue.toLocaleString()}</h4>
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

          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 className="fw-bold mb-3">Key Performance Indicators</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">Closed Won Deals</small>
                    <strong className="fs-4 text-dark">{user.deals_won} Deals</strong>
                  </div>
                  <i className="bi bi-trophy text-warning fs-3"></i>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">Win Ratio</small>
                    <strong className="fs-4 text-primary">{user.win_rate}</strong>
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
