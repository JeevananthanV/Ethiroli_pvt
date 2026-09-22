import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { courseApi } from '../../../services/api/courseApi'
import { enrollmentApi } from '../../../services/api/enrollmentApi'
import { assignmentApi } from '../../../services/api/assignmentApi'
import { quizApi } from '../../../services/api/quizApi'

export default function EmployeeCalendar() {
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [assignments, setAssignments] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [coursesData, enrollmentsData, assignmentsData, quizzesData] = await Promise.all([
        courseApi.getAll().catch(() => []),
        enrollmentApi.getAll().catch(() => []),
        assignmentApi.getAll().catch(() => []),
        quizApi.getAll().catch(() => []),
      ])
      setCourses(coursesData)
      setEnrollments(enrollmentsData)
      setAssignments(assignmentsData)
      setQuizzes(quizzesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const events = [
    ...courses.map((c) => ({ ...c, type: 'course', date: c.createdAt || c.startDate })),
    ...enrollments.map((e) => ({ ...e, type: 'enrollment', date: e.enrolledAt || e.createdAt })),
    ...assignments.map((a) => ({ ...a, type: 'assignment', date: a.dueDate || a.createdAt })),
    ...quizzes.map((q) => ({ ...q, type: 'quiz', date: q.date || q.createdAt })),
  ].filter((e) => e.date).sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <AdminPage
      title="My Calendar"
      subtitle="View your personal events, courses, and deadlines"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      <div className="grid gridCols4 mb4">
        <div className="statCard">
          <div className="statLabel">My Courses</div>
          <div className="statValue">{courses.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Enrollments</div>
          <div className="statValue">{enrollments.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Assignments</div>
          <div className="statValue">{assignments.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Quizzes</div>
          <div className="statValue">{quizzes.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Upcoming Events</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="4" className="textCenter textMuted py4">
                    No upcoming events
                  </td>
                </tr>
              ) : (
                events.slice(0, 20).map((event, idx) => (
                  <tr key={idx}>
                    <td>{event.type}</td>
                    <td className="fontSemibold">{event.title || event.name || 'Untitled'}</td>
                    <td className="textSecondary">
                      {event.date ? new Date(event.date).toLocaleDateString() : '-'}
                    </td>
                    <td>
                      <span className={`statusTag ${event.status === 'published' || event.status === 'active' ? 'active' : 'pending'}`}>
                        {event.status || 'upcoming'}
                      </span>
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
