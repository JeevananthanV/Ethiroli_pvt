import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';
import DetailModal, { DetailRow, DetailSection, DetailBadge, dash } from '../components/DetailModal.jsx';

/**
 * My Assigned Tasks.
 *
 * Everything on this page is real data from `GET /v1/employee/tasks`, which is
 * scoped server-side to the signed-in employee (`Task.list({ assigned_to: me })`)
 * - so a task only appears here once someone actually assigns it, and no task
 * belonging to a colleague can leak in. There is no fallback or sample list: an
 * empty table means nothing has been assigned yet.
 *
 * Clicking a row opens the full record. The table only has room for the
 * description, due date and status, so the detail dialog surfaces the remaining
 * fields the API returns (priority, estimate, project, sprint, milestone).
 */

const PRIORITY_TONE = {
  CRITICAL: 'danger',
  HIGH: 'danger',
  MEDIUM: 'warning',
  LOW: 'secondary'
};

const PRIORITY_ICON = {
  CRITICAL: 'bi-exclamation-octagon-fill',
  HIGH: 'bi-exclamation-lg',
  MEDIUM: 'bi-dash-lg',
  LOW: 'bi-arrow-down'
};

const humanise = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

/** DECIMAL columns arrive as strings ("8.0"), so normalise before formatting. */
const toHours = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n === 0) return null;
  return `${Number(n.toFixed(2))} hour${n === 1 ? '' : 's'}`;
};

const formatDate = (value) => {
  if (!value) return null;
  // Date-only values are parsed as UTC midnight by `new Date()`, which renders as
  // the previous day for anyone west of Greenwich. Pin them to local midnight.
  const raw = String(value);
  const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    ? new Date(Number(raw.slice(0, 4)), Number(raw.slice(5, 7)) - 1, Number(raw.slice(8, 10)))
    : new Date(raw);
  return Number.isNaN(dateOnly.getTime()) ? String(value) : dateOnly.toLocaleDateString();
};

