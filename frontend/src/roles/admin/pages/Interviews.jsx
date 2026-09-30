import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { interviewApi } from '../../../services/api/interviewApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'

export default function AdminInterviews() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState(null)
  const [formData, setFormData] = useState({ candidateName: '', interviewer: '', date: '', time: '', type: 'online', status: 'scheduled' })

  const fetchInterviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await interviewApi.getAll()
      setInterviews(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterviews()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedInterview) {
        await interviewApi.update(selectedInterview.id, formData)
      } else {
        await interviewApi.create(formData)
      }
      setShowModal(false)
      setSelectedInterview(null)
      setFormData({ candidateName: '', interviewer: '', date: '', time: '', type: 'online', status: 'scheduled' })
      fetchInterviews()
    } catch (err) {
      alert('Failed to save interview: ' + err.message)
    }
  }

  const handleEdit = (interview) => {
    setSelectedInterview(interview)
    setFormData({
      candidateName: interview.candidateName || '',
      interviewer: interview.interviewer || '',
      date: interview.date || '',
      time: interview.time || '',
      type: interview.type || 'online',
      status: interview.status || 'scheduled',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) return
    try {
      await interviewApi.delete(id)
      setInterviews((prev) => prev.filter((i) => i.id !== id))
    } catch (error) {
      alert('Failed to delete interview: ' + error.message)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await interviewApi.updateStatus(id, status)
      setInterviews((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    } catch (error) {
      alert('Failed to update status: ' + error.message)
    }
  }

  return (
    <AdminPage
      title="Interviews"
      subtitle="Manage scheduled interviews"
      loading={loading}
      error={error}
      onRetry={fetchInterviews}
      actions={
        <Button onClick={() => { setSelectedInterview(null); setFormData({ candidateName: '', interviewer: '', date: '', time: '', type: 'online', status: 'scheduled' }); setShowModal(true) }}>
          Schedule Interview
        </Button>
      }
    >
      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Interviewer</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.length === 0 ? (
              <tr>
                <td colSpan="7" className="textCenter textMuted py4">
                  No interviews scheduled
                </td>
              </tr>
            ) : (
              interviews.map((interview) => (
                <tr key={interview.id}>
                  <td className="fontSemibold">{interview.candidateName || 'Unknown'}</td>
                  <td>{interview.interviewer}</td>
                  <td>{interview.date}</td>
                  <td>{interview.time}</td>
                  <td className="textSecondary">{interview.type}</td>
                  <td>
                    <select
                      className="select"
                      value={interview.status}
                      onChange={(e) => handleStatusChange(interview.id, e.target.value)}
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '13px' }}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div className="flex gap2">
                      <Button size="small" onClick={() => handleEdit(interview)}>
                        Edit
                      </Button>
                      <Button size="small" variant="danger" onClick={() => handleDelete(interview.id)}>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedInterview ? 'Edit Interview' : 'Schedule Interview'}>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="formGroup">
              <label className="label required">Candidate Name</label>
              <input
                className="inputField"
                value={formData.candidateName}
                onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label required">Interviewer</label>
              <input
                className="inputField"
                value={formData.interviewer}
                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label required">Date</label>
              <input
                className="inputField"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label required">Time</label>
              <input
                className="inputField"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Type</label>
              <select
                className="select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            <div className="formGroup">
              <label className="label">Status</label>
              <select
                className="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedInterview ? 'Update' : 'Schedule'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
