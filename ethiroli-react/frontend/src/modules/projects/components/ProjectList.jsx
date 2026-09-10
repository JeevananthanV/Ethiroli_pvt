import React, { useEffect, useState } from 'react';
import { getStudentProjects } from '../../../../services/api/projectApi.js';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getStudentProjects().catch(() => []);
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Student Projects</h2>
          <p className="pageSubtitle">Linked repositories and project submissions</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {projects.length === 0 ? (
            <div className="emptyState"><h3>No Projects</h3><p>No student projects linked yet.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Student</th><th>Repository</th><th>Status</th></tr></thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id}>
                    <td>{proj.student_name || proj.student_id}</td>
                    <td><code>{proj.repo_url || proj.repository_url}</code></td>
                    <td><span className="statusTag active">{proj.status || 'Linked'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
