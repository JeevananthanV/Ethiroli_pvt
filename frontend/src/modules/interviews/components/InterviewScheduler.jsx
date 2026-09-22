import React, { useState } from 'react';
import { scheduleInterview } from '../../../../services/api/interviewApi.js';

export default function InterviewScheduler({ candidateId, onClose, onSuccess }) {
  const [form, setForm] = useState({ candidate_id: candidateId || '', scheduled_at: '', duration: 60, type: 'video' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await scheduleInterview(form);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to schedule interview:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>Schedule Interview</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Date & Time</label>
            <input className="input" type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Duration (minutes)</label>
            <input className="input" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
          </div>
          <div className="formGroup">
            <label className="label">Type</label>
            <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="video">Video</option>
              <option value="phone">Phone</option>
              <option value="in-person">In-Person</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary" disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
