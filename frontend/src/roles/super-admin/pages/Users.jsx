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
  const [form, setForm] = useState({ 
    full_name: '', 
    email: '', 
    password: '', 
    role: 'ADMIN', 
    phone: '', 
    is_active: true 
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers();
      const list = res?.data || res || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Failed to fetch real-time user records from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ full_name: '', email: '', password: '', role: 'ADMIN', phone: '', is_active: true });
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ 
      full_name: user.full_name || user.name || '', 
      email: user.email || '', 
      password: '', 
      role: user.role || 'ADMIN', 
      phone: user.phone || '', 
      is_active: Boolean(user.is_active) 
    });
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
        await createUser(form);
        await fetchUsers(); // Refresh live records from DB
      }
      setShowForm(false);
    } catch (err) {
      console.error('Failed to save user', err);
      alert('Failed to save user in database.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user from MySQL?')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user', err);
      alert('Failed to delete user.');
    }
  };

  const filteredUsers = (users || []).filter(u => {
    const name = (u.full_name || u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-white mb-1">Global User Directory</h1>
          <p className="text-secondary small mb-0">
            Real-time user accounts and credentials fetched from MySQL datastore ({users.length} registered).
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchUsers} 
            disabled={loading}
          >
            <i className={`bi bi-arrow-clockwise me-1 ${loading ? 'spin' : ''}`}></i>
            Refresh
          </button>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <i className="bi bi-person-plus me-1"></i> New User
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
        </div>
      )}

      {showForm && (
        <div className="card bg-dark text-white border-secondary mb-4 shadow-sm">
          <div className="card-header border-secondary">
            <h5 className="mb-0 fs-6 fw-semibold text-primary">{editingUser ? 'Edit User Record' : 'Provision User Account'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }} className="d-flex flex-column gap-3">
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary" 
                    required 
                    value={form.full_name} 
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })} 
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary" 
                    required 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    placeholder="e.g. user@ethiroli.com"
                  />
                </div>
              </div>

              {!editingUser && (
                <div>
                  <label className="form-label small text-secondary">Initial Password</label>
                  <input 
                    type="password" 
                    className="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary" 
                    required 
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                    placeholder="Minimum 6 characters"
                  />
                </div>
              )}

              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label small text-secondary">System Role</label>
                  <select 
                    className="form-select form-select-sm bg-secondary bg-opacity-25 text-white border-secondary" 
                    value={form.role} 
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Platform)</option>
                    <option value="ADMIN">ADMIN (Organization)</option>
                    <option value="HR">HR</option>
                    <option value="TUTOR">TUTOR</option>
                    <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                    <option value="FINANCE">FINANCE</option>
                    <option value="SALES">SALES</option>
                    <option value="RECEPTION">RECEPTION</option>
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="INTERN">INTERN</option>
                    <option value="STUDENT">STUDENT</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-secondary">Account Status</label>
                  <select 
                    className="form-select form-select-sm bg-secondary bg-opacity-25 text-white border-secondary" 
                    value={form.is_active ? '1' : '0'} 
                    onChange={(e) => setForm({ ...form, is_active: e.target.value === '1' })}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card bg-dark text-white border-secondary shadow-sm">
        <div className="card-header border-secondary d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold small">Live Database Users</span>
            <span className="badge bg-primary bg-opacity-25 text-primary">{filteredUsers.length}</span>
          </div>
          <input
            type="text"
            className="form-control form-control-sm bg-secondary bg-opacity-25 text-white border-secondary"
            style={{ maxWidth: '240px' }}
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5 text-secondary">
              <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
              Querying database for live user records...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-people fs-2 d-block mb-2 text-secondary"></i>
              No users found.
            </div>
          ) : (
            <table className="table table-dark table-hover mb-0 align-middle">
              <thead>
                <tr className="border-secondary text-secondary small text-uppercase" style={{ fontSize: '0.75rem' }}>
                  <th scope="col">User Identity</th>
                  <th scope="col">Email Address</th>
                  <th scope="col">Assigned Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Created At</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="border-secondary">
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          className="rounded-circle bg-primary bg-opacity-25 text-primary fw-bold d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                        >
                          {(u.full_name || u.name || u.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold text-white">{u.full_name || u.name || 'User'}</div>
                          <small className="text-secondary font-monospace" style={{ fontSize: '0.7rem' }}>{u.id}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-light">{u.email}</td>
                    <td>
                      <span className="badge bg-primary bg-opacity-15 text-primary border border-primary border-opacity-25">
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.is_active ? 'bg-success bg-opacity-25 text-success' : 'bg-danger bg-opacity-25 text-danger'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-secondary small">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="text-end">
                      <button 
                        className="btn btn-outline-secondary btn-sm me-1" 
                        style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }} 
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm" 
                        style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }} 
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
