import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { candidateApi } from '../../../services/api/candidateApi'
import { interviewApi } from '../../../services/api/interviewApi'
import Button from '../../../common/components/Button'

export default function SalesDashboard() {
  const [leads, setLeads] = useState([])
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [leadsData, interviewsData] = await Promise.all([
        candidateApi.getAll().catch(() => []),
        interviewApi.getAll().catch(() => []),
      ])
      setLeads(leadsData)
      setInterviews(interviewsData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div>
      <div className="pageHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="pageTitle" style={{ fontSize: '26px', fontWeight: '700', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Sales Dashboard
          </h1>
          <p style={{ color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
            Track leads, pipeline, and conversion metrics.
          </p>
        </div>
        <Button onClick={loadData}>
          Refresh
        </Button>
      </div>

      <div className="grid gridCols4 mb4">
        <div className="statCard">
          <div className="statLabel">Total Leads</div>
          <div className="statValue">{leads.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">New Leads</div>
          <div className="statValue" style={{ color: 'var(--admin-warning)' }}>
            {leads.filter((l) => l.status === 'new').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Converted</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {leads.filter((l) => l.status === 'converted' || l.status === 'qualified').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Interviews</div>
          <div className="statValue">{interviews.length}</div>
        </div>
      </div>

      <div className="grid gridCols2" style={{ gap: '24px' }}>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Lead Pipeline</h3>
            <span className="statusTag active">Live</span>
          </div>
          <div className="cardBody overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="textCenter textMuted py4">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="fontSemibold">{lead.name}</td>
                      <td>
                        <span className={`statusTag ${lead.status === 'qualified' || lead.status === 'converted' ? 'active' : lead.status === 'lost' ? 'error' : 'pending'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="textSecondary">{lead.position || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Quick Actions</h3>
          </div>
          <div className="cardBody" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              Add New Lead
            </Button>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              Schedule Follow-up
            </Button>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              View Reports
            </Button>
            <Button variant="success" style={{ width: '100%', justifyContent: 'flex-start' }}>
              Export Leads
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
