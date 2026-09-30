import React, { useState } from 'react';
import interviewApi from '../../../../services/api/interviewApi'

export default function FeedbackForm({ interviewId, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    rating: 0,
    comments: '',
    strengths: '',
    weaknesses: '',
    recommendation: 'maybe',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await interviewApi.submitFeedback(interviewId, formData)
      onSubmit?.(formData)
      onClose?.()
    } catch (error) {
      alert('Failed to submit feedback: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="formGroup">
        <label className="label required">Rating</label>
        <div className="flex gap2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="btn secondary"
              style={{
                background: star <= formData.rating ? 'var(--admin-warning)' : 'transparent',
                color: star <= formData.rating ? 'white' : 'var(--admin-text-secondary)',
                border: '1px solid var(--admin-border)',
              }}
              onClick={() => handleRatingChange(star)}
            >
              {star}
            </button>
          ))}
        </div>
      </div>

      <div className="formGroup">
        <label className="label required">Recommendation</label>
        <select className="select" name="recommendation" value={formData.recommendation} onChange={handleChange}>
          <option value="strong_yes">Strong Yes</option>
          <option value="yes">Yes</option>
          <option value="maybe">Maybe</option>
          <option value="no">No</option>
          <option value="strong_no">Strong No</option>
        </select>
      </div>

      <div className="formGroup">
        <label className="label">Strengths</label>
        <textarea
          className="inputField"
          name="strengths"
          value={formData.strengths}
          onChange={handleChange}
          rows={3}
          placeholder="Key strengths observed..."
        />
      </div>

      <div className="formGroup">
        <label className="label">Weaknesses</label>
        <textarea
          className="inputField"
          name="weaknesses"
          value={formData.weaknesses}
          onChange={handleChange}
          rows={3}
          placeholder="Areas for improvement..."
        />
      </div>

      <div className="formGroup">
        <label className="label required">Comments</label>
        <textarea
          className="inputField"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          rows={4}
          placeholder="Detailed feedback..."
          required
        />
      </div>

      <div className="flex gap3">
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
        <button type="button" className="btn secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  )
}
