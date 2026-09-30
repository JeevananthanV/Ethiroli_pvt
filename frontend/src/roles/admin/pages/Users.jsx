import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { getUsers, createUser, updateUser, deleteUser } from '../../../services/api/userApi'
import axiosInstance from '../../../services/api/axiosInstance.js'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({ full_name: '', email: '', role: 'EMPLOYEE', is_active: 1 })
  
  // Intern Promotion State
  const [promoteTarget, setPromoteTarget] = useState(null)
  const [promoteForm, setPromoteForm] = useState({ department: 'Engineering', designation: 'Junior Software Engineer', employee_code: '' })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getUsers()
      setUsers(data?.data || data || [])
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
        await updateUser(selectedUser.id, formData)
      } else {
        await createUser(formData)
      }
      setShowModal(false)
      setSelectedUser(null)
      setFormData({ full_name: '', email: '', role: 'EMPLOYEE', is_active: 1 })
      fetchUsers()
    } catch (err) {
      alert('Failed to save user: ' + err.message)
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      full_name: user.full_name || user.name || '',
      email: user.email || '',
      role: user.role || 'EMPLOYEE',
      is_active: user.is_active ?? 1,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate/delete this user?')) return
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (error) {
      alert('Failed to delete user: ' + error.message)
    }
  }

  const handlePromote = async (e) => {
    e.preventDefault()
    if (!promoteTarget) return
    setSubmitting(true)
    setFeedback(null)
    try {
      await axiosInstance.post(`/v1/interns/${promoteTarget.id}/promote`, {
        department: promoteForm.department,
        designation: promoteForm.designation,
        employee_code: promoteForm.employee_code || `EMP-${Date.now().toString().slice(-4)}`
      })
      setFeedback({
        type: 'success',
        message: `🎉 Success! Intern ${promoteTarget.full_name || promoteTarget.name} has been promoted to full-time Employee.`
      })
      setPromoteTarget(null)
      fetchUsers()
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || err.message || 'Failed to promote intern.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminPage
      title="User Accounts & Operational Roles"
      subtitle="Directory of staff, faculty, and learner accounts across all system roles"
      loading={loading}
      error={error}
      onRetry={fetchUsers}
      actions={
        <Button onClick={() => { setSelectedUser(null); setFormData({ full_name: '', email: '', role: 'EMPLOYEE', is_active: 1 }); setShowModal(true) }}>
          Add New User
        </Button>
      }
    >
      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show shadow-sm mb-2`} role="alert">
          <div>{feedback.message}</div>
          <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
        </div>
      )}

      <div className="card overflowAuto">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
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
                  <td className="fontSemibold">{user.full_name || user.name || 'User'}</td>
                  <td className="textSecondary">{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'SUPER_ADMIN' ? 'bg-danger' : user.role === 'ADMIN' ? 'bg-primary' : user.role === 'TUTOR' ? 'bg-info text-dark' : user.role === 'INTERN' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                      {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {user.role === 'INTERN' && (
                        <button 
                          className="btn btn-sm btn-outline-success shadow-sm py-1 px-2"
                          title="Promote Intern to Full-Time Employee"
                          onClick={() => {
                            setPromoteTarget(user)
                            setPromoteForm({ department: 'Engineering', designation: 'Junior Software Engineer', employee_code: `EMP-${Date.now().toString().slice(-4)}` })
                          }}
                        >
                          <i className="bi bi-award me-1"></i>Promote
                        </button>
                      )}
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

      {/* Intern Promotion Modal */}
      {promoteTarget && (
        <Modal 
          isOpen={Boolean(promoteTarget)} 
          onClose={() => setPromoteTarget(null)} 
          title="Promote Intern to Full-Time Employee"
        >
          <form onSubmit={handlePromote}>
            <div className="alert alert-success py-2 small mb-3">
              <i className="bi bi-mortarboard-fill me-1"></i>
              Promoting <strong>{promoteTarget.full_name || promoteTarget.name}</strong> will update their system role to <strong>EMPLOYEE</strong>, provision corporate payroll/leave entitlements, and maintain historical project submissions.
            </div>
            <div className="formGroup mb-3">
              <label className="label required small fw-semibold">Assigned Department</label>
              <select 
                className="form-select"
                value={promoteForm.department}
                onChange={e => setPromoteForm({ ...promoteForm, department: e.target.value })}
              >
                <option value="Engineering">Engineering & Development</option>
                <option value="Design">Product & UI/UX Design</option>
                <option value="Data Science">Data Science & AI</option>
                <option value="Marketing">Growth & Digital Marketing</option>
                <option value="Operations">Operations & HR</option>
              </select>
            </div>
            <div className="formGroup mb-3">
              <label className="label required small fw-semibold">Corporate Designation</label>
              <Input
                value={promoteForm.designation}
                onChange={e => setPromoteForm({ ...promoteForm, designation: e.target.value })}
                required
              />
            </div>
            <div className="formGroup mb-3">
              <label className="label required small fw-semibold">Employee Code</label>
              <Input
                value={promoteForm.employee_code}
                onChange={e => setPromoteForm({ ...promoteForm, employee_code: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button variant="secondary" onClick={() => setPromoteTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Promoting...' : 'Confirm Promotion & Update Role'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="formGroup mb-3">
              <label className="label required">Full Name</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            <div className="formGroup mb-3">
              <label className="label required">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="formGroup mb-3">
              <label className="label required">Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="HR">HR</option>
                <option value="TUTOR">TUTOR</option>
                <option value="FINANCE">FINANCE</option>
                <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                <option value="SALES">SALES</option>
                <option value="RECEPTION">RECEPTION</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="INTERN">INTERN</option>
                <option value="STUDENT">STUDENT</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
