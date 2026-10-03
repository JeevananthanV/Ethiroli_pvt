import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getMyProjects();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setProjects(list);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <AdminPage
      title="My Projects"
      subtitle="Overview of assigned engineering projects and repository workspaces"
      loading={loading}
      error={error}
      onRetry={loadProjects}
    >
      <div className="row g-4">
        {projects.length === 0 ? (
          <div className="col-12"><EmptyState icon="bi-kanban" text="No projects assigned to you yet." /></div>
        ) : (
          projects.map((item) => (
            <div key={item.project_id || item.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 border-top border-primary border-3">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">
                      {item.project_role || 'MEMBER'}
                    </span>
                    <span className={`badge ${item.is_active ? 'bg-success' : 'bg-secondary'}`}>
                      {item.is_active ? 'Active' : 'Archived'}
                    </span>
                  </div>

                  <h5 className="card-title fw-bold text-dark mt-2 mb-1">{item.name || 'Unnamed Project'}</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    {item.description || 'No detailed description available for this project repository.'}
                  </p>

                  <div className="border-top pt-3 mt-3">
                    <div className="d-flex align-items-center justify-content-between text-muted small mb-2">
                      <span><i className="bi bi-git me-1"></i> Branch</span>
                      <code className="text-dark bg-light px-2 py-0.5 rounded">{item.branch || 'main'}</code>
                    </div>

                    {item.github_repo_url && (
                      <a
                        href={item.github_repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="bi bi-github"></i>
                        <span>Open Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPage>
  );
}
