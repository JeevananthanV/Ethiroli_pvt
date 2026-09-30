import React, { useState, useEffect, useCallback } from 'react';
import jobBoardApi from '../../../../services/api/jobBoardApi'

export default function JobPostingForm({ postId, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    category: '',
    description: '',
    requirements: '',
    benefits: '',
    salary: '',
    skills: [],
    media: [],
    status: 'draft',
  })

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId, fetchPost])

  const fetchPost = useCallback(async () => {
    try {
      const data = await jobBoardApi.getById(postId)
      setFormData(data)
    } catch (error) {
      console.error('Failed to fetch job board post:', error)
    }
  }, [postId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (postId) {
        await jobBoardApi.update(postId, formData)
      } else {
        await jobBoardApi.create(formData)
      }
      onSuccess?.()
      onClose?.()
    } catch (error) {
      alert('Failed to save job posting: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="formGroup">
        <label className="label required">Job Title</label>
        <input
          type="text"
          name="title"
          className="inputField"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gridCols2">
        <div className="formGroup">
          <label className="label required">Company</label>
          <input
            type="text"
            name="company"
            className="inputField"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formGroup">
          <label className="label required">Location</label>
          <input
            type="text"
            name="location"
            className="inputField"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid gridCols2">
        <div className="formGroup">
          <label className="label">Job Type</label>
          <select className="select" name="type" value={formData.type} onChange={handleChange}>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div className="formGroup">
          <label className="label">Category</label>
          <select className="select" name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select category</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
            <option value="hr">Human Resources</option>
            <option value="finance">Finance</option>
          </select>
        </div>
      </div>

      <div className="formGroup">
        <label className="label required">Description</label>
        <textarea
          name="description"
          className="inputField"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          required
        />
      </div>

      <div className="formGroup">
        <label className="label">Requirements</label>
        <textarea
          name="requirements"
          className="inputField"
          value={formData.requirements}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="formGroup">
        <label className="label">Benefits</label>
        <textarea
          name="benefits"
          className="inputField"
          value={formData.benefits}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="grid gridCols2">
        <div className="formGroup">
          <label className="label">Salary Range</label>
          <input
            type="text"
            name="salary"
            className="inputField"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. $50,000 - $80,000"
          />
        </div>

        <div className="formGroup">
          <label className="label">Skills (comma-separated)</label>
          <input
            type="text"
            className="inputField"
            value={formData.skills?.join(', ') || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              }))
            }
            placeholder="React, Node.js, SQL"
          />
        </div>
      </div>

      <div className="formGroup">
        <label className="label">Media Files</label>
        <input
          type="file"
          multiple
          className="inputField"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, media: Array.from(e.target.files || []) }))
          }
        />
      </div>

      <div className="formGroup">
        <label className="label">Status</label>
        <select className="select" name="status" value={formData.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex gap3">
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
        </button>
        <button type="button" className="btn secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  )
}
