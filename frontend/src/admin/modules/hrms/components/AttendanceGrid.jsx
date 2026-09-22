import React, { useEffect, useState } from 'react';
import { getAttendance } from '../../../../services/api/attendanceApi.js';

export default function AttendanceGrid() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAttendance().catch(() => []);
        setAttendance(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load attendance:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading attendance...</div>;

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Attendance</h2>
          <p className="pageSubtitle">Employee attendance records</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="cardBody">
          {attendance.length === 0 ? (
            <div className="emptyState"><h3>No Records</h3><p>No attendance records found.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Employee</th><th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th></tr></thead>
              <tbody>
                {attendance.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.employee_name || rec.employee_id}</td>
                    <td>{rec.date ? new Date(rec.date).toLocaleDateString() : '—'}</td>
                    <td>{rec.check_in || '—'}</td>
                    <td>{rec.check_out || '—'}</td>
                    <td><span className={`statusTag ${rec.status === 'present' ? 'active' : 'pending'}`}>{rec.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
