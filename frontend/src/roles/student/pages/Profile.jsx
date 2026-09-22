import React from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function StudentProfile() {
  return (
    <AdminPage
      title="My Profile"
      subtitle="Manage your personal information"
    >
      <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="cardHeader">
          <h3 className="cardTitle">Student Profile</h3>
        </div>
        <div className="cardBody">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <div className="formGroup">
              <label className="label">Full Name</label>
              <input type="text" className="inputField" defaultValue="Karthik Raja" />
            </div>
            <div className="formGroup">
              <label className="label">Registered Email</label>
              <input type="email" className="inputField" defaultValue="karthik@student.com" />
            </div>
            <button type="submit" className="btn primary">Save Profile</button>
          </form>
        </div>
      </div>
    </AdminPage>
  );
}