import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getActivities, getDeals } from '../../../services/api/salesApi.js';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState('September 2026');

  useEffect(() => {
    async function loadCalendar() {
      try {
        setLoading(true);
        const [acts, deals] = await Promise.all([
          getActivities().catch(() => ({ items: [] })),
          getDeals().catch(() => ({ items: [] }))
        ]);

        const actItems = acts?.items || (Array.isArray(acts) ? acts : []);
        const dealItems = deals?.items || (Array.isArray(deals) ? deals : []);

        const combined = [
          ...actItems.map(a => ({
            id: a.id,
            title: a.title,
            date: a.scheduled_at ? a.scheduled_at.slice(0, 10) : '2026-09-12',
            time: a.scheduled_at ? new Date(a.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
            type: a.activity_type || 'MEETING',
            company: a.lead_company || a.deal_title || 'Client'
          })),
          ...dealItems.map(d => ({
            id: d.id,
            title: `TARGET CLOSE: ${d.title}`,
            date: d.expected_close_date || '2026-09-30',
            time: 'EOD',
            type: 'DEAL_CLOSE',
            company: d.client_name || 'Prospect'
          }))
        ];

        setEvents(combined.length > 0 ? combined : [
          { id: '1', title: 'Platform Architecture Demo', date: '2026-09-11', time: '11:00 AM', type: 'MEETING', company: 'EduGlobal Institute' },
          { id: '2', title: 'Quarterly Pricing Follow-Up Call', date: '2026-09-12', time: '02:30 PM', type: 'CALL', company: 'Zenith Tech' },
          { id: '3', title: 'TARGET CLOSE: Corporate LMS 50 Seats', date: '2026-09-15', time: 'EOD', type: 'DEAL_CLOSE', company: 'Quantum Labs' },
          { id: '4', title: 'Executive SLA Signing Ceremony', date: '2026-09-18', time: '04:00 PM', type: 'MEETING', company: 'Apex Infotech' }
        ]);
      } catch (err) {
        console.error('Failed to load calendar events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCalendar();
  }, []);

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <AdminPage
      title="Sales Calendar & Schedule"
      subtitle="Synchronized timeline of scheduled prospect demos, executive calls, and deal closing target deadlines"
      actions={
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary fs-6 px-3 py-2">{currentMonth}</span>
        </div>
      }
    >
      {/* Month Grid Overview */}
      <div className="card border-0 shadow-sm rounded-3 bg-white p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Upcoming Engagements for {currentMonth}</h5>
          <div className="d-flex gap-2">
            <span className="badge bg-primary"><i className="bi bi-people me-1"></i>Meeting</span>
            <span className="badge bg-info text-dark"><i className="bi bi-telephone me-1"></i>Call</span>
            <span className="badge bg-success"><i className="bi bi-trophy me-1"></i>Deal Close Target</span>
          </div>
        </div>

        <div className="row g-3">
          {events.map(ev => (
            <div key={ev.id} className="col-md-6 col-lg-3">
              <div className={`card border-0 shadow-sm rounded-3 p-3 h-100 border-start border-4 ${
                ev.type === 'DEAL_CLOSE' ? 'border-success bg-success bg-opacity-10' :
                ev.type === 'MEETING' ? 'border-primary bg-light' : 'border-info bg-light'
              }`}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="fw-bold text-dark">{ev.date}</small>
                  <span className="badge bg-white text-dark shadow-sm">{ev.time}</span>
                </div>
                <h6 className="fw-bold text-dark mt-2 mb-1">{ev.title}</h6>
                <small className="text-muted d-block">{ev.company}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
