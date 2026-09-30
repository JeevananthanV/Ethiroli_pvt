import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage'
import { projectApi } from '../../../services/api/projectApi'
import { assignmentApi } from '../../../services/api/assignmentApi'
import { subscriptionApi } from '../../../services/api/subscriptionApi'
import Button from '../../../common/components/Button'

export default function PMDashboard() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [projectsData, tasksData, clientsData] = await Promise.all([
        projectApi.getAll().catch(() => []),
        assignmentApi.getAll().catch(() => []),
        subscriptionApi.getAll().catch(() => []),
      ])
      setProjects(projectsData)
      setTasks(tasksData)
      setClients(clientsData)
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
            PM Dashboard
          </h1>
          <p style={{ color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
            Manage projects, tasks, and client relationships.
          </p>
        </div>
        <Button onClick={loadData}>
          Refresh
        </Button>
      </div>

      <div className="grid gridCols4 mb4">
        <div className="statCard">
          <div className="statLabel">Projects</div>
          <div className="statValue">{projects.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Active Tasks</div>
          <div className="statValue" style={{ color: 'var(--admin-success)' }}>
            {tasks.filter((t) => t.status === 'in-progress' || t.status === 'pending').length}
          </div>
        </div>
        <div className="statCard">
          <div className="statLabel">Clients</div>
          <div className="statValue">{clients.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Completion Rate</div>
          <div className="statValue" style={{ color: 'var(--admin-info)' }}>
            {tasks.length > 0 ? Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="grid gridCols2" style={{ gap: '24px' }}>
        <div className="card">
          <div className="cardHeader">
            <h3 className="cardTitle">Recent Projects</h3>
          </div>
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="textCenter textMuted py4">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  projects.slice(0, 5).map((project) => (
                    <tr key={project.id}>
                      <td className="fontSemibold">{project.name}</td>
                      <td>
                        <span className={`statusTag ${project.status === 'active' ? 'active' : project.status === 'completed' ? 'active' : 'pending'}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="textSecondary">
                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}
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
            <h3 className="cardTitle">Recent Tasks</h3>
          </div>
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="textCenter textMuted py4">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  tasks.slice(0, 5).map((task) => (
                    <tr key={task.id}>
                      <td className="fontSemibold">{task.title}</td>
                      <td>
                        <span className={`statusTag ${task.status === 'completed' ? 'active' : task.status === 'overdue' ? 'error' : 'pending'}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="textSecondary">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
