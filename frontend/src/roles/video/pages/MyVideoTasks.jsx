import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks } from '../../../services/api/videoApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { Button, Table, TableRow, TableCell, TableHead, TableBody, Alert, Select, MenuItem, Paper, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../store/selectors/userSelector.js';
import { useParams } from 'react-router-dom';

export default function MyVideoTasks() {
  const dispatch = useDispatch();
  const { id: userId, role } = useSelector(selectUser);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        // Filter by assigned editor (current user)
        const result = await getTasks({
          assigned_editor: userId,
          status: filterStatus,
          page: 1,
          limit: 20,
        });
        setTasks(result.items || []);
      } catch (err) {
        console.error('Failed to load my tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [filterStatus, userId]);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Delivered').length;
  const inProgress = tasks.filter(t => ['Editing', 'Internal Review', 'Client Review'].includes(t.status)).length;
  const overdue = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Delivered').length;

  const getStatusBadge = (status) => {
    const classes = {
      'Delivered': 'bg-success text-white',
      'Editing': 'bg-info text-white',
      'Internal Review': 'bg-warning text-dark',
      'Client Review': 'bg-primary text-white',
      'Revision': 'bg-primary',
      'Approved': 'bg-success text-white',
      'Assigned': 'bg-secondary text-white',
    };
    return classes[status] || 'bg-secondary text-white';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'Delivered': 'Delivered',
      'Editing': 'Editing',
      'Internal Review': 'Internal Review',
      'Client Review': 'Client Review',
      'Revision': 'Revision',
      'Approved': 'Approved',
      'Assigned': 'Assigned',
    };
    return labels[status] || status;
  };

  return (
    <AdminPage
      title="My Video Tasks"
      subtitle="Your assigned video editing tasks and deadlines"
    >
      <Paper sx={{ p: 2, mb: 2 }}>
        <h3>My Assigned Tasks</h3>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <small className="text-muted text-uppercase fw-semibold">Total Tasks</small>
              <h3>{total}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-success border-4">
              <small className="text-muted text-uppercase fw-semibold">Completed</small>
              <h3>{completed}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-info border-4">
              <small className="text-muted text-uppercase fw-semibold">In Progress</small>
              <h3>{inProgress}</h3>
            </div>
          </div>
        </div>
      </Paper>

      {loading ? (
        <p>Loading my tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned to you.</p>
      ) : (
        <Table sx={{ minWidth: 600 }} aria-label="my video tasks">
          <TableHead>
            <TableRow>
              <TableColumn>Task ID</TableCell>
              <TableColumn>Project</TableCell>
              <TableColumn>Video Type</TableCell>
              <TableColumn>Status</TableCell>
              <TableColumn>Deadline</TableCell>
              <TableColumn>Priority</TableCell>
              <TableColumn>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.project_title || 'Unassigned'}</TableCell>
                <TableCell>
                  {task.video_type ? (
                    <span>{task.video_type}</span>
                  ) : (
                    <span>Unknown</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`badge ${getStatusBadge(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </span>
                </TableCell>
                <TableCell>
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                </TableCell>
                <TableCell>
                  {task.priority ? (
                    <span className={`badge bg-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  ) : (
                    <span>Medium</span>
                  )}
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {task.status === 'Assigned' && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => window.alert('Start this task')}
                      >
                        Start
                      </Button>
                    )}
                    {task.status === 'Editing' && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => window.alert('Submit preview')}
                      >
                        Submit Preview
                      </Button>
                    )}
                    {task.status === 'Client Review' && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => window.alert('Request revisions')}
                      >
                        Request Rev.
                      </Button>
                    )}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => window.alert('View full details')}
                    >
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          </TableBody>
        </Table>
      )}

      {/* Status filter for managers viewing others' tasks */}
      {role === 'MANAGER' || role === 'SUPER_ADMIN' && (
        <Paper sx={{ marginTop: 16, p: 1 }}>
          <h4>Filter by Status</h4>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Assigned">Assigned</MenuItem>
            <MenuItem value="Editing">Editing</MenuItem>
            <MenuItem value="Internal Review">Internal Review</MenuItem>
            <MenuItem value="Client Review">Client Review</MenuItem>
            <MenuItem value="Revision">Revision</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
          </MenuItem>
        </Paper>
      )}
    </AdminPage>
  );
}