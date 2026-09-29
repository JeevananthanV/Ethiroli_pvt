import React, { useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Database Maintenance Scheduled', message: 'Planned zero-downtime shard re-indexing on Sep 14, 02:00 UTC.', type: 'SYSTEM', target: 'ALL_TENANTS', time: '10 mins ago', read: false },
    { id: 2, title: 'New Tenant Onboarded', message: 'Apex EduTech Pvt Ltd successfully provisioned on Professional Tier.', type: 'TENANT', target: 'SUPER_ADMIN', time: '1 hour ago', read: false },
    { id: 3, title: 'High Memory Threshold Alert', message: 'Node-03 memory utilization exceeded 85% for > 5 consecutive minutes.', type: 'ALERT', target: 'INFRASTRUCTURE', time: '3 hours ago', read: true },
    { id: 4, title: 'Security Incident: Failed Root Attempts', message: '5 failed API key authentication requests detected from IP 192.168.1.104.', type: 'SECURITY', target: 'SECURITY_OPS', time: 'Yesterday', read: true },
  ]);

  const [broadcastModal, setBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', target: 'ALL_TENANTS', severity: 'INFO' });

  const handleBroadcast = (e) => {
    e.preventDefault();
    setNotifications(prev => [
      {
        id: Date.now(),
        title: broadcastForm.title,
        message: broadcastForm.message,
        type: broadcastForm.severity,
        target: broadcastForm.target,
        time: 'Just now',
        read: false,
      },
      ...prev
    ]);
    setBroadcastModal(false);
    setBroadcastForm({ title: '', message: '', target: 'ALL_TENANTS', severity: 'INFO' });
  };

  return (
    <div className="container-fluid p-3 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-bell text-primary" aria-hidden="true"></i>
            Platform Notifications & Broadcasts
          </h2>
          <p className="text-secondary small mb-0">
            Global system announcements, multi-tenant alerts, and infrastructure health notifications.
          </p>
        </div>
        <button 
          onClick={() => setBroadcastModal(true)}
          className="btn btn-primary btn-sm d-flex align-items-center gap-1"
        >
          <i className="bi bi-megaphone" aria-hidden="true"></i> Send System Broadcast
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Platform Notification Feed</h5>
          <button 
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            className="btn btn-link btn-sm text-decoration-none"
          >
            Mark all as read
          </button>
        </div>

        <div className="list-group list-group-flush">
          {notifications.map(n => (
            <div 
              key={n.id} 
              className={`list-group-item p-3 d-flex align-items-start gap-3 border-0 border-bottom ${!n.read ? 'bg-light bg-opacity-75' : ''}`}
            >
              <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary mt-1">
                <i className={`bi ${n.type === 'ALERT' || n.type === 'SECURITY' ? 'bi-exclamation-triangle-fill text-danger' : 'bi-bell-fill'}`} aria-hidden="true"></i>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-semibold mb-1 text-dark">{n.title}</h6>
                  <span className="small text-muted">{n.time}</span>
                </div>
                <p className="small text-secondary mb-1">{n.message}</p>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-secondary bg-opacity-15 text-dark font-monospace" style={{ fontSize: '0.7rem' }}>
                    Target: {n.target}
                  </span>
                  <span className={`badge ${n.type === 'SECURITY' || n.type === 'ALERT' ? 'bg-danger' : 'bg-primary'}`} style={{ fontSize: '0.7rem' }}>
                    {n.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Modal */}
      {broadcastModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Dispatch Platform Broadcast</h5>
                <button type="button" className="btn-close" onClick={() => setBroadcastModal(false)}></button>
              </div>
              <form onSubmit={handleBroadcast}>
                <div className="modal-body p-3">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Broadcast Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required
                      value={broadcastForm.title}
                      onChange={e => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                      placeholder="e.g., Scheduled Maintenance"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Target Audience</label>
                    <select 
                      className="form-select"
                      value={broadcastForm.target}
                      onChange={e => setBroadcastForm({ ...broadcastForm, target: e.target.value })}
                    >
                      <option value="ALL_TENANTS">All Tenant Organizations</option>
                      <option value="ADMINS_ONLY">Organization Admins Only</option>
                      <option value="SUPER_ADMIN">Platform Operations Team</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Severity</label>
                    <select 
                      className="form-select"
                      value={broadcastForm.severity}
                      onChange={e => setBroadcastForm({ ...broadcastForm, severity: e.target.value })}
                    >
                      <option value="INFO">Information</option>
                      <option value="WARNING">Warning</option>
                      <option value="ALERT">Urgent Alert</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Notification Content</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      required
                      value={broadcastForm.message}
                      onChange={e => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                      placeholder="Detailed announcement or instructions..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setBroadcastModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Send Broadcast</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
