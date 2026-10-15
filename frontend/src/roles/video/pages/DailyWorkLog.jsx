import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createLog } from '../../../services/api/videoApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { Button, Paper, FormControlLabel, FormGroup, InputLabel, Select, MenuItem, TextInput, InputAdornment, Box } from '@mui/material';
import { v4 as v4 } from 'crypto';

export default function DailyWorkLog({ taskId }) {
  const dispatch = useDispatch();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [blockers, setBlockers] = useState('');
  const [notes, setNotes] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate hours
  const calculateHours = () => {
    if (startTime && endTime) {
      const start = new Date(`1970-01-01 ${startTime}`);
      const end = new Date(`1970-01-01 ${endTime}`);
      const diffMinutes = (end.getTime() - start.getTime()) / 60000;
      return (minutes / 60).toFixed(2);
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogging(true);

    try {
      const logId = await createLog({
        task_id: taskId,
        editor: 'current-user', // Will be replaced with actual user ID from context
        start_time: startTime,
        end_time: endTime,
        blockers: blockers ? [blockers] : [],
        notes: notes,
      });

      setShowSuccess(true);
      setStartTime('');
      setEndTime('');
      setBlockers('');
      setNotes('');
      // Refresh tasks after logging
      // In full impl: dispatch(fetchTasks())
    } catch (err) {
      console.error('Failed to create work log:', err);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <AdminPage
      title="Daily Work Log"
      subtitle="Track your editing time and submit daily reports"
    >
      <Paper sx={{ p: 2, mb: 2 }}>
        <h3>Daily Work Log</h3>

        {showSuccess ? (
          <p style={{ color: 'green' }}>Work log submitted successfully!</p>
        ) : (
          <form onSubmit={handleSubmit} sx={{ mb: 16 }}>
            <FormGroup component="div">
              <InputLabel htmlFor="start-time">Start Time</InputLabel>
              <TextInput
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isLogging}
              />
            </FormGroup>

            <FormGroup component="div">
              <InputLabel htmlFor="end-time">End Time</InputLabel>
              <TextInput
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isLogging}
              />
            </FormGroup>

            <FormGroup component="div">
              <InputLabel htmlFor="blockers">Blockers (optional)</InputLabel>
              <TextInput
                id="blockers"
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                placeholder="e.g., Waiting for client feedback, technical issues"
                rows={2}
                disabled={isLogging}
              />
            </FormGroup>

            <FormGroup component="div">
              <InputLabel htmlFor="notes">Notes (optional)</InputLabel>
              <TextInput
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                disabled={isLogging}
              />
            </FormGroup>

            <Box textAlign="right">
              <Button
                type="submit"
                disabled={isLogging}
                variant="contained"
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLogging}
                variant="primary"
              >
                {isLogging ? 'Logging...' : 'Submit Work Log'}
              </Button>
            </Box>
          </form>
        )}
      )

      {showSuccess && (
        <Paper sx={{ p: 1, bgcolor: 'success', color: 'white' }}>
          <span>✓ Work log submitted. Hours recorded and task progress updated.</span>
        </Paper>
      )}
    </AdminPage>
  );
}