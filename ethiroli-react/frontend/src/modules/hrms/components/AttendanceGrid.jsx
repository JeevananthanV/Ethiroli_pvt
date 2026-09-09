import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listAttendance } from '../../services/api/attendanceApi.js';

export default function AttendanceGrid() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAttendance();
      setRecords(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const getStatusTag = (status) => {
    const map = {
      PRESENT: 'active',
      ABSENT: 'error',
      LEAVE: 'pending',
      HALF_DAY: 'pending',
    };
    const cls = map[status] || 'pending';
    return <span className={`statusTag ${cls}`}>{status || 'N/A'}</span>;
  };

  const formatTime = (time) => {
    if (!time) return '-';
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const stats = {
    total: records.length,
    present: records.filter((r) => r.status === 'PRESENT').length,
    late: records.filter((r) => r.is_late).length,
  };

  return (
    <AdminPage
      title="Attendance"
      subtitle="Daily attendance tracking and late check-in monitoring"
      loading={loading}
      error={error}
      onRetry={fetchAttendance}
      actions={
        <button className="btn secondary" onClick={fetchAttendance}>
          Refresh
        </button>
      }
    >
      <div className="dashboardGrid" style={{ marginBottom: 24 }}>
        <div className="statCard">
          <p className="statLabel">Total Records</p>
          <p className="statValue">{stats.total}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Present</p>
          <p className="statValue" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text' }}>{stats.present}</p>
        </div>
        <div className="statCard">
          <p className="statLabel">Late Check-ins</p>
          <p className="statValue" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', WebkitBackgroundClip: 'text' }}>{stats.late}</p>
        </div>
      </div>

      <div className="card">
        {records.length === 0 ? (
          <div className="emptyState">
            <h3>No attendance records</h3>
            <p>Attendance data will appear here once available.</p>
          </div>
        ) : (
          <div className="overflowAuto">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User ID</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Late</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="textSecondary">{record.date || '-'}</td>
                    <td className="textSecondary">{record.user_id || '-'}</td>
                    <td>{getStatusTag(record.status)}</td>
                    <td className="textSecondary">{formatTime(record.check_in_time)}</td>
                    <td className="textSecondary">{formatTime(record.check_out_time)}</td>
                    <td>
                      {record.is_late ? (
                        <span className="statusTag error">Late</span>
                      ) : (
                        <span className="statusTag active">On Time</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
