import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../services/api/userApi';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../common/components/Modal/Modal.jsx';
import Button from '../../common/components/Button/Button.jsx';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      const list = data?.data?.users || data?.data || data?.users || (Array.isArray(data) ? data : []);
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = (user) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? user : u));
    } else {
      setUsers([...users, user]);
    }
    setShowModal(false);
  };

  const getStatusClass = (status) => {
    if (!status) return 'pending';
    const lower = status.toLowerCase();
    if (lower === 'active') return 'active';
    if (lower === 'inactive') return 'inactive';
    return 'pending';
  };

  const getRoleClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'superadmin':
        return 'roleTag';
      case 'manager':
        return 'actionTag';
      default:
        return 'statusTag pending';
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadUsers}>Retry</button></div>;

  return (
    <AdminPage
      title="Users"
      subtitle="Manage user accounts and permissions"
      loading={loading}
      error={error}
      onRetry={loadUsers}
      actions={<button className="btn primary" onClick={handleAdd}>Add User</button>}
    >
      <div className="card">
        <div className="cardBody">
          {users.length === 0 ? (
            <div className="emptyState">
              <h3>No users found</h3>
              <p>Get started by adding your first user.</p>
            </div>
          ) : (
            <div className="overflowAuto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="textPrimary">{user.name}</td>
                      <td className="textSecondary">{user.email}</td>
                      <td>
                        <span className={getRoleClass(user.role)}>
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td>
                        <span className={`statusTag ${getStatusClass(user.status)}`}>
                          {user.status || 'Pending'}
                        </span>
                      </td>
                      <td className="textSecondary">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                      <td>
                        <div className="pageActions">
                          <button className="btn btnSm secondary" onClick={() => handleEdit(user)}>Edit</button>
                          <button className="btn btnSm danger" onClick={() => handleDelete(user.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingUser ? 'Edit User' : 'Add User'}>
          <UserFormModal
            userId={editingUser?.id}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        </Modal>
      )}
    </AdminPage>
  );
};

export default UserTable;
