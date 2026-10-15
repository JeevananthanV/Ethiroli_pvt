import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, getProjects } from '../../../services/api/videoApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { Button, Table, TableRow, TableCell, TableHead, TableBody, Alert, Select, MenuItem, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function VideoEditorDashboard() {
  const dispatch = useDispatch();
  const { status, priority } = useParams();
  const { id: userId, role } = useSelector(selectUser);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const tasksResult = await getTasks({
          status: filterStatus,
          priority: filterPriority,
          assigned_editor: userId,
          page: 1,
          limit: 20,
        });
        setTasks(tasksResult.items || []);

        const projectsResult = await getProjects();
        setProjects(projectsResult.items || []);
      } catch (err) {
        console.error('Failed to load video data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filterStatus, filterPriority, userId]);

  // Calculate stats
  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === 'Delivered').length;
  const inProgress = tasks.filter(t => ['Editing', 'Internal Review', 'Client Review'].includes(t.status)).length;
  const overdue = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Delivered').length;

  const isEditor = role === 'VIDEO_EDITOR';
  const isManager = role === 'MANAGER' || role === 'SUPER_ADMIN';

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
      title="Video Editor Dashboard"
      subtitle="Video Production Tracking & Task Management"
    >
      <Paper sx={{ p: 2, mb: 2 }}>
        <h3>Video Editor Production Stats</h3>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-primary border-4">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted text-uppercase fw-semibold">Total Tasks</small>
                <h3>{totalTasks}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-success border-4">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted text-uppercase fw-semibold">Completed</small>
                <h3>{completed}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-info border-4">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted text-uppercase fw-semibold">In Progress</small>
                <h3>{inProgress}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-danger border-4">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted text-uppercase fw-semibold">Overdue</small>
                <h3>{overdue}</h3>
              </div>
            </div>
          </div>
        </div>
      </Paper>

      <Paper sx={{ my: 2, p: 1 }}>
        <h3>My Assigned Tasks</h3>

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks assigned</p>
        ) : (
          <Table sx={{ minWidth: 600 }} aria-label="video tasks">
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
                      {isEditor && task.assigned_editor === userId && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => window.alert('Start task work log')}
                        >
                          Start
                        </Button>
                      )}
                      {isManager && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => window.alert('Update task status')}
                        >
                          Status
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Filters for Manager/Super Admin */}
      {isManager && (
        <Paper sx={{ marginTop: 16, p: 1 }}>
          <h4>Filters</h4>
          <Select
            labelId="task-status-filter"
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
          </Select>

          <Select
            labelId="task-priority-filter"
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Urgent">Urgent</MenuItem>
          </Select>
        </Paper>
      )}
    </AdminPage>
  );
}