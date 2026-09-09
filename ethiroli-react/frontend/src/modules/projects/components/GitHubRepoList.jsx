import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listProjects, linkRepository } from '../../services/api/projectApi.js';

export default function GitHubRepoList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncingId, setSyncingId] = useState(null);

  const loadProjects = async () => {
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
    loadProjects();
  }, []);

  const handleSync = async (project) => {
    setSyncingId(project.id);
    try {
      await linkRepository({ project_id: project.id, repo_url: project.github_url });
      alert(`Repository synced for ${project.name}`);
      loadProjects();
    } catch (err) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setSyncingId(null);
    }
  };

  const getSyncStatus = (project) => {
    if (!project.github_url) return 'not_linked';
    if (project.sync_status) return project.sync_status;
    if (project.last_synced_at) return 'synced';
    return 'pending';
  };

  const getSyncClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'synced':
      case 'success':
        return 'active';
      case 'syncing':
      case 'pending':
        return 'pending';
      case 'failed':
      case 'error':
        return 'error';
      default:
        return 'pending';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminPage
      title="GitHub Repositories"
      subtitle="Linked repositories and sync status"
      loading={loading}
      error={error}
      onRetry={loadProjects}
    >
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Repository Connections</h3>
        </div>
        <div className="cardBody" style={{ overflowX: 'auto' }}>
          {projects.length === 0 ? (
            <div className="emptyState">No projects found.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Repository</th>
                  <th>Branch</th>
                  <th>Sync Status</th>
                  <th>Last Synced</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const syncStatus = getSyncStatus(project);
                  return (
                    <tr key={project.id}>
                      <td className="textPrimary" style={{ fontWeight: 500 }}>{project.name}</td>
                      <td className="textSecondary">
                        {project.github_url ? (
                          <a href={project.github_url} target="_blank" rel="noreferrer">{project.github_url}</a>
                        ) : (
                          <span className="textMuted">Not linked</span>
                        )}
                      </td>
                      <td className="textSecondary">{project.branch || 'main'}</td>
                      <td>
                        <span className={`statusTag ${getSyncClass(syncStatus)}`}>
                          {syncStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="textSecondary">{formatDate(project.last_synced_at)}</td>
                      <td>
                        <button
                          className="btn primary"
                          style={{ padding: '4px 10px', fontSize: 12 }}
                          onClick={() => handleSync(project)}
                          disabled={syncingId === project.id || !project.github_url}
                        >
                          {syncingId === project.id ? 'Syncing...' : 'Sync Now'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
