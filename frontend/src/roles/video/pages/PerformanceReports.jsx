import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, getLogs } from '../../../services/api/videoApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { Box, Table, TableRow, TableCell, TableHead, TableBody, Alert, Select, Chip, CssProvider } from '@mui-material';
import { useParams } from 'react-router-dom';
import { v4 as v4 } from 'crypto';

export default function PerformanceReports() {
  const dispatch = useDispatch();
  const { bdaId } = useParams();
  const { id: userId, role } = useSelector(selectUser);

  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // month, week, year
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [tasksResult, logsResult] = await Promise.all([
          getTasks({ assigned_editor: bdaId || userId, page: 1, limit: 100 }),
          getLogs({ editor: bdaId || userId, page: 1, limit: 100 }),
        ]);
        setTasks(tasksResult.items || []);
        setLogs(logsResult.items || []);
      } catch (err) {
        console.error('Failed to load performance data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bdaId, userId, period]);

  // Calculate metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Delivered').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).round(2) : 0;
  const onTimeDeliveries = tasks.filter(
    t => t.status === 'Delivered' && new Date(t.deadline) >= new Date(t.created_at)
  ).length;
  const onTimeRate = totalTasks > 0 ? (onTimeDeliveries / totalTasks * 100).round(2) : 0;
  const totalHours = logs.reduce((sum, log) => sum + (log.actual_hours || 0), 0);
  const avgHours = tasks.length > 0 ? (totalHours / tasks.length).round(2) : 0;
  const avgCompletionTime = tasks.length > 0 ? (totalHours / completedTasks).round(2) : 0;

  // Rating distribution from reviews
  const reviews = logs.filter(l => l.task_completed === 1).map(l => ({
    rating: Math.round(l.actual_hours) || 3,
  }));
  const ratingCounts = {
    '5': (reviews.filter(r => r.rating === 5).length).round(0),
    '4': (reviews.filter(r => r.rating === 4).length).round(0),
    '3': (reviews.filter(r => r.rating === 3).length).round(0),
    '2': (reviews.filter(r => r.rating === 2).length).round(0),
    '1': (reviews.filter(r => r.rating === 1).length).round(0),
  };

  return (
    <AdminPage
      title="Performance Reports"
      subtitle="Video editor productivity and performance metrics"
    >
      <Paper sx={{ p: 2, mb: 2 }}>
        <h3>Performance Reports</h3>

        <Box sx={{ mb: 12 }}>
          <Box sx={{ display: 'flex', justify-content: 'space-between', mb: 8 }}>
            <Box>
              <Chip label="Completion Rate" color="success">{completionRate}%</Chip>
            </Box>
            <Box>
              <Chip label="On-Time Rate" color="info">{onTimeRate}%</Chip>
            </Box>
            <Box>
              <Chip label="Avg Hours/Task" color="primary">{avgHours}</Chip>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justify-content: 'space-between', mb: 8 }}>
            <Box>
              <Chip label="Total Tasks" color="secondary">{totalTasks}</Chip>
            </Box>
            <Box>
              <Chip label="Completed" color="success">{completedTasks}</Chip>
            </Box>
            <Box>
              <Chip label="Avg Hours" color="primary">{avgHours}</Chip>
            </Box>
          </Box>
        </Box>

        {/* Charts and Tables */}
        <Paper sx={{ my: 2, p: 1 }}>
          <h4>Task Completion Trend</h4>

          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks found for the selected period.</p>
          ) : (
            <Table sx={{ minWidth: 600 }} aria-label="task completion trend">
              <TableHead>
                <TableRow>
                  <TableColumn>Period</TableCell>
                  <TableColumn>Tasks Completed</TableCell>
                  <TableColumn>On-Time %</TableCell>
                  <TableColumn>Avg Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[{ label: 'This Month', value: completionRate }, { label: 'This Week', value: completionRate }, { label: 'This Year', value: completionRate }].map(
                  (item) => (
                    <TableRow key={item.label}>
                      <TableCell>{item.label}</TableCell>
                      <TableCell>{item.value}%</TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>N/A</TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* Work Log Summary */}
        <Paper sx={{ my: 2, p: 1 }}>
          <h4>Work Hours Summary</h4>

          {loading ? (
            <p>Loading work logs...</p>
          ) : logs.length === 0 ? (
            <p>No work logs found.</p>
          ) : (
            <Table sx={{ minWidth: 600 }} aria-label="work hours summary">
              <TableHead>
                <TableRow>
                  <TableColumn>Period</TableCell>
                  <TableColumn>Total Hours</TableCell>
                  <TableColumn>Avg Hours/Task</TableCell>
                  <TableColumn>Tasks Completed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{period}</TableCell>
                  <TableCell>{totalHours}</TableCell>
                  <TableCell>{avgHours}</TableCell>
                  <TableCell>{completedTasks}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Paper>

        {/* Rating Distribution */}
        {role === 'MANAGER' || role === 'SUPER_ADMIN' && (
          <Paper sx={{ my: 2, p: 1 }}>
            <h4>Reviewer Rating Distribution</h4>
            <Table sx={{ minWidth: 400 }} aria-label="rating distribution">
              <TableHead>
                <TableRow>
                  <TableColumn>Rating</TableCell>
                  <TableColumn>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['1', '2', '3', '4', '5'].map((rating) => (
                  <TableRow key={rating}>
                    <TableCell>{rating}</TableCell>
                    <TableCell>{ratingCounts[rating] || 0}</TableCell>
                  </TableRow>
                ))
              </TableBody>
            </Table>
          </Paper>
        )}
      </Paper>

      {/* Export Button */}
      {role === 'SUPER_ADMIN' && (
        <Paper sx={{ p: 1, textAlign: 'right' }}>
          <Button variant="outlined" onClick={() => setShowExport(true)}>
            Export Report
          </Button>
        </Paper>
      )}
    </AdminPage>
  );
}