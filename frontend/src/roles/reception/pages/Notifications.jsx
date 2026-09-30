import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ReceptionNotifications() {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Visitor Arrived at Reception', description: 'Mr. Suresh Kumar (Infosys) has arrived for 10:30 AM appointment with HR Director.', category: 'VISITOR', time: '5 mins ago', read: false, icon: 'bi-person-check-fill', color: 'text-primary' },
    { id: '2', title: 'Courier / Package Delivery at Front Gate', description: 'BlueDart courier package received for Karthik S (Engineering). Waiting at parcel shelf.', category: 'DELIVERY', time: '20 mins ago', read: false, icon: 'bi-box-seam-fill', color: 'text-warning' },
    { id: '3', title: 'Appointment Reminder: Parent Counseling', description: 'Mr. Lakshmi Narayanan appointment scheduled at 11:45 AM in Counseling Room 2.', category: 'APPOINTMENT', time: '45 mins ago', read: false, icon: 'bi-alarm-fill', color: 'text-danger' },
    { id: '4', title: 'Fee Payment Received', description: 'Receipt REC-20260910-0501 of ₹15,000 for Aravind Swamy generated via UPI.', category: 'FINANCE', time: '1 hour ago', read: true, icon: 'bi-credit-card-2-front-fill', color: 'text-success' },
    { id: '5', title: 'Visitor Badge Checkout Complete', description: 'Visitor badge VIP-04 returned by TCS representative upon campus exit.', category: 'SECURITY', time: '2 hours ago', read: true, icon: 'bi-shield-check', color: 'text-secondary' },
  ]);

  const [filter, setFilter] = useState('ALL');

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    if (filter !== 'ALL') return n.category === filter;
    return true;
  });

  return (
    <AdminPage
      title="Front Desk Alerts & Notification Feed"
      subtitle="Real-time security gate updates, upcoming appointment chimes, package deliveries, and visitor arrival alerts"
      actions={
        <button className="btn btn-outline-primary btn-sm shadow-sm" onClick={markAllRead}>
          <i className="bi bi-check2-all me-1"></i> Mark All as Read
        </button>
      }
    >
      {/* Category Pills */}
      <div className="d-flex gap-2 flex-wrap mb-2">
        <button className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-white border'}`} onClick={() => setFilter('ALL')}>
          All Alerts ({notifications.length})
        </button>
        <button className={`btn btn-sm ${filter === 'UNREAD' ? 'btn-primary' : 'btn-white border'}`} onClick={() => setFilter('UNREAD')}>
          Unread ({notifications.filter(n => !n.read).length})
        </button>
        <button className={`btn btn-sm ${filter === 'VISITOR' ? 'btn-primary' : 'btn-white border'}`} onClick={() => setFilter('VISITOR')}>
          Visitors
        </button>
        <button className={`btn btn-sm ${filter === 'APPOINTMENT' ? 'btn-primary' : 'btn-white border'}`} onClick={() => setFilter('APPOINTMENT')}>
          Appointments
        </button>
        <button className={`btn btn-sm ${filter === 'DELIVERY' ? 'btn-primary' : 'btn-white border'}`} onClick={() => setFilter('DELIVERY')}>
          Deliveries
        </button>
      </div>

      {/* Notifications List */}
      <div className="card border-0 shadow-sm rounded-3 bg-white overflow-hidden">
        <div className="list-group list-group-flush">
          {filtered.map(n => (
            <div 
              key={n.id} 
              className={`list-group-item p-3 d-flex align-items-center justify-content-between ${!n.read ? 'bg-light bg-opacity-50' : ''}`}
            >
              <div className="d-flex align-items-center gap-3">
                <div className={`rounded-circle p-2 bg-light d-flex align-items-center justify-content-center ${n.color}`} style={{ width: '42px', height: '42px' }}>
                  <i className={`bi ${n.icon} fs-5`}></i>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <h6 className={`mb-0 ${!n.read ? 'fw-bold text-dark' : 'text-secondary'}`}>{n.title}</h6>
                    {!n.read && <span className="badge bg-primary rounded-pill px-2 py-0" style={{ fontSize: '0.65rem' }}>NEW</span>}
                  </div>
                  <p className="mb-0 small text-secondary">{n.description}</p>
                  <small className="text-muted"><i className="bi bi-clock me-1"></i>{n.time}</small>
                </div>
              </div>
              <button 
                className="btn btn-sm btn-link text-decoration-none text-muted"
                onClick={() => toggleRead(n.id)}
                title={n.read ? 'Mark as Unread' : 'Mark as Read'}
              >
                <i className={`bi bi-${n.read ? 'envelope' : 'envelope-open'}`}></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
