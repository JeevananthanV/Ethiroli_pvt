import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';
import DetailModal, { DetailRow, DetailSection, DetailBadge } from '../components/DetailModal.jsx';

/**
 * My Projects.
 *
 * Backed by `GET /v1/employee/projects`, which reads `project_members` joined to
 * `student_projects` for the signed-in employee only. A project appears here when
 * and only when the employee has actually been added to it - there is no sample
 * or fallback data, so an empty grid means no assignments yet.
 *
 * The card grid is a summary view; clicking a card opens the full record
 * (repository, branch, commit, role, joined date and the stored repo structure).
 */

const humanise = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
};

const formatDateTime = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
};

/**
 * `repo_structure` is a JSON column. It may arrive already parsed, as a JSON
 * string, or be null - so it is normalised here and rendered as an indented
 * tree rather than dumped as raw text.
 */
const parseRepoStructure = (raw) => {
  if (!raw) return null;
  let value = raw;
  if (typeof raw === 'string') {
    try {
      value = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') {
    // A single-level object is rendered as its own list of entries.
    return Object.entries(value).map(([name, meta]) => ({
      name,
      type: meta?.type || 'entry',
      ...(meta && typeof meta === 'object' ? meta : {})
    }));
  }
  return null;
};

const repoTypeIcon = (type) => {
  const t = String(type || '').toLowerCase();
  if (t.includes('dir') || t.includes('folder')) return 'bi-folder-fill';
  if (t.includes('img') || t.includes('image')) return 'bi-file-earmark-image';
  if (t.includes('md')) return 'bi-file-earmark-richtext';
  if (t.includes('json')) return 'bi-braces';
  if (t.includes('test') || t.includes('spec')) return 'bi-file-earmark-check';
  return 'bi-file-earmark';
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getMyProjects();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setProjects(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const activeCount = useMemo(() => projects.filter((p) => p.is_active).length, [projects]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (!showArchived && !p.is_active) return false;
      if (!term) return true;
      return [p.name, p.description, p.project_role, p.repo_name, p.branch]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
  }, [projects, search, showArchived]);

  const structure = useMemo(
    () => parseRepoStructure(selectedProject?.repo_structure),
    [selectedProject]
  );

  const archivedCount = projects.length - activeCount;

  return (
    <AdminPage
      title="My Projects"
      subtitle="Overview of assigned engineering projects and repository workspaces"
      loading={loading}
      error={error}
      onRetry={loadProjects}
    >
      {projects.length === 0 ? (
        <div className="card shadow-sm border-0">
          <EmptyState
            icon="bi-kanban"
            title="No projects assigned to you yet"
            text="When a project manager adds you to a project it will appear here with its repository and role. Nothing has been assigned to you yet."
          />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                {activeCount} active
              </span>
              {archivedCount > 0 && (
                <label className="d-flex align-items-center gap-2 small text-muted mb-0">
                  <input
                    type="checkbox"
                    className="form-check-input mt-0"
                    checked={showArchived}
                    onChange={(e) => setShowArchived(e.target.checked)}
                  />
                  Show archived ({archivedCount})
                </label>
              )}
            </div>

            <div className="input-group input-group-sm" style={{ maxWidth: '280px' }}>
              <span className="input-group-text bg-white">
                <i className="bi bi-search" aria-hidden="true"></i>
              </span>
              <input
                type="search"
                className="form-control"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search projects"
              />
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="card shadow-sm border-0">
              <EmptyState
                icon="bi-search"
                title="No matching projects"
                text="No project matches your search. Clear the search box to see all of your assignments."
                compact
              />
            </div>
          ) : (
            <div className="row g-4">
              {visible.map((item) => (
                <div key={item.project_id || item.id} className="col-md-6 col-xl-4">
                  <div
                    className="card h-100 shadow-sm border-0 border-top border-3 emp-project-card"
                    style={{ borderTopColor: item.is_active ? 'var(--emp-olive)' : '#adb5bd' }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View full details for ${item.name}`}
                    onClick={() => setSelectedProject(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedProject(item);
                      }
                    }}
                  >
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                        <DetailBadge tone={item.is_active ? 'success' : 'secondary'}>
                          {humanise(item.project_role) || 'Member'}
                        </DetailBadge>
                        <span className={`badge ${item.is_active ? 'bg-success' : 'bg-secondary'}`}>
                          {item.is_active ? 'Active' : 'Archived'}
                        </span>
                      </div>

                      <h5 className="card-title fw-bold text-dark mt-2 mb-1">{item.name || 'Unnamed Project'}</h5>

                      <p className="card-text text-muted small flex-grow-1 emp-project-card__desc">
                        {item.description || 'No detailed description available for this project repository.'}
                      </p>

                      <div className="border-top pt-3 mt-3">
                        <div className="d-flex align-items-center justify-content-between text-muted small mb-2">
                          <span><i className="bi bi-git me-1" aria-hidden="true"></i> Branch</span>
                          <code className="text-dark bg-light px-2 py-0.5 rounded">{item.branch || 'main'}</code>
                        </div>

                        <div className="d-flex align-items-center justify-content-between text-muted small">
                          <span>
                            <i className="bi bi-clock-history me-1" aria-hidden="true"></i>
                            Added {formatDate(item.joined_at) || 'unknown'}
                          </span>
                          <span className="fw-semibold" style={{ color: 'var(--emp-olive-dark)' }}>
                            View details <i className="bi bi-arrow-right" aria-hidden="true"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <DetailModal
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        icon="bi-kanban"
        accent={selectedProject?.is_active ? 'success' : 'secondary'}
        title={selectedProject?.name || 'Project'}
        subtitle={selectedProject ? `You are ${humanise(selectedProject.project_role) || 'a member'} on this project` : ''}
        badge={
          selectedProject && (
            <span className={`badge ${selectedProject.is_active ? 'bg-success' : 'bg-secondary'}`}>
              {selectedProject.is_active ? 'Active' : 'Archived'}
            </span>
          )
        }
        footer={
          selectedProject && (
            <>
              <button type="button" className="btn btn-light" onClick={() => setSelectedProject(null)}>
                Close
              </button>
              {selectedProject.github_repo_url && (
                <a
                  href={selectedProject.github_repo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-dark"
                >
                  <i className="bi bi-github me-1" aria-hidden="true"></i>
                  Open Repository
                </a>
              )}
            </>
          )
        }
      >
        {selectedProject && (
          <>
            <DetailSection title="Overview">
              <p className="emp-detail__prose mb-0">
                {selectedProject.description || 'No detailed description available for this project repository.'}
              </p>
            </DetailSection>

            <DetailSection title="Assignment" icon="bi-person-badge">
              <dl className="emp-detail__row-list mb-0">
                <DetailRow label="Your role" value={humanise(selectedProject.project_role)} />
                <DetailRow label="Added to project" value={formatDateTime(selectedProject.joined_at)} />
                <DetailRow label="Status" value={selectedProject.is_active ? 'Active' : 'Archived'} />
                <DetailRow label="Project ID" value={selectedProject.project_id} mono />
              </dl>
            </DetailSection>

            <DetailSection title="Repository" icon="bi-git">
              <dl className="emp-detail__row-list mb-0">
                <DetailRow label="Repository" value={selectedProject.github_repo_url} mono />
                <DetailRow label="Owner" value={selectedProject.repo_owner} />
                <DetailRow label="Repository name" value={selectedProject.repo_name} />
                <DetailRow label="Branch" value={selectedProject.branch} mono />
                <DetailRow label="Last commit" value={selectedProject.last_commit_hash} mono />
                <DetailRow label="Created" value={formatDateTime(selectedProject.created_at)} />
              </dl>
            </DetailSection>

            {structure && structure.length > 0 && (
              <DetailSection title="Repository structure" icon="bi-folder2-open">
                <ul className="emp-repo-tree list-unstyled mb-0">
                  {structure.map((entry, i) => {
                    const name = entry?.name ?? entry?.path ?? String(entry);
                    const type = entry?.type || (entry?.children ? 'dir' : 'file');
                    return (
                      <li key={`${name}-${i}`} className="emp-repo-tree__item">
                        <i className={`bi ${repoTypeIcon(type)} me-2`} aria-hidden="true"></i>
                        <span className="font-monospace">{name}</span>
                        {entry?.size != null && (
                          <span className="text-muted small ms-2">{entry.size}</span>
                        )}
                        {entry?.children && Array.isArray(entry.children) && entry.children.length > 0 && (
                          <ul className="list-unstyled mt-1 ms-4">
                            {entry.children.map((child, j) => (
                              <li key={`${child?.name ?? child}-${j}`} className="emp-repo-tree__item">
                                <i className={`bi ${repoTypeIcon(child?.type)} me-2`} aria-hidden="true"></i>
                                <span className="font-monospace">{child?.name ?? child}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </DetailSection>
            )}
          </>
        )}
      </DetailModal>
    </AdminPage>
  );
}
