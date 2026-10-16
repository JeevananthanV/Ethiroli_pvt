import React, { useState, useEffect } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import { getNotifications } from '../../../services/api/salesApi.js';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifs() {
      try {
        setLoading(true);
        const res = await getNotifications();
        const items = res?.items || (Array.isArray(res) ? res : []);
        setNotifications(items);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotifs();
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'SUCCESS': return 'bg-success';
      case 'WARNING': return 'bg-warning text-dark';
      case 'DANGER': return 'bg-danger';
      default: return 'bg-primary';
    }
  };

  return (
    <AdminPage
      title="Sales Notifications & Deal Alerts"
      subtitle="Real-time deal progress updates, commercial proposal acceptances, and urgent prospect cadence reminders"
      actions={
        <button className="btn btn-outline-secondary" onClick={markAllRead}>
          <i className="bi bi-check2-all me-1"></i> Mark All as Read
        </button>
      }
    >
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold">Recent Alerts & Reminders</h6>
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
            {notifications.filter(n => !n.read).length} Unread Alerts
          </span>
        </div>

        <div className="list-group list-group-flush">
          {loading ? (
            <div className="p-3 text-center">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-3 text-center text-muted">No notifications to display.</div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`list-group-item p-3 d-flex align-items-start gap-3 transition ${
                  !n.read ? 'bg-light' : ''
                }`}
              >
                <div className={`rounded-circle p-2 text-white d-flex align-items-center justify-content-center flex-shrink-0 ${getTypeBadge(n.type)}`} style={{ width: '36px', height: '36px' }}>
                  <i className="bi bi-bell-fill small"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-1 text-dark">{n.title}</h6>
                    <small className="text-muted">{n.created_at}</small>
                  </div>
                  <p className="mb-0 text-muted small">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminPage>
  );
}
