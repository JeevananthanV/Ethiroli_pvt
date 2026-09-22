import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { assignmentApi } from '../../../services/api/assignmentApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending', dueDate: '' })

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await assignmentApi.getAll()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedTask) {
        await assignmentApi.update(selectedTask.id, formData)
      } else {
        await assignmentApi.create(formData)
      }
      setShowModal(false)
      setSelectedTask(null)
      setFormData({ title: '', description: '', status: 'pending', dueDate: '' })
      fetchTasks()
    } catch (err) {
      alert('Failed to save task: ' + err.message)
    }
  }

  const handleEdit = (task) => {
    setSelectedTask(task)
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'pending',
      dueDate: task.dueDate || '',
    })
    setShowModal(true)
  }

  const handleSubmitAssignment = async (taskId) => {
    try {
      await assignmentApi.submit(taskId, {})
      alert('Assignment submitted successfully!')
      fetchTasks()
    } catch (err) {
      alert('Failed to submit assignment: ' + err.message)
    }
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
      title="My Tasks"
      subtitle="View and manage your assignments and tasks"
      loading={loading}
      error={error}
      onRetry={fetchTasks}
      actions={
        <Button onClick={() => { setSelectedTask(null); setFormData({ title: '', description: '', status: 'pending', dueDate: '' }); setShowModal(true) }}>
          Add Task
        </Button>
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
              <th>Description</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="textCenter textMuted py4">
                  No tasks assigned
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td className="fontSemibold">{task.title}</td>
                  <td className="textSecondary">{task.description}</td>
                  <td>
                    <span className={`statusTag ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="textSecondary">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    <div className="flex gap2">
                      {task.status !== 'completed' && (
                        <Button size="small" variant="success" onClick={() => handleSubmitAssignment(task.id)}>
                          Submit
                        </Button>
                      )}
                      <Button size="small" onClick={() => handleEdit(task)}>
                        Edit
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
