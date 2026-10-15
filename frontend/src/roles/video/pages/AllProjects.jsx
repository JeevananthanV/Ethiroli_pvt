import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../../../services/api/videoApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { Button, Table, TableRow, TableCell, TableHead, TableBody, Alert, Select, MenuItem, Paper } from '@mui-material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../store/selectors/userSelector.js';

export default function AllProjects() {
  const dispatch = useDispatch();
  const { id: userId, role } = useSelector(selectUser);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const result = await getProjects();
        setProjects(result.items || []);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [filterStatus]);

  const total = projects.length;
  const active = projects.filter(p => p.status === 'Active').length;
  const completed = projects.filter(p => p.status === 'Completed').length;

  const statusBadge = (status) => {
    const classes = {
      'Active': 'bg-success text-white',
      'Completed': 'bg-secondary text-white',
      'On Hold': 'bg-warning text-dark',
      'Cancelled': 'bg-danger text-white',
    };
    return classes[status] || 'bg-secondary text-white';
  };

  const statusLabel = (status) => {
    const labels = {
      'Active': 'Active',
      'Completed': 'Completed',
      'On Hold': 'On Hold',
      'Cancelled': 'Cancelled',
    };
    return labels[status] || status;
  };

  return (
    <AdminPage
      title="All Video Projects"
      subtitle="Browse all video production projects in the system"
    >
      <Paper sx={{ p: 2, mb: 2 }}>
        <h3>All Video Projects</h3>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <small className="text-muted text-uppercase fw-semibold">Total Projects</small>
              <h3>{total}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-success border-4">
              <small className="text-muted text-uppercase fw-semibold">Active</small>
              <h3>{active}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-secondary border-4">
              <small className="text-muted text-uppercase fw-semibold">Completed</small>
              <h3>{completed}</h3>
            </div>
          </div>
        </div>
      </Paper>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <Table sx={{ minWidth: 800 }} aria-label="all video projects">
          <TableHead>
            <TableRow>
              <TableColumn>Project ID</TableCell>
              <TableColumn>Title</TableCell>
              <TableColumn>Client</TableCell>
              <TableColumn>Type</TableCell>
              <TableColumn>Assigned Editor</TableCell>
              <TableColumn>Status</TableCell>
              <TableColumn>Deadline</TableCell>
              <TableColumn>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => {
              const editorName = project.editor_name ? `${project.editor_name} (Editor)` : 'Unassigned';
              return (
                <TableRow key={project.id}>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.client_name || 'N/A'}</TableCell>
                  <TableCell>{project.project_type || 'Marketing'}</TableCell>
                  <TableCell>{editorName}</TableCell>
                  <TableCell>
                    <span className={`badge ${statusBadge(project.status)}`}>
                      {statusLabel(project.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                  </TableCell>
                  <TableCell>
                    <Button variant="text" size="small">View Details</Button>
                    <Button variant="text" size="small" style={{ marginLeft: '8px' }}>
                      Assign Editor
                    </Button>
                  </TableCell>
                </TableRow>
              );
            ))}
          </TableBody>
        </Table>
      )}

      {/* Status filter for managers */}
      {role === 'MANAGER' || role === 'SUPER_ADMIN' && (
        <Paper sx={{ marginTop: 16, p: 1 }}>
          <h4>Filter by Status</h4>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </MenuItem>
        </Paper>
      )}
    </AdminPage>
  );
}