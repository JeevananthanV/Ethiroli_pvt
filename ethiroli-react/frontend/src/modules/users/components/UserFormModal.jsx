import React, { useState, useEffect, useCallback } from 'react';
import { createUser, updateUser, getUser } from '../../services/api/userApi';
import Modal from '../../common/components/Modal/Modal.jsx';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const UserFormModal = ({ userId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const loadUser = useCallback(async () => {
    setError(null);
    try {
      const data = await getUser(userId);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'user',
        status: data.status || 'active',
      });
      setIsEdit(true);
    } catch (err) {
      setError(err.message);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId, loadUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let result;
      if (isEdit) {
        result = await updateUser(userId, formData);
      } else {
        result = await createUser(formData);
      }
      if (onSave) onSave(result);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={isEdit ? 'Edit User' : 'Add User'}>
      <form onSubmit={handleSubmit}>
        {error && <div className="emptyState" style={{ padding: '12px', marginBottom: '12px' }}><p className="textDanger">{error}</p></div>}
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          style={{ marginTop: '12px' }}
        />
        <div className="formGroup" style={{ marginTop: '12px' }}>
          <label className="label">Role</label>
          <select
            className="select"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>
        <div className="formGroup" style={{ marginTop: '12px' }}>
          <label className="label">Status</label>
          <select
            className="select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="pageActions" style={{ marginTop: '16px' }}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
