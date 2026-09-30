import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { projectApi } from '../../../services/api/projectApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function AdminPMS() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', status: 'active', client: '', deadline: '' })

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await projectApi.getAll()
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedProject) {
        await projectApi.update(selectedProject.id, formData)
      } else {
        await projectApi.create(formData)
      }
      setShowModal(false)
      setSelectedProject(null)
      setFormData({ name: '', description: '', status: 'active', client: '', deadline: '' })
      fetchProjects()
    } catch (err) {
      alert('Failed to save project: ' + err.message)
    }
  }

  const handleEdit = (project) => {
    setSelectedProject(project)
    setFormData({
      name: project.name || '',
      description: project.description || '',
      status: project.status || 'active',
      client: project.client || '',
      deadline: project.deadline || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await projectApi.delete(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      alert('Failed to delete project: ' + error.message)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'active'
      case 'completed':
        return 'active'
      case 'on-hold':
        return 'pending'
      case 'cancelled':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Project Management"
      subtitle="Manage projects, tasks, and clients"
      loading={loading}
      error={error}
      onRetry={fetchProjects}
      actions={
        <Button onClick={() => { setSelectedProject(null); setFormData({ name: '', description: '', status: 'active', client: '', deadline: '' }); setShowModal(true) }}>
          New Project
        </Button>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Total Projects</div>
          <div className="statValue">{projects.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Active</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {projects.filter((p) => p.status === 'active').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Completed</div>
          <div className="statValue" style={{ color: 'var(--admin-info)' }}>
            {projects.filter((p) => p.status === 'completed').length}
          </div>
        </div>
      </div>

      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Client</th>
              <th>Status</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="5" className="textCenter textMuted py4">
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id}>
                  <td className="fontSemibold">{project.name}</td>
                  <td>{project.client || 'N/A'}</td>
                  <td>
                    <span className={`statusTag ${getStatusClass(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="textSecondary">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    <div className="flex gap2">
                      <Button size="small" onClick={() => handleEdit(project)}>
                        Edit
                      </Button>
                      <Button size="small" variant="danger" onClick={() => handleDelete(project.id)}>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedProject ? 'Edit Project' : 'New Project'}>
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
              <label className="label">Description</label>
              <textarea
                className="inputField"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="formGroup">
              <label className="label">Client</label>
              <Input
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              />
            </div>
            <div className="formGroup">
              <label className="label">Deadline</label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            <div className="formGroup">
              <label className="label">Status</label>
              <select
                className="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedProject ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
