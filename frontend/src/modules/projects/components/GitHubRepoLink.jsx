import React, { useEffect, useState } from 'react';
import { listProjects } from '../../../services/api/projectApi.js';
import { linkRepository } from '../../../services/api/projectApi.js';

export default function GitHubRepoLink() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await listProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch {
        setMessage({ type: 'error', text: 'Failed to load projects' });
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleLink = async (e) => {
    e.preventDefault();
    if (!selectedProject || !repoUrl) return;
    setLinking(true);
    setMessage(null);
    try {
      await linkRepository({ projectId: selectedProject, repositoryUrl: repoUrl });
      setMessage({ type: 'success', text: 'Repository linked successfully!' });
      setRepoUrl('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to link repository' });
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="card">
      <div style={{marginBottom: 20}}>
        <h3 style={{margin: '0 0 4px', fontSize: 18, fontWeight: 700}}>Link GitHub Repository</h3>
        <p style={{margin: 0, color: 'var(--admin-text-muted)', fontSize: 13.5}}>
          Synchronize student project submissions with branch commits
        </p>
      </div>

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : (
        <form onSubmit={handleLink} style={{display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480}}>
          <div className="formGroup">
            <label className="label">Select Project <span className="required">*</span></label>
            <select
              className="select"
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              required
            >
              <option value="">Choose a project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label className="label">GitHub Repository URL <span className="required">*</span></label>
            <input
              type="url"
              className="inputField"
              value={repoUrl}
              onChange={e => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              required
            />
          </div>

          {message && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
              color: message.type === 'success' ? 'var(--admin-success)' : 'var(--admin-danger)',
              fontSize: 13.5
            }}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn primary" disabled={linking || !selectedProject || !repoUrl}>
            {linking ? 'Linking...' : 'Link Repository'}
          </button>
        </form>
      )}
    </div>
  );
}
