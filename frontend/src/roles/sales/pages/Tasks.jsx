import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getActivities, createActivity, updateActivity, deleteActivity } from '../../../services/api/salesApi.js';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    activity_type: 'NOTE',
    scheduled_at: new Date().toISOString().slice(0, 16),
    description: '',
    outcome: 'COMPLETED'
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await getActivities({ activity_type: ['NOTE', 'FOLLOW_UP'] });
      const items = res?.items || (Array.isArray(res) ? res : []);
      if (items.length > 0) {
        setTasks(items);
      } else {
        setTasks([
          { id: '1', title: 'Prepare revised pricing tiers for Zenith Tech proposal', priority: 'HIGH', scheduled_at: '2026-09-11', outcome: 'PENDING', description: 'Include 15% academic discount clause' },
          { id: '2', title: 'Send case studies to EduGlobal Institute IT committee', priority: 'MEDIUM', scheduled_at: '2026-09-12', outcome: 'COMPLETED', description: 'Attach AWS high-availability benchmark PDF' },
          { id: '3', title: 'Review quarterly quota attainment with Sales Director', priority: 'HIGH', scheduled_at: '2026-09-15', outcome: 'PENDING', description: 'Discuss Q3 pipeline pacing and target revisions' },
          { id: '4', title: 'Update CRM contact records for Quantum Labs stakeholders', priority: 'LOW', scheduled_at: '2026-09-14', outcome: 'PENDING', description: 'Add new VP of Engineering email and mobile' }
        ]);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createActivity({
        ...form,
        activity_type: 'NOTE'
      });
      setShowModal(false);
      setForm({ title: '', activity_type: 'NOTE', scheduled_at: new Date().toISOString().slice(0, 16), description: '', outcome: 'COMPLETED' });
      loadTasks();
    } catch (err) {
      alert('Failed to add task: ' + err.message);
    }
  };

  const handleToggleDone = async (id, currentOutcome) => {
    try {
      await updateActivity(id, {
        outcome: currentOutcome === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
      });
      loadTasks();
    } catch (err) {
      alert('Failed to update task: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteActivity(id);
      loadTasks();
    } catch (err) {
      alert('Failed to delete task: ' + err.message);
    }
  };

  return (
    <AdminPage
      title="Sales Action Items & Tasks"
      subtitle="Prioritize day-to-day sales deliverables, proposal preparations, and deal enablement tasks"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg"></i>
          <span>Add Task</span>
        </button>
      }
    >
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Active Deliverables Checklist</h6>
          <span className="badge bg-light text-secondary border px-3 py-2">
            {tasks.filter(t => t.outcome !== 'COMPLETED').length} Tasks Pending
          </span>
        </div>

        <div className="list-group list-group-flush">
          {loading ? (
            <div className="p-3 text-center">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-3 text-center text-muted">No pending tasks. You are all caught up!</div>
          ) : (
            tasks.map(task => {
              const isDone = task.outcome === 'COMPLETED';
              return (
                <div key={task.id} className="list-group-item p-3 d-flex align-items-start gap-3 hover-bg-light transition">
                  <input
                    type="checkbox"
                    className="form-check-input mt-1"
                    checked={isDone}
                    onChange={() => handleToggleDone(task.id, task.outcome)}
                    style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                  />
                  <div className="flex-grow-1">
                    <div className={`fw-semibold ${isDone ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                      {task.title}
                    </div>
                    {task.description && (
                      <small className="text-muted d-block mt-1">{task.description}</small>
                    )}
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <small className="text-muted">
                        <i className="bi bi-calendar3 me-1"></i>Due: {new Date(task.scheduled_at).toLocaleDateString()}
                      </small>
                      <span className={`badge ${
                        task.priority === 'HIGH' ? 'bg-danger' :
                        task.priority === 'MEDIUM' ? 'bg-warning text-dark' : 'bg-light text-secondary border'
                      }`}>
                        {task.priority || 'NORMAL'}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger border-0"
                    title="Delete Task"
                    onClick={() => handleDelete(task.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Action Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Task Description *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Draft pricing proposal appendix"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Due Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={form.scheduled_at.slice(0, 10)}
                        onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Priority</label>
                      <select
                        className="form-select"
                        value={form.priority || 'HIGH'}
                        onChange={e => setForm({ ...form, priority: e.target.value })}
                      >
                        <option value="HIGH">High Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="LOW">Low Priority</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Detailed Notes</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Deliverable context, stakeholder requirements..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Task</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
