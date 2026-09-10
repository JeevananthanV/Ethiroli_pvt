import React, { useState } from 'react';

export default function BadgeCriteriaForm() {
  const [form, setForm] = useState({ name: '', description: '', criteria: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Badge creation would be implemented here with API call');
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Badge Criteria</h2>
          <p className="pageSubtitle">Define badge award criteria</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label className="label">Badge Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="formGroup">
              <label className="label">Description</label>
              <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="formGroup">
              <label className="label">Criteria</label>
              <input className="input" value={form.criteria} onChange={(e) => setForm({ ...form, criteria: e.target.value })} required />
            </div>
            <button type="submit" className="btn btnPrimary">Create Badge</button>
          </form>
        </div>
      </div>
    </div>
  );
}
