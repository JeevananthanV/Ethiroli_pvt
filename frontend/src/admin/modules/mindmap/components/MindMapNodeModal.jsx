import React, { useState } from 'react';

export default function MindMapNodeModal({ node, onClose, onSave }) {
  const [form, setForm] = useState(node || { title: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Mind Map Node</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Description</label>
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">Save Node</button>
          </div>
        </form>
      </div>
    </div>
  );
}
