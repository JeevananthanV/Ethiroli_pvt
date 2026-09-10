import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../../services/api/userApi.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'USER', status: 'active', department: '' });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data?.data || data || []);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = (users || []).filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', role: 'USER', status: 'active', department: '' });
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name || '', email: user.email || '', role: user.role || 'USER', status: user.status || 'active', department: user.department || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, form);
        setUsers(prev => prev.map(u => (u.id === editingUser.id ? { ...u, ...form } : u)));
      } else {
        const created = await createUser(form);
        setUsers(prev => [...prev, created?.data || created]);
      }
      setShowForm(false);
    } catch (err) {
      console.error('Failed to save user', err);
      alert('Failed to save user.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user', err);
      alert('Failed to delete user.');
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="emptyState">{error}</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">User Access Management</h1>
          <p className="pageSubtitle">Manage user account credentials, active roles, and system permission layers.</p>
        </div>
        <div className="pageActions">
          <button className="btn btnPrimary" onClick={openCreate}>New User</button>
        </div>
      </div>

      {showForm && (
        <div className="modalOverlay" onClick={() => setShowForm(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h3 style={{ marginTop: 0 }}>{editingUser ? 'Edit User' : 'Create User'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div className="formGroup">
                <label className="label">Full Name</label>
                <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Email Address</label>
                <input type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Department</label>
                <input className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div className="formGroup">
                <label className="label">Role</label>
                <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="HR">HR</option>
                  <option value="TUTOR">TUTOR</option>
                  <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                </select>
              </div>
              <div className="formGroup">
                <label className="label">Status</label>
                <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btnSecondary" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="btn btnPrimary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="cardHeader" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 className="cardTitle" style={{ fontSize: '20px' }}>Users</h2>
            <p style={{ color: 'var(--admin-text-secondary)', fontSize: '13px' }}>Showing {filteredUsers.length} of {users.length} users.</p>
          </div>
          <input
            type="text"
            placeholder="Filter by name or email..."
            className="input"
            style={{ maxWidth: '280px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Department</th>
                <th>Role Tag</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: '600' }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td><span className="roleTag">{user.role}</span></td>
                  <td>
                    <span className={`statusTag ${user.status === 'active' ? 'active' : user.status === 'pending' ? 'pending' : 'inactive'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btnSecondary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => openEdit(user)}>Edit</button>
                    <button className="btn btnSecondary" style={{ padding: '4px 10px', fontSize: '11px', borderColor: 'var(--admin-danger)', color: 'var(--admin-danger)' }} onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
