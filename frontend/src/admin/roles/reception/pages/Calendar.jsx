import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { enrollmentApi } from '../../../services/api/enrollmentApi'
import { assignmentApi } from '../../../services/api/assignmentApi'
import Button from '../../../common/components/Button'

export default function ReceptionCalendar() {
  const [enrollments, setEnrollments] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [enrollmentsData, assignmentsData] = await Promise.all([
        enrollmentApi.getAll().catch(() => []),
        assignmentApi.getAll().catch(() => []),
      ])
      setEnrollments(enrollmentsData)
      setAssignments(assignmentsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const appointments = [
    ...enrollments.map((e) => ({ ...e, type: 'enrollment', date: e.enrolledAt || e.createdAt })),
    ...assignments.map((a) => ({ ...a, type: 'assignment', date: a.dueDate || a.createdAt })),
  ].filter((e) => e.date).sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <AdminPage
      title="Appointments"
      subtitle="Manage visitor appointments and schedules"
      loading={loading}
      error={error}
      onRetry={loadData}
      actions={
        <input
          type="date"
          className="inputField"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ width: '200px' }}
        />
      }
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Appointments Today</div>
          <div className="statValue">{appointments.filter((a) => a.date === selectedDate).length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Enrollments</div>
          <div className="statValue">{enrollments.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Assignments</div>
          <div className="statValue">{assignments.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Today's Schedule</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="textCenter textMuted py4">
                    No appointments scheduled
                  </td>
                </tr>
              ) : (
                appointments.slice(0, 20).map((appt, idx) => (
                  <tr key={idx}>
                    <td>{appt.type}</td>
                    <td className="fontSemibold">{appt.title || appt.name || 'Untitled'}</td>
                    <td className="textSecondary">
                      {appt.date ? new Date(appt.date).toLocaleTimeString() : '-'}
                    </td>
                    <td>
                      <span className="statusTag active">Scheduled</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  )
}
