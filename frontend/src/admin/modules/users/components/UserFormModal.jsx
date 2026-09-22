import React, { useState } from 'react';

export default function UserFormModal({ user, onClose, onSave }) {
  const [form, setForm] = useState(user || { full_name: '', email: '', role: 'EMPLOYEE' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
    if (onClose) onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h3>{user ? 'Edit User' : 'Create User'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Full Name</label>
            <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="formGroup">
            <label className="label">Role</label>
            <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="STUDENT">Student</option>
              <option value="TUTOR">Tutor</option>
              <option value="HR">HR</option>
              <option value="SALES">Sales</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btnPrimary">{user ? 'Update' : 'Create'} User</button>
          </div>
        </form>
      </div>
    </div>
  );
}
