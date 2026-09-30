import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ReceptionAnnouncements() {
  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'Campus Holiday Notice - Regional Festival', target: 'ALL_CAMPUS', priority: 'HIGH', posted_by: 'Campus Administration', date: 'Today', is_pinned: true, body: 'Please note that the campus, labs, and front desk will remain closed on Monday for the festival. Normal sessions resume Tuesday at 9:00 AM.' },
    { id: '2', title: 'Infosys BPM Campus Recruitment Drive Tomorrow', target: 'FINAL_YEAR_STUDENTS', priority: 'HIGH', posted_by: 'Placement Cell', date: 'Today', is_pinned: true, body: 'All shortlisted trainees must report to Seminar Hall A by 09:30 AM in formal attire with 2 physical copies of their resume and portfolio.' },
    { id: '3', title: 'Biometric RFID Card Replacement Drive at Reception', target: 'STUDENTS_INTERNS', priority: 'MEDIUM', posted_by: 'Front Desk', date: 'Yesterday', is_pinned: false, body: 'Students who have not collected their permanent smart card or have lost their card should visit the front desk between 2:00 PM and 5:00 PM.' },
    { id: '4', title: 'WiFi Network Maintenance on 2nd Floor Labs', target: 'INTERNAL_STAFF', priority: 'LOW', posted_by: 'IT Infrastructure', date: '2 days ago', is_pinned: false, body: 'Scheduled router firmware upgrade will take place on Saturday from 6:00 PM to 8:00 PM. Lab internet may experience brief intermittent drops.' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    target: 'ALL_CAMPUS',
    priority: 'HIGH',
    body: ''
  });

  const handleCreate = (e) => {
    e.preventDefault();
    setAnnouncements([
      {
        id: String(Date.now()),
        ...newNotice,
        posted_by: 'Reception Desk',
        date: 'Today',
        is_pinned: false
      },
      ...announcements
    ]);
    setShowModal(false);
    setNewNotice({ title: '', target: 'ALL_CAMPUS', priority: 'HIGH', body: '' });
  };

  const togglePin = (id) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_pinned: !a.is_pinned } : a));
  };

  return (
    <AdminPage
      title="Front Desk Campus Announcements"
      subtitle="Broadcast emergency notices, holiday schedules, placement drives, and digital notice board bulletins"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-megaphone-fill"></i>
          <span>Post Announcement</span>
        </button>
      }
    >
      {/* Notices List */}
      <div className="row g-3">
        {announcements.map(a => (
          <div className="col-12" key={a.id}>
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
              <div className="d-flex align-items-start justify-content-between mb-2">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    {a.is_pinned && (
                      <span className="badge bg-primary px-2 py-1">
                        <i className="bi bi-pin-angle-fill me-1"></i>PINNED
                      </span>
                    )}
                    <span className={`badge ${a.priority === 'HIGH' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-info bg-opacity-10 text-info'}`}>
                      {a.priority} PRIORITY
                    </span>
                    <span className="badge bg-light text-dark border">
                      Target: {a.target.replace('_', ' ')}
                    </span>
                  </div>
                  <h5 className="fw-bold text-dark mb-1">{a.title}</h5>
                  <small className="text-muted">Posted by {a.posted_by} &bull; {a.date}</small>
                </div>
                <button
                  className={`btn btn-sm ${a.is_pinned ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => togglePin(a.id)}
                  title={a.is_pinned ? 'Unpin Notice' : 'Pin to Notice Board'}
                >
                  <i className="bi bi-pin-angle"></i>
                </button>
              </div>
              <p className="text-secondary mt-2 mb-0" style={{ lineHeight: '1.6' }}>{a.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Post Campus Notice</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body p-3">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Notice Headline *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                        placeholder="e.g. Schedule Change for Friday Labs"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Target Audience</label>
                      <select
                        className="form-select"
                        value={newNotice.target}
                        onChange={(e) => setNewNotice({ ...newNotice, target: e.target.value })}
                      >
                        <option value="ALL_CAMPUS">Entire Campus (All)</option>
                        <option value="STUDENTS">Students Only</option>
                        <option value="INTERNS">Interns Only</option>
                        <option value="INTERNAL_STAFF">Staff & Faculty</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Priority</label>
                      <select
                        className="form-select"
                        value={newNotice.priority}
                        onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                      >
                        <option value="HIGH">High (Urgent)</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Notice Body Text *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        required
                        value={newNotice.body}
                        onChange={(e) => setNewNotice({ ...newNotice, body: e.target.value })}
                        placeholder="Write detailed notice information..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Publish Announcement</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
