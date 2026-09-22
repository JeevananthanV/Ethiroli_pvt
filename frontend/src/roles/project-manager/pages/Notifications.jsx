import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage';

export default function PMNotifications() {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Timesheets Submitted for Review', desc: 'Ananya Sharma logged 8.0 hours on ERP Modernization', time: '10 mins ago', type: 'TIMESHEET', isRead: false },
    { id: '2', title: 'Milestone Delivery Approaching', desc: 'Beta Release deliverable due in 3 days', time: '1 hour ago', type: 'DEADLINE', isRead: false },
    { id: '3', title: 'New Client Message', desc: 'Acme Corp acknowledged staging preview link', time: '3 hours ago', type: 'CLIENT', isRead: true },
    { id: '4', title: 'Expense Reimbursement Approved', desc: 'AWS Staging Cluster invoice approved by Finance', time: 'Yesterday', type: 'EXPENSE', isRead: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <AdminPage
      title="Project Notifications & Alerts"
      subtitle="Milestone deadlines, team timesheet submissions, client inquiries, and delivery alerts"
      actions={
        <button className="btn btn-outline-primary btn-sm" onClick={markAllRead}>
          Mark All as Read
        </button>
      }
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="list-group list-group-flush">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`list-group-item p-3 border-0 border-bottom d-flex align-items-start gap-3 ${
                !n.isRead ? 'bg-primary bg-opacity-10' : ''
              }`}
            >
              <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-2 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                <i className={`bi bi-${n.type === 'TIMESHEET' ? 'clock' : n.type === 'DEADLINE' ? 'exclamation-circle' : n.type === 'CLIENT' ? 'chat' : 'receipt'} fs-6`}></i>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className={`mb-1 ${!n.isRead ? 'fw-bold text-dark' : 'fw-medium'}`}>{n.title}</h6>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>{n.time}</small>
                </div>
                <p className="mb-0 text-muted small">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
