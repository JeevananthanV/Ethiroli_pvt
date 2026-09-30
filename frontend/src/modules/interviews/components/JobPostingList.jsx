import React, { useState, useEffect } from 'react';
import jobApi from '../../../services/api/jobApi'
import AdminPage from '../../../common/components/AdminPage'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import JobPostingForm from './JobPostingForm'

export default function JobPostingList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)

  const fetchJobs = async () => {
    try {
      const data = await jobApi.getAll()
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    try {
      await jobApi.delete(id)
      setJobs((prev) => prev.filter((j) => j.id !== id))
    } catch (error) {
      alert('Failed to delete job: ' + error.message)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await jobApi.update(id, { status })
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)))
    } catch (error) {
      alert('Failed to update status: ' + error.message)
    }
  }

  return (
    <AdminPage
      title="Job Postings"
      subtitle="Manage job listings"
      loading={loading}
      error={error}
      onRetry={fetchJobs}
      actions={
        <Button onClick={() => { setSelectedJob(null); setShowModal(true) }}>
          Create Job
        </Button>
      }
    >
      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="6" className="textCenter textMuted py4">
                  No job postings found
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td className="fontSemibold">{job.title}</td>
                  <td>{job.department}</td>
                  <td>{job.location}</td>
                  <td className="textSecondary">{job.type}</td>
                  <td>
                    <select
                      className="select"
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '13px' }}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td>
                    <div className="flex gap2">
                      <Button
                        size="small"
                        onClick={() => { setSelectedJob(job); setShowModal(true) }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDelete(job.id)}
                      >
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedJob ? 'Edit Job' : 'Create Job'}>
        <JobPostingForm
          jobId={selectedJob?.id}
          onClose={() => setShowModal(false)}
          onSuccess={fetchJobs}
        />
      </Modal>
    </AdminPage>
  )
}
