import React, { useState } from 'react';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';

export default function ResolutionForm({ isOpen, onClose, errorId, onResolve }) {
  const [form, setForm] = useState({ notes: '', status: 'resolved' });

  const save = (e) => {
    e.preventDefault();
    onResolve({ error_id: errorId, ...form });
    setForm({ notes: '', status: 'resolved' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resolve Error">
      <form onSubmit={save} className="form">
        <div className="formGroup">
          <label className="label">Resolution Notes</label>
          <textarea className="textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} required />
        </div>
        <div className="formGroup">
          <label className="label">Status</label>
          <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="resolved">Resolved</option>
            <option value="ignored">Ignored</option>
            <option value="reopened">Reopened</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Save</button>
        </div>
      </form>
    </Modal>
  );
}
