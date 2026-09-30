import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { courseApi } from '../../../services/api/courseApi'
import { projectApi } from '../../../services/api/projectApi'
import { assignmentApi } from '../../../services/api/assignmentApi'
import Button from '../../../common/components/Button'

export default function PMCalendar() {
  const [courses, setCourses] = useState([])
  const [projects, setProjects] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [coursesData, projectsData, assignmentsData] = await Promise.all([
        courseApi.getAll().catch(() => []),
        projectApi.getAll().catch(() => []),
        assignmentApi.getAll().catch(() => []),
      ])
      setCourses(coursesData)
      setProjects(projectsData)
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

  return (
    <AdminPage
      title="Project Calendar"
      subtitle="View project milestones and deadlines"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Projects</div>
          <div className="statValue">{projects.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Courses</div>
          <div className="statValue">{courses.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Tasks</div>
          <div className="statValue">{assignments.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Upcoming Milestones</h3>
        </div>
        <div className="overflowAuto">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 && courses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="textCenter textMuted py4">
                    No milestones found
                  </td>
                </tr>
              ) : (
                projects
                  .filter((p) => p.deadline)
                  .map((milestone, idx) => (
                    <tr key={`project-${idx}`}>
                      <td>Project</td>
                      <td className="fontSemibold">{milestone.name}</td>
                      <td className="textSecondary">
                        {new Date(milestone.deadline).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`statusTag ${milestone.status === 'active' ? 'active' : milestone.status === 'completed' ? 'active' : 'pending'}`}>
                          {milestone.status}
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
