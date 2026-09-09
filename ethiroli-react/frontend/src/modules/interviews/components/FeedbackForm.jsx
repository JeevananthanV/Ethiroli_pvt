import React, { useState } from 'react';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';
import Button from '../../../common/components/Button/Button.jsx';

export default function FeedbackForm({ isOpen, onClose, interviewId, onSubmit }) {
  const [form, setForm] = useState({ rating: '', feedback: '', recommendation: 'YES' });

  const save = (e) => {
    e.preventDefault();
    onSubmit({ ...form, interview_id: interviewId });
    setForm({ rating: '', feedback: '', recommendation: 'YES' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Interview Feedback">
      <form onSubmit={save} className="form">
        <div className="formGroup">
          <label className="label">Rating (1-5)</label>
          <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} required />
        </div>
        <div className="formGroup">
          <label className="label">Recommendation</label>
          <select className="select" value={form.recommendation} onChange={(e) => setForm({ ...form, recommendation: e.target.value })}>
            <option value="YES">Yes - Hire</option>
            <option value="NO">No - Reject</option>
            <option value="MAYBE">Maybe</option>
          </select>
        </div>
        <div className="formGroup">
          <label className="label">Feedback</label>
          <textarea className="textarea" value={form.feedback} onChange={(e) => setForm({ ...form, feedback: e.target.value })} rows={4} required />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
          <Button type="submit" variant="primary">Submit Feedback</Button>
        </div>
      </form>
    </Modal>
  );
}
