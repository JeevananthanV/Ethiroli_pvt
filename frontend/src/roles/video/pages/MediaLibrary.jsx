import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks } from '../../../services/api/videoApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { Button, Table, TableRow, TableCell, TableHead, TableBody, Alert, Select, MenuItem, Paper, Chip } from '@mui-material';
import { useParams } from 'react-router-dom';

export default function MediaLibrary() {
  const dispatch = useDispatch();
  const { bdaId } = useParams();
  const { id: userId, role } = useSelector(selectUser);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const result = await getTasks({
          assigned_editor: bdaId || userId,
          page: 1,
          limit: 50,
        });
        setTasks(result.items || []);
      } catch (err) {
        console.error('Failed to load media library:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [bdaId, userId]);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Delivered').length;

  return (
    <AdminPage
      title="Media Library"
      subtitle="Video files and links associated with tasks"
    >
      <Paper sx={{ p: 2, mb: 2 }}>
        <h3>Media Library</h3>

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
              <h3>{total - completed}</h3>
            </div>
          </div>
        </div>
      </Paper>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <Table sx={{ minWidth: 800 }} aria-label="media library">
          <TableHead>
            <TableRow>
              <TableColumn>Task ID</TableCell>
              <TableColumn>Project</TableCell>
              <TableColumn>Video Type</TableCell>
              <TableColumn>Status</TableCell>
              <TableColumn>Video Links</TableCell>
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
                  <span className={`badge ${task.status === 'Delivered' ? 'bg-success' : task.status === 'Editing' ? 'bg-info' : task.status === 'Client Review' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                    {task.status}
                  </span>
                </TableCell>
                <TableCell>
                  {task.preview_video_url ? (
                    <Chip label="Preview" href={task.preview_video_url} target="_blank" />
                  ) : (
                    <Chip label="No preview" variant="outlined" />
                  )}
                  {task.final_video_url ? (
                    <Chip label="Final" href={task.final_video_url} target="_blank" variant="outlined" />
                  ) : (
                    <Chip label="No final" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="text" size="small">View Details</Button>
                </TableCell>
              </TableRow>
            ))
          </TableBody>
        </Table>
      )}

      <Paper sx={{ my: 2, p: 1 }}>
        <h4>Add Task to Library</h4>
        <p>Tasks are automatically added to the media library when created. Use the dashboard or my tasks view to manage task statuses.</p>
      </Paper>
    </AdminPage>
  );
}