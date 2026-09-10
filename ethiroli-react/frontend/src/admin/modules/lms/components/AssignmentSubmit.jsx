import React, { useState } from 'react';

export default function AssignmentSubmit({ onClose, onSuccess }) {
  const [form, setForm] = useState({ assignment_id: '', submission_text: '', file_url: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Assignment submitted (would call API)');
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Submit Assignment</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Assignment ID</label>
            <input className="input" value={form.assignment_id} onChange={(e) => setForm({ ...form, assignment_id: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Submission Text</label>
            <textarea className="textarea" value={form.submission_text} onChange={(e) => setForm({ ...form, submission_text: e.target.value })} required rows={5} />
          </div>
          <div className="formGroup">
            <label className="label">File URL (optional)</label>
            <input className="input" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">Submit Assignment</button>
          </div>
        </form>
      </div>
    </div>
  );
}
