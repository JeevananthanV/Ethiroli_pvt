import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createLog } from '../../../services/api/videoApi.js';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { Button, Paper, Box, Timeline, TimelineItem, TimelineConnector } from '@mui-material';
import { useParams } from 'react-router-dom';

export default function TimeTracker({ match }) {
  const { taskId } = match.params;
  const dispatch = useDispatch();
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [totalPaused, setTotalPaused] = useState(0);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newNotes, setNewNotes] = useState('');
  const [newBlockers, setNewBlockers] = useState('');
  const timerRef = useRef(null);
  const startTimerRef = useRef(null);

  // Calculate elapsed time
  useEffect(() => {
    if (isTracking && startTime) {
      const now = new Date();
      const start = new Date(startTime);
      const diffMinutes = ((now.getTime() - start.getTime()) / 1000) / 60;
      const totalPausedMinutes = totalPaused;
      const activeMinutes = diffMinutes - totalPausedMinutes;
      setElapsedTime(Math.max(0, activeMinutes));
    }
  }, [isTracking, startTime, totalPaused]);

  // Auto-create work log when stopping
  const handleStop = async () => {
    setIsTracking(false);
    clearInterval(timerRef.current);

    if (startTime) {
      const endTime = new Date().toISOString();
      await createLog({
        task_id: taskId,
        editor: 'current-user',
        start_time: startTime,
        end_time: endTime,
        blockers: [],
        notes: newNotes,
      });

      setShowModal(true);
      setIsTracking(false);
      setElapsedTime(0);
      setStartTime(null);
    }
  };

  const handleStart = () => {
    setIsTracking(true);
    setStartTime(new Date().toISOString());
    setPausedTime(0);
    setTotalPaused(0);
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    startTimerRef.current = Date.now();
  };

  const handlePause = () => {
    setIsTracking(false);
    clearInterval(timerRef.current);
    const now = new Date();
    const start = startTime ? new Date(startTime) : now;
    const pausedMinutes = ((now.getTime() - start.getTime()) / 1000) / 60;
    setTotalPaused(prev => prev + pausedMinutes);
  };

  const handleResume = () => {
    setIsTracking(true);
    setStartTime(new Date().toISOString());
    // Don't reset elapsed time - continue from where we left off
  };

  const submitLog = async () => {
    if (!startTime) return;
    await createLog({
      task_id: taskId,
      editor: 'current-user',
      start_time: startTime,
      end_time: new Date().toISOString(),
      blockers: newBlockers ? [newBlockers] : [],
      notes: newNotes,
    });
    setShowModal(true);
    setIsTracking(false);
    setElapsedTime(0);
    setStartTime(null);
    setNewNotes('');
    setNewBlockers('');
  };

  return (
    <AdminPage
      title="Time Tracker"
      subtitle="Track editing time and submit work logs"
    >
      <Paper sx={{ p: 2, mb: 2 }}>
        <h3>Time Tracker</h3>

        {isTracking ? (
          <Box sx={{ p: 1, bgcolor: 'info', color: 'white' }}>
            <Box sx={{ display: 'flex', justify-content: 'space-between', my: 1 }}>
              <span>Running: {elapsedTime} minutes</span>
              <Button onClick={handleResume} variant="outlined" size="small">
                Resume
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Button variant="outlined" size="large" onClick={handleStart}>
              <svg
                width: "24"
                height: "24"
                viewBox: "0 0 24 24"
                color: "green"
              >
                <path d: "M19 13v4h-4v-4H5v4H1v-4h4V5h4v4H5v4h4V13H19zM9 3V5h6v4H3v4H9zM5 9v2h4v-2H5zM3 17v2h4v-2H3z" />
              </svg>
              Start Tracking
            </Button>
          </Box>
        )}

        {/* Controls when not tracking */}
        {isTracking && (
          <Box sx={{ p: 1, bgcolor: 'warning', color: 'white' }}>
            <Box sx={{ display: 'flex', justify-content: 'space-between', my: 1 }}>
              <span>Paused: {elapsedTime} minutes</span>
              <Button onClick={handleResume} variant="outlined" size="small">
                Resume
              </Button>
              <Button onClick={handleStop} variant="outlined" size="small" sx={{ mx: 'auto' }}>
                Stop
              </Button>
            </Box>
          </Box>
        )}

        {/* Log submission form */}
        {showModal && (
          <Paper sx={{ p: 1, bgcolor: 'success', color: 'white' }}>
            <span>✓ Work log submitted. Hours recorded and task progress updated.</span>
          </Paper>
        )}

        {/* Blockers and notes form (when stopping) */}
        {isTracking && !showModal && (
          <Paper sx={{ p: 1, bgcolor: 'white', border: '1px dashed', borderColor: 'primary' }}>
            <h4>Add Log Details</h4>
            <Box sx={{ mb: 12 }}>
              <Box>
                <span>Blockers:</span>
                <TextInput
                  placeholder="e.g., Waiting for client feedback, technical issues"
                  value={newBlockers}
                  onChange={(e) => setNewBlockers(e.target.value)}
                  multiline={true}
                  rows={2}
                />
              </Box>
              <Box>
                <span>Notes:</span>
                <TextInput
                  placeholder="e.g., Completed intro segment, working on transitions"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  multiline={true}
                  rows={3}
                />
              </Box>
            </Box>
            <Box textAlign="right">
              <Button variant="outlined" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleStop}>
                Submit Log
              </Button>
            </Box>
          </Paper>
        )}
      </Paper>
    </AdminPage>
  );
}