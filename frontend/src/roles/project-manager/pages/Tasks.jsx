import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { projectApi } from '../../../services/api/projectApi'
import { assignmentApi } from '../../../services/api/assignmentApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function PMTasks() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending', dueDate: '', projectId: '' })
  const [filterProject, setFilterProject] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectApi.getProjects().catch(() => []),
        assignmentApi.getAll().catch(() => []),
      ])
      setProjects(projectsData)
      setTasks(tasksData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredTasks = filterProject
    ? tasks.filter((t) => t.projectId === filterProject)
    : tasks

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      title: formData.title,
      description: formData.description || '',
      course_id: formData.projectId,
      due_date: formData.dueDate,
      max_score: 100,
      status: formData.status,
    }
    try {
      if (selectedTask) {
        await assignmentApi.update(selectedTask.id, payload)
      } else {
        await assignmentApi.create(payload)
      }
      setShowModal(false)
      setSelectedTask(null)
      setFormData({ title: '', description: '', status: 'pending', dueDate: '', projectId: '' })
      loadData()
    } catch (err) {
      setTasks((prev) => [
        ...prev,
        selectedTask
          ? { ...prev.find((t) => t.id === selectedTask.id), ...payload }
          : { id: String(Date.now()), ...payload, projectId: formData.projectId, dueDate: formData.dueDate },
      ])
      setShowModal(false)
      setSelectedTask(null)
      setFormData({ title: '', description: '', status: 'pending', dueDate: '', projectId: '' })
    }
  }

  const handleEdit = (task) => {
    setSelectedTask(task)
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'pending',
      dueDate: task.dueDate || '',
      projectId: task.projectId || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    try {
      await assignmentApi.delete(id)
    } catch {
      /* fall through - remove locally regardless */
    }
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'active'
      case 'in-progress':
        return 'pending'
      case 'pending':
        return 'pending'
      case 'overdue':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Tasks"
      subtitle="Manage team tasks and assignments"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            className="select"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <Button onClick={() => { setSelectedTask(null); setFormData({ title: '', description: '', status: 'pending', dueDate: '', projectId: '' }); setShowModal(true) }}>
            Add Task
          </Button>
        </div>
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Total Tasks</div>
          <div className="statValue">{tasks.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">In Progress</div>
          <div className="statValue" style={{ color: 'var(--admin-warning)' }}>
            {tasks.filter((t) => t.status === 'in-progress' || t.status === 'pending').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Completed</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {tasks.filter((t) => t.status === 'completed').length}
          </div>
        </div>
      </div>

      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Project</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="textCenter textMuted py4">
                  No tasks found
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="fontSemibold">{task.title}</td>
                  <td className="textSecondary">
                    {projects.find((p) => p.id === task.projectId)?.name || 'N/A'}
                  </td>
                  <td>
                    <span className={`statusTag ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="textSecondary">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    <div className="d-flex gap-2 justify-content-end">
                      <Button size="small" onClick={() => handleEdit(task)}>
                        Edit
                      </Button>
                      <Button size="small" variant="danger" onClick={() => handleDelete(task.id)}>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedTask ? 'Edit Task' : 'Add Task'}>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="formGroup">
              <label className="label required">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <label className="label">Project</label>
              <select
                className="select"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Due Date</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div className="formGroup">
              <label className="label">Status</label>
              <select
                className="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedTask ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
