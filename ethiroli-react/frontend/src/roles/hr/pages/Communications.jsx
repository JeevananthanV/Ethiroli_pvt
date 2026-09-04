import React from 'react';

export default function CommunicationsPage() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Staff Broadcast & Templates Panel</h2>
      </div>
      <div className="cardBody">
        <form className="form">
          <div className="formGroup">
            <label className="label">Template Name</label>
            <input type="text" className="inputField" defaultValue="Welcome Onboard Template" />
          </div>
          <div className="formGroup">
            <label className="label">Broadcasting Channel</label>
            <select className="inputField">
              <option>Email & In-App notification</option>
              <option>WhatsApp Direct</option>
            </select>
          </div>
          <button type="button" className="actionTag" style={{ background: 'var(--admin-primary)', color: 'white' }}>Save Template</button>
        </form>
      </div>
    </div>
  );
}