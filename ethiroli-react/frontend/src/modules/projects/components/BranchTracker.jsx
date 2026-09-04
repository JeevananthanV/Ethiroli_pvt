import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listProjects } from '../../../services/api/projectApi.js';

export default function BranchTracker() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState({});
  const [tracking, setTracking] = useState({});

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTrack = async (projectId) => {
    setTracking(prev => ({ ...prev, [projectId]: true }));
    try {
      const res = await fetch(`/api/v1/student-projects/projects/${projectId}/branches`);
      const data = await res.json();
      setBranches(prev => ({ ...prev, [projectId]: data }));
    } catch {
      alert('Failed to track branches');
    } finally {
      setTracking(prev => ({ ...prev, [projectId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading project branches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)'}}>
        <p style={{color: 'var(--admin-danger)', margin: 0}}>{error}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{marginBottom: 20}}>
        <h3 style={{margin: '0 0 4px', fontSize: 18, fontWeight: 700}}>Branch Tracker</h3>
        <p style={{margin: 0, color: 'var(--admin-text-muted)', fontSize: 13.5}}>Monitor branch activity across student repositories</p>
      </div>

      {projects.length === 0 ? (
        <div className="emptyState">
          <h3>No projects found</h3>
          <p>Projects will appear here once created</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {projects.map(project => (
            <div key={project.id} style={{
              background: 'var(--admin-bg-card)',
              border: '1px solid var(--admin-border-subtle)',
              borderRadius: 10,
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div>
                <div style={{fontWeight: 600, fontSize: 14, marginBottom: 4}}>{project.title}</div>
                <div style={{fontSize: 12, color: 'var(--admin-text-muted)'}}>
                  {project.student?.name || project.studentName || 'Unknown Student'}
                </div>
              </div>
              {branches[project.id] ? (
                <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
                  {(branches[project.id] || []).map(branch => (
                    <span key={branch.name} className="statusTag active" style={{fontSize: 12}}>
                      {branch.name}
                    </span>
                  ))}
                </div>
              ) : (
                <button
                  className="btn primary btnSm"
                  onClick={() => handleTrack(project.id)}
                  disabled={tracking[project.id]}
                >
                  {tracking[project.id] ? 'Tracking...' : 'Track Branches'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
