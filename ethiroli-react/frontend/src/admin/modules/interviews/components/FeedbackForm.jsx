import React, { useState } from 'react';

export default function FeedbackForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ rating: 5, comments: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Feedback submitted');
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Feedback</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Rating</label>
            <input className="input" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} required />
          </div>
          <div className="formGroup">
            <label className="label">Comments</label>
            <textarea className="textarea" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} required rows={4} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
