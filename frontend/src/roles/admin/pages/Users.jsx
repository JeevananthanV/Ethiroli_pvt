import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { candidateApi } from '../../../services/api/candidateApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user', status: 'active' })

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await candidateApi.getAll()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedUser) {
        await candidateApi.update(selectedUser.id, formData)
      } else {
        await candidateApi.create(formData)
      }
      setShowModal(false)
      setSelectedUser(null)
      setFormData({ name: '', email: '', role: 'user', status: 'active' })
      fetchUsers()
    } catch (err) {
      alert('Failed to save user: ' + err.message)
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      status: user.status || 'active',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await candidateApi.delete(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (error) {
      alert('Failed to delete user: ' + error.message)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'active'
      case 'inactive':
        return 'error'
      case 'pending':
        return 'pending'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Users"
      subtitle="Manage platform users and permissions"
      loading={loading}
      error={error}
      onRetry={fetchUsers}
      actions={
        <Button onClick={() => { setSelectedUser(null); setFormData({ name: '', email: '', role: 'user', status: 'active' }); setShowModal(true) }}>
          Add User
        </Button>
      }
    >
      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="textCenter textMuted py4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="fontSemibold">{user.name}</td>
                  <td className="textSecondary">{user.email}</td>
                  <td>{user.role || 'user'}</td>
                  <td>
                    <span className={`statusTag ${getStatusClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap2">
                      <Button size="small" onClick={() => handleEdit(user)}>
                        Edit
                      </Button>
                      <Button size="small" variant="danger" onClick={() => handleDelete(user.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="formGroup">
              <label className="label required">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label required">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Role</label>
              <select
                className="select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="formGroup">
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
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedUser ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
