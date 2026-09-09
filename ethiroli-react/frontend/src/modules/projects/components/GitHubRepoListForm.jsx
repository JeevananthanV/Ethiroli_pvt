import React, { useState, useEffect } from 'react';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import { listProjects, linkRepository } from '../../services/api/projectApi.js';

export default function GitHubRepoListForm({ onLinked }) {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [saving, setSaving] = useState(false);

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const data = await listProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProjectId || !repoUrl.trim()) {
      alert('Project and repository URL are required');
      return;
    }
    setSaving(true);
    try {
      await linkRepository({
        project_id: selectedProjectId,
        repo_url: repoUrl.trim(),
        branch,
      });
      setRepoUrl('');
      setBranch('main');
      setSelectedProjectId('');
      onLinked?.();
      alert('Repository linked successfully');
    } catch (err) {
      alert(`Failed to link repository: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="GitHub Repository Connection"
      subtitle="Link a GitHub repository to a project"
      loading={loadingProjects}
    >
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Link Repository</h3>
        </div>
        <div className="cardBody">
          <form onSubmit={handleSubmit} className="form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div className="formGroup">
                <label className="label required">Project</label>
                <select className="select" required value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                  <option value="">Select project...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div className="formGroup">
                <label className="label required">Repository URL</label>
                <input className="inputField" required type="url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/org/repo" />
              </div>
              <div className="formGroup">
                <label className="label">Branch</label>
                <input className="inputField" value={branch} onChange={(e) => setBranch(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? 'Linking...' : 'Link Repository'}
            </button>
          </form>
        </div>
      </div>
    </AdminPage>
  );
}