const formatDateTime = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState(null);
  const [savingTaskId, setSavingTaskId] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getAssignedTasks();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setTasks(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load assigned tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    setUpdateError('');
    setSavingTaskId(task.id);
    try {
      await employeePortalApi.updateTaskStatus(task.id, nextStatus);
      await fetchTasks();
      // Keep an open dialog in sync with the row it describes.
      setSelectedTask((prev) => (prev && prev.id === task.id ? { ...prev, status: nextStatus } : prev));
    } catch (err) {
      setUpdateError(err.response?.data?.message || err.message || 'Failed to update task status');
    } finally {
      setSavingTaskId(null);
    }
  };

  const filteredTasks = filter === 'ALL'
    ? tasks
    : tasks.filter((t) => t.status === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge bg-success">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="badge bg-primary">In Progress</span>;
      default:
        return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  const counts = {
    ALL: tasks.length,
    PENDING: tasks.filter((t) => t.status === 'PENDING').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    COMPLETED: tasks.filter((t) => t.status === 'COMPLETED').length
  };

  const FILTERS = [
    { key: 'ALL', label: 'All Tasks' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'COMPLETED', label: 'Completed' }
  ];

  // A task is overdue when its due date has passed and it is not finished.
  const isOverdue = (task) =>
    task.due_date &&
    task.status !== 'COMPLETED' &&
    new Date(`${String(task.due_date).slice(0, 10)}T23:59:59`) < new Date();

  return (
    <AdminPage
      title="My Assigned Tasks"
      subtitle="Track your daily engineering deliverables, sprints, and assigned client tasks"
      loading={loading}
      error={error}
      onRetry={fetchTasks}
    >
      {updateError && (
        <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>{updateError}</div>
          <button type="button" className="btn-close" onClick={() => setUpdateError('')}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div className="btn-group flex-wrap" role="group">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`btn btn-sm ${filter === f.key ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
            >
              {f.label} ({counts[f.key]})
            </button>
          ))}
        </div>

        <span className="text-muted small">
          {counts.COMPLETED} of {tasks.length} tasks completed
        </span>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th style={{ width: '40px' }}><span className="visually-hidden">Done</span></th>
                <th>Task Description</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <EmptyState
                      icon={tasks.length === 0 ? 'bi-clipboard-check' : 'bi-check2-all'}
                      title={tasks.length === 0 ? 'No tasks assigned yet' : 'Nothing in this view'}
                      text={
                        tasks.length === 0
                          ? 'When your manager assigns work to you it will appear here automatically. Nothing has been assigned to you yet.'
                          : 'No tasks found matching this criteria.'
                      }
                      compact
                    />
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="emp-row-clickable"
                    onClick={() => setSelectedTask(task)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for task: ${task.description}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedTask(task);
                      }
                    }}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={task.status === 'COMPLETED'}
                        disabled={savingTaskId === task.id}
                        onChange={() => handleToggleStatus(task)}
                        aria-label={`Mark "${task.description}" as ${task.status === 'COMPLETED' ? 'in progress' : 'done'}`}
                      />
                    </td>
                    <td>
                      <div className={`fw-semibold text-dark ${task.status === 'COMPLETED' ? 'text-decoration-line-through text-muted' : ''}`}>
                        {task.description}
                      </div>
                      {(task.project_name || task.sprint_name) && (
                        <div className="text-muted small">
                          {[task.project_name, task.sprint_name].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </td>
                    <td>
                      {task.priority ? (
                        <DetailBadge tone={PRIORITY_TONE[task.priority] || 'secondary'}>
                          <i className={`bi ${PRIORITY_ICON[task.priority] || 'bi-dash'} me-1`} aria-hidden="true"></i>
                          {humanise(task.priority)}
                        </DetailBadge>
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </td>
                    <td className="text-muted small">
                      {task.due_date ? formatDate(task.due_date) : 'No due date'}
                      {isOverdue(task) && (
                        <div>
                          <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">Overdue</span>
                        </div>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>{getStatusBadge(task.status)}</td>
                    <td className="text-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={`btn btn-sm ${task.status === 'COMPLETED' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                        onClick={() => handleToggleStatus(task)}
                        disabled={savingTaskId === task.id}
                      >
                        {savingTaskId === task.id
                          ? 'Saving...'
                          : task.status === 'COMPLETED' ? 'Mark In Progress' : 'Mark Done'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailModal
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        icon="bi-check2-square"
        accent={selectedTask?.status === 'COMPLETED' ? 'success' : selectedTask?.status === 'IN_PROGRESS' ? 'info' : 'warning'}
        title={selectedTask?.description || 'Task'}
        subtitle={
          selectedTask
            ? [selectedTask.project_name, selectedTask.sprint_name].filter(Boolean).join(' · ') || 'Assigned task'
            : ''
        }
        badge={selectedTask && getStatusBadge(selectedTask.status)}
        footer={
          selectedTask && (
            <>
              <button type="button" className="btn btn-light" onClick={() => setSelectedTask(null)}>
                Close
              </button>
              <button
                type="button"
                className={`btn ${selectedTask.status === 'COMPLETED' ? 'btn-outline-secondary' : 'btn-success'}`}
                onClick={() => handleToggleStatus(selectedTask)}
                disabled={savingTaskId === selectedTask.id}
              >
                <i className={`bi ${selectedTask.status === 'COMPLETED' ? 'bi-arrow-counterclockwise' : 'bi-check2'} me-1`} aria-hidden="true"></i>
                {savingTaskId === selectedTask.id
                  ? 'Saving...'
                  : selectedTask.status === 'COMPLETED' ? 'Mark In Progress' : 'Mark Done'}
              </button>
            </>
          )
        }
      >
        {selectedTask && (
          <>
            <DetailSection title="Assignment">
              <dl className="emp-detail__row-list mb-0">
                <DetailRow label="Status" value={humanise(selectedTask.status)} />
                <DetailRow label="Priority" value={humanise(selectedTask.priority)} />
                <DetailRow label="Due date" value={formatDate(selectedTask.due_date)} />
                <DetailRow label="Assigned" value={formatDateTime(selectedTask.created_at)} />
                <DetailRow label="Last updated" value={formatDateTime(selectedTask.updated_at)} />
                <DetailRow label="Task ID" value={selectedTask.id} mono />
              </dl>
            </DetailSection>

            <DetailSection title="Work breakdown" icon="bi-diagram-3">
              <dl className="emp-detail__row-list mb-0">
                <DetailRow label="Project" value={selectedTask.project_name} />
                <DetailRow
                  label="Sprint"
                  value={selectedTask.sprint_name
                    ? `${selectedTask.sprint_name}${selectedTask.sprint_number != null ? ` (#${selectedTask.sprint_number})` : ''}`
                    : null}
                />
                <DetailRow label="Milestone" value={selectedTask.milestone_name} />
                <DetailRow label="Milestone target" value={formatDate(selectedTask.milestone_target_date)} />
                <DetailRow
                  label="Estimated effort"
                  value={toHours(selectedTask.estimated_hours)}
                />
                {/* actual_hours is a NOT NULL decimal defaulting to 0.0, so a task
                    nobody has logged time against reports 0 rather than NULL.
                    Treated as "not logged yet" so the dialog never implies work
                    was recorded. */}
                <DetailRow
                  label="Logged effort"
                  value={Number(selectedTask.actual_hours) > 0 ? toHours(selectedTask.actual_hours) : null}
                />
              </dl>
            </DetailSection>
          </>
        )}
      </DetailModal>
    </AdminPage>
  );
}
