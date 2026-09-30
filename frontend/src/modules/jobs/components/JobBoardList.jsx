import React, { useState, useEffect } from 'react';
import jobApi from '../../../services/api/jobApi'
import AdminPage from '../../../common/components/AdminPage'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'
import JobPostingForm from '../../interviews/components/JobPostingForm'

export default function JobBoardList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')

  const fetchJobs = async () => {
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
    const matchesFilter = !filterType || job.type === filterType
    return matchesSearch && matchesFilter && job.status === 'active'
  })

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
      subtitle="Browse and search job openings"
      loading={loading}
      error={error}
      onRetry={fetchJobs}
      actions={
        <Button onClick={() => { setSelectedJob(null); setShowModal(true) }}>
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
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
                  <Button size="small" onClick={() => { setSelectedJob(job); setShowModal(true) }}>
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
        <JobPostingForm
          jobId={selectedJob?.id}
          onClose={() => setShowModal(false)}
          onSuccess={fetchJobs}
        />
      </Modal>
    </AdminPage>
  )
}
