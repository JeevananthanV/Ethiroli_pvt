import React, { useState, useEffect, useCallback } from 'react';
import assignmentApi from '../../../../services/api/assignmentApi'

export default function AssignmentSubmit({ assignmentId, onSuccess }) {
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    text: '',
    files: [],
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchData()
  }, [assignmentId, fetchData])

  const fetchData = useCallback(async () => {
    try {
      const [assignmentData] = await Promise.all([
        assignmentApi.getById(assignmentId),
      ])
      setAssignment(assignmentData)
    } catch (error) {
      console.error('Failed to fetch assignment data:', error)
    } finally {
      setLoading(false)
    }
  }, [assignmentId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      files: Array.from(e.target.files || []),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('text', formData.text)
      formData.files.forEach((file) => {
        formDataToSend.append('files', file)
      })

      await assignmentApi.submit(assignmentId, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSubmitted(true)
      onSuccess?.()
    } catch (error) {
      alert('Failed to submit assignment: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading assignment...</div>
  }

  if (!assignment) {
    return <div className="emptyState">Assignment not found</div>
  }

  if (submitted) {
    return (
      <div className="card">
        <div className="cardBody textCenter">
          <h3 className="textSuccess mb3">Assignment Submitted!</h3>
          <p className="textSecondary">Your assignment has been submitted successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">{assignment.title}</h3>
      </div>
      <div className="cardBody">
        <div className="mb4">
          <h4 className="fontSemibold mb2">Instructions</h4>
          <p className="textSecondary">{assignment.instructions || 'Complete the assignment and submit your work.'}</p>
        </div>

        {assignment.dueDate && (
          <div className="mb4">
            <span className="textMuted">Due: {new Date(assignment.dueDate).toLocaleString()}</span>
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label required">Submission Text</label>
            <textarea
              name="text"
              className="inputField"
              value={formData.text}
              onChange={handleChange}
              rows={5}
              required
              placeholder="Enter your submission text..."
            />
          </div>

          <div className="formGroup">
            <label className="label">Attach Files</label>
            <input
              type="file"
              multiple
              className="inputField"
              onChange={handleFileChange}
            />
            {formData.files.length > 0 && (
              <p className="textSecondary textSm mt2">
                {formData.files.length} file(s) selected
              </p>
            )}
          </div>

          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </form>
      </div>
    </div>
  )
}
