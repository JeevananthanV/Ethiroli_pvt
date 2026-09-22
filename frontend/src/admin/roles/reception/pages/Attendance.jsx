import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { candidateApi } from '../../../services/api/candidateApi'
import { enrollmentApi } from '../../../services/api/enrollmentApi'
import Button from '../../../common/components/Button'

export default function ReceptionAttendance() {
  const [visitors, setVisitors] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [visitorsData, enrollmentsData] = await Promise.all([
        candidateApi.getAll().catch(() => []),
        enrollmentApi.getAll().catch(() => []),
      ])
      setVisitors(visitorsData)
      setEnrollments(enrollmentsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <AdminPage
      title="Attendance"
      subtitle="Track visitor attendance and enrollment status"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Today's Visitors</div>
          <div className="statValue">{visitors.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Active Enrollments</div>
          <div className="statValue">{enrollments.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Check-ins</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {visitors.filter((v) => v.status === 'checked-in').length}
          </div>
        </div>
      </div>

      <div className="card overflowAuto">
        <div className="cardHeader">
          <h3 className="cardTitle">Visitor Log</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Purpose</th>
              <th>Check-in</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr>
                <td colSpan="5" className="textCenter textMuted py4">
                  No visitors today
                </td>
              </tr>
            ) : (
              visitors.map((visitor) => (
                <tr key={visitor.id}>
                  <td className="fontSemibold">{visitor.name}</td>
                  <td className="textSecondary">{visitor.email}</td>
                  <td>{visitor.position || 'Visit'}</td>
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
    </AdminPage>
  )
}
