import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listProjects } from '../../../services/api/projectApi.js';

export default function StudentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProjects().catch(() => []);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getStatusClass = (status) => {
    if (!status) return 'inactive';
    const s = String(status).toLowerCase();
    if (['submitted', 'completed', 'approved', 'done'].includes(s)) return 'active';
    if (['in_progress', 'in-progress', 'review'].includes(s)) return 'pending';
    if (['rejected', 'overdue', 'cancelled'].includes(s)) return 'error';
    return 'inactive';
  };

  return (
    <AdminPage
      title="My Projects"
      subtitle="Track your project submissions and evaluations"
      loading={loading}
      error={error}
      onRetry={fetchProjects}
    >
      <div className="dashboard">
        {projects.length === 0 ? (
          <div className="emptyState">
            <h3>No projects yet</h3>
            <p>Your project submissions will appear here.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Project Submissions</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td style={{ fontWeight: 600 }}>{project.title || project.name}</td>
                      <td>{project.deadline ? new Date(project.deadline).toLocaleDateString() : '—'}</td>
                      <td>
                        <span className={`statusTag ${getStatusClass(project.status)}`}>
                          {project.status || 'Unknown'}
                        </span>
                      </td>
                      <td>{project.grade || project.evaluation || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}