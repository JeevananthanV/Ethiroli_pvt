import React, { useState } from 'react';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';
import Button from '../../../common/components/Button/Button.jsx';
import { updateLead, sendFollowUp } from '../../../services/api/leadApi.js';

export default function LeadModal({ isOpen, onClose, lead, onLeadUpdate }) {
  if (!lead) return null;

  const [notes, setNotes] = useState(lead.notes || '');
  const [followUpMsg, setFollowUpMsg] = useState('');
  const [followUpDate, setFollowUpDate] = useState(lead.follow_up_date || '');
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateLead(lead.id, { notes, follow_up_date: followUpDate || null });
      if (onLeadUpdate) onLeadUpdate({ ...lead, notes, follow_up_date: followUpDate });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendFollowUp = async () => {
    if (!followUpMsg.trim()) return;
    setUpdating(true);
    try {
      await sendFollowUp(lead.id, followUpMsg);
      setFollowUpMsg('');
      alert('Follow-up email sent successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Lead: ${lead.name}`}>
      <div className="modalBody">
        <div className="form">
          <div className="formGroup">
            <label className="label">Email</label>
            <p className="textSecondary">{lead.email || 'N/A'}</p>
          </div>
          <div className="formGroup">
            <label className="label">Phone</label>
            <p className="textSecondary">{lead.phone || 'N/A'}</p>
          </div>
          <div className="formGroup">
            <label className="label">Source</label>
            <p className="textSecondary">{lead.source}</p>
          </div>
          <div className="formGroup">
            <label className="label">Status</label>
            <span className={`statusTag ${lead.status === 'PAYMENT' || lead.status === 'ADMISSION' ? 'active' : lead.status === 'LOST' ? 'error' : 'pending'}`}>{lead.status}</span>
          </div>

          <Input 
            label="Follow-up Date" 
            type="date" 
            value={followUpDate} 
            onChange={(e) => setFollowUpDate(e.target.value)}
          />

          <div className="textareaGroup">
            <label className="label">Notes</label>
            <textarea 
              className="textarea" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes..."
              rows={4}
            />
          </div>

          <Button onClick={handleUpdate} disabled={updating} variant="primary" className="btnFull">
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>

          {lead.email && (
            <div style={{marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--admin-border-subtle)', display: 'flex', flexDirection: 'column', gap: 12}}>
              <label className="label" style={{fontSize: 14, fontWeight: 600}}>Send Follow-up Email</label>
              <textarea 
                className="textarea"
                value={followUpMsg} 
                onChange={(e) => setFollowUpMsg(e.target.value)}
                placeholder="Enter follow-up email message..."
                rows={4}
              />
              <Button onClick={handleSendFollowUp} disabled={updating || !followUpMsg.trim()} variant="secondary" className="btnFull">
                Send Email
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}