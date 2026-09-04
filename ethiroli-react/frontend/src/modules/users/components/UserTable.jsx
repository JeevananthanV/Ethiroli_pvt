import React, { useEffect, useState } from 'react';
import Button from '../../../common/components/Button/Button.jsx';
import Modal from '../../../common/components/Modal/Modal.jsx';
import Input from '../../../common/components/Input/Input.jsx';
import { getUsers, createUser } from '../../../services/api/userApi.js';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('EMPLOYEE');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUser({ email, password, full_name: fullName, role });
      loadUsers();
      setCreateOpen(false);
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">System Users</h2>
          <p className="pageSubtitle">Manage platform users and permissions</p>
        </div>
        <div className="pageActions">
          <Button onClick={() => setCreateOpen(true)} variant="primary">+ Create User</Button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="textPrimary" style={{fontWeight:500}}>{u.full_name}</td>
                    <td className="textSecondary">{u.email}</td>
                    <td><span className="roleTag">{u.role}</span></td>
                    <td>
                      <span className={`statusTag ${u.is_active ? 'active' : 'inactive'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create User">
        <form onSubmit={handleCreate} className="form">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <div className="formGroup">
            <label className="label">Role</label>
            <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="SALES">Sales</option>
              <option value="HR">HR</option>
              <option value="TUTOR">Tutor</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
              <option value="FINANCE">Finance</option>
              <option value="RECEPTION">Reception</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="STUDENT">Student</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>
          <Button type="submit" variant="primary" className="btnFull">Save User</Button>
        </form>
      </Modal>
    </div>
  );
}