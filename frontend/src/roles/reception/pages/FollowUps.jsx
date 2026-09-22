import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function ReceptionFollowUps() {
  const [followUps, setFollowUps] = useState([
    { id: '1', candidate: 'Manoj Prabhakar', phone: '+91 98412 98765', task_type: 'Call Back - Course Syllabus', due_date: 'Today, 2:00 PM', priority: 'HIGH', status: 'PENDING', notes: 'Interested in Full Stack. Requested syllabus & batch schedule via WhatsApp.' },
    { id: '2', candidate: 'Deepika Krishnan', phone: '+91 97890 12345', task_type: 'Parent Discussion', due_date: 'Today, 4:30 PM', priority: 'MEDIUM', status: 'PENDING', notes: 'Father inquired about weekend hostel facility and bus routes.' },
    { id: '3', candidate: 'Karthik Raman', phone: '+91 98765 43210', task_type: 'Fee Clearance Reminder', due_date: 'Tomorrow, 11:00 AM', priority: 'HIGH', status: 'PENDING', notes: 'Part payment done. Remaining balance due before ID card issuance.' },
    { id: '4', candidate: 'Saravanan T', phone: '+91 99401 23987', task_type: 'Demo Class Attendance', due_date: 'Yesterday', priority: 'LOW', status: 'COMPLETED', notes: 'Attended Saturday AI demo class. Rated session 5 stars.' },
  ]);

  const [filter, setFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    candidate: '',
    phone: '',
    task_type: 'Phone Call Follow Up',
    due_date: 'Today, 3:00 PM',
    priority: 'HIGH',
    notes: ''
  });

  const toggleStatus = (id) => {
    setFollowUps(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, status: f.status === 'PENDING' ? 'COMPLETED' : 'PENDING' };
      }
      return f;
    }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setFollowUps(prev => [
      { id: String(Date.now()), ...newTask, status: 'PENDING' },
      ...prev
    ]);
    setShowModal(false);
    setNewTask({ candidate: '', phone: '', task_type: 'Phone Call Follow Up', due_date: 'Today, 3:00 PM', priority: 'HIGH', notes: '' });
  };

  const filtered = followUps.filter(f => {
    if (filter === 'PENDING') return f.status === 'PENDING';
    if (filter === 'COMPLETED') return f.status === 'COMPLETED';
    return true;
  });

  return (
    <AdminPage
      title="Front Desk Follow-Ups Schedule"
      subtitle="Organize candidate callbacks, parent counseling follow-ups, document pending reminders, and demo invitations"
      actions={
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-calendar-plus-fill"></i>
          <span>Add Follow-Up Task</span>
        </button>
      }
    >
      {/* Counters */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-medium">Pending Follow-Ups</span>
                <h3 className="fw-bold mb-0 mt-1 text-warning">
                  {followUps.filter(f => f.status === 'PENDING').length}
                </h3>
              </div>
              <div className="rounded-3 bg-warning bg-opacity-10 p-3 text-warning">
                <i className="bi bi-clock-history fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-medium">Completed Today</span>
                <h3 className="fw-bold mb-0 mt-1 text-success">
                  {followUps.filter(f => f.status === 'COMPLETED').length}
                </h3>
              </div>
              <div className="rounded-3 bg-success bg-opacity-10 p-3 text-success">
                <i className="bi bi-check-circle-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-medium">High Priority Callbacks</span>
                <h3 className="fw-bold mb-0 mt-1 text-danger">
                  {followUps.filter(f => f.priority === 'HIGH' && f.status === 'PENDING').length}
                </h3>
              </div>
              <div className="rounded-3 bg-danger bg-opacity-10 p-3 text-danger">
                <i className="bi bi-exclamation-octagon-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="btn-group shadow-sm">
          <button className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('ALL')}>
            All Tasks ({followUps.length})
          </button>
          <button className={`btn btn-sm ${filter === 'PENDING' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('PENDING')}>
            Pending ({followUps.filter(f => f.status === 'PENDING').length})
          </button>
          <button className={`btn btn-sm ${filter === 'COMPLETED' ? 'btn-primary' : 'btn-light'}`} onClick={() => setFilter('COMPLETED')}>
            Completed ({followUps.filter(f => f.status === 'COMPLETED').length})
          </button>
        </div>
      </div>

      {/* Follow-up Cards */}
      <div className="row g-3">
        {filtered.map(f => (
          <div className="col-12 col-lg-6" key={f.id}>
            <div className={`card border-0 shadow-sm rounded-3 p-3 h-100 bg-white ${f.status === 'COMPLETED' ? 'opacity-75' : ''}`}>
              <div className="d-flex align-items-start justify-content-between mb-2">
                <div>
                  <span className={`badge mb-1 ${f.priority === 'HIGH' ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25' : 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25'}`}>
                    {f.priority} PRIORITY
                  </span>
                  <h6 className="fw-bold text-dark mb-0">{f.task_type}</h6>
                </div>
                <button
                  className={`btn btn-sm rounded-pill px-3 ${f.status === 'COMPLETED' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                  onClick={() => toggleStatus(f.id)}
                >
                  <i className={`bi bi-${f.status === 'COMPLETED' ? 'arrow-counterclockwise' : 'check2'} me-1`}></i>
                  {f.status === 'COMPLETED' ? 'Reopen' : 'Mark Done'}
                </button>
              </div>
              <p className="text-secondary small mb-3">{f.notes}</p>
              <hr className="my-2 border-light opacity-50" />
              <div className="d-flex align-items-center justify-content-between pt-1">
                <div>
                  <div className="fw-semibold text-dark small">{f.candidate}</div>
                  <small className="text-muted"><i className="bi bi-clock me-1"></i>Due: {f.due_date}</small>
                </div>
                <div className="d-flex gap-2">
                  <a href={`tel:${f.phone}`} className="btn btn-sm btn-light text-primary border" title="Dial Call">
                    <i className="bi bi-telephone-fill me-1"></i> {f.phone}
                  </a>
                  <a href={`https://wa.me/${f.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-light text-success border" title="WhatsApp Message">
                    <i className="bi bi-whatsapp"></i>
                  </a>
                </div>
              </div>
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
                <h5 className="modal-title fw-bold">Schedule New Follow-Up Task</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Candidate / Contact Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={newTask.candidate}
                        onChange={(e) => setNewTask({ ...newTask, candidate: e.target.value })}
                        placeholder="e.g. Anand Babu"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        value={newTask.phone}
                        onChange={(e) => setNewTask({ ...newTask, phone: e.target.value })}
                        placeholder="+91 98401 23456"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Priority</label>
                      <select
                        className="form-select"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      >
                        <option value="HIGH">High Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="LOW">Low Priority</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Task Purpose</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newTask.task_type}
                        onChange={(e) => setNewTask({ ...newTask, task_type: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Due Time</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newTask.due_date}
                        onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                        placeholder="e.g. Today 5:00 PM"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Follow-Up Instructions / Background</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={newTask.notes}
                        onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                        placeholder="Notes about discussion points or documents requested..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top bg-light">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Save Task</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
