import React, { useState } from 'react';

export default function InterviewJobPostingForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ title: '', department: '', type: 'full-time' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Job posting created (would call API)');
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Create Job Posting</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Job Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Department</label>
            <input className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Type</label>
            <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">Create Posting</button>
          </div>
        </form>
      </div>
    </div>
  );
}
