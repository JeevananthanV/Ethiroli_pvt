import React, { useState, useEffect } from 'react';
import enrollmentApi from '../../../../services/api/enrollmentApi'
import AdminPage from '../../../common/components/AdminPage'
import Button from '../../../common/components/Button'
import Modal from '../../../common/components/Modal'

export default function EnrollmentList() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentApi.getAll()
      setEnrollments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const handleStatusChange = async (id, status) => {
    try {
      if (status === 'completed') {
        await enrollmentApi.complete(id)
      } else {
        await enrollmentApi.updateProgress(id, status === 'in_progress' ? 50 : 0)
      }
      setEnrollments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      )
    } catch (error) {
      alert('Failed to update enrollment: ' + error.message)
    }
  }

  return (
    <AdminPage
      title="Enrollments"
      subtitle="Manage course enrollments"
      loading={loading}
      error={error}
      onRetry={fetchEnrollments}
      actions={
        <Button onClick={() => { }}>
          New Enrollment
        </Button>
      }
    >
      <div className="card overflowAuto">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Enrolled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan="6" className="textCenter textMuted py4">
                  No enrollments found
                </td>
              </tr>
            ) : (
              enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td className="fontSemibold">{enrollment.studentName || 'Unknown'}</td>
                  <td>{enrollment.courseName}</td>
                  <td>
                    <div className="flex itemsCenter gap2">
                      <div style={{ flex: 1, height: '8px', background: 'var(--admin-border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${enrollment.progress || 0}%`,
                            height: '100%',
                            background: 'var(--admin-primary)',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                      <span className="textSm">{enrollment.progress || 0}%</span>
                    </div>
                  </td>
                  <td>
                    <select
                      className="select"
                      value={enrollment.status}
                      onChange={(e) => handleStatusChange(enrollment.id, e.target.value)}
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '13px' }}
                    >
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </select>
                  </td>
                  <td className="textSecondary textSm">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </td>
                  <td>
                      <Button size="small" variant="secondary" onClick={() => { }}>
                        Edit
                      </Button>
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
