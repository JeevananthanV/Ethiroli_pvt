import React, { useEffect, useState, useCallback, useRef } from 'react';
import { listTasks, updateTaskStatus, deleteTask, createTask } from '../../../services/api/taskApi.js';

const COLUMNS = [
  { key: 'todo', label: 'To Do', color: 'var(--admin-text-muted)' },
  { key: 'in-progress', label: 'In Progress', color: 'var(--admin-warning)' },
  { key: 'review', label: 'In Review', color: 'var(--admin-info)' },
  { key: 'done', label: 'Done', color: 'var(--admin-success)' },
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskCol, setNewTaskCol] = useState('todo');
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listTasks({});
      const list = Array.isArray(data) ? data : data.tasks || data.data || [];
      setTasks(list);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', String(taskId));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragOver');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragOver');
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragOver');
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    const previousStatus = tasks.find((t) => (t.id || t._id) === Number(taskId))?.status;
    if (previousStatus === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => ((t.id || t._id) === Number(taskId) ? { ...t, status: newStatus } : t))
    );
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => ((t.id || t._id) === Number(taskId) ? { ...t, status: previousStatus || t.status } : t))
      );
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setFormError('Task title is required.');
      return;
    }
    setAdding(true);
    setFormError(null);
    try {
      const newTask = await createTask({ title: newTaskTitle.trim(), description: newTaskDescription.trim() || undefined, status: newTaskCol });
      setTasks((prev) => [...prev, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setShowAddForm(false);
      setNewTaskCol('todo');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This action cannot be undone.')) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => (t.id || t._id) !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const getTasksForColumn = (colKey) => {
    return tasks.filter((t) => (t.status || 'todo') === colKey);
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Task Board</h1>
          <p className="pageSubtitle">Drag cards between columns to update status — manage your team's workflow</p>
        </div>
        <div className="pageActions">
          <button className="btn primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Task'}
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--admin-danger)', fontSize: 13 }}>{error}</span>
            <button className="btn secondary btnSm" onClick={fetchTasks}>Retry</button>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <form onSubmit={handleAddTask}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="formGroup" style={{ marginBottom: 0 }}>
                <label className="label">Task Title <span className="required">*</span></label>
                <input
                  className="inputField"
                  value={newTaskTitle}
                  onChange={(e) => { setNewTaskTitle(e.target.value); setFormError(null); }}
                  placeholder="Enter task title"
                  autoFocus
                />
              </div>
              <div className="formGroup" style={{ marginBottom: 0 }}>
                <label className="label">Description</label>
                <input
                  className="inputField"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Optional task description"
                />
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div className="formGroup" style={{ minWidth: 150, marginBottom: 0 }}>
                  <label className="label">Column</label>
                  <select className="select" value={newTaskCol} onChange={(e) => setNewTaskCol(e.target.value)}>
                    {COLUMNS.map((col) => (
                      <option key={col.key} value={col.key}>{col.label}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn primary" disabled={adding}>{adding ? 'Adding...' : 'Add Task'}</button>
                <button type="button" className="btn secondary" onClick={() => { setShowAddForm(false); setFormError(null); }}>Cancel</button>
              </div>
              {formError && (
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--admin-danger)', fontSize: 13 }}>
                  {formError}
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="card">
          <div className="loading">
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }}></div>
              <div className="skeleton" style={{ width: '40%', height: 12 }}></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="boardContainer">
          <div className="columnsContainer">
            {COLUMNS.map((col) => {
              const colTasks = getTasksForColumn(col.key);
              return (
                <div
                  key={col.key}
                  className="column"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.key)}
                >
                  <div className="columnHeader">
                    <h3 style={{ color: col.color }}>{col.label}</h3>
                    <span className="leadCount">{colTasks.length}</span>
                  </div>
                  <div className="columnBody">
                    {colTasks.map((task) => (
                      <div
                        key={task.id || task._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id || task._id)}
                      >
                        <p className="cardName">{task.title}</p>
                        {task.description && <p className="cardInfo">{task.description}</p>}
                        {task.clientName && (
                          <span className="sourceTag">{task.clientName}</span>
                        )}
                        {task.dueDate && (
                          <p className="cardInfo" style={{ marginTop: 6 }}>
                            📅 {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                          <button className="btn danger btnSm" style={{ padding: '5px 10px', fontSize: 11 }} onClick={() => handleDelete(task.id || task._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <p style={{ color: 'var(--admin-text-faint)', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>No tasks</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
