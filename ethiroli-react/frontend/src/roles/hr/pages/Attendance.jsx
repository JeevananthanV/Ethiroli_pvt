import React, { useEffect, useState, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listAttendance } from '../../../services/api/attendanceApi.js';

export default function HRAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAttendance().catch(() => []);
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return (
    <AdminPage
      title="Attendance & Timesheets"
      subtitle="Log and review employee attendance and working hours"
      loading={loading}
      error={error}
      onRetry={fetchAttendance}
    >
      <div className="dashboard">
        {records.length === 0 ? (
          <div className="emptyState">
            <h3>No attendance records</h3>
            <p>Attendance logs will appear here.</p>
          </div>
        ) : (
          <div className="card">
            <div className="cardHeader">
              <h3 className="cardTitle">Attendance Logger</h3>
            </div>
            <div className="cardBody" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec.id}>
                      <td style={{ fontWeight: 600 }}>{rec.employee_name || rec.user_name || '—'}</td>
                      <td>{rec.date ? new Date(rec.date).toLocaleDateString() : '—'}</td>
                      <td>{rec.clock_in || rec.checkIn || '—'}</td>
                      <td>{rec.clock_out || rec.checkOut || '—'}</td>
                      <td>
                        <span className={`statusTag ${rec.status === 'present' || rec.status === 'on_time' ? 'active' : rec.status === 'absent' ? 'error' : 'pending'}`}>
                          {rec.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}