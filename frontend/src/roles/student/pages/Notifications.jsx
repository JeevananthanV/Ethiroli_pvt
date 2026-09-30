import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';
import Button from '../../../common/components/Button/Button.jsx';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    title: 'New Live Class Scheduled',
    message: 'React Custom Hooks & Async Lifecycle session starts today at 10:00 AM IST with Lead Architect Jeeva Karthik.',
    type: 'LIVE_CLASS',
    read: false,
    timestamp: '10 minutes ago',
    actionLink: '/app/student/live-classes',
    actionText: 'Join Class',
    icon: 'bi-camera-video-fill',
    tone: 'danger',
  },
  {
    id: 'NOTIF-02',
    title: 'Assignment Evaluated: Todo App with Hooks',
    message: 'Your assignment submission has been reviewed by your tutor. Score: 85/100. Feedback: "Great code structure, improve input validation."',
    type: 'ASSIGNMENT',
    read: false,
    timestamp: '2 hours ago',
    actionLink: '/app/student/assignments',
    actionText: 'View Feedback',
    icon: 'bi-clipboard-check-fill',
    tone: 'success',
  },
  {
    id: 'NOTIF-03',
    title: 'Tutor Replied to your Doubt',
    message: 'Faculty replied to your doubt on "useEffect cleanup timing with AbortController".',
    type: 'DOUBT',
    read: false,
    timestamp: '5 hours ago',
    actionLink: '/app/student/doubts',
    actionText: 'Open Doubt Thread',
    icon: 'bi-chat-dots-fill',
    tone: 'primary',
  },
  {
    id: 'NOTIF-04',
    title: 'Upcoming Assessment: React Phase 2 Test',
    message: 'Module 4 & 5 comprehensive assessment is scheduled for tomorrow. 20 questions, 30 minutes.',
    type: 'QUIZ',
    read: true,
    timestamp: '1 day ago',
    actionLink: '/app/student/quiz',
    actionText: 'Review Syllabus',
    icon: 'bi-patch-question-fill',
    tone: 'warning',
  },
  {
    id: 'NOTIF-05',
    title: 'Achievement Unlocked: 7-Day Learning Streak! 🔥',
    message: 'Congratulations! You have completed daily lessons and sandbox practice tasks for 7 days in a row.',
    type: 'ACHIEVEMENT',
    read: true,
    timestamp: '2 days ago',
    actionLink: '/app/student/achievements',
    actionText: 'View Badge',
    icon: 'bi-trophy-fill',
    tone: 'info',
  },
  {
    id: 'NOTIF-06',
    title: 'Certificate Clearance Checkpoint',
    message: 'Your course progress has reached 68% and attendance is 94%. Keep progressing to unlock your certificate.',
    type: 'CERTIFICATE',
    read: true,
    timestamp: '3 days ago',
    actionLink: '/app/student/certificates',
    actionText: 'Check Eligibility',
    icon: 'bi-award-fill',
    tone: 'success',
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('ALL');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filteredList = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'ALL') return true;
    return n.type === filter;
  });

  return (
    <AdminPage
      title="Student Notifications & Updates"
      subtitle={`Stay updated with course alerts, live classes, assignment grading, doubt resolutions, and achievements.`}
    >
      {/* Action Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div className="btn-group" role="group">
          {['ALL', 'UNREAD', 'LIVE_CLASS', 'ASSIGNMENT', 'DOUBT', 'QUIZ'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              {cat === 'ALL' && 'All Notifications'}
              {cat === 'UNREAD' && `Unread (${unreadCount})`}
              {cat === 'LIVE_CLASS' && 'Live Classes'}
              {cat === 'ASSIGNMENT' && 'Assignments'}
              {cat === 'DOUBT' && 'Doubts'}
              {cat === 'QUIZ' && 'Quizzes'}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-sm btn-outline-primary">
            <i className="bi bi-check2-all me-1" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {filteredList.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-bell-slash fs-1 text-secondary mb-2" />
              <p className="mb-0">No notifications found in this category.</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {filteredList.map((n) => (
                <div
                  key={n.id}
                  className={`list-group-item list-group-item-action p-3 d-flex gap-3 align-items-start ${
                    !n.read ? 'bg-primary-subtle bg-opacity-25 border-start border-primary border-3' : ''
                  }`}
                >
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-${n.tone}-subtle text-${n.tone}`}
                    style={{ width: 44, height: 44 }}
                  >
                    <i className={`bi ${n.icon} fs-5`} />
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="mb-0 fw-bold text-dark">
                        {n.title} {!n.read && <span className="badge bg-primary ms-1">New</span>}
                      </h6>
                      <small className="text-muted">{n.timestamp}</small>
                    </div>
                    <p className="small text-muted mb-2">{n.message}</p>
                    <div className="d-flex gap-2 align-items-center">
                      <Link
                        to={n.actionLink}
                        onClick={() => markAsRead(n.id)}
                        className="btn btn-sm btn-primary py-1 px-3"
                      >
                        {n.actionText} <i className="bi bi-arrow-right ms-1" />
                      </Link>
                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="btn btn-sm btn-link text-decoration-none text-muted"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
