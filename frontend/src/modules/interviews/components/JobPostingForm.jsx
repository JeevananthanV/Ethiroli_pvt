import React, { useState, useEffect, useCallback } from 'react';
import jobApi from '../../../services/api/jobApi'

export default function JobPostingForm({ jobId, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    status: 'draft',
  })

  useEffect(() => {
    if (jobId) {
      fetchJob()
    }
  }, [jobId, fetchJob])

  const fetchJob = useCallback(async () => {
    try {
      const data = await jobApi.getById(jobId)
      setFormData(data)
    } catch (error) {
      console.error('Failed to fetch job:', error)
    }
  }, [jobId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (jobId) {
        await jobApi.update(jobId, formData)
      } else {
        await jobApi.create(formData)
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
          <label className="label required">Department</label>
          <input
            type="text"
            name="department"
            className="inputField"
            value={formData.department}
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
          <label className="label">Experience Level</label>
          <select className="select" name="experience" value={formData.experience} onChange={handleChange}>
            <option value="">Select level</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="lead">Lead</option>
          </select>
        </div>
      </div>

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
        <label className="label required">Description</label>
        <textarea
          name="description"
          className="inputField"
          value={formData.description}
          onChange={handleChange}
          rows={4}
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
          rows={3}
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

      <div className="formGroup">
        <label className="label">Status</label>
        <select className="select" name="status" value={formData.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="flex gap3">
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? 'Saving...' : jobId ? 'Update Job' : 'Create Job'}
        </button>
        <button type="button" className="btn secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  )
}
