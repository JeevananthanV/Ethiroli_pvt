import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage';
import { projectApi } from '../../../services/api/projectApi';

const EMPTY_FORM = {
  name: '',
  description: '',
  github_repo_url: '',
  branch: 'main',
  is_active: true,
  manager_id: '',
  assigned_user_ids: [],
  priority: 'MEDIUM',
  due_date: '',
  status: 'ACTIVE'
};

const PRIORITY_TONE = {
  HIGH: 'danger',
  MEDIUM: 'warning',
  LOW: 'secondary'
};

const STATUS_TONE = {
  ACTIVE: 'success',
  ON_HOLD: 'warning',
  COMPLETED: 'primary',
  ARCHIVED: 'secondary'
};

const ROLE_LABEL = {
  PROJECT_MANAGER: 'Project Manager',
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  HR: 'HR',
  TUTOR: 'Tutor',
  SENIOR_TUTOR: 'Senior Tutor',
  EMPLOYEE: 'Employee',
  INTERN: 'Intern',
  FINANCE: 'Finance',
  SALES: 'Sales',
  RECEPTION: 'Reception'
};

export default function PMProjects() {
  const [projects, setProjects] = useState([]);
  const [assignable, setAssignable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectApi.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignable = async () => {
    try {
      setAssignable(await projectApi.getAssignableUsers());
    } catch (err) {
      console.error('Failed to load assignable users:', err);
      setAssignable([]);
    }
  };

  useEffect(() => {
    loadProjects();
    loadAssignable();
  }, []);

  const toggleTeamMember = (id) => {
    setFormData((prev) => ({
      ...prev,
      assigned_user_ids: prev.assigned_user_ids.includes(id)
        ? prev.assigned_user_ids.filter((x) => x !== id)
        : [...prev.assigned_user_ids, id]
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: formData.name,
      description: formData.description || null,
      github_repo_url: formData.github_repo_url,
      branch: formData.branch || 'main',
      is_active: formData.is_active,
      manager_id: formData.manager_id || null,
      assigned_user_ids: formData.assigned_user_ids,
      priority: formData.priority,
      due_date: formData.due_date || null
    };

    try {
      if (editingId) {
        await projectApi.updateProject(editingId, payload);
      } else {
        await projectApi.createProject(payload);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not save the project.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name || '',
      description: project.description || '',
      github_repo_url: project.github_repo_url || '',
      branch: project.branch || 'main',
      is_active: project.is_active ?? true,
      manager_id: project.manager_id || '',
      assigned_user_ids: Array.isArray(project.assigned_user_ids) ? project.assigned_user_ids : [],
      priority: project.priority || 'MEDIUM',
      due_date: project.due_date ? String(project.due_date).slice(0, 10) : '',
      status: project.status || 'ACTIVE'
    });
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await projectApi.deleteProject(id);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const userById = (id) => assignable.find((u) => u.id === id);

  const teamOf = (project) => (project.assigned_user_ids || []).map(userById).filter(Boolean);

  const filtered = projects.filter((p) => {
    const matchesFilter = filter === 'ALL' || (filter === 'ACTIVE' ? p.is_active : !p.is_active);
    const q = search.trim().toLowerCase();
    const matchesSearch = !q
      || p.name?.toLowerCase().includes(q)
      || p.description?.toLowerCase().includes(q)
      || p.manager?.full_name?.toLowerCase().includes(q);
    const matchesOwner = ownerFilter === 'ALL'
      || (ownerFilter === 'UNASSIGNED' ? !p.manager_id : p.manager_id === ownerFilter);
    return matchesFilter && matchesSearch && matchesOwner;
  });

  const unownedCount = projects.filter((p) => !p.manager_id).length;
  const overdueCount = projects.filter((p) => {
    if (!p.due_date || p.status === 'COMPLETED' || !p.is_active) return false;
    return new Date(p.due_date) < new Date();
  }).length;

  return (
    <AdminPage
      title="Projects Management"
      subtitle="Assign a responsible owner, connect the delivery team, and track deadlines"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setFormData(EMPTY_FORM); setEditingId(null); setError(''); setShowModal(true); }}>
          <i className="bi bi-plus-lg"></i>
          <span>New Project</span>
        </button>
      }
    >
      <div className="row g-3 mb-2">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-primary bg-opacity-10 text-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-uppercase fw-semibold">Total Projects</small>
                <h3 className="mb-0 fw-bold">{projects.length}</h3>
              </div>
              <i className="bi bi-folder-fill fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-success bg-opacity-10 text-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-uppercase fw-semibold">In Progress</small>
                <h3 className="mb-0 fw-bold">{projects.filter(p => p.is_active).length}</h3>
              </div>
              <i className="bi bi-activity fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-warning bg-opacity-10 text-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-uppercase fw-semibold">Needs Owner</small>
                <h3 className="mb-0 fw-bold">{unownedCount}</h3>
              </div>
              <i className="bi bi-person-exclamation fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-danger bg-opacity-10 text-danger">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-uppercase fw-semibold">Overdue</small>
                <h3 className="mb-0 fw-bold">{overdueCount}</h3>
              </div>
              <i className="bi bi-alarm-fill fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="input-group" style={{ maxWidth: '320px' }}>
            <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Search projects or owners..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={ownerFilter}
              onChange={e => setOwnerFilter(e.target.value)}
              aria-label="Filter by responsible person"
            >
              <option value="ALL">All owners</option>
              <option value="UNASSIGNED">Needs an owner</option>
              {assignable.map(u => (
                <option key={u.id} value={u.id}>{u.full_name}</option>
              ))}
            </select>
            <div className="btn-group">
              <button className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('ALL')}>All</button>
              <button className={`btn btn-sm ${filter === 'ACTIVE' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('ACTIVE')}>Active</button>
              <button className={`btn btn-sm ${filter === 'ARCHIVED' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('ARCHIVED')}>Archived</button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Project Name</th>
                <th>Responsible</th>
                <th>Team</th>
                <th>Priority</th>
                <th>Due</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading projects...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">No projects found.</td></tr>
              ) : (
                filtered.map(project => {
                  const team = teamOf(project);
                  const overdue = project.due_date
                    && project.status !== 'COMPLETED'
                    && project.is_active
                    && new Date(project.due_date) < new Date();

                  return (
                    <tr key={project.id}>
                      <td>
                        <div className="fw-semibold text-dark">{project.name}</div>
                        <small className="text-muted text-truncate d-block" style={{ maxWidth: '260px' }}>
                          {project.description || 'No description provided'}
                        </small>
                        {project.github_repo_url && (
                          <a
                            href={project.github_repo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="small text-decoration-none"
                          >
                            <i className="bi bi-github me-1"></i>
                            {project.github_repo_url.replace('https://github.com/', '')}
                            <i className="bi bi-box-arrow-up-right ms-1" style={{ fontSize: '0.7rem' }}></i>
                          </a>
                        )}
                      </td>
                      <td>
                        {project.manager ? (
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{
                                width: 30, height: 30,
                                background: 'linear-gradient(135deg, var(--base-olive), var(--base-gold))',
                                color: '#fff', fontSize: '12px', fontWeight: 700,
                                overflow: 'hidden'
                              }}
                            >
                              {project.manager.avatar_url ? (
                                <img
                                  src={project.manager.avatar_url}
                                  alt={project.manager.full_name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                (project.manager.full_name || '?').charAt(0).toUpperCase()
                              )}
                            </div>
                            <div style={{ lineHeight: '1.2' }}>
                              <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>
                                {project.manager.full_name}
                              </div>
                              <small className="text-muted">
                                {ROLE_LABEL[project.manager.role] || project.manager.role}
                              </small>
                            </div>
                          </div>
                        ) : (
                          <span className="badge bg-warning bg-opacity-10 text-warning">
                            <i className="bi bi-exclamation-triangle me-1"></i>Unassigned
                          </span>
                        )}
                      </td>
                      <td>
                        {team.length === 0 ? (
                          <span className="text-muted small">—</span>
                        ) : (
                          <div className="d-flex align-items-center">
                            {team.slice(0, 3).map((m, i) => (
                              <div
                                key={m.id}
                                title={`${m.full_name} (${ROLE_LABEL[m.role] || m.role})`}
                                className="rounded-circle border border-white d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                  width: 28, height: 28,
                                  marginLeft: i === 0 ? 0 : -8,
                                  background: 'var(--base-teal)',
                                  color: '#fff', fontSize: '11px', fontWeight: 700,
                                  zIndex: 10 - i
                                }}
                              >
                                {(m.full_name || '?').charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {team.length > 3 && (
                              <span className="badge bg-light text-dark border ms-1">
                                +{team.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge bg-${PRIORITY_TONE[project.priority] || 'secondary'} bg-opacity-10 text-${PRIORITY_TONE[project.priority] || 'secondary'}`}>
                          {project.priority || 'MEDIUM'}
                        </span>
                      </td>
                      <td>
                        {project.due_date ? (
                          <span className={overdue ? 'text-danger fw-semibold' : 'text-muted'}>
                            {overdue && <i className="bi bi-exclamation-circle me-1"></i>}
                            {String(project.due_date).slice(0, 10)}
                          </span>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge bg-${project.is_active ? 'success' : 'secondary'} bg-opacity-10 text-${project.is_active ? 'success' : 'secondary'}`}>
                          {project.status && project.status !== 'ACTIVE'
                            ? project.status.replace(/_/g, ' ')
                            : (project.is_active ? 'Active' : 'Archived')}
                        </span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(project)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(project.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">{editingId ? 'Edit Project' : 'Create Project'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger py-2" role="alert">
                      <i className="bi bi-exclamation-circle me-2"></i>{error}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label">Project Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={formData.priority}
                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="row g-3 mt-0">
                    <div className="col-md-8">
                      <label className="form-label">GitHub Repo URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://github.com/org/repo"
                        value={formData.github_repo_url}
                        onChange={e => setFormData({ ...formData, github_repo_url: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Default Branch</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.branch}
                        onChange={e => setFormData({ ...formData, branch: e.target.value })}
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-person-badge me-1"></i>
                        Responsible for delivery
                      </label>
                      <select
                        className="form-select"
                        value={formData.manager_id}
                        onChange={e => setFormData({ ...formData, manager_id: e.target.value })}
                      >
                        <option value="">— Nobody assigned —</option>
                        {assignable.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.full_name} — {ROLE_LABEL[u.role] || u.role}
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">
                        This person is notified and becomes accountable for the project.
                      </small>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Delivery status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="ON_HOLD">On hold</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Due date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.due_date}
                        onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-people me-1"></i>
                      Connected team
                    </label>
                    {assignable.length === 0 ? (
                      <p className="text-muted small mb-0">No assignable people available.</p>
                    ) : (
                      <div className="border rounded-3 p-2" style={{ maxHeight: '190px', overflowY: 'auto' }}>
                        {assignable.map(u => {
                          const isManager = formData.manager_id === u.id;
                          const isMember = formData.assigned_user_ids.includes(u.id);
                          return (
                            <div
                              key={u.id}
                              className="form-check d-flex align-items-center gap-2 px-2 py-1 rounded"
                              style={{ cursor: isManager ? 'not-allowed' : 'pointer', opacity: isManager ? 0.6 : 1 }}
                            >
                              <input
                                className="form-check-input mt-0"
                                type="checkbox"
                                id={`member-${u.id}`}
                                checked={isMember}
                                disabled={isManager}
                                onChange={() => toggleTeamMember(u.id)}
                              />
                              <label className="form-check-label flex-grow-1" htmlFor={`member-${u.id}`}>
                                {u.full_name}
                                <span className="text-muted"> — {ROLE_LABEL[u.role] || u.role}</span>
                                {isManager && <span className="badge bg-primary bg-opacity-10 text-primary ms-2">Owner</span>}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <small className="text-muted">
                      Everyone selected here is notified that they are on this project.
                    </small>
                  </div>

                  <div className="form-check mt-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isActive"
                      checked={formData.is_active}
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="isActive">Active project</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Create & Notify')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
