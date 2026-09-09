import React, { useState } from 'react';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';

export default function UserFormModal({ isOpen, onClose, user, onSubmit }) {
  const [form, setForm] = useState({ full_name: '', email: '', role: 'employee', phone: '', is_active: true });

  React.useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  const save = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Edit User' : 'New User'}>
      <form onSubmit={save} className="form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="formGroup">
            <label className="label">Full Name</label>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Email</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Role</label>
            <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Phone</label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Save</button>
        </div>
      </form>
    </Modal>
  );
}
