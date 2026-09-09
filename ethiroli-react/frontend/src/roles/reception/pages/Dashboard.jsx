import React, { useEffect, useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { listAttendance } from '../../../services/api/attendanceApi.js';
import { listEvents } from '../../../services/api/calendarApi.js';

export default function ReceptionDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [att, ev] = await Promise.all([listAttendance().catch(() => []), listEvents().catch(() => [])]);
      setAttendance(Array.isArray(att) ? att : []);
      setEvents(Array.isArray(ev) ? ev : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return (
    <AdminPage title="Reception Dashboard" subtitle="Visitor management and appointments" loading={loading} error={null} onRetry={load}>
      <div className="dashboardGrid" style={{ marginBottom: 24 }}>
        <div className="statCard"><p className="statLabel">Today's Visitors</p><p className="statValue">{attendance.length}</p></div>
        <div className="statCard"><p className="statLabel">Appointments</p><p className="statValue">{events.length}</p></div>
      </div>
    </AdminPage>
  );
}
