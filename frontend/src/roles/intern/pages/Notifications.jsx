import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function InternNotifications() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Assignment deadline tomorrow',
      desc: 'React Todo Application submission is due by Sep 24, 11:59 PM.',
      category: 'Tasks',
      time: 'Today • 2 hours ago',
      unread: true,
      icon: 'bi-file-earmark-code-fill text-warning',
      actionUrl: '/app/intern/assignments'
    },
    {
      id: '2',
      title: 'Mentor assigned a new task',
      desc: 'Arun Kumar assigned: "Implement JWT token interceptor".',
      category: 'Mentor',
      time: 'Today • 4 hours ago',
      unread: true,
      icon: 'bi-person-badge text-primary',
      actionUrl: '/app/intern/tasks'
    },
    {
      id: '3',
      title: 'Your daily work log was approved',
      desc: 'Your mentor approved your work log for Sep 21 with a 4/5 rating.',
      category: 'Mentor',
      time: 'Today • 6 hours ago',
      unread: false,
      icon: 'bi-check-circle-fill text-success',
      actionUrl: '/app/intern/work-log'
    },
    {
      id: '4',
      title: 'New training module available',
      desc: 'Module 4: "State Management with Redux Toolkit" is now unlocked.',
      category: 'Training',
      time: 'Yesterday • 10:30 AM',
      unread: false,
      icon: 'bi-mortarboard-fill text-info',
      actionUrl: '/app/intern/courses'
    },
    {
      id: '5',
      title: 'Attendance marked',
      desc: 'Your clock-in at 09:21 AM was recorded successfully.',
      category: 'System',
      time: 'Yesterday • 09:22 AM',
      unread: false,
      icon: 'bi-calendar-check-fill text-success',
      actionUrl: '/app/intern/attendance'
    },
    {
      id: '6',
      title: 'HR policy update',
      desc: 'Please review and sign the updated Code of Conduct document.',
      category: 'HR',
      time: '3 days ago',
      unread: false,
      icon: 'bi-shield-check text-secondary',
      actionUrl: '/app/intern/documents'
    }
  ]);

  const categories = ['All', 'Tasks', 'Training', 'Mentor', 'HR', 'System'];

  const filtered = notifications.filter(
    (n) => activeFilter === 'All' || n.category === activeFilter
  );

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markSingleAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <AdminPage
      title="Notification Center"
      subtitle="Stay updated with tasks, training announcements, mentor messages, and approvals"
      actions={
        <button className="btn btn-outline-secondary btn-sm" onClick={markAllAsRead}>
          <i className="bi bi-check2-all me-1"></i> Mark All as Read
        </button>
      }
    >
      {/* Category Filter Pills */}
      <div className="d-flex gap-2 flex-wrap mb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`btn btn-sm ${
              activeFilter === cat ? 'btn-primary shadow-sm' : 'btn-outline-secondary'
            }`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        {filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-bell-slash fs-1 text-muted mb-2 d-block"></i>
            <h5 className="fw-semibold">No notifications in this category</h5>
            <p className="small mb-0">You're all caught up!</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`list-group-item list-group-item-action p-3 d-flex align-items-start gap-3 ${
                  item.unread ? 'bg-light bg-opacity-50' : ''
                }`}
                onClick={() => markSingleAsRead(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="fs-4 mt-1">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <h6 className="mb-0 fw-semibold text-dark">
                      {item.title}
                      {item.unread && (
                        <span className="badge bg-primary ms-2 rounded-pill" style={{ fontSize: '0.65rem' }}>
                          NEW
                        </span>
                      )}
                    </h6>
                    <small className="text-muted">{item.time}</small>
                  </div>
                  <p className="mb-2 text-muted small">{item.desc}</p>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-secondary bg-opacity-10 text-secondary border">
                      {item.category}
                    </span>
                    <Link to={item.actionUrl} className="btn btn-sm btn-link p-0 text-decoration-none small">
                      View Details <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPage>
  );
}
