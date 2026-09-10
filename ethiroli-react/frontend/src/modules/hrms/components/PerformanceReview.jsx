import React, { useState, useEffect } from 'react'
import AdminPage from '../../common/components/AdminPage'
import Button from '../../common/components/Button'
import Modal from '../../common/components/Modal'
import Input from '../../common/components/Input'
import { performanceApi } from '../../services/api/performanceApi'

export default function PerformanceReview() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [form, setForm] = useState({
    employeeId: '',
    employeeName: '',
    rating: '',
    goals: '',
    feedback: '',
    reviewDate: '',
  })

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await performanceApi.getAll()
      setReviews(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingReview(null)
    setForm({ employeeId: '', employeeName: '', rating: '', goals: '', feedback: '', reviewDate: '' })
    setModalOpen(true)
  }

  const handleEdit = (review) => {
    setEditingReview(review)
    setForm({
      employeeId: review.employeeId || '',
      employeeName: review.employeeName || '',
      rating: review.rating || '',
      goals: review.goals || '',
      feedback: review.feedback || '',
      reviewDate: review.reviewDate || '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const payload = { ...form, rating: parseInt(form.rating, 10) || 0 }
      if (editingReview) {
        await performanceApi.update(editingReview.id, payload)
        setReviews(reviews.map((r) => (r.id === editingReview.id ? { ...r, ...payload } : r)))
      } else {
        const data = await performanceApi.create(payload)
        setReviews([...reviews, data])
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminPage
      title="Performance Reviews"
      subtitle="Manage employee performance reviews"
      loading={loading}
      error={error}
      onRetry={loadReviews}
      actions={
        <Button variant="primary" onClick={handleCreate}>
          New Review
        </Button>
      }
    >
      <div className="card">
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Rating</th>
                <th>Review Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>
                    <span className="textMuted">No reviews found</span>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.employeeName || review.employeeId}</td>
                    <td>{review.rating}/5</td>
                    <td>{review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="small" variant="secondary" onClick={() => handleEdit(review)}>
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
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingReview ? 'Edit Review' : 'New Review'}>
        <div className="form">
          <div className="formGroup">
            <label className="label required">Employee Name</label>
            <Input value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} placeholder="Employee name" />
          </div>
          <div className="formGroup">
            <label className="label required">Rating (1-5)</label>
            <Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="5" />
          </div>
          <div className="formGroup">
            <label className="label">Goals</label>
            <textarea
              className="inputField"
              value={form.goals}
              onChange={(e) => setForm({ ...form, goals: e.target.value })}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="formGroup">
            <label className="label">Feedback</label>
            <textarea
              className="inputField"
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="formGroup">
            <label className="label">Review Date</label>
            <Input type="date" value={form.reviewDate} onChange={(e) => setForm({ ...form, reviewDate: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingReview ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  )
}
