import React, { useEffect, useState } from 'react'
import AdminPage from '../../../common/components/AdminPage'
import { projectApi } from '../../../services/api/projectApi'
import Button from '../../../common/components/Button'

export default function InternProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await projectApi.getAll()
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'active'
      case 'completed':
        return 'active'
      case 'on-hold':
        return 'pending'
      case 'cancelled':
        return 'error'
      default:
        return 'pending'
    }
  }

  return (
    <AdminPage
      title="My Projects"
      subtitle="View your assigned projects and progress"
      loading={loading}
      error={error}
      onRetry={fetchProjects}
    >
      <div className="grid gridCols3 mb4">
        <div className="statCard">
          <div className="statLabel">Total Projects</div>
          <div className="statValue">{projects.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Active</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {projects.filter((p) => p.status === 'active').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Completed</div>
          <div className="statValue" style={{ color: 'var(--admin-info)' }}>
            {projects.filter((p) => p.status === 'completed').length}
          </div>
        </div>
      </div>

      <div className="grid gridCols3">
        {projects.map((project) => (
          <div key={project.id} className="card">
            <div className="cardBody">
              <div className="flex justifyBetween itemsCenter mb3">
                <span className={`statusTag ${getStatusClass(project.status)}`}>
                  {project.status}
                </span>
                <span className="textMuted textSm">{project.client || 'Internal'}</span>
              </div>
              <h3 className="fontSemibold textPrimary mb2">{project.name}</h3>
              <p className="textSecondary textSm mb3 truncate">{project.description}</p>
              {project.deadline && (
                <p className="textMuted textSm">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
              )}
              <div className="flex gap3 mt4">
                <Button size="small" onClick={() => alert('View project details')}>
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && (
        <div className="emptyState">
          <h3>No projects assigned</h3>
          <p>You will see your assigned projects here.</p>
        </div>
      )}
    </AdminPage>
  )
}
