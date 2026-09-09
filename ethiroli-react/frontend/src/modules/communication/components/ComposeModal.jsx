import React, { useState, useEffect } from 'react';
import { sendMessage, sendBulkMessages } from '../services/api/communicationApi.js';

export default function ComposeModal({ onClose, onSend, templates = [] }) {
  const [channel, setChannel] = useState('email');
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [sending, setSending] = useState(false);
  const [bulk, setBulk] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleTemplateChange = (e) => {
    const template = templates.find((t) => t.id === e.target.value);
    if (template) {
      setSubject(template.subject || '');
      setBody(template.body || template.content || '');
      setChannel(template.type || channel);
    }
    setSelectedTemplateId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipients.trim()) {
      alert('Recipient(s) are required');
      return;
    }
    setSending(true);
    try {
      const payload = {
        channel,
        recipients: bulk ? recipients.split(',').map((r) => r.trim()).filter(Boolean) : recipients.trim(),
        subject,
        body,
        template_id: selectedTemplateId || undefined,
      };
      if (bulk) {
        await sendBulkMessages(payload);
      } else {
        await sendMessage(payload);
      }
      onSend?.();
      onClose();
    } catch (err) {
      alert(`Failed to send message: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="modalHeader">
          <h3 className="modalTitle">Compose Message</h3>
          <button className="closeBtn" onClick={onClose}>&times;</button>
        </div>
        <div className="modalBody">
          <form onSubmit={handleSubmit} className="form">
            <div className="formGroup">
              <label className="label">Channel</label>
              <select className="select" value={channel} onChange={(e) => setChannel(e.target.value)}>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="push">Push Notification</option>
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Template</label>
              <select className="select" value={selectedTemplateId} onChange={handleTemplateChange}>
                <option value="">Select template...</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Recipient(s)</label>
              <input
                className="inputField"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="email@example.com or +1234567890"
              />
            </div>
            <div className="formGroup">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={bulk}
                  onChange={(e) => setBulk(e.target.checked)}
                />
                <span>Bulk send (comma-separated recipients)</span>
              </label>
            </div>
            <div className="formGroup">
              <label className="label">Subject</label>
              <input
                className="inputField"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Message subject"
              />
            </div>
            <div className="formGroup">
              <label className="label">Body</label>
              <textarea
                className="textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Message content..."
                rows={5}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn primary" disabled={sending}>
                {sending ? 'Sending...' : bulk ? 'Send Bulk' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
