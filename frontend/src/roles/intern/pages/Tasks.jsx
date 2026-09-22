import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Tasks() {
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'upcoming' | 'completed' | 'all'
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const [tasks, setTasks] = useState([
    {
      id: 'task-101',
      title: 'Implement JWT Refresh Token Rotation in Auth Service',
      project: 'Ethiroli Web Portal v2',
      priority: 'HIGH',
      dueDate: 'Today, 6:00 PM',
      assignedBy: 'Mentor Arun Kumar',
      status: 'IN_PROGRESS',
      estimatedHours: 3,
      loggedHours: 1.5,
      category: 'today',
      description: 'Implement secure refresh token rotation stored in HttpOnly cookies with Redis replay detection.',
      criteria: [
        { text: 'Create POST /api/v1/auth/refresh endpoint', done: true },
        { text: 'Store refresh token in HTTP-only secure cookie', done: true },
        { text: 'Invalidate old token family on reuse attempt', done: false },
        { text: 'Write integration test with Supertest', done: false }
      ],
      relatedModule: 'Module 4: Authentication & Security',
      prLink: 'https://github.com/ethiroli/portal/pull/42',
      notes: 'Initial middleware drafted, pending Redis integration.'
    },
    {
      id: 'task-102',
      title: 'Build Responsive Offcanvas Navigation for Admin & Intern Portals',
      project: 'Ethiroli Web Portal v2',
      priority: 'MEDIUM',
      dueDate: 'Today, 8:00 PM',
      assignedBy: 'Mentor Arun Kumar',
      status: 'UNDER_REVIEW',
      estimatedHours: 4,
      loggedHours: 3.5,
      category: 'today',
      description: 'Create mobile-friendly Bootstrap 5 offcanvas sidebar drawer with categorized navigation items.',
      criteria: [
        { text: 'Support role-based menu items (Admin, Mentor, Intern)', done: true },
        { text: 'Active route highlighting & badge indicators', done: true },
        { text: 'Smooth backdrop transitions on mobile viewports', done: true }
      ],
      relatedModule: 'Module 2: Responsive UI Systems',
      prLink: 'https://github.com/ethiroli/portal/pull/39',
      notes: 'PR submitted, waiting for mentor code review.'
    },
    {
      id: 'task-103',
      title: 'Integrate Live Duration Timer in Attendance Tracker',
      project: 'Ethiroli Web Portal v2',
      priority: 'LOW',
      dueDate: 'Today, 5:00 PM',
      assignedBy: 'Mentor Arun Kumar',
      status: 'COMPLETED',
      estimatedHours: 2,
      loggedHours: 1.8,
      category: 'today',
      description: 'Create real-time ticking clock and working hours counter that tracks active duration since clock-in.',
      criteria: [
        { text: 'Live ticker updating every second', done: true },
        { text: 'Persist state across page reloads', done: true }
      ],
      relatedModule: 'Module 4: React 19 Hooks',
      prLink: 'https://github.com/ethiroli/portal/pull/37',
      notes: 'Merged and verified in staging.'
    },
    {
      id: 'task-104',
      title: 'Design PostgreSQL Relational Schema for LMS Course Enrollments',
      project: 'Ethiroli LMS Engine',
      priority: 'HIGH',
      dueDate: 'Tomorrow, 5:00 PM',
      assignedBy: 'Mentor Arun Kumar',
      status: 'TO_DO',
      estimatedHours: 5,
      loggedHours: 0,
      category: 'upcoming',
      description: 'Design normalized tables for courses, modules, lessons, quizzes, and intern enrollment records.',
      criteria: [
        { text: 'Define 3NF schema with foreign keys', done: false },
        { text: 'Create indexing on intern_id and course_id', done: false },
        { text: 'Prepare SQL migration script', done: false }
      ],
      relatedModule: 'Module 5: Relational DBs & MySQL',
      prLink: '',
      notes: ''
    },
    {
      id: 'task-105',
      title: 'Configure Razorpay Payment Gateway Webhook Listener',
      project: 'Ethiroli Web Portal v2',
      priority: 'MEDIUM',
      dueDate: 'Thursday, 6:00 PM',
      assignedBy: 'Lead Architect',
      status: 'TO_DO',
      estimatedHours: 4,
      loggedHours: 0,
      category: 'upcoming',
      description: 'Build HMAC-SHA256 signature verification for payment success webhooks.',
      criteria: [
        { text: 'Verify webhook signature using secret key', done: false },
        { text: 'Update transaction record in database', done: false }
      ],
      relatedModule: 'Module 6: Payment APIs & Webhooks',
      prLink: '',
      notes: ''
    },
    {
      id: 'task-106',
      title: 'Setup ESLint & Prettier Rules for Monorepo',
      project: 'Ethiroli Monorepo',
      priority: 'LOW',
      dueDate: 'Sep 10, 2026',
      assignedBy: 'DevOps Lead',
      status: 'COMPLETED',
      estimatedHours: 2,
      loggedHours: 2,
      category: 'completed',
      description: 'Standardize linting rules across frontend and backend services.',
      criteria: [
        { text: 'Configure eslint.config.js', done: true },
        { text: 'Add pre-commit git hook', done: true }
      ],
      relatedModule: 'Module 1: Git & Tooling',
      prLink: 'https://github.com/ethiroli/portal/pull/12',
      notes: 'Completed ahead of schedule.'
    }
  ]);

  const handleOpenTask = (task) => {
    setSelectedTask({ ...task });
    setShowModal(true);
  };

  const handleUpdateStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleCriteriaToggle = (idx) => {
    if (!selectedTask) return;
    const updated = [...selectedTask.criteria];
    updated[idx].done = !updated[idx].done;
    setSelectedTask({ ...selectedTask, criteria: updated });
    setTasks((prev) =>
      prev.map((t) => (t.id === selectedTask.id ? { ...t, criteria: updated } : t))
    );
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    setTasks((prev) =>
      prev.map((t) => (t.id === selectedTask.id ? selectedTask : t))
    );
    setShowModal(false);
    setAlert({ type: 'success', text: `Task "${selectedTask.title}" updated and submitted for review!` });
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'today') return t.category === 'today';
    if (activeTab === 'upcoming') return t.category === 'upcoming';
    if (activeTab === 'completed') return t.status === 'COMPLETED';
    return true;
  });

  const columns = [
    { id: 'TO_DO', title: 'To Do', color: 'secondary' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'primary' },
    { id: 'UNDER_REVIEW', title: 'Under Review', color: 'warning' },
    { id: 'COMPLETED', title: 'Completed', color: 'success' }
  ];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle small">High</span>;
      case 'MEDIUM':
        return <span className="badge bg-warning-subtle text-warning border border-warning-subtle small">Medium</span>;
      default:
        return <span className="badge bg-success-subtle text-success border border-success-subtle small">Low</span>;
    }
  };

  return (
    <AdminPage
      title="Daily Tasks & Sprint Manager"
      subtitle="Jira-style task board, sprint backlog, time tracking, and mentor code review workflows"
    >
      <div className="container-fluid px-0">
        {alert.text && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show mb-4`} role="alert">
            <i className="bi bi-check-circle me-2"></i>{alert.text}
            <button type="button" className="btn-close" onClick={() => setAlert({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Filter Tabs & View Mode Switch */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'today' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('today')}
            >
              Today ({tasks.filter((t) => t.category === 'today').length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming ({tasks.filter((t) => t.category === 'upcoming').length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({tasks.filter((t) => t.status === 'COMPLETED').length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('all')}
            >
              All Tasks ({tasks.length})
            </button>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn ${viewMode === 'kanban' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('kanban')}
                title="Kanban Board View"
              >
                <i className="bi bi-kanban me-1"></i> Kanban
              </button>
              <button
                type="button"
                className={`btn ${viewMode === 'list' ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <i className="bi bi-list-ul me-1"></i> List
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board View */}
        {viewMode === 'kanban' && (
          <div className="row g-3">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="col-12 col-md-6 col-xl-3">
                  <div className="card shadow-sm border-0 h-100 bg-light-subtle">
                    <div className="card-header bg-white py-2 border-0 d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-dark small">{col.title}</span>
                      <span className="badge bg-secondary-subtle text-dark small">{colTasks.length}</span>
                    </div>
                    <div className="card-body p-2 d-flex flex-column gap-2" style={{ minHeight: '420px' }}>
                      {colTasks.length === 0 ? (
                        <div className="text-center py-4 text-muted small">No tasks in this lane</div>
                      ) : (
                        colTasks.map((t) => (
                          <div
                            key={t.id}
                            className="card border shadow-sm p-3 bg-white cursor-pointer"
                            onClick={() => handleOpenTask(t)}
                            style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="badge bg-light text-muted border small text-truncate" style={{ maxWidth: '140px' }}>
                                {t.project}
                              </span>
                              {getPriorityBadge(t.priority)}
                            </div>
                            <h6 className="fw-bold mb-2 text-dark small">{t.title}</h6>
                            <div className="d-flex align-items-center justify-content-between small text-muted mb-2">
                              <span><i className="bi bi-calendar-event me-1"></i>{t.dueDate}</span>
                              <span><i className="bi bi-stopwatch me-1"></i>{t.loggedHours}/{t.estimatedHours}h</span>
                            </div>
                            <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-auto">
                              <small className="text-muted text-truncate" style={{ maxWidth: '130px' }}>
                                {t.assignedBy}
                              </small>
                              <span className="badge bg-light text-primary border small">Details →</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Task Title</th>
                    <th scope="col">Project</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Logged / Est</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => (
                    <tr key={t.id}>
                      <td className="ps-4 fw-semibold text-dark">{t.title}</td>
                      <td><span className="badge bg-light text-secondary border small">{t.project}</span></td>
                      <td>{getPriorityBadge(t.priority)}</td>
                      <td className="small text-muted">{t.dueDate}</td>
                      <td className="small fw-medium">{t.loggedHours}h / {t.estimatedHours}h</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={t.status}
                          onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                        >
                          <option value="TO_DO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </td>
                      <td className="text-end pe-4">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenTask(t)}>
                          Open Task
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Task Detail Modal */}
        {showModal && selectedTask && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <div>
                    <span className="badge bg-light text-primary border me-2 small">{selectedTask.project}</span>
                    {getPriorityBadge(selectedTask.priority)}
                    <h5 className="modal-title fw-bold mt-1 text-dark">{selectedTask.title}</h5>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSaveModal}>
                  <div className="modal-body">
                    <div className="row g-3 mb-3">
                      <div className="col-sm-4">
                        <small className="text-muted d-block">Assigned By</small>
                        <strong className="text-dark small">{selectedTask.assignedBy}</strong>
                      </div>
                      <div className="col-sm-4">
                        <small className="text-muted d-block">Due Date</small>
                        <strong className="text-dark small">{selectedTask.dueDate}</strong>
                      </div>
                      <div className="col-sm-4">
                        <small className="text-muted d-block">Status</small>
                        <select
                          className="form-select form-select-sm mt-1"
                          value={selectedTask.status}
                          onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                        >
                          <option value="TO_DO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6 className="fw-bold small text-dark mb-1">Description</h6>
                      <p className="text-muted small">{selectedTask.description}</p>
                    </div>

                    <div className="mb-3">
                      <h6 className="fw-bold small text-dark mb-2">Acceptance Criteria</h6>
                      <div className="list-group list-group-flush border rounded-3 p-2 bg-light">
                        {selectedTask.criteria.map((c, idx) => (
                          <div key={idx} className="list-group-item bg-transparent border-0 px-2 py-1 d-flex align-items-center">
                            <input
                              className="form-check-input me-2"
                              type="checkbox"
                              checked={c.done}
                              onChange={() => handleCriteriaToggle(idx)}
                              id={`crit-${idx}`}
                            />
                            <label
                              htmlFor={`crit-${idx}`}
                              className={`form-check-label small ${c.done ? 'text-decoration-line-through text-muted' : 'text-dark'}`}
                            >
                              {c.text}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">GitHub Branch / PR URL</label>
                        <input
                          type="url"
                          className="form-control form-control-sm"
                          placeholder="https://github.com/ethiroli/portal/pull/123"
                          value={selectedTask.prLink}
                          onChange={(e) => setSelectedTask({ ...selectedTask, prLink: e.target.value })}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label small fw-semibold">Logged Hours Today</label>
                        <input
                          type="number"
                          step="0.5"
                          className="form-control form-control-sm"
                          value={selectedTask.loggedHours}
                          onChange={(e) => setSelectedTask({ ...selectedTask, loggedHours: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Submission Notes for Mentor</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        placeholder="Highlight any architectural choices or blockers..."
                        value={selectedTask.notes}
                        onChange={(e) => setSelectedTask({ ...selectedTask, notes: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light btn-sm" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Submit for Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
