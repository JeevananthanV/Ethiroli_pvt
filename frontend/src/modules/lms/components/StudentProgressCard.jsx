import React, { useState, useEffect, useCallback } from 'react';
import enrollmentApi from '../../../../services/api/enrollmentApi'
import BadgeDisplay from './BadgeDisplay'

export default function StudentProgressCard({ studentId, studentName }) {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEnrollments()
  }, [studentId, fetchEnrollments])

  const fetchEnrollments = useCallback(async () => {
    try {
      const data = await enrollmentApi.getAll()
      const studentEnrollments = data.filter((e) => e.userId === studentId)
      setEnrollments(studentEnrollments)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [studentId])

  if (loading) {
    return <div className="loading">Loading progress...</div>
  }

  if (error) {
    return <div className="emptyState textDanger">Error: {error}</div>
  }

  const completedCourses = enrollments.filter((e) => e.status === 'completed').length
  const inProgressCourses = enrollments.filter((e) => e.status === 'in_progress').length
  const averageProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0

  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">{studentName || 'Student Progress'}</h3>
        <span className={`statusTag ${averageProgress >= 80 ? 'active' : averageProgress >= 50 ? 'pending' : 'error'}`}>
          {averageProgress}% Complete
        </span>
      </div>
      <div className="cardBody">
        <div className="grid gridCols3 mb4">
          <div className="statCard">
            <div className="statLabel">Enrolled</div>
            <div className="statValue">{enrollments.length}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">In Progress</div>
            <div className="statValue">{inProgressCourses}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Completed</div>
            <div className="statValue">{completedCourses}</div>
          </div>
        </div>

        <div className="mb4">
          <h4 className="fontSemibold mb3">Overall Progress</h4>
          <div style={{ height: '12px', background: 'var(--admin-border)', borderRadius: '6px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${averageProgress}%`,
                height: '100%',
                background: averageProgress >= 80 ? 'var(--admin-success)' : averageProgress >= 50 ? 'var(--admin-warning)' : 'var(--admin-danger)',
                borderRadius: '6px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <div className="mb4">
          <h4 className="fontSemibold mb3">Current Courses</h4>
          <div className="flex flexCol gap2">
            {enrollments.filter((e) => e.status === 'in_progress').map((enrollment) => (
              <div key={enrollment.id} className="card" style={{ border: '1px solid var(--admin-border)' }}>
                <div className="cardBody">
                  <div className="flex justifyBetween itemsCenter">
                    <span className="fontMedium textPrimary">{enrollment.courseName}</span>
                    <span className="textSm">{enrollment.progress || 0}%</span>
                  </div>
                </div>
              </div>
            ))}
            {enrollments.filter((e) => e.status === 'in_progress').length === 0 && (
              <p className="textMuted textSm">No courses in progress</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="fontSemibold mb3">Badges</h4>
          <BadgeDisplay userId={studentId} />
        </div>
      </div>
    </div>
  )
}
