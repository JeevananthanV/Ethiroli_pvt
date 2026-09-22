import React, { useState } from 'react';
import { createTemplate } from '../../../../services/api/templateApi.js';

export default function TemplateEditor({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', subject: '', body: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTemplate(form);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to create template:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Create Template</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Template Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Subject</label>
            <input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Body</label>
            <textarea className="textarea" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required rows={6} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
