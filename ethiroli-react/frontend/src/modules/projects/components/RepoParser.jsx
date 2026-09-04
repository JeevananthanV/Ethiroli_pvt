import React, { useEffect, useState } from 'react';
import { listProjects } from '../../../services/api/projectApi.js';

export default function RepoParser() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState({});
  const [parsedData, setParsedData] = useState({});

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

  const handleParse = async (projectId) => {
    setParsing(prev => ({ ...prev, [projectId]: true }));
    try {
      const res = await fetch(`/api/v1/student-projects/projects/${projectId}/parse-repo`);
      const data = await res.json();
      setParsedData(prev => ({ ...prev, [projectId]: data }));
    } catch {
      alert('Failed to parse repository');
    } finally {
      setParsing(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const linkedProjects = projects.filter(p => p.repositoryUrl);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading repository data...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{marginBottom: 20}}>
        <h4 style={{margin: '0 0 6px', fontSize: 16, fontWeight: 700}}>Repository Parser</h4>
        <p style={{margin: 0, color: 'var(--admin-text-muted)', fontSize: 13.5}}>
          Analyze repository structure and commit history
        </p>
      </div>

      {linkedProjects.length === 0 ? (
        <div className="emptyState">
          <h3>No linked repositories</h3>
          <p>Link repositories first to parse their contents</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {linkedProjects.map(project => (
            <div key={project.id} style={{
              background: 'var(--admin-bg-card)',
              border: '1px solid var(--admin-border-subtle)',
              borderRadius: 10,
              padding: '14px 18px'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: parsedData[project.id] ? 12 : 0}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: 14, marginBottom: 4}}>{project.title}</div>
                  <div style={{fontSize: 12, color: 'var(--admin-text-muted)'}}>
                    {project.repositoryUrl}
                  </div>
                </div>
                <button
                  className="btn primary btnSm"
                  onClick={() => handleParse(project.id)}
                  disabled={parsing[project.id]}
                >
                  {parsing[project.id] ? 'Parsing...' : 'Parse Repo'}
                </button>
              </div>

              {parsedData[project.id] && (
                <div style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: '1px solid var(--admin-border-subtle)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: 12
                }}>
                  <div className="statCard" style={{padding: '12px 14px'}}>
                    <p className="statLabel">Branches</p>
                    <p className="statValue" style={{fontSize: 22}}>{parsedData[project.id].branchCount ?? '—'}</p>
                  </div>
                  <div className="statCard" style={{padding: '12px 14px'}}>
                    <p className="statLabel">Commits</p>
                    <p className="statValue" style={{fontSize: 22}}>{parsedData[project.id].commitCount ?? '—'}</p>
                  </div>
                  <div className="statCard" style={{padding: '12px 14px'}}>
                    <p className="statLabel">Language</p>
                    <p className="statValue" style={{fontSize: 22}}>{parsedData[project.id].language || '—'}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
