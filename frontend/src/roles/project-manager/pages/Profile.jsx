import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import { useAuth } from '../../../common/hooks/useAuth';

export default function PMProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || 'Project Manager',
    email: user?.email || 'pm@ethiroli.com',
    phone: user?.phone || '+91 98765 43210',
    department: 'Engineering Operations',
    designation: 'Senior Technical Project Manager'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminPage
      title="Manager Profile & Security"
      subtitle="Personal information, assigned portfolio governance, and security credentials"
    >
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white text-center">
            <div
              className="rounded-circle bg-primary bg-opacity-10 text-primary mx-auto d-flex align-items-center justify-content-center fw-bold fs-2 mb-3"
              style={{ width: '90px', height: '90px' }}
            >
              {(formData.full_name || 'P').charAt(0).toUpperCase()}
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
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h6 className="fw-bold mb-3">Update Profile Details</h6>
            {saved && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-check-circle-fill"></i>
                <span>Profile details updated successfully!</span>
              </div>
            )}
            <form onSubmit={handleSave}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    disabled
                    value={formData.email}
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Designation Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
