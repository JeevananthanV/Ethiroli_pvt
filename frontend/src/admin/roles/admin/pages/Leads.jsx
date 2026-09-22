import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { candidateApi } from '../../../services/api/candidateApi'
import { interviewApi } from '../../../services/api/interviewApi'
import Button from '../../../common/components/Button'

export default function AdminLeads() {
  const [candidates, setCandidates] = useState([])
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [candidatesData, interviewsData] = await Promise.all([
        candidateApi.getAll().catch(() => []),
        interviewApi.getAll().catch(() => []),
      ])
      setCandidates(candidatesData)
      setInterviews(interviewsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const leads = candidates.map((c) => ({
    ...c,
    source: 'candidate',
    status: c.status || 'new',
  }))

  const filteredLeads = filterStatus
    ? leads.filter((l) => l.status === filterStatus)
    : leads

  const getStatusClass = (status) => {
    switch (status) {
      case 'new':
        return 'pending'
      case 'contacted':
        return 'pending'
      case 'qualified':
        return 'active'
      case 'converted':
        return 'active'
      case 'lost':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="Leads"
      subtitle="Manage and track leads through the pipeline"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <select
          className="select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      }
    >
      <div className="grid gridCols4 mb4">
        <div className="statCard">
          <div className="statLabel">Total Leads</div>
          <div className="statValue">{leads.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">New</div>
          <div className="statValue" style={{ color: 'var(--admin-warning)' }}>
            {leads.filter((l) => l.status === 'new').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Qualified</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {leads.filter((l) => l.status === 'qualified' || l.status === 'converted').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Interviews</div>
          <div className="statValue">{interviews.length}</div>
        </div>
      </div>

      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Status</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="6" className="textCenter textMuted py4">
                  No leads found
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="fontSemibold">{lead.name}</td>
                  <td className="textSecondary">{lead.email}</td>
                  <td>{lead.position || 'N/A'}</td>
                  <td>
                    <span className={`statusTag ${getStatusClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>{lead.source}</td>
                  <td>
                    <div className="flex gap2">
                      <Button size="small" onClick={() => alert('Contact lead')}>
                        Contact
                      </Button>
                      <Button size="small" variant="secondary" onClick={() => alert('View details')}>
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminPage>
  )
}
