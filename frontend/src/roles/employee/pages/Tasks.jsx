import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import employeePortalApi from '../../../services/api/employeePortalApi.js';
import { EmptyState } from '../components/StatCard.jsx';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateError, setUpdateError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeePortalApi.getAssignedTasks();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setTasks(list);
    } catch (err) {
      setError(err.message || 'Failed to load assigned tasks');
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
    try {
      await employeePortalApi.updateTaskStatus(task.id, nextStatus);
      await fetchTasks();
    } catch (err) {
      setUpdateError(err.message || 'Failed to update task status');
    }
  };

  const filteredTasks = filter === 'ALL'
    ? tasks
    : tasks.filter(t => t.status === filter);

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
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('ALL')}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'PENDING' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('PENDING')}
          >
            Pending
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'IN_PROGRESS' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('IN_PROGRESS')}
          >
            In Progress
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'COMPLETED' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('COMPLETED')}
          >
            Completed
          </button>
        </div>

        <span className="text-muted small">
          {tasks.filter(t => t.status === 'COMPLETED').length} of {tasks.length} tasks completed
        </span>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Task Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7"><EmptyState icon="bi-check2-all" text="No tasks found matching this criteria." compact /></td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={task.status === 'COMPLETED'}
                        onChange={() => handleToggleStatus(task)}
                      />
                    </td>
                    <td>
                      <div className={`fw-semibold text-dark ${task.status === 'COMPLETED' ? 'text-decoration-line-through text-muted' : ''}`}>
                        {task.description}
                      </div>
                    </td>
                    <td className="text-muted small">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                    </td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td className="text-end">
                      <button
                        className={`btn btn-sm ${task.status === 'COMPLETED' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                        onClick={() => handleToggleStatus(task)}
                      >
                        {task.status === 'COMPLETED' ? 'Mark In Progress' : 'Mark Done'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}
