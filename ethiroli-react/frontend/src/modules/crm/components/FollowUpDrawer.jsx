import React, { useEffect, useState, useCallback } from 'react';
import { getFollowUps, createFollowUp, deleteFollowUp } from '../../../services/api/followUpApi.js';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { sendFollowUp } from '../../../services/api/leadApi.js';

export default function FollowUpDrawer({ isOpen, onClose, lead }) {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({ date: '', notes: '', channel: 'email' });
  const [submitting, setSubmitting] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState('');
  const [error, setError] = useState(null);

  const loadFollowUps = useCallback(async () => {
    if (!lead?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFollowUps(lead.id);
      setFollowUps(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  }, [lead?.id]);

  useEffect(() => {
    if (isOpen && lead?.id) {
      loadFollowUps();
    }
  }, [isOpen, lead?.id, loadFollowUps]);

  const handleCreateFollowUp = async (e) => {
    e.preventDefault();
    if (!lead?.id) return;
    setSubmitting(true);
    try {
      const created = await createFollowUp(lead.id, newFollowUp);
      setFollowUps([created, ...followUps]);
      setShowAddForm(false);
      setNewFollowUp({ date: '', notes: '', channel: 'email' });
    } catch (err) {
      setError(err.message || 'Failed to create follow-up');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFollowUp = async (followUpId) => {
    if (!lead?.id) return;
    try {
      await deleteFollowUp(lead.id, followUpId);
      setFollowUps(followUps.filter((f) => f.id !== followUpId));
    } catch (err) {
      setError(err.message || 'Failed to delete follow-up');
    }
  };

  const handleSendEmail = async () => {
    if (!lead?.id || !emailMsg.trim()) return;
    setSendingEmail(true);
    try {
      await sendFollowUp(lead.id, emailMsg);
      setEmailMsg('');
      alert('Follow-up email sent successfully!');
    } catch (err) {
      setError(err.message || 'Failed to send follow-up email');
    } finally {
      setSendingEmail(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Follow-ups: ${lead?.name || ''}`}>
      <div className="modalBody">
        {error && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: 'rgba(244, 63, 94, 0.1)', color: 'var(--admin-danger)', fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h4 style={{ margin: 0 }}>Scheduled Follow-ups ({followUps.length})</h4>
          <button className="btn primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Follow-up'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleCreateFollowUp} className="form" style={{ marginBottom: 20, padding: 16, background: 'var(--admin-bg-card)', borderRadius: 8 }}>
            <div className="formGroup">
              <label className="label">Date <span className="required">*</span></label>
              <input className="inputField" type="date" value={newFollowUp.date} onChange={(e) => setNewFollowUp({ ...newFollowUp, date: e.target.value })} required />
            </div>
            <div className="formGroup">
              <label className="label">Notes</label>
              <textarea className="textarea" value={newFollowUp.notes} onChange={(e) => setNewFollowUp({ ...newFollowUp, notes: e.target.value })} placeholder="Follow-up notes..." rows={3} />
            </div>
            <div className="formGroup">
              <label className="label">Channel</label>
              <select className="select" value={newFollowUp.channel} onChange={(e) => setNewFollowUp({ ...newFollowUp, channel: e.target.value })}>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Follow-up'}
            </Button>
          </form>
        )}

        {loading ? (
          <div className="loading">Loading follow-ups...</div>
        ) : followUps.length === 0 ? (
          <div className="emptyState">
            <h4>No follow-ups scheduled</h4>
            <p>Schedule a follow-up to keep track of lead interactions.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {followUps.map((fu) => (
              <div key={fu.id} style={{ padding: 14, borderRadius: 8, background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span className="statusTag active">{fu.channel || 'email'}</span>
                      <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{formatDate(fu.date || fu.scheduled_at)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--admin-text-secondary)' }}>{fu.notes || fu.message || 'No notes'}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFollowUp(fu.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px' }}
                    title="Delete"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {lead?.email && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--admin-border-subtle)' }}>
            <h4 style={{ marginBottom: 10 }}>Send Follow-up Email</h4>
            <textarea
              className="textarea"
              value={emailMsg}
              onChange={(e) => setEmailMsg(e.target.value)}
              placeholder="Enter follow-up email message..."
              rows={3}
              style={{ marginBottom: 10 }}
            />
            <Button onClick={handleSendEmail} disabled={sendingEmail || !emailMsg.trim()} variant="secondary" className="btnFull">
              {sendingEmail ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
