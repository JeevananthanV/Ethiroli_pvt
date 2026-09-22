import React, { useState } from 'react';
import { sendMessage } from '../../../../services/api/communicationApi.js';

export default function Composer({ onClose, onSuccess }) {
  const [form, setForm] = useState({ to: '', subject: '', body: '', type: 'email' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await sendMessage(form);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Compose Message</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Recipient</label>
            <input className="input" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Type</label>
            <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Subject</label>
            <input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Message</label>
            <textarea className="textarea" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required rows={6} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
