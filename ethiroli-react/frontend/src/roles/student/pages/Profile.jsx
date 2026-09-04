import React from 'react';

export default function StudentProfile() {
  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="cardHeader">
        <h2 className="cardTitle">My Student Profile</h2>
      </div>
      <div className="cardBody">
        <form className="form">
          <div className="formGroup">
            <label className="label">Full Name</label>
            <input type="text" className="inputField" defaultValue="Karthik Raja" />
          </div>
          <div className="formGroup">
            <label className="label">Registered Email</label>
            <input type="email" className="inputField" defaultValue="karthik@student.com" />
          </div>
          <button type="button" className="actionTag" style={{ background: 'var(--admin-primary)', color: 'white' }}>Save Profile</button>
        </form>
      </div>
    </div>
  );
}