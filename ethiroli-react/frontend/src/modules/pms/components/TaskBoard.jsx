import React, { useState, useEffect, useCallback } from 'react';
import { getTaskBoard, getTasks, createTask, updateTask, moveTask } from '../../services/api/taskApi';
import AdminPage from '../../common/components/AdminPage/AdminPage.jsx';
import Modal from '../../common/components/Modal/Modal.jsx';
import Input from '../../common/components/Input/Input.jsx';
import Button from '../../common/components/Button/Button.jsx';

const TaskBoard = ({ projectId }) => {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignedTo: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = projectId ? await getTaskBoard(projectId) : await getTasks();
      setBoard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadBoard();
  }, [projectId, loadBoard]);

  const handleAdd = (status = 'todo') => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: status,
      priority: 'medium',
      assignedTo: '',
    });
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      assignedTo: task.assignedTo || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, formData);
        setBoard({
          ...board,
          columns: board.columns.map(col => ({
            ...col,
            tasks: col.tasks.map(t => t.id === editingTask.id ? updated : t)
          }))
        });
      } else {
        const created = await createTask(formData);
        setBoard({
          ...board,
          columns: board.columns.map(col =>
            col.status === formData.status
              ? { ...col, tasks: [...col.tasks, created] }
              : col
          )
        });
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDragStart = (e, task, columnStatus) => {
    setDraggedTask({ task, fromStatus: columnStatus });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, toStatus) => {
    e.preventDefault();
    if (!draggedTask) return;
    const { task, fromStatus } = draggedTask;
    if (fromStatus === toStatus) return;
    try {
      await moveTask(task.id, toStatus);
      setBoard({
        ...board,
        columns: board.columns.map(col => {
          if (col.status === fromStatus) {
            return { ...col, tasks: col.tasks.filter(t => t.id !== task.id) };
          }
          if (col.status === toStatus) {
            return { ...col, tasks: [...col.tasks, { ...task, status: toStatus }] };
          }
          return col;
        })
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setDraggedTask(null);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'textDanger';
      case 'medium': return 'textWarning';
      case 'low': return 'textSuccess';
      default: return 'textSecondary';
    }
  };

  if (loading) return <div className="loading">Loading task board...</div>;
  if (error) return <div className="emptyState"><h3>Error</h3><p>{error}</p><button className="btn primary" onClick={loadBoard}>Retry</button></div>;

  return (
    <AdminPage
      title="Task Board"
      subtitle="Kanban-style project management"
      loading={loading}
      error={error}
      onRetry={loadBoard}
      actions={<button className="btn primary" onClick={() => handleAdd()}>Add Task</button>}
    >
      <div className="boardContainer">
        <div className="columnsContainer">
          {board?.columns?.map((column) => (
            <div
              key={column.status}
              className="column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="columnHeader">
                <h3>{column.title || column.status}</h3>
                <span className="leadCount">{column.tasks?.length || 0}</span>
              </div>
              <div className="columnBody">
                {column.tasks?.map((task) => (
                  <div
                    key={task.id}
                    className="card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, column.status)}
                    onClick={() => handleEdit(task)}
                  >
                    <h4 className="cardName">{task.title}</h4>
                    {task.description && <p className="cardInfo">{task.description}</p>}
                    <div className="pageActions" style={{ marginTop: '8px' }}>
                      <span className={`statusTag ${getPriorityClass(task.priority)}`}>
                        {task.priority || 'Medium'}
                      </span>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btnSm secondary"
                  style={{ marginTop: '8px', width: '100%' }}
                  onClick={() => handleAdd(column.status)}
                >
                  + Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTask ? 'Edit Task' : 'Add Task'}>
          <form onSubmit={handleSubmit}>
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Description</label>
              <textarea
                className="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Status</label>
              <select
                className="select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="formGroup" style={{ marginTop: '12px' }}>
              <label className="label">Priority</label>
              <select
                className="select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="pageActions" style={{ marginTop: '16px' }}>
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </AdminPage>
  );
};

export default TaskBoard;
