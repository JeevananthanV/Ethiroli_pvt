import React, { useEffect, useState } from 'react';
import { listProjects } from '../../../services/api/projectApi.js';

export default function GitHubRepoLinker() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await listProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const linkedProjects = projects.filter(p => p.repositoryUrl);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading repositories...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{marginBottom: 20}}>
        <h4 style={{margin: '0 0 6px', fontSize: 16, fontWeight: 700}}>Link Repository</h4>
        <p style={{margin: 0, color: 'var(--admin-text-muted)', fontSize: 13.5}}>
          Synchronize student project submissions with branch commits
        </p>
      </div>

      {linkedProjects.length === 0 ? (
        <div className="emptyState">
          <h3>No linked repositories</h3>
          <p>Link repositories to track branch activity</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {linkedProjects.map(project => (
            <div
              key={project.id}
              onClick={() => setSelectedRepo(selectedRepo === project.id ? null : project.id)}
              style={{
                background: selectedRepo === project.id ? 'rgba(168, 85, 247, 0.08)' : 'var(--admin-bg-card)',
                border: `1px solid ${selectedRepo === project.id ? 'rgba(168, 85, 247, 0.25)' : 'var(--admin-border-subtle)'}`,
                borderRadius: 10,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: 14, marginBottom: 4}}>{project.title}</div>
                  <div style={{fontSize: 12, color: 'var(--admin-text-muted)'}}>
                    {project.student?.name || project.studentName || 'Student'} • {project.repositoryUrl}
                  </div>
                </div>
                <span className="statusTag active">Linked</span>
              </div>
              {selectedRepo === project.id && (
                <div style={{marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--admin-border-subtle)', fontSize: 12, color: 'var(--admin-text-secondary)'}}>
                  <p style={{margin: '0 0 4px'}}><strong>Repository:</strong> {project.repositoryUrl}</p>
                  <p style={{margin: 0}}><strong>Default Branch:</strong> main</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
