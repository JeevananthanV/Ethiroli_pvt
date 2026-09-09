import React, { useState } from 'react';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';
import Button from '../../../common/components/Button/Button.jsx';

export default function JobPostingForm({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', department: '', type: 'full_time', salary: '', description: '', requirements: '' });

  const save = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: '', department: '', type: 'full_time', salary: '', description: '', requirements: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Job Posting">
      <form onSubmit={save} className="form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="formGroup">
            <label className="label">Title</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Department</label>
            <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Type</label>
            <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Salary</label>
            <Input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          </div>
          <div className="formGroup" style={{ gridColumn: '1 / -1' }}>
            <label className="label">Description</label>
            <textarea className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} required />
          </div>
          <div className="formGroup" style={{ gridColumn: '1 / -1' }}>
            <label className="label">Requirements</label>
            <textarea className="textarea" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={3} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
          <Button type="submit" variant="primary">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
