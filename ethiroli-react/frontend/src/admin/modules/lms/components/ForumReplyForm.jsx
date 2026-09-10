import React, { useState } from 'react';

export default function ForumReplyForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Reply submitted (would call API)');
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Reply to Thread</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Your Reply</label>
            <textarea className="textarea" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={5} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">Post Reply</button>
          </div>
        </form>
      </div>
    </div>
  );
}
