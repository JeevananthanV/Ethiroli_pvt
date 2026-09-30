import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { jobApi } from '../../../services/api/jobApi'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import Input from '../../../common/components/Input'

export default function AdminJobsBoard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({ title: '', department: '', location: '', description: '', type: 'full-time', status: 'active' })

  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await jobApi.getPostings()
      setJobs(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !formData.type || job.type === formData.type
    return matchesSearch && matchesFilter && job.status === 'active'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedJob) {
        await jobApi.update(selectedJob.id, formData)
      } else {
        await jobApi.create(formData)
      }
      setShowModal(false)
      setSelectedJob(null)
      setFormData({ title: '', department: '', location: '', description: '', type: 'full-time', status: 'active' })
      fetchJobs()
    } catch (err) {
      alert('Failed to save job: ' + err.message)
    }
  }

  const handleEdit = (job) => {
    setSelectedJob(job)
    setFormData({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      description: job.description || '',
      type: job.type || 'full-time',
      status: job.status || 'active',
    })
    setShowModal(true)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'active'
      case 'paused':
        return 'pending'
      case 'closed':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Job Board"
      subtitle="Browse and manage job openings"
      loading={loading}
      error={error}
      onRetry={fetchJobs}
      actions={
        <Button onClick={() => { setSelectedJob(null); setFormData({ title: '', department: '', location: '', description: '', type: 'full-time', status: 'active' }); setShowModal(true) }}>
          Post New Job
        </Button>
      }
    >
      <div className="flex gap3 mb4">
        <input
          type="text"
          className="inputField"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <select
          className="select"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          style={{ maxWidth: '200px' }}
        >
          <option value="">All Types</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="emptyState">
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gridCols3">
          {filteredJobs.map((job) => (
            <div key={job.id} className="card">
              <div className="cardBody">
                <div className="flex justifyBetween itemsCenter mb3">
                  <span className={`statusTag ${getStatusClass(job.status)}`}>
                    {job.status}
                  </span>
                  <span className="textSecondary textSm">{job.type}</span>
                </div>
                <h3 className="fontSemibold textPrimary mb2">{job.title}</h3>
                <p className="textSecondary textSm mb2">{job.department}</p>
                <p className="textMuted textSm mb3">{job.location}</p>
                <p className="textSecondary textSm truncate">{job.description}</p>
                <div className="flex gap3 mt4">
                  <Button size="small" onClick={() => handleEdit(job)}>
                    Edit
                  </Button>
                  <Button size="small" variant="secondary" onClick={() => alert('View details')}>
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedJob ? 'Edit Job' : 'Create Job'}>
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
              <label className="label required">Department</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label required">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Description</label>
              <textarea
                className="inputField"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="formGroup">
              <label className="label">Type</label>
              <select
                className="select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedJob ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </AdminPage>
  )
}
