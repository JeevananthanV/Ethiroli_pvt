import React, { useState } from 'react';

export default function InterviewFeedbackForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ rating: 5, comments: '', recommendation: 'yes' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Feedback submitted (would call API)');
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Interview Feedback</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Rating (1-5)</label>
            <input className="input" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} required />
          </div>
          <div className="formGroup">
            <label className="label">Comments</label>
            <textarea className="textarea" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} required rows={4} />
          </div>
          <div className="formGroup">
            <label className="label">Recommendation</label>
            <select className="select" value={form.recommendation} onChange={(e) => setForm({ ...form, recommendation: e.target.value })}>
              <option value="yes">Yes - Hire</option>
              <option value="no">No - Reject</option>
              <option value="maybe">Maybe - Hold</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">Submit Feedback</button>
          </div>
        </form>
      </div>
    </div>
  );
}
