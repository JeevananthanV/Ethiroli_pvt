import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { candidateApi } from '../../../services/api/candidateApi'
import { enrollmentApi } from '../../../services/api/enrollmentApi'
import { workflowApi } from '../../../services/api/workflowApi'
import Button from '../../../common/components/Button'

export default function ReceptionDashboard() {
  const [visitors, setVisitors] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [visitorsData, enrollmentsData, workflowsData] = await Promise.all([
        candidateApi.getAll().catch(() => []),
        enrollmentApi.getAll().catch(() => []),
        workflowApi.getAll().catch(() => []),
      ])
      setVisitors(visitorsData)
      setEnrollments(enrollmentsData)
      setWorkflows(workflowsData)
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
            Reception Dashboard
          </h1>
          <p style={{ color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
            Monitor visitor traffic, appointments, and check-ins.
          </p>
        </div>
        <Button onClick={loadData}>
          Refresh
        </Button>
      </div>

      <div className="grid gridCols4 mb4">
        <div className="statCard">
          <div className="statLabel">Today's Visitors</div>
          <div className="statValue">{visitors.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Check-ins</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {visitors.filter((v) => v.status === 'active' || v.status === 'checked-in').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Pending Appointments</div>
          <div className="statValue" style={{ color: 'var(--admin-warning)' }}>
            {workflows.filter((w) => w.status === 'pending').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Enrollments</div>
          <div className="statValue">{enrollments.length}</div>
        </div>
      </div>

      <div className="grid gridCols2" style={{ gap: '24px' }}>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Recent Visitors</h3>
          </div>
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Check-in Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visitors.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="textCenter textMuted py4">
                      No visitors today
                    </td>
                  </tr>
                ) : (
                  visitors.slice(0, 5).map((visitor) => (
                    <tr key={visitor.id}>
                      <td className="fontSemibold">{visitor.name}</td>
                      <td className="textSecondary">{visitor.email}</td>
                      <td className="textSecondary">
                        {visitor.createdAt ? new Date(visitor.createdAt).toLocaleString() : '-'}
                      </td>
                      <td>
                        <span className={`statusTag ${visitor.status === 'active' || visitor.status === 'checked-in' ? 'active' : 'pending'}`}>
                          {visitor.status || 'pending'}
                        </span>
                      </td>
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
              Register New Visitor
            </Button>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              View Today's Schedule
            </Button>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              Send Notification
            </Button>
            <Button variant="secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
