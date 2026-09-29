import React, { useState } from 'react';
import AdminPage from '../../../common/components/AdminPage/AdminPage.jsx';

export default function InternHelp() {
  const [showModal, setShowModal] = useState(false);
  const [tickets, setTickets] = useState([
    {
      id: 'ETH-1021',
      title: 'Unable to submit assignment for React Todo App',
      category: 'Training Issue',
      priority: 'High',
      status: 'IN_PROGRESS',
      assignedTo: 'HR / LMS Support',
      createdAt: 'Sep 21, 2026',
      description: 'The file upload was showing a network timeout error during code bundle upload.'
    },
    {
      id: 'ETH-1014',
      title: 'Clock-in location mismatch on remote days',
      category: 'Attendance Issue',
      priority: 'Medium',
      status: 'RESOLVED',
      assignedTo: 'HR Operations',
      createdAt: 'Sep 15, 2026',
      description: 'Clock-in tagged as office instead of remote mode.'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical Issue',
    priority: 'Medium',
    description: ''
  });

  const categories = [
    'Technical Issue',
    'Attendance Issue',
    'Training Issue',
    'Payment / Stipend',
    'Document Issue',
    'Account Issue',
    'Other'
  ];

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    const newTicket = {
      id: `ETH-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      status: 'OPEN',
      assignedTo: 'Support Queue',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: formData.description
    };

    setTickets([newTicket, ...tickets]);
    setShowModal(false);
    setFormData({ title: '', category: 'Technical Issue', priority: 'Medium', description: '' });
  };

  return (
    <AdminPage
      title="Help & Support Desk"
      subtitle="Submit support tickets, report technical difficulties, or ask administrative questions"
      actions={
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle"></i> Create Ticket
        </button>
      }
    >
      {/* Help Categories Banner */}
      <div className="row g-3 mb-2">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3 fs-3">
                <i className="bi bi-headset"></i>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-dark">LMS & Tech Support</h6>
                <small className="text-muted">Portal issues, assignments, environment bugs</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 fs-3">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-dark">Attendance & Leaves</h6>
                <small className="text-muted">Clock-in corrections, leave approvals</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3 fs-3">
                <i className="bi bi-cash-coin"></i>
              </div>
              <div>
                <h6 className="mb-1 fw-bold text-dark">HR & Stipends</h6>
                <small className="text-muted">Offer letters, stipend invoices, certificates</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tickets Section */}
      <div className="card border-0 shadow-sm rounded-3 bg-white mb-2">
        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold text-dark">
            <i className="bi bi-ticket-perforated me-2 text-primary"></i> My Support Tickets
          </h6>
          <span className="badge bg-light text-dark border">{tickets.length} Total</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Ticket ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Created Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="ps-3 font-monospace fw-bold text-primary">{t.id}</td>
                    <td>
                      <div className="fw-semibold text-dark">{t.title}</div>
                      <small className="text-muted text-truncate d-block" style={{ maxWidth: '300px' }}>{t.description}</small>
                    </td>
                    <td><span className="badge bg-light text-dark border">{t.category}</span></td>
                    <td>
                      <span className={`badge ${t.priority === 'High' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-info bg-opacity-10 text-info'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="small text-secondary">{t.assignedTo}</td>
                    <td className="small text-muted">{t.createdAt}</td>
                    <td>
                      <span className={`badge ${
                        t.status === 'RESOLVED'
                          ? 'bg-success bg-opacity-10 text-success'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-warning bg-opacity-10 text-warning'
                          : 'bg-secondary bg-opacity-10 text-secondary'
                      }`}>
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="card border-0 shadow-sm rounded-3 bg-white p-3">
        <h6 className="fw-bold text-dark mb-3">Frequently Asked Questions</h6>
        <div className="accordion" id="faqAccordion">
          <div className="accordion-item border-0 border-bottom">
            <h2 className="accordion-header" id="faq1">
              <button className="accordion-button collapsed px-0 fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
                How do I request attendance correction for a missed clock-in?
              </button>
            </h2>
            <div id="collapse1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body px-0 text-muted small">
                Navigate to <strong>Attendance</strong> page, click <strong>"Attendance Correction"</strong> button, select the date and provide your supervisor's approval note.
              </div>
            </div>
          </div>
          <div className="accordion-item border-0 border-bottom">
            <h2 className="accordion-header" id="faq2">
              <button className="accordion-button collapsed px-0 fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                When and how are monthly stipends disbursed?
              </button>
            </h2>
            <div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body px-0 text-muted small">
                Stipends are credited on the 5th of each month to your registered bank account once your daily work logs and timesheets are verified by your mentor.
              </div>
            </div>
          </div>
          <div className="accordion-item border-0">
            <h2 className="accordion-header" id="faq3">
              <button className="accordion-button collapsed px-0 fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
                How do I get my internship completion certificate?
              </button>
            </h2>
            <div id="collapse3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
              <div className="accordion-body px-0 text-muted small">
                Once you complete the 45-day curriculum, pass the final evaluation, and achieve at least 90% attendance, your certificate will automatically be generated in the <strong>Certificates</strong> tab.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Create Support Ticket</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateTicket}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Subject / Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Brief summary of the issue..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Priority</label>
                    <select
                      className="form-select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Explain the problem and include any error messages..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit Ticket</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
