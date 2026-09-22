import React, { useState, useEffect, useCallback } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    // Initial notifications state with rich realistic employee alerts
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          category: 'LEAVE',
          title: 'Leave Request Approved',
          description: 'Your casual leave request for next week has been approved by HR.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_read: false,
          icon: 'bi-calendar-check',
          color: 'text-success bg-success'
        },
        {
          id: '2',
          category: 'PAYROLL',
          title: 'Monthly Payslip Generated',
          description: 'Your salary payslip for the current period is now ready to download.',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          is_read: false,
          icon: 'bi-receipt',
          color: 'text-primary bg-primary'
        },
        {
          id: '3',
          category: 'TASK',
          title: 'New Task Assignment',
          description: 'You have been assigned to sprint deliverable "API Gateway Optimization".',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          is_read: true,
          icon: 'bi-check2-circle',
          color: 'text-info bg-info'
        },
        {
          id: '4',
          category: 'GOVERNANCE',
          title: 'Security Compliance Reminder',
          description: 'Annual compliance and code of conduct certification is due in 5 days.',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          is_read: true,
          icon: 'bi-shield-check',
          color: 'text-warning bg-warning'
        }
      ]);
      setLoading(false);
    }, 200);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const filtered = filter === 'ALL'
    ? notifications
    : filter === 'UNREAD'
    ? notifications.filter(n => !n.is_read)
    : notifications.filter(n => n.category === filter);

  return (
    <AdminPage
      title="Notifications & Alerts"
      subtitle="Live feed of policy alerts, leave updates, task deadlines, and payroll logs"
      loading={loading}
      onRetry={loadNotifications}
    >
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('ALL')}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'UNREAD' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('UNREAD')}
          >
            Unread ({notifications.filter(n => !n.is_read).length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'LEAVE' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('LEAVE')}
          >
            Leaves
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === 'PAYROLL' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('PAYROLL')}
          >
            Payroll
          </button>
        </div>

        <button className="btn btn-sm btn-outline-primary" onClick={markAllRead}>
          <i className="bi bi-check2-all me-1"></i>
          Mark All as Read
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="list-group list-group-flush">
          {filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-bell-slash fs-1 d-block mb-2"></i>
              <p>No notifications matching this filter.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`list-group-item p-3 d-flex align-items-start gap-3 border-bottom ${
                  !item.is_read ? 'bg-light' : ''
                }`}
              >
                <div
                  className={`rounded-circle p-2 d-flex align-items-center justify-content-center bg-opacity-10 ${item.color}`}
                  style={{ width: '42px', height: '42px' }}
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="mb-0 fw-semibold text-dark">{item.title}</h6>
                    <small className="text-muted">
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </small>
                  </div>
                  <p className="mb-0 text-secondary small">{item.description}</p>
                </div>

                {!item.is_read && (
                  <span className="badge bg-primary rounded-pill p-1">
                    <span className="visually-hidden">unread</span>
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminPage>
  );
}
